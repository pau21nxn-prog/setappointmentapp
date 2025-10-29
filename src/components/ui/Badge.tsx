import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium',
          'whitespace-nowrap',
          // Size variants
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-1 text-sm': size === 'md',
            'px-3 py-1.5 text-base': size === 'lg',
          },
          // Color variants
          {
            'bg-emerald-100 text-emerald-700': variant === 'default',
            'bg-green-100 text-green-700': variant === 'success',
            'bg-yellow-100 text-yellow-700': variant === 'warning',
            'bg-red-100 text-red-700': variant === 'error',
            'bg-blue-100 text-blue-700': variant === 'info',
            'border-2 border-gray-300 bg-transparent text-gray-700': variant === 'outline',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
