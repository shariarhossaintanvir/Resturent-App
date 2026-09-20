'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Bike, Power, ArrowLeft, Navigation, ShieldCheck } from 'lucide-react';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { rider, isRiderOnline, toggleRiderOnline } = useApp();

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
