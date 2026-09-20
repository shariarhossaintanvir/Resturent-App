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
  const [justAdded, setJustAdded] = useState(false);

  const isFav = isFoodFavorite(food.id);
  const restaurant = restaurants.find((r) => r.id === food.restaurantId);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const hasRequiredCustomizations = food.customizations && food.customizations.some((c) => c.required);
    if (hasRequiredCustomizations) {
      setModalOpen(true);
    } else {
      addToCart(food, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group relative bg-white dark:bg-[#121722] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer select-none"
      >
        {/* Food Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* Popular Chef's Choice Tag */}
          {food.isPopular && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-200" />
              <span>Popular</span>
            </div>
          )}

          {/* Dietary Indicator Badges */}
          {food.dietary && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {food.dietary.includes('veg') && (
                <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                  VEG
                </span>
              )}
              {food.dietary.includes('halal') && (
                <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                  HALAL
                </span>
              )}
            </div>
          )}

          {/* Floating Heart Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavoriteFood(food.id);
            }}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-md transition-all duration-200 hover:scale-110 active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Title & Restaurant */}
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
              {food.name}
            </h4>

            {restaurant && (
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {restaurant.name}
              </p>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
              {food.description}
            </p>
          </div>

          {/* Price, Rating & Floating Add Action */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {formatPrice(food.price)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{food.rating}</span>
                <span className="text-slate-400">({food.reviewCount})</span>
              </div>
            </div>

            {/* Quick Add Button with state response */}
            <button
              onClick={handleQuickAdd}
              aria-label={`Add ${food.name} to cart`}
              className={`px-3.5 py-1.5 rounded-2xl font-black text-xs shadow-md transition-all duration-200 flex items-center gap-1 active:scale-90 ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-500/25 scale-105'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/25 hover:shadow-glow'
              }`}
            >
              <Plus className={`w-3.5 h-3.5 stroke-[3] transition-transform ${justAdded ? 'rotate-90' : ''}`} />
              <span>{justAdded ? 'Added! ✓' : 'Add'}</span>
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
