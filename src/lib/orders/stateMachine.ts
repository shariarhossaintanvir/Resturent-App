import { OrderStatus } from '../../data/types';
import { AuthContextUser } from '../security/ownership';

interface TransitionRule {
  from: OrderStatus;
  to: OrderStatus;
  allowedRoles: Array<AuthContextUser['role']>;
}

const ALLOWED_TRANSITIONS: TransitionRule[] = [
  // Order confirmation
  { from: 'Pending', to: 'Confirmed', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  // Kitchen preparation
  { from: 'Confirmed', to: 'Preparing', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  // Kitchen finished packing
  { from: 'Preparing', to: 'Ready', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  // Rider dispatch & pickup
  { from: 'Ready', to: 'Picked Up', allowedRoles: ['DELIVERY_RIDER', 'SUPER_ADMIN'] },
  // Transit
  { from: 'Picked Up', to: 'On The Way', allowedRoles: ['DELIVERY_RIDER', 'SUPER_ADMIN'] },
  // Delivery completion
  { from: 'On The Way', to: 'Delivered', allowedRoles: ['DELIVERY_RIDER', 'SUPER_ADMIN'] },
  // Cancellations
  { from: 'Pending', to: 'Cancelled', allowedRoles: ['CUSTOMER', 'RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  { from: 'Confirmed', to: 'Cancelled', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
];

export interface StatusValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates whether an order status transition is valid according to the business state machine
 * and whether the requesting user's role has permission to execute it.
 */
export function validateOrderStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  user: AuthContextUser
): StatusValidationResult {
  if (currentStatus === newStatus) {
    return { allowed: false, reason: `Order is already in state '${currentStatus}'.` };
  }

  if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
    return {
      allowed: false,
      reason: `Order has reached terminal state '${currentStatus}' and cannot be altered.`,
    };
  }

  // Super admin override
  if (user.role === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  const matchedTransition = ALLOWED_TRANSITIONS.find(
    (t) => t.from === currentStatus && t.to === newStatus
  );

  if (!matchedTransition) {
    return {
      allowed: false,
      reason: `Invalid status progression: cannot transition directly from '${currentStatus}' to '${newStatus}'.`,
    };
  }

  if (!matchedTransition.allowedRoles.includes(user.role)) {
    return {
      allowed: false,
      reason: `Forbidden: Role '${user.role}' is not authorized to transition orders to '${newStatus}'.`,
    };
  }

  return { allowed: true };
}
