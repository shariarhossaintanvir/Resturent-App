import { NextResponse } from 'next/server';
import { requireRestaurantAdmin } from '../../../../lib/auth/rbac';
import { logSecurityEvent } from '../../../../lib/security/logger';
import { mockFoodItems } from '../../../../data/mockData';

export async function PATCH(req: Request) {
  const { session, errorResponse } = await requireRestaurantAdmin(req);
  if (errorResponse || !session) return errorResponse;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { foodId, newPrice, isAvailable } = (body || {}) as {
    foodId?: string;
    newPrice?: number;
    isAvailable?: boolean;
  };

  if (!foodId) {
    return NextResponse.json({ error: 'Food item ID is required.' }, { status: 400 });
  }

  const foodItem = mockFoodItems.find((f) => f.id === foodId);
  if (!foodItem) {
    return NextResponse.json({ error: 'Food item not found.' }, { status: 404 });
  }

  // Verify restaurant admin permissions for this specific food's restaurant
  if (session.role === 'RESTAURANT_ADMIN' && session.restaurantId && session.restaurantId !== foodItem.restaurantId) {
    return NextResponse.json(
      { error: 'Forbidden: You cannot modify dishes belonging to another restaurant.' },
      { status: 403 }
    );
  }

  if (newPrice !== undefined) {
    const priceNum = Number(newPrice);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > 100000) {
      return NextResponse.json(
        { error: 'Price must be a positive number up to 100,000 BDT.' },
        { status: 400 }
      );
    }
    foodItem.price = priceNum;
  }

  if (isAvailable !== undefined) {
    foodItem.isAvailable = Boolean(isAvailable);
  }

  logSecurityEvent({
    event: 'ADMIN_ACTION_EXECUTED',
    userId: session.userId,
    role: session.role,
    path: '/api/admin/menu',
    resourceId: foodId,
    severity: 'INFO',
    details: {
      action: 'UPDATE_MENU_ITEM',
      foodId,
      newPrice,
      isAvailable,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Menu item updated successfully.',
    foodItem,
  });
}
