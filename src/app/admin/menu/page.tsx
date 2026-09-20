'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Search, UtensilsCrossed, Power, Edit2, Check } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

export default function AdminMenuPage() {
  const { foodItems, restaurants, toggleFoodAvailability, updateFoodPrice } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const filteredItems = foodItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  const handleStartEdit = (id: string, currentPrice: number) => {
    setEditingFoodId(id);
    setEditPrice(currentPrice);
  };

  const handleSavePrice = (id: string) => {
    if (editPrice > 0) {
      updateFoodPrice(id, editPrice);
    }
    setEditingFoodId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Menu & Culinary Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Adjust dish pricing, category classification and in-stock/sold-out availability live
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search dishes or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-medium px-3.5 py-2.5 pl-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Menu Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Dish</th>
                <th className="py-3.5 px-5">Restaurant</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Price (৳)</th>
                <th className="py-3.5 px-5">Availability</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((food) => {
                const rest = restaurants.find((r) => r.id === food.restaurantId);
                const isEditing = editingFoodId === food.id;

                return (
                  <tr key={food.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">
                            {food.name}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {food.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300">
                      {rest?.name || 'Kitchen'}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[10px] text-slate-600 dark:text-slate-400">
                        {food.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs rounded border border-primary-500 font-bold text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleSavePrice(food.id)}
                            className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatPrice(food.price)}
                          </span>
                          <button
                            onClick={() => handleStartEdit(food.id, food.price)}
                            className="text-slate-400 hover:text-primary-500"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          food.isAvailable !== false
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                        }`}
                      >
                        {food.isAvailable !== false ? 'In Stock' : 'Sold Out'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => toggleFoodAvailability(food.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          food.isAvailable !== false
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 hover:bg-rose-200'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        {food.isAvailable !== false ? 'Mark Sold Out' : 'Mark Available'}
                      </button>
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
