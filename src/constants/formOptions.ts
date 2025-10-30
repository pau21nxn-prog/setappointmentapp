import { SelectOption } from '@/components/ui/Select';

/**
 * Form dropdown options for booking form
 * Placeholder options to be customized by client
 */

export const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: 'technology', label: 'Technology/SaaS' },
  { value: 'ecommerce', label: 'E-commerce/Retail' },
  { value: 'healthcare', label: 'Healthcare/Medical' },
  { value: 'finance', label: 'Finance/Banking' },
  { value: 'education', label: 'Education/E-learning' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality/Travel' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'manufacturing', label: 'Manufacturing/Industrial' },
  { value: 'nonprofit', label: 'Non-profit/Charity' },
  { value: 'other', label: 'Other' },
];

export const PROJECT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'new-website', label: 'New Website' },
  { value: 'website-redesign', label: 'Website Redesign' },
  { value: 'ecommerce-store', label: 'E-commerce Store' },
  { value: 'web-application', label: 'Web Application' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'portfolio', label: 'Portfolio Website' },
  { value: 'blog', label: 'Blog/Content Site' },
  { value: 'maintenance', label: 'Website Maintenance' },
  { value: 'seo-optimization', label: 'SEO Optimization' },
  { value: 'other', label: 'Other' },
];

export const BUDGET_RANGE_OPTIONS: SelectOption[] = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
  { value: 'not-sure', label: 'Not Sure Yet' },
];

export const TIMELINE_OPTIONS: SelectOption[] = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-months', label: '1-2 Months' },
  { value: '3-6-months', label: '3-6 Months' },
  { value: '6-12-months', label: '6-12 Months' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'not-sure', label: 'Not Sure Yet' },
];

export const PREFERRED_TIME_OPTIONS: SelectOption[] = [
  { value: '9am-10am', label: '9:00 AM - 10:00 AM' },
  { value: '10am-11am', label: '10:00 AM - 11:00 AM' },
  { value: '11am-12pm', label: '11:00 AM - 12:00 PM' },
  { value: '12pm-1pm', label: '12:00 PM - 1:00 PM' },
  { value: '1pm-2pm', label: '1:00 PM - 2:00 PM' },
  { value: '2pm-3pm', label: '2:00 PM - 3:00 PM' },
  { value: '3pm-4pm', label: '3:00 PM - 4:00 PM' },
  { value: '4pm-5pm', label: '4:00 PM - 5:00 PM' },
  { value: '5pm-6pm', label: '5:00 PM - 6:00 PM' },
];

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'UTC', label: 'UTC/GMT' },
];

export const REFERRAL_SOURCE_OPTIONS: SelectOption[] = [
  { value: 'google-search', label: 'Google Search' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'friend-referral', label: 'Friend/Colleague Referral' },
  { value: 'online-ad', label: 'Online Advertisement' },
  { value: 'blog-article', label: 'Blog/Article' },
  { value: 'portfolio', label: 'Saw Your Portfolio' },
  { value: 'event', label: 'Event/Conference' },
  { value: 'other', label: 'Other' },
];

export const FEATURE_OPTIONS = [
  'Contact Forms',
  'Blog/News Section',
  'Photo/Video Galleries',
  'E-commerce/Shopping Cart',
  'User Login/Registration',
  'Payment Processing',
  'Content Management System',
  'Search Functionality',
  'Multi-language Support',
  'API Integration',
  'Analytics/Reporting',
  'Live Chat Support',
  'Email Marketing Integration',
  'Social Media Integration',
  'Mobile App',
] as const;

// Type for features
export type FeatureOption = (typeof FEATURE_OPTIONS)[number];
