'use client';

import React from 'react';
import Link from 'next/link';
import { Restaurant } from '../../data/types';
import { useApp } from '../../context/AppContext';
import { Star, Clock, Bike, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isRestaurantFavorite, toggleFavoriteRestaurant } = useApp();
  const isFav = isRestaurantFavorite(restaurant.id);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Cover Image Container */}
      <Link href={`/restaurants/${restaurant.id}`} className="relative aspect-[16/9] w-full overflow-hidden block bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Promo Badge */}
        {restaurant.isOfferAvailable && restaurant.offerText && (
          <div className="absolute bottom-3 left-3 bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md">
            {restaurant.offerText}
          </div>
        )}

        {/* Delivery Time Badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-primary-500" />
          <span>{restaurant.deliveryTime}</span>
        </div>
      </Link>

      {/* Favorite Heart Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavoriteRestaurant(restaurant.id);
        }}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-md transition-all hover:scale-110 active:scale-95"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-600 dark:text-slate-300'
          }`}
        />
      </button>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Rating */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/restaurants/${restaurant.id}`}>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-xs px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{restaurant.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({restaurant.reviewCount})</span>
            </div>
          </div>

          {/* Cuisine Tags */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {restaurant.cuisine.join(' • ')}
          </p>
        </div>

        {/* Footer: Delivery Fee & Location */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>Delivery {restaurant.deliveryFee === 0 ? 'Free' : formatPrice(restaurant.deliveryFee)}</span>
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-300">{restaurant.area}</span>
        </div>
      </div>
    </div>
  );
};
