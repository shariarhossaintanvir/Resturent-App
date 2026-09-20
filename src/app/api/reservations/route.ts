import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth/rbac';
import { validateReservationInput } from '../../../lib/validation/schemas';
import { getAllReservations, saveReservation } from '../../../lib/reservations/reservationStore';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../lib/security/rateLimiter';
import { logSecurityEvent } from '../../../lib/security/logger';
import { Reservation } from '../../../data/types';

export async function GET(req: Request) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const allReservations = getAllReservations();

  if (session.role === 'SUPER_ADMIN') {
    return NextResponse.json({ reservations: allReservations });
  }

  if (session.role === 'RESTAURANT_ADMIN') {
    const scoped = allReservations.filter(
      (r) => !session.restaurantId || r.restaurantId === session.restaurantId
    );
    return NextResponse.json({ reservations: scoped });
  }

  // Customer: only their own bookings
  const scoped = allReservations.filter(
    (r) => r.customerEmail.toLowerCase() === session.email.toLowerCase()
  );
  return NextResponse.json({ reservations: scoped });
}

export async function POST(req: Request) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const ip = getClientIp(req);

  // Rate Limiting
  const rateLimitResult = checkRateLimit(
    `res_${session.userId}`,
    RATE_LIMITS.RESERVATION.limit,
    RATE_LIMITS.RESERVATION.windowMs
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: `Reservation rate limit exceeded. Please wait ${rateLimitResult.resetSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.resetSeconds) },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const validation = validateReservationInput(body);
  if (!validation.isValid || !validation.sanitizedData) {
    return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
  }

  const { restaurantId, restaurantName, date, time, guests, specialRequests } =
    validation.sanitizedData;

  const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReservation: Reservation = {
    id: resId,
    restaurantId,
    restaurantName,
    customerName: session.name,
    customerEmail: session.email,
    customerPhone: '+880 1819-456789',
    date,
    time,
    guests,
    specialRequests,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  saveReservation(newReservation);

  logSecurityEvent({
    event: 'ORDER_PLACED', // reservation audit
    userId: session.userId,
    ip,
    path: '/api/reservations',
    resourceId: resId,
    severity: 'INFO',
    details: {
      reservationId: resId,
      restaurantId,
      date,
      time,
      guests,
    },
  });

  return NextResponse.json({ success: true, reservation: newReservation }, { status: 201 });
}
