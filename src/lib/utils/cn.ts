import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional class handling
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'hover:bg-blue-600')
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
