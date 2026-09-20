'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Clock, MapPin, Bike, ArrowRight, Home } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'FD-10245';
  const { getOrder } = useApp();

  const order = getOrder(orderId);

  return (
    <div className="max-w-xl mx-auto text-center py-12 sm:py-16 space-y-6">
      {/* Animated Success Badge */}
      <div className="relative w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-14 h-14 stroke-[2.5] animate-bounce-subtle" />
      </div>

      {/* Confirmation Header */}
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Payment Successful
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ✓ Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your order has been transmitted to the kitchen and is being freshly prepared.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400">Order Reference</span>
            <h3 className="text-lg font-black font-mono text-primary-600 dark:text-primary-400">
              #{orderId}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase font-bold text-slate-400">Estimated Delivery</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              <span>25–35 minutes</span>
            </p>
          </div>
        </div>

        {order && (
          <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Kitchen:</span>
              <span className="font-bold text-slate-900 dark:text-white">{order.restaurantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deliver To:</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[65%]">
                {order.deliveryAddress.street}, {order.deliveryAddress.area}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment:</span>
              <span className="font-semibold uppercase text-slate-900 dark:text-white">
                {order.paymentMethod.replace('_', ' ')} (Paid {formatPrice(order.total)})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Track Order & Back to Home */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link href={`/tracking/${orderId}`} className="w-full sm:flex-1">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-lg shadow-primary-500/25"
          >
            Track Order Live
          </Button>
        </Link>

        <Link href="/" className="w-full sm:flex-1">
          <Button variant="outline" size="lg" fullWidth leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-medium">Loading confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
