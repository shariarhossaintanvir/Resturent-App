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
  Clock,
  Flame,
  Star,
  CalendarDays,
  Percent,
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

  const quickTags = ['Kacchi Biryani', 'Gourmet Burger', 'Wood-Fired Pizza', 'Smoked Kebab', 'Creamy Pasta', 'Belgian Waffle'];

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1. IMMERSIVE EDITORIAL HERO EXPERIENCE */}
      <section aria-label="Hero Section" className="relative">
        <div className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800/80 shadow-2xl p-6 sm:p-10 md:p-14">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Background Food Editorial Imagery */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-80 pointer-events-none overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
              alt="Gourmet Dining Spread"
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent lg:via-slate-950/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            {/* User Location Bar */}
            <div className="inline-flex items-center gap-3 bg-white/10 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-xl object-cover ring-2 ring-primary-500/50"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
              </div>
              <div className="text-xs">
                <span className="text-slate-400 font-medium">Deliver to: </span>
                <span className="font-bold text-white">
                  {userProfile.addresses[0]?.street}, {userProfile.addresses[0]?.area}
                </span>
              </div>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-400">
                25-Min Zone Active
              </span>
            </div>

            {/* Editorial Title & Concept */}
            <div className="space-y-2.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-primary-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                {getGreeting()}, {userProfile.name.split(' ')[0]}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Good food. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-orange-400 to-amber-300">
                  Good mood.
                </span> Delivered.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg leading-relaxed pt-1">
                Discover Dhaka&apos;s most celebrated gourmet kitchens, handcrafted burgers, slow-cooked kacchi & wood-fired pizza.
              </p>
            </div>

            {/* Floating Live Stat Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-extrabold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9 Top Rated</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-sm">
                <Zap className="w-4 h-4 text-primary-400" />
                <span>25 min Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-400 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Free delivery over ৳500</span>
              </div>
            </div>

            {/* Floating Search Container */}
            <div className="pt-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl group">
                <input
                  type="text"
                  placeholder="Search food, cuisines, or restaurants (e.g., Kacchi, Burger, Pizza)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-white dark:bg-[#121722] text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl pl-12 pr-28 py-4 text-xs sm:text-sm font-semibold shadow-2xl border border-white/20 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-primary-500 transition-colors" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-extrabold text-xs shadow-md shadow-primary-500/30 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </button>
              </form>

              {/* Trending Quick Search Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
                <span className="text-slate-400 font-bold shrink-0">Trending:</span>
                {quickTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-slate-200 border border-white/10 shrink-0 transition-all hover:scale-105 active:scale-95"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SELECTIVE BENTO-STYLE HIGHLIGHTS SECTION */}
      <section aria-label="Curated Bento Highlights" className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Today&apos;s Highlights</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                Special Bento
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Handpicked culinary treats, active savings and instant reservations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Bento Card 1: 20% Off Promo (spans 2 cols on lg) */}
          <Link
            href="/explore"
            className="md:col-span-2 lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between min-h-[220px]"
          >
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-85 pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                alt="Gourmet Burger Deal"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600/40 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2 max-w-xs">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Percent className="w-3 h-3 text-yellow-300" />
                <span>Special Promo</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                20% OFF <br />Your First Order
              </h3>
              <p className="text-xs text-white/90 font-medium">
                Use voucher code <strong className="text-amber-300 font-mono">FIRST20</strong> at checkout
              </p>
            </div>

            <div className="relative z-10 pt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-black bg-white text-slate-900 px-4 py-2 rounded-xl shadow-md group-hover:bg-amber-100 transition-colors">
                <span>Claim Offer</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Bento Card 2: Popular Near You (Star Kabab) */}
          <Link
            href="/restaurants/rest-2"
            className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#121722] border border-slate-200/80 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
                <Flame className="w-3 h-3" />
                <span>Popular Near You</span>
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.8</span>
              </div>
            </div>

            <div className="space-y-1 my-3">
              <h4 className="text-lg font-black text-slate-900 dark:white group-hover:text-primary-600 transition-colors">
                Star Kabab & Biryani
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Authentic old Dhaka style kacchi, mutton rezala & fresh luchi
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary-500" />
                20–30 min
              </span>
              <span className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
                Order Now →
              </span>
            </div>
          </Link>

          {/* Bento Card 3: Dine-In Table Reservation */}
          <Link
            href="/reservations"
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 text-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between min-h-[220px]"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <CalendarDays className="w-3 h-3 text-teal-200" />
                <span>VIP Dine-In</span>
              </span>
              <h4 className="text-xl font-black leading-tight">
                Reserve Tables Instantly
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Zero waiting time. Priority seating at top Dhaka fine-dining spots.
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-xs font-black text-white hover:underline">
                <span>Book Table</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. CATEGORIES SCROLLER */}
      <section aria-label="Food Categories">
        <CategoryScroller />
      </section>

      {/* 4. PROMOTIONAL CAROUSEL BANNER */}
      <section aria-label="Promotions">
        <PromoCarousel />
      </section>

      {/* 5. POPULAR RESTAURANTS SECTION */}
      <section className="space-y-5">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Popular Restaurants
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-rated culinary hotspots and award-winning kitchens across Dhaka
            </p>
          </div>

          <Link
            href="/explore?tab=restaurants"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group shrink-0"
          >
            <span>Explore All ({restaurants.length})</span>
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

      {/* 6. POPULAR FOOD DISHES SECTION */}
      <section className="space-y-5">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Utensils className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Trending Dishes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Most ordered delights right now in your neighborhood
            </p>
          </div>

          <Link
            href="/explore?tab=foods"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group shrink-0"
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

      {/* 7. RECOMMENDED GOURMET PICKS */}
      <section className="space-y-5">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Award className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Handpicked gourmet recommendations with 4.8+ diner approval
            </p>
          </div>

          <Link
            href="/explore?sortBy=rating"
            className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group shrink-0"
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

      {/* 8. TRUST & QUALITY FEATURES BANNER */}
      <section className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-950 via-[#121722] to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base tracking-tight">Express 25-Min Delivery</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Dedicated couriers stationed near your favorite kitchens ensure your meals arrive steaming hot.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base tracking-tight">Gourmet Hygiene Guarantee</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Every partner kitchen is 100% verified, sanitized and sealed in tamper-proof thermal packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base tracking-tight">Live Animated GPS Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Watch your delivery courier move in real time on our vector map with step-by-step milestone updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

