import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, required, id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full rounded-md border px-3 py-2.5 text-sm',
            'focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            'resize-y',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
            'bg-white text-gray-900 placeholder:text-gray-400',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          required={required}
          {...props}
        />
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
