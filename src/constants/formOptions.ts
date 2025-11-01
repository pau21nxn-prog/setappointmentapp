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
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'night', label: 'Night' },
];

export const VIDEO_CALL_PLATFORM_OPTIONS: SelectOption[] = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'google-meet', label: 'Google Meet' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'webex', label: 'Webex' },
  { value: 'other', label: 'Other' },
];

export const TIMEZONE_OPTIONS: SelectOption[] = [
  // UTC -12 to -10
  { value: 'UTC -12 (Baker Island)', label: 'UTC -12 (Baker Island)' },
  { value: 'UTC -11 (Pago Pago)', label: 'UTC -11 (Pago Pago)' },
  { value: 'UTC -11 (Midway)', label: 'UTC -11 (Midway)' },
  { value: 'UTC -10 (Honolulu)', label: 'UTC -10 (Honolulu)' },

  // UTC -9 to -6
  { value: 'UTC -9 (Anchorage)', label: 'UTC -9 (Anchorage)' },
  { value: 'UTC -8 (Los Angeles)', label: 'UTC -8 (Los Angeles)' },
  { value: 'UTC -8 (Vancouver)', label: 'UTC -8 (Vancouver)' },
  { value: 'UTC -8 (Tijuana)', label: 'UTC -8 (Tijuana)' },
  { value: 'UTC -7 (Denver)', label: 'UTC -7 (Denver)' },
  { value: 'UTC -7 (Phoenix)', label: 'UTC -7 (Phoenix)' },
  { value: 'UTC -7 (Calgary)', label: 'UTC -7 (Calgary)' },
  { value: 'UTC -6 (Chicago)', label: 'UTC -6 (Chicago)' },
  { value: 'UTC -6 (Mexico City)', label: 'UTC -6 (Mexico City)' },
  { value: 'UTC -6 (Guatemala City)', label: 'UTC -6 (Guatemala City)' },

  // UTC -5 to -3
  { value: 'UTC -5 (New York)', label: 'UTC -5 (New York)' },
  { value: 'UTC -5 (Toronto)', label: 'UTC -5 (Toronto)' },
  { value: 'UTC -5 (Bogota)', label: 'UTC -5 (Bogota)' },
  { value: 'UTC -5 (Lima)', label: 'UTC -5 (Lima)' },
  { value: 'UTC -4 (Caracas)', label: 'UTC -4 (Caracas)' },
  { value: 'UTC -4 (Santiago)', label: 'UTC -4 (Santiago)' },
  { value: 'UTC -4 (La Paz)', label: 'UTC -4 (La Paz)' },
  { value: 'UTC -3 (Buenos Aires)', label: 'UTC -3 (Buenos Aires)' },
  { value: 'UTC -3 (Sao Paulo)', label: 'UTC -3 (Sao Paulo)' },
  { value: 'UTC -3 (Montevideo)', label: 'UTC -3 (Montevideo)' },

  // UTC -2 to 0
  { value: 'UTC -2 (South Georgia)', label: 'UTC -2 (South Georgia)' },
  { value: 'UTC -1 (Azores)', label: 'UTC -1 (Azores)' },
  { value: 'UTC -1 (Cape Verde)', label: 'UTC -1 (Cape Verde)' },
  { value: 'UTC +0 (London)', label: 'UTC +0 (London)' },
  { value: 'UTC +0 (Dublin)', label: 'UTC +0 (Dublin)' },
  { value: 'UTC +0 (Lisbon)', label: 'UTC +0 (Lisbon)' },
  { value: 'UTC +0 (Reykjavik)', label: 'UTC +0 (Reykjavik)' },
  { value: 'UTC +0 (Accra)', label: 'UTC +0 (Accra)' },

  // UTC +1 to +2
  { value: 'UTC +1 (Paris)', label: 'UTC +1 (Paris)' },
  { value: 'UTC +1 (Berlin)', label: 'UTC +1 (Berlin)' },
  { value: 'UTC +1 (Rome)', label: 'UTC +1 (Rome)' },
  { value: 'UTC +1 (Madrid)', label: 'UTC +1 (Madrid)' },
  { value: 'UTC +1 (Amsterdam)', label: 'UTC +1 (Amsterdam)' },
  { value: 'UTC +1 (Brussels)', label: 'UTC +1 (Brussels)' },
  { value: 'UTC +1 (Lagos)', label: 'UTC +1 (Lagos)' },
  { value: 'UTC +2 (Cairo)', label: 'UTC +2 (Cairo)' },
  { value: 'UTC +2 (Johannesburg)', label: 'UTC +2 (Johannesburg)' },
  { value: 'UTC +2 (Athens)', label: 'UTC +2 (Athens)' },
  { value: 'UTC +2 (Helsinki)', label: 'UTC +2 (Helsinki)' },
  { value: 'UTC +2 (Istanbul)', label: 'UTC +2 (Istanbul)' },

  // UTC +3 to +4.5
  { value: 'UTC +3 (Moscow)', label: 'UTC +3 (Moscow)' },
  { value: 'UTC +3 (Nairobi)', label: 'UTC +3 (Nairobi)' },
  { value: 'UTC +3 (Riyadh)', label: 'UTC +3 (Riyadh)' },
  { value: 'UTC +3 (Baghdad)', label: 'UTC +3 (Baghdad)' },
  { value: 'UTC +3.5 (Tehran)', label: 'UTC +3.5 (Tehran)' },
  { value: 'UTC +4 (Dubai)', label: 'UTC +4 (Dubai)' },
  { value: 'UTC +4 (Baku)', label: 'UTC +4 (Baku)' },
  { value: 'UTC +4.5 (Kabul)', label: 'UTC +4.5 (Kabul)' },

  // UTC +5 to +6.5
  { value: 'UTC +5 (Karachi)', label: 'UTC +5 (Karachi)' },
  { value: 'UTC +5 (Tashkent)', label: 'UTC +5 (Tashkent)' },
  { value: 'UTC +5.5 (Mumbai)', label: 'UTC +5.5 (Mumbai)' },
  { value: 'UTC +5.5 (Colombo)', label: 'UTC +5.5 (Colombo)' },
  { value: 'UTC +5.75 (Kathmandu)', label: 'UTC +5.75 (Kathmandu)' },
  { value: 'UTC +6 (Dhaka)', label: 'UTC +6 (Dhaka)' },
  { value: 'UTC +6 (Almaty)', label: 'UTC +6 (Almaty)' },
  { value: 'UTC +6.5 (Yangon)', label: 'UTC +6.5 (Yangon)' },

  // UTC +7 to +8.75
  { value: 'UTC +7 (Bangkok)', label: 'UTC +7 (Bangkok)' },
  { value: 'UTC +7 (Jakarta)', label: 'UTC +7 (Jakarta)' },
  { value: 'UTC +7 (Ho Chi Minh City)', label: 'UTC +7 (Ho Chi Minh City)' },
  { value: 'UTC +8 (Manila)', label: 'UTC +8 (Manila)' },
  { value: 'UTC +8 (Singapore)', label: 'UTC +8 (Singapore)' },
  { value: 'UTC +8 (Hong Kong)', label: 'UTC +8 (Hong Kong)' },
  { value: 'UTC +8 (Beijing)', label: 'UTC +8 (Beijing)' },
  { value: 'UTC +8 (Taipei)', label: 'UTC +8 (Taipei)' },
  { value: 'UTC +8 (Kuala Lumpur)', label: 'UTC +8 (Kuala Lumpur)' },
  { value: 'UTC +8 (Perth)', label: 'UTC +8 (Perth)' },
  { value: 'UTC +8.75 (Eucla)', label: 'UTC +8.75 (Eucla)' },

  // UTC +9 to +14
  { value: 'UTC +9 (Tokyo)', label: 'UTC +9 (Tokyo)' },
  { value: 'UTC +9 (Seoul)', label: 'UTC +9 (Seoul)' },
  { value: 'UTC +9.5 (Adelaide)', label: 'UTC +9.5 (Adelaide)' },
  { value: 'UTC +9.5 (Darwin)', label: 'UTC +9.5 (Darwin)' },
  { value: 'UTC +10 (Sydney)', label: 'UTC +10 (Sydney)' },
  { value: 'UTC +10 (Melbourne)', label: 'UTC +10 (Melbourne)' },
  { value: 'UTC +10 (Brisbane)', label: 'UTC +10 (Brisbane)' },
  { value: 'UTC +10 (Port Moresby)', label: 'UTC +10 (Port Moresby)' },
  { value: 'UTC +11 (Noumea)', label: 'UTC +11 (Noumea)' },
  { value: 'UTC +11 (Solomon Islands)', label: 'UTC +11 (Solomon Islands)' },
  { value: 'UTC +12 (Auckland)', label: 'UTC +12 (Auckland)' },
  { value: 'UTC +12 (Fiji)', label: 'UTC +12 (Fiji)' },
  { value: "UTC +13 (Nuku'alofa)", label: "UTC +13 (Nuku'alofa)" },
  { value: 'UTC +13 (Apia)', label: 'UTC +13 (Apia)' },
  { value: 'UTC +14 (Kiritimati)', label: 'UTC +14 (Kiritimati)' },
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
