'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/ui/Button';
import { Store, Star, Clock, Bike, Power, ExternalLink } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

export default function AdminRestaurantsPage() {
  const { restaurants, toggleRestaurantOpen } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Partner Kitchen Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor operational status, ratings and delivery parameters across all {restaurants.length} kitchens
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Restaurant</th>
                <th className="py-3.5 px-5">Area</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5">Delivery Fee</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Operational Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {restaurants.map((rest) => (
                <tr key={rest.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rest.logoImage}
                        alt={rest.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">
                          {rest.name}
                        </span>
                        <span className="text-slate-400">{rest.cuisine.join(', ')}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-medium text-slate-700 dark:text-slate-300">
                    {rest.area}
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{rest.rating}</span>
                      <span className="text-slate-400 font-normal">({rest.reviewCount})</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-semibold text-slate-800 dark:text-slate-200">
                    {formatPrice(rest.deliveryFee)}
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        rest.isOpen !== false
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/20'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-500/20'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          rest.isOpen !== false ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span>{rest.isOpen !== false ? 'Open for Orders' : 'Temporarily Closed'}</span>
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => toggleRestaurantOpen(rest.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                        rest.isOpen !== false
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{rest.isOpen !== false ? 'Close Kitchen' : 'Open Kitchen'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
