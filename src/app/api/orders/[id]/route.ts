import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth/rbac';
import { getOrderById, updateServerOrderStatus } from '../../../../lib/orders/orderStore';
import { validateOrderAccess } from '../../../../lib/security/ownership';
import { validateOrderStatusTransition } from '../../../../lib/orders/stateMachine';
import { logSecurityEvent } from '../../../../lib/security/logger';
import { getClientIp } from '../../../../lib/security/rateLimiter';
import { OrderStatus } from '../../../../data/types';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const orderId = params.id;
  const order = getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: `Order #${orderId} was not found.` }, { status: 404 });
  }

  // IDOR Ownership Verification
  const accessCheck = validateOrderAccess(session, order);
  if (!accessCheck.allowed) {
    const ip = getClientIp(req);
    logSecurityEvent({
      event: 'IDOR_ACCESS_BLOCKED',
      userId: session.userId,
      role: session.role,
      ip,
      path: `/api/orders/${orderId}`,
      resourceId: orderId,
      severity: 'SECURITY_ALERT',
      details: {
        orderCustomerId: order.customerId,
        attemptedUserId: session.userId,
        reason: accessCheck.reason,
      },
    });

    return NextResponse.json({ error: accessCheck.reason }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const orderId = params.id;
  const order = getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: `Order #${orderId} was not found.` }, { status: 404 });
  }

  // IDOR & Authorization check
  const accessCheck = validateOrderAccess(session, order);
  if (!accessCheck.allowed) {
    return NextResponse.json({ error: accessCheck.reason }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { status } = (body || {}) as { status?: OrderStatus };

  if (!status) {
    return NextResponse.json({ error: 'New status must be specified' }, { status: 400 });
  }

  // Strict Finite State Machine Validation with RBAC
  const transitionCheck = validateOrderStatusTransition(order.status, status, session);
  if (!transitionCheck.allowed) {
    const ip = getClientIp(req);
    logSecurityEvent({
      event: 'STATUS_TRANSITION_VIOLATION',
      userId: session.userId,
      role: session.role,
      ip,
      path: `/api/orders/${orderId}`,
      resourceId: orderId,
      severity: 'SECURITY_ALERT',
      details: {
        currentStatus: order.status,
        attemptedStatus: status,
        reason: transitionCheck.reason,
      },
    });

    return NextResponse.json({ error: transitionCheck.reason }, { status: 400 });
  }

  const updatedOrder = updateServerOrderStatus(orderId, status);

  logSecurityEvent({
    event: 'ORDER_STATUS_UPDATED',
    userId: session.userId,
    role: session.role,
    path: `/api/orders/${orderId}`,
    resourceId: orderId,
    severity: 'INFO',
    details: {
      fromStatus: order.status,
      toStatus: status,
    },
  });

  return NextResponse.json({ success: true, order: updatedOrder });
}
