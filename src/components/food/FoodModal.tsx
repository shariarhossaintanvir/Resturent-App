'use client';

import React, { useState } from 'react';
import { FoodItem, SelectedAddon } from '../../data/types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Star, Plus, Minus, Check, Clock, Flame, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../ui/Button';

interface FoodModalProps {
  food: FoodItem;
  isOpen: boolean;
  onClose: () => void;
}

export const FoodModal: React.FC<FoodModalProps> = ({ food, isOpen, onClose }) => {
  const { addToCart, restaurants } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const restaurant = restaurants.find((r) => r.id === food.restaurantId);

  // Toggle single or multiple addon option
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
    // Check required customizations
    if (food.customizations) {
      for (const group of food.customizations) {
        if (group.required) {
          const hasSelected = selectedAddons.some((a) => a.groupId === group.id);
          if (!hasSelected) {
            alert(`Please select an option for: ${group.name}`);
            return;
          }
        }
      }
    }

    addToCart(food, quantity, selectedAddons, specialInstructions);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-6 -mx-6 -mt-6">
        {/* Large Cover Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {food.isPopular && (
            <div className="absolute top-4 left-4 bg-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef's Choice</span>
            </div>
          )}

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-[11px] font-bold text-primary-300 uppercase tracking-widest bg-primary-950/60 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
              {restaurant?.name}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{food.name}</h2>
          </div>
        </div>

        {/* Content Box */}
        <div className="px-6 space-y-6 pb-2">
          {/* Rating, Prep time, Calories Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-xl border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-black">{food.rating}</span>
              <span className="text-slate-400 font-normal">({food.reviewCount} ratings)</span>
            </div>

            {food.prepTimeMinutes && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-primary-500" />
                <span>{food.prepTimeMinutes} mins prep</span>
              </div>
            )}

            {food.calories && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{food.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Ingredients list */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Fresh Ingredients Included
              </h4>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options */}
          {food.customizations && food.customizations.length > 0 && (
            <div className="space-y-5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Customize Recipe Options
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Select your preferences</span>
              </div>

              {food.customizations.map((group) => {
                const isSingleChoice = group.maxSelect === 1 || group.required;

                return (
                  <div key={group.id} className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {group.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          group.required
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {group.required ? 'Required' : 'Optional'}
                      </span>
                    </div>

                    <div className="space-y-2">
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
                            className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                              selected
                                ? 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-500 font-bold text-slate-900 dark:text-white shadow-sm ring-1 ring-primary-500/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-${
                                  isSingleChoice ? 'full' : 'md'
                                } flex items-center justify-center border transition-all ${
                                  selected
                                    ? 'bg-primary-500 border-primary-500 text-white'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {selected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="font-semibold">{opt.name}</span>
                            </div>

                            <span className={`font-bold ${selected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>
                              {opt.price === 0 ? 'Included' : `+${formatPrice(opt.price)}`}
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

          {/* Special Instructions */}
          <div className="pt-2">
            <label
              htmlFor="special-instructions"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Special Cooking Instructions
            </label>
            <input
              id="special-instructions"
              type="text"
              placeholder="e.g. Less spicy, dressing on the side, extra napkins..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Quantity and Add to Cart Action Bar */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 sm:gap-4">
            {/* Quantity Counter */}
            <div className="flex items-center border border-slate-200/80 dark:border-slate-700 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary-500 disabled:opacity-40 transition-colors"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-10 text-center font-black text-sm text-slate-900 dark:text-white">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary-500 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              fullWidth
              className="shadow-glow hover:shadow-glow-lg rounded-2xl py-3.5 font-extrabold"
            >
              Add to Cart • {formatPrice(totalPrice)}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
