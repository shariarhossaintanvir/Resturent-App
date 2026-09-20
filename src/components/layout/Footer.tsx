'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Heart, Phone, Mail, MapPin, Shield, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-24 lg:pb-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Feast<span className="text-primary-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dhaka&apos;s premier food delivery and table reservation ecosystem. Savor handcrafted gourmet meals from the city&apos;s most celebrated kitchens.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-primary-400 shrink-0" />
              <span>Available 24/7 in Gulshan, Banani, Dhanmondi & Uttara</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-primary-400 transition-colors">
                  All Restaurants & Menus
                </Link>
              </li>
              <li>
                <Link href="/explore?category=burgers" className="hover:text-primary-400 transition-colors">
                  Gourmet Burgers
                </Link>
              </li>
              <li>
                <Link href="/explore?category=biryani" className="hover:text-primary-400 transition-colors">
                  Shahi Kacchi & Biryani
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-primary-400 transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-primary-400 transition-colors">
                  My Favorite Dishes
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Apps */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Portals & Roles</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary-400" />
                  Admin Restaurant Portal
                </Link>
              </li>
              <li>
                <Link href="/rider" className="hover:text-primary-400 transition-colors">
                  Delivery Rider App
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary-400 transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary-400 transition-colors">
                  Customer Profile & Saved Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                <span>Road 11, Gulshan 2, Dhaka 1212</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>+880 (2) 988-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>concierge@feasthub.com.bd</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-primary-400 font-semibold border border-slate-700">
                ⚡ Average ETA: 25-30 Mins
              </span>
            </div>
          </div>
        </div>

        {/* Payment and Trust Badges Row */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 mr-1">Secured Payments via:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-pink-400">bKash</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-orange-400">Nagad</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-blue-400">VISA</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-amber-400">Mastercard</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-emerald-400">Cash on Delivery</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Tamper-Proof Thermal Sealed Delivery</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FeastHub Bangladesh Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for discerning food lovers in Dhaka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
