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
    <div className="max-w-xl mx-auto text-center py-12 sm:py-20 space-y-7 pb-20">
      {/* Animated Success Badge */}
      <div className="relative w-24 h-24 rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-500/20">
        <CheckCircle2 className="w-14 h-14 stroke-[2.5] animate-bounce-subtle" />
      </div>

      {/* Confirmation Header */}
      <div className="space-y-2">
        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Feast is On The Way!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Your order has been transmitted directly to the kitchen and is being freshly prepared with sealed packaging.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card text-left space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Reference</span>
            <h3 className="text-xl font-black font-mono text-primary-600 dark:text-primary-400 mt-0.5">
              #{orderId}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Delivery</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end mt-0.5">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>25–35 mins</span>
            </p>
          </div>
        </div>

        {order && (
          <div className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Kitchen:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{order.restaurantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deliver To:</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[65%]">
                {order.deliveryAddress.street}, {order.deliveryAddress.area}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment:</span>
              <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">
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
            className="shadow-glow hover:shadow-glow-lg rounded-2xl py-4 font-black"
          >
            Track Rider Live
          </Button>
        </Link>

        <Link href="/" className="w-full sm:flex-1">
          <Button variant="outline" size="lg" fullWidth leftIcon={<Home className="w-4 h-4" />} className="rounded-2xl font-bold py-4">
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
