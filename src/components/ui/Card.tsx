'use client';

import { cn } from './utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export function Card({
  children,
  className,
  padding = true,
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-(--shadow-card)',
        padding && 'p-6',
        hover &&
          'hover:shadow-(--shadow-card-hover) transition-shadow duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
