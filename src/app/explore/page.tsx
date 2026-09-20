'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { RestaurantCard } from '../../components/home/RestaurantCard';
import { FoodCard } from '../../components/home/FoodCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockCategories } from '../../data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  Tag,
  Leaf,
  X,
  Store,
  UtensilsCrossed,
} from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialTab = (searchParams.get('tab') as 'all' | 'restaurants' | 'foods') || 'all';

  const { restaurants, foodItems } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'foods'>(initialTab);

  // Filter controls
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [onlyVegetarian, setOnlyVegetarian] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'fastest'
  >('recommended');

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        // Query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchCuisine = r.cuisine.some((c) => c.toLowerCase().includes(q));
          const matchArea = r.area.toLowerCase().includes(q);
          if (!matchName && !matchCuisine && !matchArea) return false;
        }

        // Category match
        if (selectedCategory !== 'all') {
          const catObj = mockCategories.find((c) => c.id === selectedCategory);
          if (catObj) {
            const matchCat = r.cuisine.some((c) => c.toLowerCase().includes(catObj.name.toLowerCase()));
            if (!matchCat) return false;
          }
        }

        // Rating
        if (minRating > 0 && r.rating < minRating) return false;

        // Delivery time parse
        if (maxDeliveryTime < 60) {
          const num = parseInt(r.deliveryTime.split('-')[0]) || 30;
          if (num > maxDeliveryTime) return false;
        }

        // Offers
        if (onlyOffers && !r.isOfferAvailable) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'fastest') {
          const aTime = parseInt(a.deliveryTime.split('-')[0]) || 30;
          const bTime = parseInt(b.deliveryTime.split('-')[0]) || 30;
          return aTime - bTime;
        }
        return 0; // recommended
      });
  }, [restaurants, searchQuery, selectedCategory, minRating, maxDeliveryTime, onlyOffers, sortBy]);

  // Filter Foods
  const filteredFoods = useMemo(() => {
    return foodItems
      .filter((f) => {
        // Query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = f.name.toLowerCase().includes(q);
          const matchDesc = f.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        // Category match
        if (selectedCategory !== 'all' && f.category !== selectedCategory) {
          return false;
        }

        // Rating
        if (minRating > 0 && f.rating < minRating) return false;

        // Price
        if (f.price > maxPrice) return false;

        // Vegetarian
        if (onlyVegetarian && !f.dietary?.includes('veg')) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [foodItems, searchQuery, selectedCategory, minRating, maxPrice, onlyVegetarian, sortBy]);

  const hasActiveFilters =
    minRating > 0 ||
    maxPrice < 1500 ||
    maxDeliveryTime < 60 ||
    onlyOffers ||
    onlyVegetarian ||
    selectedCategory !== 'all';

  const resetFilters = () => {
    setMinRating(0);
    setMaxPrice(1500);
    setMaxDeliveryTime(60);
    setOnlyOffers(false);
    setOnlyVegetarian(false);
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('recommended');
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Top Header & Search Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-primary-50/20 to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/50 text-primary-600 dark:text-primary-400 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Curated Discovery & Search
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore Cravings & Flavors
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Browse {restaurants.length} premium restaurants and {foodItems.length}+ signature dishes crafted across Dhaka
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative pt-1">
            <input
              type="text"
              placeholder="Search dishes, restaurants, or cuisines (e.g. Smash Burger, Kacchi, Woodfired Pizza)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-950/80 rounded-2xl pl-11 pr-11 py-3.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
            />
            <Search className="w-5 h-5 text-primary-500 absolute left-4 top-4.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-4.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                minRating === 4.5
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.5+ Rated</span>
            </button>

            <button
              onClick={() => setMaxDeliveryTime(maxDeliveryTime === 30 ? 60 : 30)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                maxDeliveryTime === 30
                  ? 'bg-primary-500 text-white shadow-sm ring-2 ring-primary-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Fast (≤30m)</span>
            </button>

            <button
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                onlyOffers
                  ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Offers & Deals</span>
            </button>

            <button
              onClick={() => setOnlyVegetarian(!onlyVegetarian)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                onlyVegetarian
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Pure Veg</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-500 dark:text-slate-400 ml-1 underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white shadow-glow'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          All Categories
        </button>

        {mockCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Main Tabs: All | Restaurants | Foods & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        {/* Type Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'restaurants'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kitchens ({filteredRestaurants.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'foods'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dishes ({filteredFoods.length})</span>
          </button>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Sort selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 pr-9 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-sm"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Top Rated ⭐</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="fastest">Fastest Delivery ⚡</option>
            </select>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              hasActiveFilters
                ? 'bg-primary-500 text-white border-primary-500 shadow-glow'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFiltersMobile && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Detailed Filters
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Refine by customer satisfaction, delivery radius, and dietary preferences
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 4.0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinRating(rate)}
                    className={`py-2 text-xs font-black rounded-xl border transition-all ${
                      minRating === rate
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {rate === 0 ? 'Any' : `${rate}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Delivery Time */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Max Delivery Time
                </label>
                <span className="text-xs font-extrabold text-primary-600 dark:text-primary-400">
                  {maxDeliveryTime} mins
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={maxDeliveryTime}
                onChange={(e) => setMaxDeliveryTime(parseInt(e.target.value))}
                className="w-full accent-primary-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>15m Express</span>
                <span>60m</span>
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Max Dish Price
                </label>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  ৳{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>৳150</span>
                <span>৳1500+</span>
              </div>
            </div>

            {/* Quick toggles */}
            <div className="flex flex-col justify-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="rounded-md text-primary-500 focus:ring-primary-500 w-4 h-4"
                />
                <span>Special Deals & Offers Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVegetarian}
                  onChange={(e) => setOnlyVegetarian(e.target.checked)}
                  className="rounded-md text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Vegetarian Dishes Only 🥦</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-10">
        {/* If 'all' tab has zero restaurants AND zero foods */}
        {activeTab === 'all' && filteredRestaurants.length === 0 && filteredFoods.length === 0 && (
          <EmptyState
            icon={Search}
            title="No culinary matches found"
            description="We couldn't find any dishes or restaurants matching your search filters. Try clearing your filters to explore more options."
            actionText="Reset All Filters"
            onActionClick={resetFilters}
          />
        )}

        {/* Restaurants Grid */}
        {(activeTab === 'all' || activeTab === 'restaurants') && (
          <div className="space-y-4">
            {filteredRestaurants.length > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Top Kitchens & Restaurants
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {filteredRestaurants.length} matching dining partners
                  </p>
                </div>
              </div>
            )}

            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              activeTab === 'restaurants' && (
                <EmptyState
                  icon={Store}
                  title="No restaurants match your criteria"
                  description="Try adjusting your maximum delivery time, rating threshold, or cuisine filters."
                  actionText="Reset All Filters"
                  onActionClick={resetFilters}
                />
              )
            )}
          </div>
        )}

        {/* Food Dishes Grid */}
        {(activeTab === 'all' || activeTab === 'foods') && (
          <div className="space-y-4">
            {filteredFoods.length > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Featured Dishes & Entrees
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {filteredFoods.length} culinary creations
                  </p>
                </div>
              </div>
            )}

            {filteredFoods.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredFoods.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            ) : (
              activeTab === 'foods' && (
                <EmptyState
                  icon={UtensilsCrossed}
                  title="No dishes match your filters"
                  description="Try increasing the maximum dish price or choosing a different category."
                  actionText="Reset All Filters"
                  onActionClick={resetFilters}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-medium">Loading explore discovery...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
