/**
 * Validation utility functions for form inputs
 */

/**
 * Validate email format
 *
 * @param email - Email string to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid.email') // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate US phone number format
 * Accepts: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
 *
 * @param phone - Phone number string
 * @returns true if valid, false otherwise
 *
 * @example
 * isValidPhone('(123) 456-7890') // true
 * isValidPhone('1234567890') // true
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

/**
 * Validate URL format
 *
 * @param url - URL string to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('not a url') // false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate if a string is not empty (after trimming)
 *
 * @param value - String to validate
 * @returns true if not empty, false otherwise
 *
 * @example
 * isNotEmpty('hello') // true
 * isNotEmpty('   ') // false
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate string length is within range
 *
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns true if within range, false otherwise
 *
 * @example
 * isLengthInRange('hello', 3, 10) // true
 * isLengthInRange('hi', 3, 10) // false
 */
export function isLengthInRange(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Validate if a date is in the future
 *
 * @param date - Date string or Date object
 * @returns true if in future, false otherwise
 *
 * @example
 * isFutureDate('2025-12-31') // true (assuming current date is before)
 * isFutureDate('2020-01-01') // false
 */
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Validate if a date is today or in the future
 *
 * @param date - Date string or Date object
 * @returns true if today or in future, false otherwise
 *
 * @example
 * isTodayOrFuture('2025-12-31') // true
 */
export function isTodayOrFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj >= today;
}

/**
 * Sanitize string by removing special characters
 *
 * @param value - String to sanitize
 * @returns Sanitized string
 *
 * @example
 * sanitizeString('<script>alert("xss")</script>') // 'scriptalert("xss")/script'
 */
export function sanitizeString(value: string): string {
  return value.replace(/[<>'"]/g, '');
}

/**
 * Validate if a number is within range
 *
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns true if within range, false otherwise
 *
 * @example
 * isNumberInRange(5, 1, 10) // true
 * isNumberInRange(15, 1, 10) // false
 */
export function isNumberInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate if a string contains only alphanumeric characters
 *
 * @param value - String to validate
 * @returns true if alphanumeric, false otherwise
 *
 * @example
 * isAlphanumeric('abc123') // true
 * isAlphanumeric('abc-123') // false
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Validate postal code (US ZIP code format)
 * Accepts: 12345 or 12345-6789
 *
 * @param postalCode - Postal code string
 * @returns true if valid US ZIP code, false otherwise
 *
 * @example
 * isValidPostalCode('12345') // true
 * isValidPostalCode('12345-6789') // true
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(postalCode);
}

/**
 * Check if a value is defined (not null or undefined)
 *
 * @param value - Value to check
 * @returns true if defined, false otherwise
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
