'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { TrackingMap } from '../../../components/tracking/TrackingMap';
import { TrackingTimeline } from '../../../components/tracking/TrackingTimeline';
import { RiderContactCard } from '../../../components/tracking/RiderContactCard';
import { ReviewModal } from '../../../components/orders/ReviewModal';
import { Button } from '../../../components/ui/Button';
import {
  Clock,
  Store,
  MapPin,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Star,
} from 'lucide-react';
import { formatPrice, getStatusBadgeStyle } from '../../../utils/formatters';

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getOrder, simulateNextStatus, updateOrderStatus, orders } = useApp();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const order = getOrder(orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <p className="text-xs text-slate-500">Could not locate tracking details for order #{orderId}.</p>
        <Link href="/orders">
          <Button variant="primary" size="md">
            View All Orders
          </Button>
        </Link>
      </div>
    );
  }

  const badgeStyle = getStatusBadgeStyle(order.status);
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Order #{order.id}
            </h1>
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              {badgeStyle.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Delivery to {order.deliveryAddress.area}, Dhaka
          </p>
        </div>

        {/* Prototype Simulation Control */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {!isDelivered ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => simulateNextStatus(order.id)}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              className="bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20"
            >
              Simulate Next Status
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'Confirmed')}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Restart Simulation
            </Button>
          )}
        </div>
      </div>

      {/* Delivered Celebration / Review Banner */}
      {isDelivered && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Food Delivered! Hope you enjoy your meal 🎉</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Share your culinary experience with the restaurant and chef.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowReviewModal(true)}
            leftIcon={<Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md shrink-0"
          >
            {order.reviewed ? 'Edit Your Review' : 'Rate & Write Review'}
          </Button>
        </div>
      )}

      {/* Live Estimated Arrival Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
              {isDelivered ? 'Delivery Complete' : 'Estimated Arrival'}
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              {isDelivered ? 'Delivered at Doorstep 🎉' : `${order.estimatedDeliveryTime} (Arriving soon)`}
            </h3>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-white/80">Courier Assigned</span>
          <p className="text-xs font-bold text-white">{order.rider?.name || 'Rakib Hasan'}</p>
        </div>
      </div>

      {/* Visual Live GPS Vector Map Component */}
      <section aria-label="Live Delivery Route Map">
        <TrackingMap order={order} />
      </section>

      {/* 5-Step Milestone Timeline */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
          Delivery Status Progression
        </h3>
        <TrackingTimeline currentStatus={order.status} />
      </section>

      {/* Rider Information & Direct Contact Card */}
      {order.rider && (
        <section aria-label="Courier Details">
          <RiderContactCard rider={order.rider} />
        </section>
      )}

      {/* Order Summary & Delivery Address Breakdown */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Order Summary & Delivery Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Dishes */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-slate-400">Items Ordered</span>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  <strong className="text-slate-900 dark:text-white mr-1.5">{item.quantity}x</strong>
                  <span className="text-slate-700 dark:text-slate-300">{item.foodItem.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.itemTotal)}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1">
                <span>Total Paid:</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400">Kitchen Address</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{order.restaurantName}</p>
              <p className="text-slate-500">{order.restaurantAddress}</p>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400">Delivery Destination</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{order.deliveryAddress.street}</p>
              <p className="text-slate-500">{order.deliveryAddress.area}, {order.deliveryAddress.city}</p>
            </div>

            {order.customerNotes && (
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400">Special Note</span>
                <p className="text-slate-600 dark:text-slate-300 italic">&quot;{order.customerNotes}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          order={order}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
