'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { CalendarDays, Clock, Users, Check, X } from 'lucide-react';

export default function AdminReservationsPage() {
  const { reservations, updateReservationStatus } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Dining Reservations Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Approve, seat and manage priority dining reservations across partner kitchens
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Booking ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Restaurant</th>
                <th className="py-3.5 px-5">Date & Time</th>
                <th className="py-3.5 px-5">Guests</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-white">
                    #{res.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {res.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">{res.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300">
                    {res.restaurantName}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 dark:text-white block">{res.date}</span>
                    <span className="text-slate-400">{res.time}</span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                    {res.guests} Persons
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : res.status === 'Cancelled'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {res.status !== 'Completed' && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Completed')}
                          className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-200"
                          title="Mark Seated/Completed"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {res.status !== 'Cancelled' && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Cancelled')}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 hover:bg-rose-200"
                          title="Cancel Reservation"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
