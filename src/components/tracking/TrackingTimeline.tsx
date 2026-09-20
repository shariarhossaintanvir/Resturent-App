'use client';

import React from 'react';
import { OrderStatus } from '../../data/types';
import { Check, Clock, UtensilsCrossed, Bike, Home, CheckCircle2 } from 'lucide-react';
import { getStatusStepIndex } from '../../utils/formatters';

interface TrackingTimelineProps {
  currentStatus: OrderStatus;
}

interface StepInfo {
  status: OrderStatus;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: StepInfo[] = [
  {
    status: 'Confirmed',
    label: 'Order Confirmed',
    sublabel: 'Restaurant accepted your order',
    icon: CheckCircle2,
  },
  {
    status: 'Preparing',
    label: 'Kitchen Preparing',
    sublabel: 'Chef is cooking your fresh meal',
    icon: UtensilsCrossed,
  },
  {
    status: 'Picked Up',
    label: 'Rider Picked Up',
    sublabel: 'Food packed & collected by courier',
    icon: Bike,
  },
  {
    status: 'On The Way',
    label: 'On The Way',
    sublabel: 'Rider is heading to your doorstep',
    icon: Clock,
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    sublabel: 'Package handed over. Enjoy!',
    icon: Home,
  },
];

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ currentStatus }) => {
  const currentIndex = getStatusStepIndex(currentStatus);

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Step Flow */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Continuous Track Line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
        <div
          className="absolute top-5 left-8 h-1 bg-primary-500 transition-all duration-700 -z-0"
          style={{
            width: `${Math.min(100, Math.max(0, ((currentIndex - 1) / (steps.length - 1)) * 100))}%`,
          }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum <= currentIndex;
          const isCurrent = stepNum === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center max-w-[120px] text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-950/60'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                } ${isCurrent ? 'scale-110 shadow-glow' : ''}`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <div className="mt-3">
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-primary-600 dark:text-primary-400'
                      : isCompleted
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Step Flow */}
      <div className="sm:hidden space-y-6 relative pl-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum <= currentIndex;
          const isCurrent = stepNum === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  isCompleted
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-950'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                } ${isCurrent ? 'scale-125' : ''}`}
              >
                {isCompleted && !isCurrent ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3 h-3" />}
              </div>

              <div>
                <p
                  className={`text-xs font-bold ${
                    isCurrent
                      ? 'text-primary-600 dark:text-primary-400'
                      : isCompleted
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{step.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
