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
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Craving Something?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse through curated popular culinary categories
          </p>
        </div>
        <Link
          href="/explore"
          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
        >
          View All →
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
              className={`group flex flex-col items-center shrink-0 w-24 sm:w-auto p-2.5 rounded-2xl transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-card hover:-translate-y-1'
              }`}
            >
              <div
                className={`relative w-14 h-14 rounded-full overflow-hidden mb-2 ring-2 transition-transform group-hover:scale-110 ${
                  isSelected ? 'ring-white/80' : 'ring-slate-100 dark:ring-slate-800 group-hover:ring-primary-400'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <span
                className={`text-xs font-bold text-center tracking-tight truncate max-w-full ${
                  isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'
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
