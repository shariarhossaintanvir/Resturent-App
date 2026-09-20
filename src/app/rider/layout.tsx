'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Bike, Power, ArrowLeft, ShieldAlert, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { rider, isRiderOnline, toggleRiderOnline, currentRole, switchRole, openAuthModal } = useApp();

  const isAuthorized = currentRole === 'DELIVERY_RIDER' || currentRole === 'SUPER_ADMIN';

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center border border-blue-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-blue-500/20 text-blue-500 border border-blue-500/30">
            RBAC Courier Guard
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
            Courier Portal Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Direct access to dispatch and route fulfillment requires <strong className="text-slate-700 dark:text-slate-300">Courier (Rider)</strong> privileges. Your active session is currently set to <strong>{currentRole}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => switchRole('DELIVERY_RIDER')}
            className="rounded-2xl font-black shadow-glow bg-blue-600 hover:bg-blue-700"
          >
            Authenticate as Courier (Rakib)
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={openAuthModal}
            leftIcon={<Lock className="w-4 h-4" />}
            className="rounded-2xl font-bold"
          >
            Sign In with Courier Credentials
          </Button>

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="text-xs text-slate-400 hover:text-slate-600 mt-1"
            >
              Return to Customer Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Rider Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rider.photo}
              alt={rider.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-500 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-slate-900 ${
                isRiderOnline ? 'bg-emerald-500' : 'bg-slate-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base">{rider.name}</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                Active Courier
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {rider.vehicleType} • <span className="font-mono text-slate-300">{rider.vehiclePlate}</span>
            </p>
          </div>
        </div>

        {/* Online / Offline Switcher & Exit */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRiderOnline}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isRiderOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isRiderOnline ? 'Online (Accepting Deliveries)' : 'Offline'}</span>
          </button>

          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Return to Customer Store"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}
