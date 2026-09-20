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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        {/* Rider Profile Details */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rider.photo}
              alt={rider.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-500/30 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{rider.name}</h4>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-xs px-1.5 py-0.2 rounded border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{rider.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {rider.vehicleType} • <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{rider.vehiclePlate}</span>
            </p>

            <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {rider.deliveriesCount}+ Successful Deliveries
            </span>
          </div>
        </div>

        {/* Action Buttons: Call & Chat */}
        <div className="flex items-center gap-2">
          <Button
            variant={called ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              setCalled(true);
              alert(`Simulating call to rider: ${rider.phone}`);
            }}
            leftIcon={<Phone className="w-3.5 h-3.5" />}
          >
            {called ? 'Calling...' : 'Call'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
          >
            Chat
          </Button>
        </div>
      </div>

      {/* Simulated Live Chat Dropdown */}
      {showChat && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Direct Courier Chat
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs p-2.5 rounded-xl max-w-[85%] ${
                  i % 2 === 0
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 mr-auto'
                    : 'bg-primary-500 text-white ml-auto font-medium'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type message to rider..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button variant="primary" size="sm" type="submit">
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
