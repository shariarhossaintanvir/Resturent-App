'use client';

import React, { useState } from 'react';
import { Restaurant } from '../../data/types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Calendar, Clock, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ReservationModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  restaurant,
  isOpen,
  onClose,
}) => {
  const { createReservation, userProfile } = useApp();
  const [date, setDate] = useState('2026-09-22');
  const [time, setTime] = useState('07:30 PM');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const timeSlots = [
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = createReservation({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date,
      time,
      guests,
      specialRequests: specialRequests.trim() || undefined,
    });
    setConfirmedId(id);
  };

  const handleDone = () => {
    setConfirmedId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reserve Table at ${restaurant.name}`} maxWidth="md">
      {confirmedId ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5] animate-bounce-subtle" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
              VIP Table Reserved
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              Reservation Confirmed!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Booking reference: <strong className="text-primary-600 dark:text-primary-400 font-mono text-sm">#{confirmedId}</strong>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl text-xs space-y-2.5 text-left border border-slate-200/80 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Dining Kitchen:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{restaurant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{date} at {time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Party Size:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{guests} Guests (Priority Booth)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guest Contact:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{userProfile.name} ({userProfile.phone})</span>
            </div>
          </div>

          <Button variant="primary" size="md" fullWidth onClick={handleDone} className="rounded-2xl font-black py-3.5 shadow-glow">
            View My Reservations
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Guest Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary-500" />
              <span>Party Size / Number of Guests</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuests(num)}
                  className={`py-2.5 text-xs font-black rounded-2xl border transition-all ${
                    guests === num
                      ? 'bg-primary-500 text-white border-primary-500 shadow-glow'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              <span>Select Dining Date</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              <span>Available Time Slots</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-2.5 text-xs font-bold rounded-2xl border transition-all ${
                    time === slot
                      ? 'bg-primary-500 text-white border-primary-500 shadow-glow'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span>Special Occasion & Requests (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Window seat, anniversary flowers, baby high chair..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button variant="primary" size="lg" fullWidth type="submit" className="shadow-glow hover:shadow-glow-lg rounded-2xl py-4 font-black">
              Confirm Table Reservation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
