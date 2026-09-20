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
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore & Discover
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search across {restaurants.length} gourmet kitchens and {foodItems.length}+ mouthwatering dishes
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by food dish, restaurant, or cuisine (e.g. Burger, Kacchi, Pizza, Spicy)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-slate-200 dark:border-slate-800 shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          All Categories
        </button>

        {mockCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white shadow-sm'
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
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'restaurants'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurants ({filteredRestaurants.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'foods'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dishes ({filteredFoods.length})</span>
          </button>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Sort selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-sm"
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              hasActiveFilters
                ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFiltersMobile && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Filter Options
            </h4>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {/* Minimum Rating */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                Minimum Rating
              </label>
              <div className="flex items-center gap-1">
                {[0, 4.0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinRating(rate)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      minRating === rate
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rate === 0 ? 'Any' : `${rate}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Delivery Time */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                Max Delivery Time ({maxDeliveryTime} mins)
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={maxDeliveryTime}
                onChange={(e) => setMaxDeliveryTime(parseInt(e.target.value))}
                className="w-full accent-primary-500 cursor-pointer"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                Max Dish Price (৳{maxPrice})
              </label>
              <input
                type="range"
                min="150"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary-500 cursor-pointer"
              />
            </div>

            {/* Quick toggles */}
            <div className="flex flex-col justify-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span>Special Offers Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVegetarian}
                  onChange={(e) => setOnlyVegetarian(e.target.checked)}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span>Vegetarian Dishes Only 🥦</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-8">
        {/* If 'all' tab has zero restaurants AND zero foods */}
        {activeTab === 'all' && filteredRestaurants.length === 0 && filteredFoods.length === 0 && (
          <EmptyState
            icon={Search}
            title="No restaurants or food found"
            description="We couldn't find any culinary matches for your search or active filters. Try clearing some filters or searching for another term."
            actionText="Reset All Filters"
            onActionClick={resetFilters}
          />
        )}

        {/* Restaurants Grid */}
        {(activeTab === 'all' || activeTab === 'restaurants') && (
          <div className="space-y-4">
            {filteredRestaurants.length > 0 && (
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Restaurants ({filteredRestaurants.length})
                </h3>
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Food Dishes ({filteredFoods.length})
                </h3>
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
