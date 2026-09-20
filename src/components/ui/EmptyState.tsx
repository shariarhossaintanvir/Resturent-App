'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}) => {
  return (
    <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 max-w-md mx-auto shadow-card">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 mx-auto flex items-center justify-center shadow-inner">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary" size="md" className="shadow-md shadow-primary-500/20">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={onActionClick}
              className="shadow-md shadow-primary-500/20"
            >
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
