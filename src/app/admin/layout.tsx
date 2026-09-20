'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, switchRole, openAuthModal } = useApp();

  const isAuthorized = currentRole === 'RESTAURANT_ADMIN' || currentRole === 'SUPER_ADMIN';

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
            RBAC Guard Active
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Direct access to FeastHub Executive Telemetry requires <strong className="text-slate-700 dark:text-slate-300">Restaurant Admin</strong> or <strong className="text-slate-700 dark:text-slate-300">Super Admin</strong> privileges. Your active session is currently set to <strong>{currentRole}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => switchRole('RESTAURANT_ADMIN')}
            className="rounded-2xl font-black shadow-glow"
          >
            Authenticate as Restaurant Admin
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={openAuthModal}
            leftIcon={<Lock className="w-4 h-4" />}
            className="rounded-2xl font-bold"
          >
            Sign In with Admin Credentials
          </Button>

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="text-xs text-slate-400 hover:text-slate-600 mt-1"
            >
              Return to Customer Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <AdminSidebar />
      <div className="flex-1 w-full min-w-0">{children}</div>
    </div>
  );
}
