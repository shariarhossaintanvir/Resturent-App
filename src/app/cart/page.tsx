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

  const freeDeliveryThreshold = 600;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const restaurantName = cart[0]?.restaurantName || 'FeastHub Kitchen';

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Review Your Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <Store className="w-4 h-4 text-primary-500" />
            <span>Fulfilling from: <strong className="text-slate-800 dark:text-slate-200">{restaurantName}</strong></span>
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Gamification Tracker */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-primary-500/10 to-emerald-500/10 border border-primary-500/20 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-base">{amountNeededForFreeDelivery === 0 ? '🎉' : '⚡'}</span>
            <span className="text-slate-900 dark:text-white">
              {amountNeededForFreeDelivery === 0
                ? 'You unlocked FREE EXPRESS DELIVERY!'
                : `Add ${formatPrice(amountNeededForFreeDelivery)} more for Free Express Delivery`}
            </span>
          </div>
          <span className="text-primary-600 dark:text-primary-400 font-extrabold font-mono">
            {freeDeliveryProgress}%
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary-500 transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-card flex gap-4 sm:gap-5 items-center hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              {/* Food Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
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
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {item.foodItem.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={`Remove ${item.foodItem.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Addons selected */}
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {item.selectedAddons.map((a) => `${a.optionName} (+${formatPrice(a.price)})`).join(' • ')}
                  </div>
                )}

                {/* Cooking Note */}
                {item.specialInstructions && (
                  <p className="text-[11px] text-primary-600 dark:text-primary-400 italic mt-0.5 truncate font-medium">
                    Note: &quot;{item.specialInstructions}&quot;
                  </p>
                )}

                {/* Quantity Controls & Price */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    {formatPrice(item.itemTotal)}
                  </span>

                  <div className="flex items-center border border-slate-200/80 dark:border-slate-700 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary-500 active:scale-90 transition-transform"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary-500 active:scale-90 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Special Delivery Guarantee Notice */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-slate-900 dark:text-white font-bold">100% Thermal Insulated Packaging</strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Every meal is sealed with tamper-evident stickers and transported in temperature-controlled bags.
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Summary (1 col) */}
        <div className="space-y-4 sticky top-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
            <h3 className="font-black text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 tracking-tight">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Apply Promo Voucher
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-500 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary-500" />
                    <span className="font-extrabold text-primary-700 dark:text-primary-300">
                      {appliedPromo} (-{formatPrice(discount)})
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
                <div className="space-y-2">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter voucher code..."
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button variant="outline" size="sm" type="submit" className="rounded-2xl font-bold">
                      Apply
                    </Button>
                  </form>

                  {/* 1-Click Available Vouchers */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Available:</span>
                    <button
                      type="button"
                      onClick={() => applyPromoCode('FIRST20')}
                      className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 hover:scale-105 transition-transform"
                    >
                      FIRST20 (20% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPromoCode('FEAST100')}
                      className="px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/50 border border-primary-300 dark:border-primary-800 text-[10px] font-mono font-bold text-primary-700 dark:text-primary-300 hover:scale-105 transition-transform"
                    >
                      FEAST100 (৳100 OFF)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Express Courier Delivery:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? 'Free (Promo)' : formatPrice(deliveryFee)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-black">
                  <span>Promo Voucher Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base sm:text-lg font-black text-slate-900 dark:text-white">
                <span>Final Total:</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link href="/checkout" className="block w-full pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-glow hover:shadow-glow-lg rounded-2xl py-4 font-black"
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
