import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date to a human-readable string
 *
 * @param date - Date string or Date object
 * @param formatString - date-fns format string (default: 'PPP')
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-01-15') // 'January 15th, 2024'
 * formatDate(new Date(), 'MM/dd/yyyy') // '01/15/2024'
 */
export function formatDate(date: string | Date, formatString: string = 'PPP'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date to show relative time (e.g., "2 hours ago")
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime('2024-01-15T10:00:00Z') // '2 hours ago'
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Format a phone number to US format
 *
 * @param phone - Phone number string
 * @returns Formatted phone number
 *
 * @example
 * formatPhoneNumber('1234567890') // '(123) 456-7890'
 * formatPhoneNumber('+11234567890') // '+1 (123) 456-7890'
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle international format
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Handle US format
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Return original if format is unknown
  return phone;
}

/**
 * Format a number as currency (USD)
 *
 * @param amount - Number to format
 * @param includeDecimals - Include decimal places (default: true)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // '$1,234.56'
 * formatCurrency(1234.56, false) // '$1,235'
 */
export function formatCurrency(amount: number, includeDecimals: boolean = true): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Format a time string to 12-hour format
 *
 * @param time - Time string in 24-hour format (HH:mm)
 * @returns Time string in 12-hour format
 *
 * @example
 * formatTime('14:30') // '2:30 PM'
 * formatTime('09:00') // '9:00 AM'
 */
export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time;
  }
}

/**
 * Truncate a string to a specified length with ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated string
 *
 * @example
 * truncateString('This is a very long string', 10) // 'This is a...'
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize the first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * capitalize('hello world') // 'Hello world'
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert a string to title case
 *
 * @param str - String to convert
 * @returns Title case string
 *
 * @example
 * toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
