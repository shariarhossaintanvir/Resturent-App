'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Bike,
  Store,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchRole, showToast } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
          setLoading(false);
          return;
        }
        showToast('Welcome back! Authenticated successfully.', 'success');
      } else {
        const res = await register({ name, email, phone, password });
        if (!res.success) {
          setError(res.error || 'Registration failed');
          setLoading(false);
          return;
        }
        showToast('Account created and secured with PBKDF2 hashing!', 'success');
      }

      onClose();
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    } catch {
      setError('A connection error occurred. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSwitch = async (
    role: 'CUSTOMER' | 'RESTAURANT_ADMIN' | 'DELIVERY_RIDER' | 'SUPER_ADMIN'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await switchRole(role);
      if (res.success) {
        showToast(`Authenticated as ${role.replace('_', ' ')} with secure HttpOnly session`, 'success');
        onClose();
      } else {
        setError(res.error || 'Failed to switch role');
      }
    } catch {
      setError('Failed to switch role session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Security & Authentication" maxWidth="md">
      <div className="space-y-5">
        {/* Quick Role Switcher Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Quick Portal Sign-In
              </span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              HttpOnly Session
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Select a verified persona to test real server-side RBAC and cryptographic session cookies:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRoleSwitch('CUSTOMER')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-primary-600 hover:text-white transition-all text-left text-xs border border-slate-700/60 group"
            >
              <User className="w-3.5 h-3.5 mb-1 text-primary-400 group-hover:text-white" />
              <div className="font-bold text-[11px]">Customer</div>
              <div className="text-[9px] text-slate-400 group-hover:text-white/80">Tanvir</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSwitch('RESTAURANT_ADMIN')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-amber-600 hover:text-white transition-all text-left text-xs border border-slate-700/60 group"
            >
              <Store className="w-3.5 h-3.5 mb-1 text-amber-400 group-hover:text-white" />
              <div className="font-bold text-[11px]">Rest. Admin</div>
              <div className="text-[9px] text-slate-400 group-hover:text-white/80">The Burger Lab</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSwitch('DELIVERY_RIDER')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 hover:text-white transition-all text-left text-xs border border-slate-700/60 group"
            >
              <Bike className="w-3.5 h-3.5 mb-1 text-blue-400 group-hover:text-white" />
              <div className="font-bold text-[11px]">Courier</div>
              <div className="text-[9px] text-slate-400 group-hover:text-white/80">Rakib</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSwitch('SUPER_ADMIN')}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 hover:text-white transition-all text-left text-xs border border-slate-700/60 group"
            >
              <ShieldAlert className="w-3.5 h-3.5 mb-1 text-rose-400 group-hover:text-white" />
              <div className="font-bold text-[11px]">Super Admin</div>
              <div className="text-[9px] text-slate-400 group-hover:text-white/80">Executive</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors text-center border-b-2 ${
              tab === 'signin'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors text-center border-b-2 ${
              tab === 'signup'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1819-456789"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Password {tab === 'signup' && <span className="text-[10px] text-slate-400">(Min 8 chars, 1 uppercase, 1 number)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={loading}
            className="rounded-2xl font-black py-3 shadow-glow"
          >
            {loading
              ? 'Securing Session...'
              : tab === 'signin'
              ? 'Authenticate & Continue'
              : 'Register Secure Account'}
          </Button>
        </form>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Passwords are protected using PBKDF2-HMAC-SHA512. Authentication tokens are issued as HttpOnly, SameSite=Lax cookies.
        </p>
      </div>
    </Modal>
  );
};
