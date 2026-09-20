import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth/rbac';
import { getAllOrders, saveOrder } from '../../../lib/orders/orderStore';
import { calculateAuthoritativeOrderTotals } from '../../../lib/orders/orderPricing';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../lib/security/rateLimiter';
import { logSecurityEvent } from '../../../lib/security/logger';
import { sanitizeText } from '../../../lib/security/sanitize';
import { Order, CartItem, DeliveryAddress, PaymentMethodType } from '../../../data/types';
import { mockRider } from '../../../data/mockData';

export async function GET(req: Request) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const allOrders = getAllOrders();

  // Scope orders strictly based on user role and ownership (anti-IDOR)
  if (session.role === 'SUPER_ADMIN') {
    return NextResponse.json({ orders: allOrders });
  }

  if (session.role === 'RESTAURANT_ADMIN') {
    const scoped = allOrders.filter(
      (o) => !session.restaurantId || o.restaurantId === session.restaurantId
    );
    return NextResponse.json({ orders: scoped });
  }

  if (session.role === 'DELIVERY_RIDER') {
    const scoped = allOrders.filter((o) => o.rider && o.rider.id === session.userId);
    return NextResponse.json({ orders: scoped });
  }

  // Customer: only their own orders
  const scoped = allOrders.filter((o) => o.customerId === session.userId);
  return NextResponse.json({ orders: scoped });
}

export async function POST(req: Request) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const ip = getClientIp(req);

  // 1. Rate Limiting
  const rateLimitResult = checkRateLimit(
    `order_${session.userId}`,
    RATE_LIMITS.CHECKOUT.limit,
    RATE_LIMITS.CHECKOUT.windowMs
  );

  if (!rateLimitResult.success) {
    logSecurityEvent({
      event: 'RATE_LIMIT_HIT',
      userId: session.userId,
      ip,
      path: '/api/orders',
      severity: 'WARN',
      details: { resetSeconds: rateLimitResult.resetSeconds },
    });

    return NextResponse.json(
      {
        error: `Order placement rate limit exceeded. Please wait ${rateLimitResult.resetSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.resetSeconds) },
      }
    );
  }

  // 2. Parse payload
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
  }

  const {
    items,
    deliveryAddress,
    paymentMethod,
    customerNotes,
    promoCode,
    clientReportedTotal,
  } = (body || {}) as {
    items?: CartItem[];
    deliveryAddress?: DeliveryAddress;
    paymentMethod?: PaymentMethodType;
    customerNotes?: string;
    promoCode?: string;
    clientReportedTotal?: number;
  };

  if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.area) {
    return NextResponse.json({ error: 'A valid delivery address is required.' }, { status: 400 });
  }

  const validPaymentMethods: PaymentMethodType[] = ['cash_on_delivery', 'card', 'bkash', 'nagad'];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    return NextResponse.json({ error: 'A valid payment method must be selected.' }, { status: 400 });
  }

  // 3. Authoritative Server-Side Price Recalculation
  const priceCalculation = calculateAuthoritativeOrderTotals(items || [], promoCode);

  if (!priceCalculation.isValid) {
    return NextResponse.json({ error: priceCalculation.error }, { status: 400 });
  }

  // Detect potential price tampering
  if (
    clientReportedTotal !== undefined &&
    Math.abs(clientReportedTotal - priceCalculation.total) > 1
  ) {
    logSecurityEvent({
      event: 'PRICE_MANIPULATION_DETECTED',
      userId: session.userId,
      ip,
      path: '/api/orders',
      severity: 'SECURITY_ALERT',
      details: {
        clientReportedTotal,
        serverAuthoritativeTotal: priceCalculation.total,
        discrepancy: clientReportedTotal - priceCalculation.total,
      },
    });
  }

  // 4. Construct Authoritative Order
  const orderId = `FD-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();
  const firstItem = priceCalculation.verifiedItems[0];

  const newOrder: Order = {
    id: orderId,
    customerId: session.userId,
    customerName: session.name,
    customerPhone: sanitizeText(deliveryAddress.instructions || '', 30) || '+880 1819-456789',
    restaurantId: firstItem.restaurantId,
    restaurantName: firstItem.restaurantName,
    restaurantAddress: 'Dhaka Gourmet Hub',
    items: priceCalculation.verifiedItems,
    subtotal: priceCalculation.subtotal,
    deliveryFee: priceCalculation.deliveryFee,
    discount: priceCalculation.discount,
    promoCode: priceCalculation.appliedPromo,
    total: priceCalculation.total,
    status: 'Confirmed',
    statusHistory: [{ status: 'Confirmed', timestamp: now }],
    deliveryAddress: {
      id: deliveryAddress.id || `addr-${Date.now()}`,
      label: deliveryAddress.label || 'Home',
      street: sanitizeText(deliveryAddress.street, 100),
      area: sanitizeText(deliveryAddress.area, 60),
      city: 'Dhaka',
      instructions: deliveryAddress.instructions ? sanitizeText(deliveryAddress.instructions, 200) : undefined,
      isDefault: deliveryAddress.isDefault,
    },
    paymentMethod,
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
    createdAt: now,
    estimatedDeliveryTime: '25-35 mins',
    rider: mockRider,
    customerNotes: customerNotes ? sanitizeText(customerNotes, 200) : undefined,
    reviewed: false,
    riderLocationProgress: 15,
  };

  saveOrder(newOrder);

  logSecurityEvent({
    event: 'ORDER_PLACED',
    userId: session.userId,
    ip,
    path: '/api/orders',
    resourceId: orderId,
    severity: 'INFO',
    details: {
      orderId,
      total: newOrder.total,
      itemCount: newOrder.items.length,
    },
  });

  return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
}
