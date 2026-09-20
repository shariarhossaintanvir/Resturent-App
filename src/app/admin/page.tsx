'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CalendarDays,
  Users,
  TrendingUp,
  ArrowUpRight,
  Store,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Activity,
  Layers,
} from 'lucide-react';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const { orders, reservations, restaurants, foodItems } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>FeastHub Executive Control Tower</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Operations & Telemetry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time delivery fulfillment, restaurant partner health and GMV tracking across Dhaka
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-bold shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Live Dispatch Queue</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {activeOrdersCount}
            </span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2 relative overflow-hidden group hover:border-primary-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% today
          </span>
        </div>

        {/* Revenue in BDT */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.6% vs last week
          </span>
        </div>

        {/* Active Live Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2 relative overflow-hidden group hover:border-primary-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-primary-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <span>{activeOrdersCount}</span>
            {activeOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">In kitchen & on road</span>
        </div>

        {/* Reservations */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reservations</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-500 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {reservations.length}
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
            Priority VIP dining
          </span>
        </div>

        {/* Restaurants / Customers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-2 col-span-2 sm:col-span-1 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Partner Kitchens</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {restaurants.length}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {foodItems.length}+ total menu dishes
          </span>
        </div>
      </div>

      {/* Hourly Sales Visualization Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Today&apos;s Order Velocity (Dhaka Metropolitan)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live order volume distribution across peak Gulshan, Banani & Dhanmondi zones
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Peak Rush: 7 PM - 10 PM
          </span>
        </div>

        {/* Mini simulated chart bars */}
        <div className="pt-4 flex items-end justify-between gap-2.5 h-48 border-b border-slate-100 dark:border-slate-800 pb-3">
          {[
            { hour: '11 AM', height: '35%', count: 18 },
            { hour: '1 PM', height: '75%', count: 48 },
            { hour: '3 PM', height: '28%', count: 14 },
            { hour: '5 PM', height: '42%', count: 26 },
            { hour: '7 PM', height: '95%', count: 72 },
            { hour: '8 PM', height: '100%', count: 86 },
            { hour: '9 PM', height: '88%', count: 64 },
            { hour: '10 PM', height: '55%', count: 39 },
          ].map((bar) => (
            <div key={bar.hour} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.count} orders
              </span>
              <div
                className="w-full rounded-2xl bg-gradient-to-t from-primary-600 via-primary-500 to-amber-400 group-hover:brightness-110 transition-all cursor-pointer shadow-sm group-hover:shadow-glow"
                style={{ height: bar.height }}
              />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-1">
                {bar.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Live Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Orders Stream</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live incoming customer orders requiring fulfillment</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Restaurant</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map((ord) => {
                const badge = getStatusBadgeStyle(ord.status);
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5 font-mono font-black text-slate-900 dark:text-white">
                      #{ord.id}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-900 dark:text-white block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-400">{ord.deliveryAddress.area}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-700 dark:text-slate-300 font-semibold">
                      {ord.restaurantName}
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Dispatch</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

