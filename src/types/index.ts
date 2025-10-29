// Database Types

export interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;

  // Personal Information
  full_name: string;
  email: string;
  phone: string;
  company_name?: string;

  // Business Details
  industry?: string;
  website_url?: string;
  current_website: boolean;

  // Project Details
  project_type: string;
  project_description: string;
  budget_range: string;
  timeline: string;

  // Additional Information
  features?: string[];
  additional_notes?: string;
  referral_source?: string;

  // Scheduling
  preferred_date: string;
  preferred_time: string;
  timezone: string;

  // Status
  status: AppointmentStatus;

  // Metadata
  ip_address?: string;
  user_agent?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface EmailLog {
  id: string;
  created_at: string;

  // Email Details
  appointment_id?: string;
  recipient_email: string;
  email_type: EmailType;

  // Delivery Status
  status: EmailStatus;

  // Provider Details
  provider_message_id?: string;
  provider_response?: Record<string, unknown>;

  // Error Tracking
  error_message?: string;
  retry_count: number;
  last_retry_at?: string;

  // Metadata
  sent_at?: string;
  delivered_at?: string;
}

export type EmailType = 'confirmation' | 'reminder' | 'admin_notification' | 'cancellation';

export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

// Form Types

export interface BookingFormData {
  // Personal Information
  full_name: string;
  email: string;
  phone: string;
  company_name?: string;

  // Business Details
  industry?: string;
  website_url?: string;
  current_website: boolean;

  // Project Details
  project_type: string;
  project_description: string;
  budget_range: string;
  timeline: string;

  // Additional Information
  features?: string[];
  additional_notes?: string;
  referral_source?: string;

  // Scheduling
  preferred_date: string;
  preferred_time: string;
  timezone: string;
}

// API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type AppointmentResponse = ApiResponse<Appointment>;

export type EmailResponse = ApiResponse<EmailLog>;

// Component Props Types

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  url?: string;
  technologies: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

// Utility Types

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
