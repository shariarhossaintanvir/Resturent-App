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
  Sparkles,
  ChevronRight,
  Navigation,
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-xs font-bold mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>Order History & Live Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track real-time GPS dispatches and reorder your favorite meals in 1 tap
          </p>
        </div>

        {/* Live Active Tracker CTA pill */}
        {activeOrders.length > 0 && (
          <Link
            href={`/tracking/${activeOrders[0].id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary-500 to-amber-500 text-white text-xs font-bold shadow-glow hover:shadow-glow-lg transition-all animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span>1 Active Order In Transit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200/60 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Shipments</span>
          {activeOrders.length > 0 && (
            <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'past'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Past Orders</span>
          <span className="text-[11px] text-slate-400 font-semibold">({pastOrders.length})</span>
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length > 0 ? (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const badge = getStatusBadgeStyle(order.status);
            const isDelivered = order.status === 'Delivered';
            const isCancelled = order.status === 'Cancelled';
            const isActive = !isDelivered && !isCancelled;

            return (
              <div
                key={order.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all space-y-5 relative overflow-hidden"
              >
                {/* Active order accent glow bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-amber-400 to-primary-600"></div>
                )}

                {/* Header Row: Restaurant Info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {order.restaurantName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(order.createdAt)}</span>
                        <span>•</span>
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                          #{order.id}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isActive && (
                      <span className="relative flex h-2.5 w-2.5 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                      </span>
                    )}
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl border shadow-sm ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Items Preview Strip with Thumbnails */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {order.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.foodItem.image}
                          alt={it.foodItem.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[140px]">
                            <span className="text-primary-600 dark:text-primary-400 mr-1">
                              {it.quantity}x
                            </span>
                            {it.foodItem.name}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-400">
                            {formatPrice(it.itemTotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destination & Order Total */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    </div>
                    <span className="truncate max-w-md">
                      Delivered to:{' '}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {order.deliveryAddress.street}, {order.deliveryAddress.area}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-slate-400 font-medium">Grand Total:</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Payment via{' '}
                    <span className="font-bold uppercase text-slate-600 dark:text-slate-300">
                      {order.paymentMethod.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {isActive ? (
                      <Link href={`/tracking/${order.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          className="shadow-glow hover:shadow-glow-lg font-bold"
                        >
                          Track Live Courier
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order.id)}
                          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                          className="font-bold border-slate-200 dark:border-slate-700"
                        >
                          Reorder Meal
                        </Button>

                        <Button
                          variant={order.reviewed ? 'ghost' : 'primary'}
                          size="sm"
                          onClick={() => setReviewOrder(order)}
                          leftIcon={<Star className="w-3.5 h-3.5 fill-current" />}
                          className="font-bold"
                        >
                          {order.reviewed ? 'View Review' : 'Write Review'}
                        </Button>
                      </>
                    )}
                  </div>
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
              ? 'You have no live food orders being prepared right now. Craving something delicious?'
              : 'You have not completed any dining orders yet. Explore top Dhaka restaurants now!'
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
