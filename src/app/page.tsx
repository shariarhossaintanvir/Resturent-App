'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { CategoryScroller } from '../components/home/CategoryScroller';
import { PromoCarousel } from '../components/home/PromoCarousel';
import { RestaurantCard } from '../components/home/RestaurantCard';
import { FoodCard } from '../components/home/FoodCard';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Utensils,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { userProfile, restaurants, foodItems } = useApp();
  const [searchInput, setSearchInput] = useState('');

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  // Popular, Featured, and Recommended items
  const popularRestaurants = restaurants.slice(0, 6);
  const popularFoods = foodItems.filter((f) => f.isPopular).slice(0, 8);
  const recommendedFoods = foodItems.filter((f) => f.rating >= 4.8).slice(0, 4);

  const quickTags = ['Biryani', 'Burger', 'Pizza', 'Kebab', 'Pasta', 'Dessert'];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Header: Greeting & Location */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {getGreeting()}, {userProfile.name.split(' ')[0]} 👋
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                <span>Deliver to:</span>
                <strong className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-none">
                  {userProfile.addresses[0]?.street}, {userProfile.addresses[0]?.area}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Dhaka North Zone Active</span>
          </div>
        </div>
      </div>

      {/* 2. Search Section with Quick Search Chips */}
      <section aria-label="Search and Quick Filters" className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search food, cuisines, or restaurants (e.g., Kacchi, Burger, Pizza)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 rounded-2xl pl-11 pr-24 py-3.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-slate-200 dark:border-slate-800 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 sm:top-4" />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
          >
            <span>Search</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-medium shrink-0 mr-1">Trending:</span>
          {quickTags.map((tag) => (
            <Link
              key={tag}
              href={`/explore?q=${encodeURIComponent(tag)}`}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-slate-600 dark:text-slate-300 hover:text-primary-600 border border-slate-200/80 dark:border-slate-800 shrink-0 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Categories Scroller */}
      <section aria-label="Food Categories">
        <CategoryScroller />
      </section>

      {/* 4. Promotional Banner Carousel */}
      <section aria-label="Promotions">
        <PromoCarousel />
      </section>

      {/* 5. Popular Restaurants Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Popular Restaurants
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top-rated culinary hotspots and award-winning kitchens across Dhaka
            </p>
          </div>

          <Link
            href="/explore?tab=restaurants"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 6. Popular Food Dishes Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Utensils className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Popular Food
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Most ordered delights right now in your neighborhood
            </p>
          </div>

          <Link
            href="/explore?tab=foods"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>See Full Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 7. Recommended For You Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Award className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Handpicked gourmet recommendations with 4.8+ diner approval
            </p>
          </div>

          <Link
            href="/explore?sortBy=rating"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View Top Rated</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendedFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 8. Trust & Quality Features Banner */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base mb-1">Ultra-Fast 25 Min Delivery</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated couriers stationed near your favorite kitchens ensure your food arrives piping hot.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base mb-1">Gourmet Hygiene Guarantee</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every partner kitchen is 100% verified, sanitized and sealed in tamper-proof thermal packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base mb-1">Live Animated GPS Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Watch your delivery courier move in real time on our vector map with step-by-step milestone updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
