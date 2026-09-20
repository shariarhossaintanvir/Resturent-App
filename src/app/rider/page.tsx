'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import {
  Bike,
  Navigation,
  MapPin,
  Store,
  Phone,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Play,
} from 'lucide-react';
import { formatPrice, getStatusBadgeStyle } from '../../utils/formatters';

export default function RiderDashboardPage() {
  const { orders, updateOrderStatus, isRiderOnline } = useApp();

  // Find assigned orders for rider
  const assignedOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const todayEarnings = completedOrders.length * 95; // ৳95 courier payout per drop

  return (
    <div className="space-y-6">
      {/* Rider KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Today&apos;s Payout
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatPrice(todayEarnings)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +৳380 bonus milestone
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Deliveries
          </span>
          <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
            {assignedOrders.length}
          </div>
          <span className="text-[11px] text-slate-500">In dispatch queue</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Deliveries Completed
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% on-time rating</span>
        </div>
      </div>

      {!isRiderOnline && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are currently <strong>OFFLINE</strong>. Toggle your availability above to accept new orders from Gulshan and Banani restaurants.
          </span>
        </div>
      )}

      {/* Active Assigned Deliveries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Assigned Active Deliveries ({assignedOrders.length})
          </h3>
          <span className="text-xs text-slate-400">Real-time dispatcher synchronization</span>
        </div>

        {assignedOrders.length > 0 ? (
          <div className="space-y-4">
            {assignedOrders.map((order) => {
              const badge = getStatusBadgeStyle(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5"
                >
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-lg text-primary-600 dark:text-primary-400">
                        #{order.id}
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Payout: ৳95 • {order.paymentMethod === 'cash_on_delivery' ? 'Collect Cash: ' + formatPrice(order.total) : 'Paid Online (No Cash)'}
                    </div>
                  </div>

                  {/* Route Details: Pickup & Dropoff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Pickup */}
                    <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider text-[10px]">
                        <Store className="w-3.5 h-3.5" />
                        <span>Step 1: Pickup Kitchen</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {order.restaurantName}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">{order.restaurantAddress}</p>
                    </div>

                    {/* Dropoff */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Step 2: Customer Destination</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {order.customerName} ({order.customerPhone})
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city}
                      </p>
                      {order.customerNotes && (
                        <p className="text-primary-600 dark:text-primary-400 font-semibold italic">
                          Note: &quot;{order.customerNotes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items summary */}
                  <div className="text-xs text-slate-500">
                    <strong>Package contents:</strong>{' '}
                    {order.items.map((it) => `${it.quantity}x ${it.foodItem.name}`).join(', ')}
                  </div>

                  {/* Rider Status Progression Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Rider Milestone Update:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant={order.status === 'Preparing' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      >
                        At Kitchen
                      </Button>

                      <Button
                        variant={order.status === 'Picked Up' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                      >
                        Picked Up
                      </Button>

                      <Button
                        variant={order.status === 'On The Way' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'On The Way')}
                      >
                        On The Way 🚴
                      </Button>

                      <Button
                        variant={order.status === 'Delivered' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Delivered ✓
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                All Deliveries Complete!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active orders assigned to you right now. Stand by in Gulshan/Banani zone for new pings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
