'use client';

import React from 'react';
import Link from 'next/link';
import { mockCategories } from '../../data/mockData';

interface CategoryScrollerProps {
  selectedCategory?: string;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({ selectedCategory }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Craving Something?</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              8 Cuisines
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse through curated culinary collections across Dhaka
          </p>
        </div>
        <Link
          href="/explore"
          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group"
        >
          <span>Explore All</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Horizontal Scroller on mobile, grid on desktop */}
      <div className="flex overflow-x-auto gap-3 pb-3 pt-1 px-1 no-scrollbar sm:grid sm:grid-cols-4 md:grid-cols-8 sm:overflow-visible">
        {mockCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className={`group flex flex-col items-center shrink-0 w-[90px] sm:w-auto p-3 rounded-3xl transition-all duration-300 active:scale-95 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-white dark:bg-[#121722] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-card-hover hover:-translate-y-1'
              }`}
            >
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-2.5 ring-2 transition-all duration-500 shadow-sm ${
                  isSelected ? 'ring-white/80 scale-105' : 'ring-slate-100 dark:ring-slate-800 group-hover:ring-primary-400 group-hover:scale-110'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>

              <span
                className={`text-[11px] sm:text-xs font-bold text-center tracking-tight truncate max-w-full ${
                  isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
