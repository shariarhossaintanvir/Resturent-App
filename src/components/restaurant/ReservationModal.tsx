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
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 mx-auto flex items-center justify-center animate-bounce-subtle">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              🎉 Your table has been reserved!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Confirmation booking ID: <strong className="text-primary-600 dark:text-primary-400 font-mono text-sm">#{confirmedId}</strong>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs space-y-2 text-left border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Restaurant:</span>
              <span className="font-bold text-slate-900 dark:text-white">{restaurant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-bold text-slate-900 dark:text-white">{date} at {time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guests:</span>
              <span className="font-bold text-slate-900 dark:text-white">{guests} Persons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guest Contact:</span>
              <span className="font-bold text-slate-900 dark:text-white">{userProfile.name} ({userProfile.phone})</span>
            </div>
          </div>

          <Button variant="primary" size="md" fullWidth onClick={handleDone}>
            Done & View Reservations
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary-500" />
              <span>Number of Guests</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuests(num)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    guests === num
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              <span>Select Date</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              <span>Select Time Slot</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    time === slot
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span>Special Requests (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Window seat, celebration table, baby high chair..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button variant="primary" size="md" fullWidth type="submit">
              Confirm Reservation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
