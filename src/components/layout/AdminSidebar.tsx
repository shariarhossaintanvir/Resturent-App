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
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 px-2 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-primary-500 flex items-center justify-center text-white font-bold shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Admin Portal</h2>
            <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider">
              FeastHub Operations
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Customer Storefront */}
      <div className="pt-6 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </aside>
  );
};
