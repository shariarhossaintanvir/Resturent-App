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
    <nav aria-label="Mobile Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-slate-200/80 dark:border-slate-800/90 pb-[env(safe-area-inset-bottom)] shadow-float">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all duration-200 active:scale-90 ${
                item.isActive
                  ? 'text-primary-600 dark:text-primary-400 font-extrabold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all ${
                    item.isActive ? 'bg-primary-50 dark:bg-primary-950/60 shadow-sm' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${item.isActive ? 'stroke-[2.5] scale-110' : 'stroke-[1.8]'}`} />
                </div>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-primary-500 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${item.isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
