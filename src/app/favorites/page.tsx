'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { RestaurantCard } from '../../components/home/RestaurantCard';
import { FoodCard } from '../../components/home/FoodCard';
import { Button } from '../../components/ui/Button';
import { Heart, Store, UtensilsCrossed } from 'lucide-react';

export default function FavoritesPage() {
  const {
    favoriteRestaurantIds,
    favoriteFoodIds,
    restaurants,
    foodItems,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'foods'>('restaurants');

  const favoriteRestaurants = restaurants.filter((r) => favoriteRestaurantIds.includes(r.id));
  const favoriteFoods = foodItems.filter((f) => favoriteFoodIds.includes(f.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Saved Favorites</span>
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your bookmarked kitchens and go-to comfort cravings, saved securely
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'restaurants'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Favorite Restaurants ({favoriteRestaurants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('foods')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'foods'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Favorite Dishes ({favoriteFoods.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'restaurants' && (
        <>
          {favoriteRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  No favorite restaurants yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any restaurant card to save your favorite dining spots here.
                </p>
              </div>
              <Link href="/explore">
                <Button variant="primary" size="md">
                  Explore Restaurants
                </Button>
              </Link>
            </div>
          )}
        </>
      )}

      {activeTab === 'foods' && (
        <>
          {favoriteFoods.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {favoriteFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  No favorite dishes saved
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Heart individual burgers, pizzas or kacchi dishes for one-tap ordering anytime.
                </p>
              </div>
              <Link href="/explore">
                <Button variant="primary" size="md">
                  Browse Mouthwatering Dishes
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
