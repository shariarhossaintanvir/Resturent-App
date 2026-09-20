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
  ArrowRight,
  ShieldCheck,
  Fuel,
  Compass,
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
    <div className="space-y-6 pb-12">
      {/* Courier Profile & Vehicle HUD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center text-white shadow-glow">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">Kazi Tanvir (Courier #8821)</h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GPS Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
              <span>Vehicle: <strong>Honda CBR 150R</strong></span>
              <span>•</span>
              <span className="font-mono">Plate: Dhaka-HA-4491</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">4.96 ★ (412 drops)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Duty Zone</span>
            <span className="text-xs font-black text-primary-400">Gulshan - Banani Hub</span>
          </div>
        </div>
      </div>

      {/* Rider KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Today&apos;s Accumulated Payout
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatPrice(todayEarnings)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +৳380 surge milestone unlocked
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Assigned Deliveries
          </span>
          <div className="text-2xl font-black text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <span>{assignedOrders.length}</span>
            {assignedOrders.length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-ping"></span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">In real-time dispatch queue</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Deliveries Completed Today
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            100% on-time fulfillment rating
          </span>
        </div>
      </div>

      {!isRiderOnline && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are currently <strong>OFFLINE</strong>. Toggle your availability in the top bar to accept new orders from Gulshan and Banani restaurants.
          </span>
        </div>
      )}

      {/* Active Assigned Deliveries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Active Fulfillment Queue ({assignedOrders.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time dispatcher synchronization & telemetry</p>
          </div>
        </div>

        {assignedOrders.length > 0 ? (
          <div className="space-y-4">
            {assignedOrders.map((order) => {
              const badge = getStatusBadgeStyle(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-amber-400 to-primary-600"></div>

                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-xl text-primary-600 dark:text-primary-400">
                        #{order.id}
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl border shadow-sm ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                      Courier Drop Fee: <strong className="text-emerald-600 dark:text-emerald-400">৳95</strong> •{' '}
                      {order.paymentMethod === 'cash_on_delivery'
                        ? 'Collect Cash: ' + formatPrice(order.total)
                        : 'Paid Online (No Cash Collection)'}
                    </div>
                  </div>

                  {/* Route Details: Step 1 & Step 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Pickup */}
                    <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 space-y-2">
                      <div className="flex items-center justify-between text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5" />
                          <span>Step 1: Restaurant Pickup</span>
                        </div>
                        <span className="text-[10px] bg-primary-100 dark:bg-primary-950 px-2 py-0.5 rounded-full font-black">
                          Ready
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {order.restaurantName}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">{order.restaurantAddress}</p>
                    </div>

                    {/* Dropoff */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Step 2: Customer Delivery</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-black">
                          Destination
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {order.customerName} ({order.customerPhone})
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300">
                        {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city}
                      </p>
                      {order.customerNotes && (
                        <p className="text-primary-600 dark:text-primary-400 font-bold italic">
                          Gate note: &quot;{order.customerNotes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items summary */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <strong className="text-slate-800 dark:text-slate-200">Package:</strong>{' '}
                    <span>{order.items.map((it) => `${it.quantity}x ${it.foodItem.name}`).join(', ')}</span>
                  </div>

                  {/* Rider Status Progression Controls */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tap to Advance Milestone:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant={order.status === 'Preparing' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="font-bold"
                      >
                        At Kitchen
                      </Button>

                      <Button
                        variant={order.status === 'Picked Up' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                        className="font-bold"
                      >
                        Picked Up
                      </Button>

                      <Button
                        variant={order.status === 'On The Way' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'On The Way')}
                        className="font-bold"
                      >
                        On The Way 🚴
                      </Button>

                      <Button
                        variant={order.status === 'Delivered' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="font-bold shadow-glow"
                      >
                        Complete Delivery ✓
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-4 shadow-card">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                All Assigned Deliveries Complete!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active orders assigned right now. Keep your app online in the Gulshan/Banani hub to receive automated incoming order dispatches.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

