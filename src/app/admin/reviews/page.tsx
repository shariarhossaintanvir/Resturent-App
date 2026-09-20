'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Star, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const { reviews } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Reviews & Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor diner satisfaction, feedback and verified customer comments across kitchens
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Kitchen</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5">Review Comment</th>
                <th className="py-3.5 px-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {rev.userName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300">
                    {rev.restaurantName}
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300 max-w-md">
                    <p className="line-clamp-2">{rev.comment}</p>
                    {rev.foodName && (
                      <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold block mt-0.5">
                        Dish: {rev.foodName}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                    {rev.date}
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
