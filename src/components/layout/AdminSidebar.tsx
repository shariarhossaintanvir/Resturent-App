'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  CalendarDays,
  Star,
  ArrowLeft,
  ShieldAlert,
  Activity,
  ChevronRight,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Restaurant Partners', href: '/admin/restaurants', icon: Store },
    { name: 'Menu & Dishes', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Table Reservations', href: '/admin/reservations', icon: CalendarDays },
    { name: 'Customer Reviews', href: '/admin/reviews', icon: Star },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900/95 dark:bg-slate-900/90 backdrop-blur-xl text-slate-300 rounded-3xl p-5 border border-slate-800/80 shadow-2xl flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 px-2 pb-4 border-b border-slate-800/80">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-amber-500 flex items-center justify-center text-white font-black shadow-glow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Admin Console</h2>
            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operations
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-400'}`} />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status & Return to Customer Storefront */}
      <div className="pt-6 border-t border-slate-800/80 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>API Gateway</span>
          </span>
          <span className="text-emerald-400 font-bold">99.98%</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </aside>
  );
};

