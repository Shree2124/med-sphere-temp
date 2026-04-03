'use client';

import { cn } from './utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const textareaId =
    id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all resize-none',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          'placeholder:text-gray-400',
          className
        )}
        rows={3}
        {...props}
      />
    </div>
  );
}
