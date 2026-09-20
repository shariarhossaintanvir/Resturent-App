'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Home, Compass, ShoppingBag, Receipt, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartCount } = useApp();

  // Hide bottom nav on admin or rider specific pages to avoid UI clash
  if (pathname.startsWith('/admin') || pathname.startsWith('/rider')) {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: Compass,
      isActive: pathname.startsWith('/explore'),
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/cart') || pathname.startsWith('/checkout'),
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: Receipt,
      isActive: pathname.startsWith('/orders') || pathname.startsWith('/tracking'),
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      isActive: pathname.startsWith('/profile') || pathname.startsWith('/settings'),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                item.isActive
                  ? 'text-primary-600 dark:text-primary-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-primary-500 text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
