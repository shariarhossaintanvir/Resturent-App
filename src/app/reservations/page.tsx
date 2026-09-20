'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { ReservationModal } from '../../components/restaurant/ReservationModal';
import {
  CalendarDays,
  Store,
  Users,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ReservationsPage() {
  const { reservations, cancelReservation, restaurants } = useApp();
  const [selectedRestId, setSelectedRestId] = useState<string>(restaurants[0]?.id || 'rest-2');
  const [modalOpen, setModalOpen] = useState(false);

  const targetRestaurant = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Table Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Book VIP dining tables with priority seating at Dhaka&apos;s celebrated restaurants
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-md shadow-primary-500/20"
        >
          Book a New Table
        </Button>
      </div>

      {/* Quick Restaurant Picker for Reservation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Reserve at Partner Kitchens
            </h3>
          </div>
          <span className="text-xs text-slate-400">Select restaurant to book</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {restaurants.slice(0, 5).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRestId(r.id);
                setModalOpen(true);
              }}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-primary-500 hover:shadow-card text-left transition-all group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.logoImage}
                alt={r.name}
                className="w-10 h-10 rounded-xl object-cover mb-2 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-primary-500"
              />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{r.name}</h4>
              <p className="text-[10px] text-slate-400">{r.area}</p>
            </button>
          ))}
        </div>
      </div>

      {/* My Bookings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            My Bookings ({reservations.length})
          </h2>
        </div>

        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map((res) => {
              const isConfirmed = res.status === 'Confirmed';
              const isCancelled = res.status === 'Cancelled';

              return (
                <div
                  key={res.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {res.restaurantName}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Booking ID: <span className="font-mono font-bold text-primary-600">#{res.id}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border self-start sm:self-auto ${
                        isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : isCancelled
                          ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Date</span>
                        <strong className="text-slate-900 dark:text-white">{res.date}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Time</span>
                        <strong className="text-slate-900 dark:text-white">{res.time}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Party Size</span>
                        <strong className="text-slate-900 dark:text-white">{res.guests} Guests</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Seating</span>
                        <strong className="text-slate-900 dark:text-white">Reserved</strong>
                      </div>
                    </div>
                  </div>

                  {res.specialRequests && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Special Request:</strong> &quot;{res.specialRequests}&quot;
                    </div>
                  )}

                  {/* Cancel action if confirmed */}
                  {isConfirmed && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="text-xs font-bold text-rose-500 hover:underline"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No active reservations
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready for an unforgettable dining experience? Reserve your table in seconds.
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
              Book Your Table Now
            </Button>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {modalOpen && (
        <ReservationModal
          restaurant={targetRestaurant}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
