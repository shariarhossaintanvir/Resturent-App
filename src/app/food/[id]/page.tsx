'use client';

import React, { useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { SelectedAddon } from '../../../data/types';
import { Button } from '../../../components/ui/Button';
import {
  Star,
  Clock,
  Flame,
  Check,
  Plus,
  Minus,
  Heart,
  Store,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

export default function FoodDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const foodId = params.id as string;

  const {
    foodItems,
    restaurants,
    addToCart,
    isFoodFavorite,
    toggleFavoriteFood,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const food = foodItems.find((f) => f.id === foodId);
  if (!food) {
    notFound();
  }

  const restaurant = restaurants.find((r) => r.id === food.restaurantId);
  const isFav = isFoodFavorite(food.id);

  const handleToggleAddon = (
    groupId: string,
    groupName: string,
    optionId: string,
    optionName: string,
    price: number,
    isSingleChoice: boolean
  ) => {
    setSelectedAddons((prev) => {
      if (isSingleChoice) {
        const withoutGroup = prev.filter((a) => a.groupId !== groupId);
        return [...withoutGroup, { groupId, groupName, optionId, optionName, price }];
      } else {
        const exists = prev.some((a) => a.groupId === groupId && a.optionId === optionId);
        if (exists) {
          return prev.filter((a) => !(a.groupId === groupId && a.optionId === optionId));
        } else {
          return [...prev, { groupId, groupName, optionId, optionName, price }];
        }
      }
    });
  };

  const isOptionSelected = (groupId: string, optionId: string) => {
    return selectedAddons.some((a) => a.groupId === groupId && a.optionId === optionId);
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = food.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (food.customizations) {
      for (const group of food.customizations) {
        if (group.required) {
          const hasSelected = selectedAddons.some((a) => a.groupId === group.id);
          if (!hasSelected) {
            alert(`Please choose an option for: ${group.name}`);
            return;
          }
        }
      }
    }

    addToCart(food, quantity, selectedAddons, specialInstructions);
    router.push('/cart');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Food Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image col */}
          <div className="relative h-72 md:h-full min-h-[320px] bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

            <button
              onClick={() => toggleFavoriteFood(food.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 shadow-md transition-all hover:scale-110 active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`}
              />
            </button>

            {food.isPopular && (
              <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Popular Favorite</span>
              </div>
            )}
          </div>

          {/* Details & Customizations col */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {restaurant && (
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{restaurant.name}</span>
                </Link>
              )}

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {food.name}
              </h1>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{food.rating}</span>
                  <span className="text-slate-400 font-normal">({food.reviewCount})</span>
                </div>

                {food.prepTimeMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{food.prepTimeMinutes} mins</span>
                  </div>
                )}

                {food.calories && (
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{food.calories} kcal</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {food.description}
              </p>

              {/* Customizations */}
              {food.customizations && food.customizations.length > 0 && (
                <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Customization Options
                  </h3>

                  {food.customizations.map((group) => {
                    const isSingleChoice = group.maxSelect === 1 || group.required;

                    return (
                      <div key={group.id} className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {group.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {group.required ? '(Required)' : '(Optional)'}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {group.options.map((opt) => {
                            const selected = isOptionSelected(group.id, opt.id);

                            return (
                              <div
                                key={opt.id}
                                onClick={() =>
                                  handleToggleAddon(
                                    group.id,
                                    group.name,
                                    opt.id,
                                    opt.name,
                                    opt.price,
                                    isSingleChoice
                                  )
                                }
                                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                  selected
                                    ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-500 font-bold'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-3.5 h-3.5 rounded-${
                                      isSingleChoice ? 'full' : 'md'
                                    } flex items-center justify-center border ${
                                      selected
                                        ? 'bg-primary-500 border-primary-500 text-white'
                                        : 'border-slate-400'
                                    }`}
                                  >
                                    {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span>{opt.name}</span>
                                </div>
                                <span className="text-slate-500">
                                  {opt.price === 0 ? 'Free' : `+${formatPrice(opt.price)}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Kitchen Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less chili, no mayo..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Price & Add to Cart Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                className="shadow-lg shadow-primary-500/25"
              >
                Add to Cart • {formatPrice(totalPrice)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
