/**
 * Google Analytics 4 (GA4) Configuration
 * =============================================================================
 * Tracks page views, events, and conversions
 * GDPR/CCPA compliant with consent management
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - SEO & Analytics
 * =============================================================================
 */

// Google Analytics Measurement ID
// Get this from: https://analytics.google.com/ → Admin → Data Streams
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' && GA_MEASUREMENT_ID !== '';
};

/**
 * Initialize Google Analytics
 * Called automatically by Next.js Script component
 */
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Track page views
 * Call this on route changes
 *
 * @param url - The page URL to track
 */
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/**
 * Track custom events
 *
 * @param action - The event action (e.g., 'click', 'submit')
 * @param params - Additional event parameters
 */
export const event = (
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, params);
};

/**
 * Track form submission conversion
 * Call this after successful booking submission
 *
 * @param appointmentData - The appointment data
 */
export const trackFormSubmission = (appointmentData: {
  email: string;
  company_name?: string;
  project_type?: string;
  budget_range?: string;
}): void => {
  event('generate_lead', {
    category: 'engagement',
    label: 'Booking Form Submission',
    value: 1,
    email: appointmentData.email,
    company: appointmentData.company_name,
    project_type: appointmentData.project_type,
    budget: appointmentData.budget_range,
  });

  // Track as conversion
  event('conversion', {
    send_to: `${GA_MEASUREMENT_ID}/booking_complete`,
    value: 1.0,
    currency: 'USD',
  });
};

/**
 * Track CTA button clicks
 *
 * @param buttonName - Name of the CTA button clicked
 * @param buttonLocation - Where on the page it's located
 */
export const trackCTAClick = (buttonName: string, buttonLocation: string): void => {
  event('cta_click', {
    category: 'engagement',
    label: buttonName,
    location: buttonLocation,
  });
};

/**
 * Track scroll depth
 * Useful for understanding content engagement
 *
 * @param percentage - Scroll depth percentage (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage: number): void => {
  event('scroll', {
    category: 'engagement',
    label: `${percentage}% Scroll`,
    value: percentage,
  });
};

/**
 * Track external link clicks
 *
 * @param url - The external URL clicked
 * @param linkText - Text of the link
 */
export const trackOutboundLink = (url: string, linkText: string): void => {
  event('click', {
    category: 'outbound',
    label: linkText,
    url: url, // Store URL as custom parameter, not value
  });
};

/**
 * Track video plays (if applicable)
 *
 * @param videoTitle - Title of the video
 * @param action - Action performed (play, pause, complete)
 */
export const trackVideoInteraction = (
  videoTitle: string,
  action: 'play' | 'pause' | 'complete'
): void => {
  event(`video_${action}`, {
    category: 'engagement',
    label: videoTitle,
  });
};

/**
 * Track form field interactions
 * Useful for understanding where users drop off
 *
 * @param fieldName - Name of the form field
 * @param action - Action performed (focus, blur, fill)
 */
export const trackFormFieldInteraction = (
  fieldName: string,
  action: 'focus' | 'blur' | 'fill'
): void => {
  event(`form_${action}`, {
    category: 'form_interaction',
    label: fieldName,
  });
};

/**
 * Track 404 errors
 *
 * @param path - The path that resulted in 404
 */
export const track404Error = (path: string): void => {
  event('page_not_found', {
    category: 'error',
    label: path,
  });
};

/**
 * Track search queries (if search functionality added)
 *
 * @param searchTerm - The search term entered
 * @param resultsCount - Number of results returned
 */
export const trackSearch = (searchTerm: string, resultsCount: number): void => {
  event('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Set user properties
 * Call after user completes booking
 *
 * @param properties - User properties to set
 */
export const setUserProperties = (properties: {
  industry?: string;
  company_size?: string;
  budget_range?: string;
  [key: string]: any;
}): void => {
  if (!isGAEnabled()) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Consent management (GDPR/CCPA compliance)
 * Call this based on user's cookie consent
 *
 * @param granted - Whether analytics consent is granted
 */
export const updateConsent = (granted: boolean): void => {
  if (!isGAEnabled()) return;

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied', // We don't use ads
  });
};
