import { Order, OrderStatus } from '../../data/types';
import { defaultMockOrders, mockRider } from '../../data/mockData';

// Global server order repository
const ordersRegistry: Map<string, Order> = new Map();

// Initialize with default mock orders
let isSeeded = false;

function ensureOrdersSeeded(): void {
  if (isSeeded) return;
  for (const order of defaultMockOrders) {
    ordersRegistry.set(order.id, { ...order });
  }
  isSeeded = true;
}

export function getAllOrders(): Order[] {
  ensureOrdersSeeded();
  return Array.from(ordersRegistry.values());
}

export function getOrderById(id: string): Order | undefined {
  ensureOrdersSeeded();
  return ordersRegistry.get(id);
}

export function saveOrder(order: Order): Order {
  ensureOrdersSeeded();
  ordersRegistry.set(order.id, { ...order });
  return order;
}

export function updateServerOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Order | null {
  ensureOrdersSeeded();
  const order = ordersRegistry.get(orderId);
  if (!order) return null;

  const now = new Date().toISOString();
  let progress = order.riderLocationProgress || 15;
  if (newStatus === 'Preparing') progress = 30;
  if (newStatus === 'Ready' || newStatus === 'Picked Up') progress = 50;
  if (newStatus === 'On The Way') progress = 75;
  if (newStatus === 'Delivered') progress = 100;

  const updated: Order = {
    ...order,
    status: newStatus,
    riderLocationProgress: progress,
    statusHistory: [...order.statusHistory, { status: newStatus, timestamp: now }],
    paymentStatus: newStatus === 'Delivered' ? 'paid' : order.paymentStatus,
    rider: order.rider || mockRider,
  };

  ordersRegistry.set(orderId, updated);
  return updated;
}
