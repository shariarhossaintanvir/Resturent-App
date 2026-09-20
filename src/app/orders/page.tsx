'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Order } from '../../data/types';
import { Button } from '../../components/ui/Button';
import { ReviewModal } from '../../components/orders/ReviewModal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Receipt,
  Store,
  Clock,
  ArrowRight,
  RotateCcw,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, reorder } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleReorder = (orderId: string) => {
    reorder(orderId);
    router.push('/cart');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track live food shipments and review past dining memories
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>Active Deliveries</span>
          {activeOrders.length > 0 && (
            <span className="bg-primary-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'past'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>Past Orders</span>
          <span className="text-[11px] text-slate-400">({pastOrders.length})</span>
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length > 0 ? (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const badge = getStatusBadgeStyle(order.status);
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4 transition-all hover:border-primary-500/40"
              >
                {/* Order Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {order.restaurantName}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(order.createdAt)}</span>
                        <span>•</span>
                        <span className="font-mono font-semibold">#{order.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span className="truncate max-w-[70%]">
                        <strong className="text-slate-900 dark:text-white mr-1.5">
                          {it.quantity}x
                        </strong>
                        {it.foodItem.name}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(it.itemTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Location & Price */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span className="truncate max-w-sm">
                      Deliver to: {order.deliveryAddress.street}, {order.deliveryAddress.area}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-base font-black text-primary-600 dark:text-primary-400">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  {!isDelivered ? (
                    <Link href={`/tracking/${order.id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="shadow-sm hover:shadow-glow"
                      >
                        Track Order Live
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order.id)}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Reorder
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setReviewOrder(order)}
                        leftIcon={<Star className="w-3.5 h-3.5 fill-current" />}
                      >
                        {order.reviewed ? 'Edit Review' : 'Write Review'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Receipt}
          title={`No ${activeTab} orders found`}
          description={
            activeTab === 'active'
              ? 'You have no live food orders being prepared right now.'
              : 'You have not completed any orders yet.'
          }
          actionText="Order Food Now"
          actionHref="/explore"
        />
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
        />
      )}
    </div>
  );
}
