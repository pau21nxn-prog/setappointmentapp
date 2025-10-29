import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, className, required, id, ...props }, ref) => {
    const datePickerId = id || `datepicker-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={datePickerId} className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type="date"
            id={datePickerId}
            ref={ref}
            min={today}
            className={cn(
              'w-full rounded-md border px-3 py-2.5 text-sm pr-10',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
              'bg-white text-gray-900',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${datePickerId}-error` : helperText ? `${datePickerId}-helper` : undefined
            }
            required={required}
            {...props}
          />
          <Calendar
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {helperText && !error && (
          <p id={`${datePickerId}-helper`} className="mt-1.5 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${datePickerId}-error`} className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
