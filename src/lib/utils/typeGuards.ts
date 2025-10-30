import {
  PersonalInfoFormData,
  ProjectDetailsFormData,
  SchedulingFormData,
  BookingFormData,
} from '@/lib/validation/bookingSchema';

/**
 * Type guards for form data validation
 * Provides runtime type checking for form data
 */

/**
 * Check if value is a valid string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if value is a valid array
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Check if object has all required personal info fields
 */
export function isPersonalInfoData(data: unknown): data is PersonalInfoFormData {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    isNonEmptyString(obj.full_name) &&
    isNonEmptyString(obj.email) &&
    isNonEmptyString(obj.phone) &&
    isNonEmptyString(obj.company_name) &&
    isNonEmptyString(obj.industry) &&
    typeof obj.current_website === 'boolean'
  );
}

/**
 * Check if object has all required project details fields
 */
export function isProjectDetailsData(data: unknown): data is ProjectDetailsFormData {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    isNonEmptyString(obj.project_type) &&
    isNonEmptyString(obj.project_description) &&
    isNonEmptyString(obj.budget_range) &&
    isNonEmptyString(obj.timeline) &&
    isNonEmptyArray(obj.features) &&
    isNonEmptyString(obj.referral_source)
  );
}

/**
 * Check if object has all required scheduling fields
 */
export function isSchedulingData(data: unknown): data is SchedulingFormData {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    isNonEmptyString(obj.preferred_date) &&
    isNonEmptyString(obj.preferred_time) &&
    isNonEmptyString(obj.timezone)
  );
}

/**
 * Check if object has all required booking form fields
 */
export function isCompleteBookingData(data: unknown): data is BookingFormData {
  return isPersonalInfoData(data) && isProjectDetailsData(data) && isSchedulingData(data);
}

/**
 * Check if email is valid format
 */
export function isValidEmail(email: unknown): email is string {
  if (!isNonEmptyString(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if phone number is valid format
 */
export function isValidPhone(phone: unknown): phone is string {
  if (!isNonEmptyString(phone)) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Check if URL is valid format
 */
export function isValidUrl(url: unknown): url is string {
  if (!isNonEmptyString(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if date is in the future or today
 */
export function isValidFutureDate(date: unknown): date is string {
  if (!isNonEmptyString(date)) return false;

  try {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today && !isNaN(selectedDate.getTime());
  } catch {
    return false;
  }
}

/**
 * Check if value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Safe type assertion with validation
 */
export function assertType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  errorMessage: string
): asserts value is T {
  if (!guard(value)) {
    throw new TypeError(errorMessage);
  }
}
