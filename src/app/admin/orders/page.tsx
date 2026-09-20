'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../data/types';
import { Button } from '../../../components/ui/Button';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  MapPin,
  Bike,
} from 'lucide-react';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../../utils/formatters';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Picked Up',
    'On The Way',
    'Delivered',
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter !== 'all' && o.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchRest = o.restaurantName.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchRest) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Live Order Dispatch & Status Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor order transitions from kitchen acceptance through courier delivery in real time
        </p>
      </div>

      {/* Filter bar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium px-3.5 py-2.5 pl-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedStatusFilter === 'all'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedStatusFilter === st
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const badge = getStatusBadgeStyle(order.status);

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4"
            >
              {/* Top Row: Reference, Date, Total */}
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

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Placed: {formatDate(order.createdAt)}</span>
                  <strong className="text-sm font-black text-slate-900 dark:text-white">
                    {formatPrice(order.total)}
                  </strong>
                </div>
              </div>

              {/* Middle Row: Customer, Restaurant, Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Customer & Destination
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-primary-500" />
                    <span>{order.customerName} ({order.customerPhone})</span>
                  </p>
                  <p className="text-slate-500 flex items-start gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress.street}, {order.deliveryAddress.area}</span>
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Kitchen Partner
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{order.restaurantName}</p>
                  <p className="text-slate-500">{order.restaurantAddress}</p>
                  {order.customerNotes && (
                    <p className="text-primary-600 dark:text-primary-400 italic mt-1">
                      Note: &quot;{order.customerNotes}&quot;
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Items ({order.items.length})
                  </span>
                  <div className="space-y-1">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span className="truncate max-w-[70%]">
                          <strong>{it.quantity}x</strong> {it.foodItem.name}
                        </span>
                        <span className="font-semibold">{formatPrice(it.itemTotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Update Quick Action Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Transition Status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {statuses.map((st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(order.id, st)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          order.status === st
                            ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
