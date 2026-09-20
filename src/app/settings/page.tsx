'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Shield,
  CreditCard,
  Globe,
  HelpCircle,
  ChevronLeft,
  Check,
  Headphones,
  Sliders,
  PhoneCall,
  Mail,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promosEnabled, setPromosEnabled] = useState(true);
  const [language, setLanguage] = useState('English (BD)');
  const [currency, setCurrency] = useState('BDT (৳)');

  const handleSavePreferences = () => {
    showToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-xs font-bold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferences & Telemetry</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your real-time dining alerts, language, currency and concierge channels
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-7">
        {/* Notification Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Notifications & Order Updates
              </h3>
              <p className="text-xs text-slate-400">Manage device push alerts and status milestones</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 cursor-pointer hover:border-primary-500/30 transition-all"
            >
              <div className="pr-4">
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                  Live Courier & Kitchen Milestones
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Receive alerts when chef begins cooking and when rider is within 5 minutes
                </p>
              </div>
              <div
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  notificationsEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() => setPromosEnabled(!promosEnabled)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 cursor-pointer hover:border-primary-500/30 transition-all"
            >
              <div className="pr-4">
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                  Weekend Flash Discounts & Curated Deals
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Exclusive vouchers for 20% off at top Gulshan & Banani partner kitchens
                </p>
              </div>
              <div
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  promosEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    promosEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Currency Preferences */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Locale & Currency Format
              </h3>
              <p className="text-xs text-slate-400">Localization preferences for menus and totals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Display Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs font-semibold px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="English (BD)">English (Bangladesh)</option>
                <option value="Bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs font-semibold px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="BDT (৳)">BDT (৳ Bangladeshi Taka)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help & Concierge Support */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Dhaka VIP Concierge Desk
              </h3>
              <p className="text-xs text-slate-400">Direct escalation line for live orders and inquiries</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-primary-500" />
                <span>Express Hotline:</span>
              </span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">+880 (2) 988-1234</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary-500" />
                <span>Direct Concierge Email:</span>
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">concierge@feasthub.com.bd</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Service Hours:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                24 Hours / 7 Days a Week Live
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSavePreferences} className="shadow-glow font-bold">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}

