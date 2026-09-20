'use client';

import React, { useState } from 'react';
import { Rider } from '../../data/types';
import { Phone, MessageSquare, Star, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface RiderContactCardProps {
  rider: Rider;
}

export const RiderContactCard: React.FC<RiderContactCardProps> = ({ rider }) => {
  const [called, setCalled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'Hello! I am on my way with your hot meal. Will arrive soon!',
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, chatMessage.trim()]);
    setChatMessage('');
    setTimeout(() => {
      setMessages((prev) => [...prev, 'Got it! Thanks for the note.']);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Rider Profile Details */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rider.photo}
              alt={rider.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-500/30 shadow-md p-0.5 bg-white dark:bg-slate-800"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{rider.name}</h4>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-black text-xs px-2 py-0.5 rounded-lg border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{rider.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {rider.vehicleType} • <span className="font-mono text-slate-800 dark:text-slate-200 font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{rider.vehiclePlate}</span>
            </p>

            <span className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {rider.deliveriesCount}+ Safe Deliveries
            </span>
          </div>
        </div>

        {/* Action Buttons: Call & Chat */}
        <div className="flex items-center gap-2.5">
          <Button
            variant={called ? 'secondary' : 'outline'}
            size="md"
            onClick={() => {
              setCalled(true);
              alert(`Simulating phone call to rider: ${rider.phone}`);
            }}
            leftIcon={<Phone className="w-4 h-4" />}
            className="rounded-2xl font-bold"
          >
            {called ? 'Calling...' : 'Call Rider'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setShowChat(!showChat)}
            leftIcon={<MessageSquare className="w-4 h-4" />}
            className="rounded-2xl font-bold shadow-glow"
          >
            {showChat ? 'Close Chat' : 'Live Chat'}
          </Button>
        </div>
      </div>

      {/* Simulated Live Chat Dropdown */}
      {showChat && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider">Direct Chat with Courier</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs p-3 rounded-2xl max-w-[85%] ${
                  i % 2 === 0
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 mr-auto shadow-sm border border-slate-200/60 dark:border-slate-600'
                    : 'bg-primary-500 text-white ml-auto font-semibold shadow-glow'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Message your courier (e.g. Please leave by the front door)..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 text-xs px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            />
            <Button variant="primary" size="sm" type="submit" className="rounded-2xl font-bold px-4">
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
