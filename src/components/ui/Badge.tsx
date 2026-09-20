import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
  withDot = false,
}) => {
  const sizeStyles = {
    sm: 'text-[10px] font-bold px-2 py-0.5 gap-1 rounded-full',
    md: 'text-xs font-bold px-3 py-1 gap-1.5 rounded-full',
  };

  const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-emerald-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  const variantStyles = {
    primary: 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm',
    secondary: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm',
    neutral: 'bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center shrink-0 tracking-tight uppercase transition-all ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
