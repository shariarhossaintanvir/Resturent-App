'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  Tag,
  Calendar,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadNotificationCount} New
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates on orders, live rider dispatches, promotions and reservations
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isOrder = notif.type === 'order';
            const isPromo = notif.type === 'promo';
            const isRes = notif.type === 'reservation';

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                  !notif.read
                    ? 'bg-white dark:bg-slate-900 border-primary-500/40 ring-1 ring-primary-500/10 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isOrder
                      ? 'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                      : isPromo
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : isRes
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isOrder && <ShoppingBag className="w-5 h-5" />}
                  {isPromo && <Tag className="w-5 h-5" />}
                  {isRes && <Calendar className="w-5 h-5" />}
                  {!isOrder && !isPromo && !isRes && <Info className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm tracking-tight ${
                        !notif.read
                          ? 'font-black text-slate-900 dark:text-white'
                          : 'font-semibold text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(notif.timestamp)}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 ml-1" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline mt-2"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No notifications yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We will notify you when your food is on the way or new weekend discounts arrive!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
