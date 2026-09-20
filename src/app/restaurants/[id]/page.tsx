'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { FoodCard } from '../../../components/home/FoodCard';
import { ReservationModal } from '../../../components/restaurant/ReservationModal';
import { Button } from '../../../components/ui/Button';
import {
  Star,
  Clock,
  Bike,
  Heart,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Award,
  Phone,
  Info,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

export default function RestaurantDetailsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const {
    restaurants,
    foodItems,
    isRestaurantFavorite,
    toggleFavoriteRestaurant,
    getRestaurantReviews,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('All');
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) {
    notFound();
  }

  const isFav = isRestaurantFavorite(restaurant.id);
  const reviews = getRestaurantReviews(restaurant.id);
  const dishes = foodItems.filter((f) => f.restaurantId === restaurant.id);

  const filteredDishes =
    selectedMenuCategory === 'All'
      ? dishes
      : selectedMenuCategory === 'Popular'
      ? dishes.filter((d) => d.isPopular)
      : dishes.filter((d) => d.category.toLowerCase().includes(selectedMenuCategory.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Cover Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

          {/* Action buttons on Cover */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              />
            </button>
          </div>

          {/* Offer Pill */}
          {restaurant.isOfferAvailable && restaurant.offerText && (
            <div className="absolute top-4 left-4 z-10 bg-rose-600/95 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{restaurant.offerText}</span>
            </div>
          )}

          {/* Restaurant Main Metadata at bottom of cover */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={restaurant.logoImage}
                  alt={restaurant.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl bg-white"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">
                  {restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl line-clamp-1">
                  {restaurant.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                  <span className="font-semibold text-white">{restaurant.cuisine.join(' • ')}</span>
                  <span>•</span>
                  <span>{restaurant.area}</span>
                </div>
              </div>
            </div>

            {/* Reserve Table CTA on cover */}
            <div className="shrink-0 flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setReserveModalOpen(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/30"
                leftIcon={<CalendarDays className="w-4 h-4" />}
              >
                Reserve a Table
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar under Cover */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 bg-slate-900/90 text-slate-200 text-xs py-3 px-4 border-t border-slate-800">
          <div className="flex items-center gap-2 p-2 justify-center">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white text-sm">{restaurant.rating}</span>
              <span className="text-slate-400 text-[11px] ml-1">({restaurant.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 justify-center">
            <Clock className="w-4 h-4 text-primary-400 shrink-0" />
            <div>
              <span className="font-bold text-white">{restaurant.deliveryTime}</span>
              <span className="text-slate-400 text-[11px] ml-1">delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 justify-center">
            <Bike className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">
                {restaurant.deliveryFee === 0 ? 'Free Delivery' : formatPrice(restaurant.deliveryFee)}
              </span>
              <span className="text-slate-400 text-[11px] ml-1">fee</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 justify-center">
            <Award className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white">{restaurant.openingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Menu | Reviews | Info */}
      <div className="border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md -mx-4 px-4 sm:-mx-8 sm:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'menu'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Menu ({dishes.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'reviews'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'info'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Restaurant Info
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setReserveModalOpen(true)}
          className="hidden md:inline-flex"
        >
          Book Table
        </Button>
      </div>

      {/* Tab 1: Menu */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Menu Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedMenuCategory('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedMenuCategory === 'All'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedMenuCategory('Popular')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedMenuCategory === 'Popular'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              ⭐ Popular Highlights
            </button>
            {restaurant.menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedMenuCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  selectedMenuCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredDishes.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Rating Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                {restaurant.rating}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Based on {restaurant.reviewCount} customer ratings
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center sm:text-right">
              <span className="font-bold text-slate-800 dark:text-slate-200">100% Verified Feedbacks</span>
              <p className="mt-0.5">Reviews submitted exclusively by verified diners</p>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.userName}</h4>
                      <p className="text-[11px] text-slate-400">{rev.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>

                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Restaurant Info */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">About {restaurant.name}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
              {restaurant.tagline}. Proudly serving authentic recipes prepared by master culinary chefs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Address:</strong>
                <span className="text-slate-600 dark:text-slate-300">{restaurant.address}, {restaurant.area}, Dhaka</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Opening Hours:</strong>
                <span className="text-slate-600 dark:text-slate-300">{restaurant.openingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Kitchen Contact:</strong>
                <span className="text-slate-600 dark:text-slate-300">+880 (2) 883-9921</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Safety & Hygiene:</strong>
                <span className="text-slate-600 dark:text-slate-300">Grade-A Certified Kitchen with daily temperature checks</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal Trigger */}
      {reserveModalOpen && (
        <ReservationModal
          restaurant={restaurant}
          isOpen={reserveModalOpen}
          onClose={() => setReserveModalOpen(false)}
        />
      )}
    </div>
  );
}
