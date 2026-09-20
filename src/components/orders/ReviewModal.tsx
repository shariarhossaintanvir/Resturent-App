'use client';

import React, { useState } from 'react';
import { Order } from '../../data/types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Star, Camera } from 'lucide-react';
import { Button } from '../ui/Button';

interface ReviewModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ order, isOpen, onClose }) => {
  const { addReview, userProfile, showToast } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Delicious', 'Piping Hot']);

  const availableTags = [
    'Super Delicious',
    'Piping Hot',
    'Fast Delivery',
    'Great Packaging',
    'Generous Portion',
    'Fresh Ingredients',
    'Affordable',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write a brief comment about your food.', 'error');
      return;
    }

    if (rating < 1 || rating > 5) {
      showToast('Please select a star rating from 1 to 5.', 'error');
      return;
    }

    addReview({
      restaurantId: order.restaurantId,
      restaurantName: order.restaurantName,
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      rating,
      comment: comment.trim(),
      foodName: order.items[0]?.foodItem.name,
      tags: selectedTags,
      helpfulCount: 0,
    });

    showToast('Review submitted successfully! Thank you for your feedback.', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review ${order.restaurantName}`} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Selector */}
        <div className="text-center py-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            How was your meal from {order.restaurantName}?
          </p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-slate-300 hover:scale-125 transition-transform"
                aria-label={`Rate ${star} star`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="inline-block mt-2 text-xs font-black text-amber-500 uppercase tracking-wider">
            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Could Be Better'}
          </span>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            What did you like the most?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selected
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Your Review
          </label>
          <textarea
            required
            rows={3}
            placeholder="Share details of your food experience, taste, packaging and delivery..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Photo Upload Mock */}
        <div className="p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center cursor-pointer hover:border-primary-400 transition-colors">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Camera className="w-4 h-4 text-primary-500" />
            <span>Add photos of your food (Optional)</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Button variant="primary" size="md" fullWidth type="submit">
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
