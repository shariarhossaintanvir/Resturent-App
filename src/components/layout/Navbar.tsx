'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  MapPin,
  Search,
  ShoppingBag,
  Bell,
  Heart,
  CalendarDays,
  ShieldAlert,
  Bike,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cartCount,
    total,
    unreadNotificationCount,
    userProfile,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('Gulshan 2, Dhaka');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  const areas = ['Gulshan 2, Dhaka', 'Gulshan 1, Dhaka', 'Banani, Dhaka', 'Dhanmondi, Dhaka', 'Uttara, Dhaka', 'Mirpur, Dhaka'];

  // Do not render standard customer navbar on full admin or rider pages if preferred, or render a top banner
  const isAdmin = pathname.startsWith('/admin');
  const isRider = pathname.startsWith('/rider');

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        {/* Top Announcement / Role Switcher Strip */}
        <div className="bg-gradient-to-r from-orange-600 via-primary-600 to-amber-600 text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider">
                Special Offer
              </span>
              <span className="hidden sm:inline">Use code <strong className="underline">FIRST20</strong> for 20% OFF your initial order!</span>
              <span className="sm:hidden">20% OFF with code <strong>FIRST20</strong></span>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="flex items-center gap-2 font-medium">
              <span className="opacity-75 hidden md:inline">Quick Portal Demo:</span>
              <Link
                href="/"
                className={`px-2.5 py-0.5 rounded-md transition-all text-xs ${
                  !isAdmin && !isRider ? 'bg-white text-primary-700 font-bold shadow-sm' : 'hover:bg-white/10 text-white'
                }`}
              >
                Customer
              </Link>
              <Link
                href="/admin"
                className={`px-2.5 py-0.5 rounded-md transition-all text-xs flex items-center gap-1 ${
                  isAdmin ? 'bg-white text-primary-700 font-bold shadow-sm' : 'hover:bg-white/10 text-white'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                Admin
              </Link>
              <Link
                href="/rider"
                className={`px-2.5 py-0.5 rounded-md transition-all text-xs flex items-center gap-1 ${
                  isRider ? 'bg-white text-primary-700 font-bold shadow-sm' : 'hover:bg-white/10 text-white'
                }`}
              >
                <Bike className="w-3 h-3" />
                Rider
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2.5 gap-3 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-all">
                <Utensils className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  Feast<span className="text-primary-500">Hub</span>
                </span>
                <span className="hidden sm:block text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400 -mt-1">
                  Dhaka Gourmet Tech
                </span>
              </div>
            </Link>

            {/* Location Selector Pill */}
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#121722] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span className="max-w-[130px] truncate">{selectedArea}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-2">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search dishes, cuisines or restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl pl-10 pr-12 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white dark:focus:bg-[#121722] transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
                <span className="hidden sm:block absolute right-3 top-2.5 text-[10px] font-mono text-slate-400 bg-slate-200/70 dark:bg-slate-700/70 px-1.5 py-0.5 rounded-md border border-slate-300/60 dark:border-slate-600/60">
                  /
                </span>
              </div>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Link
                href="/explore"
                className={`px-3 py-2 rounded-xl transition-all hover:text-primary-600 ${
                  pathname === '/explore' ? 'text-primary-600 font-extrabold bg-primary-50 dark:bg-primary-950/50 shadow-sm' : ''
                }`}
              >
                Explore
              </Link>
              <Link
                href="/reservations"
                className={`px-3 py-2 rounded-xl transition-all hover:text-primary-600 flex items-center gap-1.5 ${
                  pathname === '/reservations' ? 'text-primary-600 font-extrabold bg-primary-50 dark:bg-primary-950/50 shadow-sm' : ''
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-primary-500" />
                Reservations
              </Link>
              <Link
                href="/favorites"
                className={`px-3 py-2 rounded-xl transition-all hover:text-primary-600 flex items-center gap-1.5 ${
                  pathname === '/favorites' ? 'text-primary-600 font-extrabold bg-primary-50 dark:bg-primary-950/50 shadow-sm' : ''
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/40" />
                Favorites
              </Link>
              <Link
                href="/orders"
                className={`px-3 py-2 rounded-xl transition-all hover:text-primary-600 ${
                  pathname === '/orders' ? 'text-primary-600 font-extrabold bg-primary-50 dark:bg-primary-950/50 shadow-sm' : ''
                }`}
              >
                Orders
              </Link>
            </nav>

            {/* Actions: Notifications, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Notification button */}
              <Link
                href="/notifications"
                className="relative p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 bg-white dark:bg-[#121722] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-glow transition-all font-bold text-xs sm:text-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">
                  {cartCount > 0 ? formatPrice(total) : 'Cart'}
                </span>
                {cartCount > 0 && (
                  <span className="bg-white text-primary-600 text-xs font-black rounded-full px-1.5 py-0.2 min-w-[18px] text-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 pl-1 group"
                aria-label="User Profile"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-9 h-9 rounded-2xl ring-2 ring-primary-500/20 group-hover:ring-primary-500 object-cover shadow-sm transition-all"
                />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 bg-white dark:bg-[#121722] border border-slate-200/80 dark:border-slate-800 shadow-sm"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Location Dropdown Modal */}
        {showLocationModal && (
          <div className="absolute top-full left-4 sm:left-48 mt-1 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Select Delivery Area
            </div>
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => {
                  setSelectedArea(area);
                  setShowLocationModal(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedArea === area
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{area}</span>
                {selectedArea === area && <span className="text-primary-500 text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search food or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                🔍 Explore All Food & Restaurants
              </Link>
              <Link
                href="/reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                📅 Reserve a Table
              </Link>
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ❤️ Saved Favorites
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                📦 My Orders & Tracking
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary-500" />
                Profile & Addresses
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
