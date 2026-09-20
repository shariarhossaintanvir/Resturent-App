import { Order, Reservation } from '../../data/types';

export interface AuthContextUser {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'RESTAURANT_ADMIN' | 'DELIVERY_RIDER' | 'SUPER_ADMIN';
  restaurantId?: string; // Optional for restaurant admins
}

/**
 * Validates whether the authenticated user has legitimate authorization to access or modify an order.
 * Prevents IDOR / Broken Object-Level Authorization (BOLA).
 */
export function validateOrderAccess(
  user: AuthContextUser,
  order: Order
): { allowed: boolean; reason?: string } {
  const currentUserId = user.id || user.userId;

  // Super Admin has system-wide oversight
  if (user.role === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  // Restaurant Admin can only inspect/modify orders for their managed restaurant
  if (user.role === 'RESTAURANT_ADMIN') {
    if (!user.restaurantId || user.restaurantId === order.restaurantId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Forbidden: You do not manage the restaurant associated with this order.',
    };
  }

  // Delivery Rider can only view deliveries assigned to them
  if (user.role === 'DELIVERY_RIDER') {
    if (order.rider && order.rider.id === currentUserId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Forbidden: This delivery order is not assigned to your courier ID.',
    };
  }

  // Customer can only view/track their own personal orders
  if (user.role === 'CUSTOMER') {
    if (order.customerId === currentUserId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Forbidden: You do not have permission to view or manage another customer’s order.',
    };
  }

  return { allowed: false, reason: 'Unauthorized: Unknown role or access policy.' };
}

/**
 * Validates ownership for table reservations.
 */
export function validateReservationAccess(
  user: AuthContextUser,
  reservation: Reservation
): { allowed: boolean; reason?: string } {
  if (user.role === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  if (user.role === 'RESTAURANT_ADMIN') {
    if (!user.restaurantId || user.restaurantId === reservation.restaurantId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Forbidden: Reservation belongs to another restaurant establishment.',
    };
  }

  if (user.role === 'CUSTOMER') {
    const isOwner =
      reservation.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      reservation.customerName.toLowerCase() === user.name.toLowerCase();
    if (isOwner) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Forbidden: You do not own this reservation booking.',
    };
  }

  return { allowed: false, reason: 'Unauthorized' };
}
