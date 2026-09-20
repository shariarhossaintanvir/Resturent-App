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
} from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, updateUserProfile, orders, reservations, favoriteFoodIds, favoriteRestaurantIds } = useApp();
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
      title: 'My Orders',
      subtitle: `${orders.length} orders placed`,
      icon: Receipt,
      href: '/orders',
      badge: orders.filter((o) => o.status !== 'Delivered').length || undefined,
    },
    {
      title: 'Saved Favorites',
      subtitle: `${favoriteRestaurantIds.length} restaurants, ${favoriteFoodIds.length} dishes`,
      icon: Heart,
      href: '/favorites',
    },
    {
      title: 'Table Reservations',
      subtitle: `${reservations.length} dining bookings`,
      icon: CalendarDays,
      href: '/reservations',
    },
    {
      title: 'Saved Delivery Addresses',
      subtitle: `${userProfile.addresses.length} saved addresses (Gulshan 2, Banani)`,
      icon: MapPin,
      href: '/checkout',
    },
    {
      title: 'Notifications & Alerts',
      icon: Bell,
      href: '/notifications',
    },
    {
      title: 'Account Settings',
      subtitle: 'Theme, privacy and notification settings',
      icon: Settings,
      href: '/settings',
    },
    {
      title: 'Help & Support',
      subtitle: '24/7 Dhaka concierge hotline',
      icon: HelpCircle,
      href: '/settings',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-500/20 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white dark:ring-slate-900">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {userProfile.name}
                </h1>
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  VIP Gold Diner
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary-500" />
                  <span>{userProfile.email}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1 font-mono">
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
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <Button variant="primary" size="sm" type="submit">
              Save Profile Changes
            </Button>
          </form>
        )}
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
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 group-hover:text-primary-500 transition-colors flex items-center justify-center">
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
                  <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
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
          onClick={() => alert('Simulated logout. Your session is active for demo purposes.')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Sign Out</h3>
              <p className="text-xs text-rose-500/70">Clear session on this device</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
