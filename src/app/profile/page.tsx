'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Heart,
  CalendarDays,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Check,
  Crown,
  Sparkles,
  Award,
} from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, updateUserProfile, orders, reservations, favoriteFoodIds, favoriteRestaurantIds, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setIsEditing(false);
  };

  const menuItems = [
    {
      title: 'My Orders & Dispatches',
      subtitle: `${orders.length} lifetime orders placed`,
      icon: Receipt,
      href: '/orders',
      badge: orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length || undefined,
    },
    {
      title: 'Saved Favorites',
      subtitle: `${favoriteRestaurantIds.length} restaurants, ${favoriteFoodIds.length} dishes`,
      icon: Heart,
      href: '/favorites',
    },
    {
      title: 'Table Reservations',
      subtitle: `${reservations.length} dining reservations booked`,
      icon: CalendarDays,
      href: '/reservations',
    },
    {
      title: 'Saved Delivery Addresses',
      subtitle: `${userProfile.addresses.length} saved addresses (Gulshan, Banani)`,
      icon: MapPin,
      href: '/checkout',
    },
    {
      title: 'Account & Device Settings',
      subtitle: 'Notification preferences, language, currency',
      icon: Settings,
      href: '/settings',
    },
    {
      title: 'Concierge Help & Hotline',
      subtitle: '24/7 Dhaka food concierge support',
      icon: HelpCircle,
      href: '/settings',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Profile Passport Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary-500/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {userProfile.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                  <Crown className="w-3 h-3 fill-current" />
                  VIP Gold Diner
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-primary-500" />
                  <span>{userProfile.email}</span>
                </span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 font-mono font-medium">
                  <Phone className="w-3.5 h-3.5 text-primary-500" />
                  <span>{userProfile.phone}</span>
                </span>
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            className="font-bold border-slate-200 dark:border-slate-700 shrink-0"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <Button variant="primary" size="sm" type="submit" className="font-bold shadow-glow">
              Save Profile Changes
            </Button>
          </form>
        )}

        {/* Tier Progress Banner */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Progress to Platinum Tier</span>
            </span>
            <span className="font-bold text-primary-600 dark:text-primary-400">
              800 / 1,000 FeastPoints
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 via-amber-400 to-amber-500 rounded-full w-4/5"></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Order 2 more meals this month to unlock <strong>Unlimited Free Delivery</strong> & 15% VIP dine-in discount.
          </p>
        </div>
      </div>

      {/* 3 Quick Metric Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/orders"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all text-center group"
        >
          <Receipt className="w-5 h-5 mx-auto text-primary-500 group-hover:scale-110 transition-transform mb-1.5" />
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {orders.length}
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Orders
          </div>
        </Link>

        <Link
          href="/favorites"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all text-center group"
        >
          <Heart className="w-5 h-5 mx-auto text-rose-500 group-hover:scale-110 transition-transform mb-1.5" />
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {favoriteRestaurantIds.length + favoriteFoodIds.length}
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Favorites
          </div>
        </Link>

        <Link
          href="/reservations"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all text-center group"
        >
          <CalendarDays className="w-5 h-5 mx-auto text-amber-500 group-hover:scale-110 transition-transform mb-1.5" />
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {reservations.length}
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Bookings
          </div>
        </Link>
      </div>

      {/* Menu Links List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-card divide-y divide-slate-100 dark:divide-slate-800/80">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 group-hover:text-primary-500 transition-colors flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.badge !== undefined && (
                  <span className="bg-primary-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    {item.badge} Active
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Sign Out</h3>
              <p className="text-xs text-rose-500/70">Invalidate session and clear cookies</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

