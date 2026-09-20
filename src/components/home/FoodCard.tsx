'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FoodItem } from '../../data/types';
import { useApp } from '../../context/AppContext';
import { Star, Plus, Heart, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { FoodModal } from '../food/FoodModal';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { isFoodFavorite, toggleFavoriteFood, addToCart, restaurants } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const isFav = isFoodFavorite(food.id);
  const restaurant = restaurants.find((r) => r.id === food.restaurantId);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If food has required customizations, open customization modal instead of quick adding
    const hasRequiredCustomizations = food.customizations && food.customizations.some((c) => c.required);
    if (hasRequiredCustomizations) {
      setModalOpen(true);
    } else {
      addToCart(food, 1);
    }
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
      >
        {/* Food Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

          {/* Popular Tag */}
          {food.isPopular && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </div>
          )}

          {/* Dietary Indicator */}
          {food.dietary && (
            <div className="absolute bottom-3 left-3 flex gap-1">
              {food.dietary.includes('veg') && (
                <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  Veg
                </span>
              )}
              {food.dietary.includes('halal') && (
                <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  Halal
                </span>
              )}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavoriteFood(food.id);
            }}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-md transition-all hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Title & Restaurant */}
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
              {food.name}
            </h4>

            {restaurant && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {restaurant.name}
              </p>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Price & Add to Cart Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {formatPrice(food.price)}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{food.rating}</span>
                <span>({food.reviewCount})</span>
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              aria-label={`Add ${food.name} to cart`}
              className="px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-sm hover:shadow-glow flex items-center gap-1 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Customization & Details Modal */}
      {modalOpen && (
        <FoodModal
          food={food}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};
