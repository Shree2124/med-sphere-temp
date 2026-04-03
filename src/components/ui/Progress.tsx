'use client';

import { cn } from './utils';

export interface ProgressProps {
  value: number;
  max?: number;
  color?: 'teal' | 'blue' | 'green' | 'red' | 'amber';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 100,
  color = 'teal',
  size = 'md',
  showLabel = false,
}: ProgressProps) {
  const pct = Math.min((value / max) * 100, 100);
  const colors = {
    teal: 'bg-brand-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
  };
  const heights = { sm: 'h-1.5', md: 'h-2.5' };
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-100 rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colors[color]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
