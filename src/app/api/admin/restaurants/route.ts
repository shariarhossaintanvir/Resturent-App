import { NextResponse } from 'next/server';
import { requireRestaurantAdmin } from '../../../../lib/auth/rbac';
import { logSecurityEvent } from '../../../../lib/security/logger';
import { mockRestaurants } from '../../../../data/mockData';

export async function PATCH(req: Request) {
  const { session, errorResponse } = await requireRestaurantAdmin(req);
  if (errorResponse || !session) return errorResponse;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { restaurantId, isOpen } = (body || {}) as {
    restaurantId?: string;
    isOpen?: boolean;
  };

  if (!restaurantId) {
    return NextResponse.json({ error: 'Restaurant ID is required.' }, { status: 400 });
  }

  const restaurant = mockRestaurants.find((r) => r.id === restaurantId);
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
  }

  if (session.role === 'RESTAURANT_ADMIN' && session.restaurantId && session.restaurantId !== restaurantId) {
    return NextResponse.json(
      { error: 'Forbidden: You do not manage this restaurant.' },
      { status: 403 }
    );
  }

  if (isOpen !== undefined) {
    restaurant.isOpen = Boolean(isOpen);
  }

  logSecurityEvent({
    event: 'ADMIN_ACTION_EXECUTED',
    userId: session.userId,
    role: session.role,
    path: '/api/admin/restaurants',
    resourceId: restaurantId,
    severity: 'INFO',
    details: {
      action: 'TOGGLE_RESTAURANT_OPEN',
      restaurantId,
      isOpen,
    },
  });

  return NextResponse.json({
    success: true,
    message: `Restaurant status updated.`,
    restaurant,
  });
}
