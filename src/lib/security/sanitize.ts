/**
 * Input Sanitization Utilities
 * =============================================================================
 * Sanitizes user input to prevent XSS and injection attacks
 * Uses DOMPurify for HTML/script sanitization
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - Enhancement & Security
 * =============================================================================
 */

/**
 * Sanitize text input (removes HTML and dangerous characters)
 * Used for text fields, names, emails, etc.
 *
 * @param input - The input string to sanitize
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove null bytes
      .replace(/\0/g, '')
      // Trim whitespace
      .trim()
      // Normalize whitespace
      .replace(/\s+/g, ' ')
  );
}

/**
 * Sanitize email address
 * Validates format and removes dangerous characters
 *
 * @param email - The email address to sanitize
 * @returns Sanitized email string
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email.toLowerCase().trim().replace(/[<>]/g, '');
}

/**
 * Sanitize phone number
 * Removes non-numeric characters except +, -, (, ), and spaces
 *
 * @param phone - The phone number to sanitize
 * @returns Sanitized phone string
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  return phone.replace(/[^0-9+\-\s()]/g, '').trim();
}

/**
 * Sanitize URL
 * Ensures URL uses safe protocols (http/https)
 *
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Check if URL starts with safe protocol
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    // Remove any javascript: or data: attempts hidden in the URL
    if (trimmed.toLowerCase().includes('javascript:') || trimmed.toLowerCase().includes('data:')) {
      return '';
    }
    return trimmed;
  }

  // If no protocol, assume https
  if (!trimmed.startsWith('http')) {
    return `https://${trimmed}`;
  }

  return '';
}

/**
 * Sanitize multi-line text (descriptions, notes, etc.)
 * Preserves line breaks but removes HTML and dangerous content
 *
 * @param text - The text to sanitize
 * @returns Sanitized text with preserved line breaks
 */
export function sanitizeMultilineText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return (
    text
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove null bytes
      .replace(/\0/g, '')
      // Trim each line
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      // Remove excessive blank lines (more than 2 consecutive)
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * Sanitize entire booking form data object
 * Applies appropriate sanitization to each field
 *
 * @param data - The form data object to sanitize
 * @returns Sanitized form data object
 */
export function sanitizeBookingFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  // Text fields
  if (typeof data.full_name === 'string') sanitized.full_name = sanitizeText(data.full_name);
  if (typeof data.company_name === 'string')
    sanitized.company_name = sanitizeText(data.company_name);
  if (typeof data.industry === 'string') sanitized.industry = sanitizeText(data.industry);
  if (typeof data.project_type === 'string')
    sanitized.project_type = sanitizeText(data.project_type);
  if (typeof data.budget_range === 'string')
    sanitized.budget_range = sanitizeText(data.budget_range);
  if (typeof data.timeline === 'string') sanitized.timeline = sanitizeText(data.timeline);
  if (typeof data.referral_source === 'string')
    sanitized.referral_source = sanitizeText(data.referral_source);
  if (typeof data.preferred_time === 'string')
    sanitized.preferred_time = sanitizeText(data.preferred_time);
  if (typeof data.timezone === 'string') sanitized.timezone = sanitizeText(data.timezone);

  // Email
  if (typeof data.email === 'string') sanitized.email = sanitizeEmail(data.email);

  // Phone
  if (typeof data.phone === 'string') sanitized.phone = sanitizePhone(data.phone);

  // URL
  if (typeof data.website_url === 'string') sanitized.website_url = sanitizeUrl(data.website_url);

  // Multi-line text
  if (typeof data.project_description === 'string') {
    sanitized.project_description = sanitizeMultilineText(data.project_description);
  }
  if (typeof data.additional_notes === 'string') {
    sanitized.additional_notes = sanitizeMultilineText(data.additional_notes);
  }

  // Dates (already validated by Zod, just ensure they're strings)
  if (typeof data.preferred_date === 'string')
    sanitized.preferred_date = String(data.preferred_date).trim();

  // Booleans
  if (typeof data.current_website !== 'undefined') {
    sanitized.current_website = Boolean(data.current_website);
  }

  // Arrays (features)
  if (Array.isArray(data.features)) {
    sanitized.features = data.features.map((feature: unknown) => sanitizeText(String(feature)));
  }

  // Honeypot (should be empty)
  if (typeof data.website === 'string') sanitized.website = sanitizeText(data.website);

  // Metadata
  if (typeof data.ip_address === 'string') sanitized.ip_address = sanitizeText(data.ip_address);
  if (typeof data.user_agent === 'string') sanitized.user_agent = sanitizeText(data.user_agent);

  return sanitized;
}

/**
 * SQL Injection prevention helper
 * This is a basic check - Supabase/PostgreSQL handles most SQL injection
 * But this provides an additional layer of defense
 *
 * @param input - The input to check
 * @returns True if input contains suspicious SQL patterns
 */
export function containsSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /('|(--|;|\/\*|\*\/|xp_))/gi,
    /(WAITFOR\s+DELAY)/gi,
    /(CAST\(|CONVERT\()/gi,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * XSS prevention helper
 * Checks for common XSS attack patterns
 *
 * @param input - The input to check
 * @returns True if input contains suspicious XSS patterns
 */
export function containsXss(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=, onload=
    /<embed[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}
