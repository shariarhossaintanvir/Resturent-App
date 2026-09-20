'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  Store,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    total,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput.trim());
    setPromoInput('');
  };

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="py-12 sm:py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added any delicious dishes yet. Explore our top-rated restaurants to get started!"
          actionText="Discover Restaurants & Dishes"
          actionHref="/explore"
        />
      </div>
    );
  }

  const restaurantName = cart[0].restaurantName;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Store className="w-3.5 h-3.5 text-primary-500" />
            <span>Ordering from: <strong>{restaurantName}</strong></span>
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-card flex gap-4 items-center"
            >
              {/* Food Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.foodItem.image}
                  alt={item.foodItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {item.foodItem.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    aria-label={`Remove ${item.foodItem.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Addons selected */}
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {item.selectedAddons.map((a) => `${a.optionName} (+${formatPrice(a.price)})`).join(', ')}
                  </div>
                )}

                {/* Cooking Note */}
                {item.specialInstructions && (
                  <p className="text-[11px] text-primary-600 dark:text-primary-400 italic mt-0.5 truncate">
                    Note: &quot;{item.specialInstructions}&quot;
                  </p>
                )}

                {/* Quantity Controls & Price */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    {formatPrice(item.itemTotal)}
                  </span>

                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Special Delivery Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero-Contact Delivery Guarantee:</strong> All orders are packed in thermally insulated bags and sealed with tamper-proof food stickers.
            </span>
          </div>
        </div>

        {/* Pricing Summary (1 col) */}
        <div className="space-y-4 sticky top-24">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <h3 className="font-black text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Have a Voucher Code?
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-500 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary-500" />
                    <span className="font-bold text-primary-700 dark:text-primary-300">
                      {appliedPromo} Applied!
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. FIRST20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button variant="outline" size="sm" type="submit">
                    Apply
                  </Button>
                </form>
              )}

              <p className="text-[11px] text-slate-400 mt-1.5">
                Tip: Try <strong>FIRST20</strong> or <strong>FEAST100</strong>
              </p>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Delivery Fee:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Voucher Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link href="/checkout" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-lg shadow-primary-500/30"
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
