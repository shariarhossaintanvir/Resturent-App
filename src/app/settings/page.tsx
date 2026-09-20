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
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promosEnabled, setPromosEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English (BD)');
  const [currency, setCurrency] = useState('BDT (৳)');

  const handleSavePreferences = () => {
    showToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your dining notifications, language, currency and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        {/* Notification Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-primary-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Notifications & Alerts
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Live Order Milestones
                </span>
                <p className="text-xs text-slate-400">
                  Receive alerts when chef begins cooking and when rider is approaching
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Weekend Flash Discounts & Promos
                </span>
                <p className="text-xs text-slate-400">
                  Receive vouchers for 20% off at top Dhaka restaurants
                </p>
              </div>
              <input
                type="checkbox"
                checked={promosEnabled}
                onChange={(e) => setPromosEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Regional & Currency Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-primary-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Locale & Currency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Display Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="English (BD)">English (Bangladesh)</option>
                <option value="Bangla">বাংলা (Bangla)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              >
                <option value="BDT (৳)">BDT (৳ Bangladeshi Taka)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help & Concierge Support */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <HelpCircle className="w-4 h-4 text-primary-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Dhaka Concierge Hotline
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Live Support Phone:</span>
              <strong className="text-slate-900 dark:text-white font-mono">+880 (2) 988-1234</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Direct Email:</span>
              <strong className="text-slate-900 dark:text-white font-mono">concierge@feasthub.com.bd</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service Hours:</span>
              <span className="text-slate-900 dark:text-white font-bold">24 Hours / 7 Days a Week</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
