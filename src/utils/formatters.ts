import { OrderStatus } from '../data/types';

/**
 * Format price in Bangladeshi Taka (৳)
 */
export function formatPrice(amount: number): string {
  return `৳${Math.round(amount).toLocaleString('en-BD')}`;
}

/**
 * Format date string into human readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format relative time (e.g. "10 mins ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } catch {
    return 'Recently';
  }
}

/**
 * Helper to get status color classes for Tailwind
 */
export function getStatusBadgeStyle(status: OrderStatus): { bg: string; text: string; border: string; label: string } {
  switch (status) {
    case 'Pending':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: 'Pending' };
    case 'Confirmed':
      return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', label: 'Confirmed' };
    case 'Preparing':
      return { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', label: 'Preparing' };
    case 'Ready':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', label: 'Ready for Pickup' };
    case 'Picked Up':
      return { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', label: 'Picked Up' };
    case 'On The Way':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', label: 'On The Way' };
    case 'Delivered':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: 'Delivered' };
    case 'Cancelled':
      return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', label: 'Cancelled' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', label: status };
  }
}

/**
 * Helper to get timeline index for tracking progress
 */
export function getStatusStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'Pending':
      return 0;
    case 'Confirmed':
      return 1;
    case 'Preparing':
      return 2;
    case 'Ready':
    case 'Picked Up':
      return 3;
    case 'On The Way':
      return 4;
    case 'Delivered':
      return 5;
    case 'Cancelled':
      return -1;
    default:
      return 1;
  }
}
