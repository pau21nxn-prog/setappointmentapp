import { z } from 'zod';

/**
 * Zod validation schemas for booking form
 * Organized by form steps with combined schema for final validation
 */

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(50, 'Phone number is too long')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Please enter a valid phone number'),

  company_name: z
    .string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must be less than 255 characters'),

  industry: z.string().min(1, 'Please select an industry'),

  website_url: z
    .string()
    .url('Please enter a valid URL')
    .max(500, 'URL is too long')
    .optional()
    .or(z.literal('')),

  current_website: z.boolean().default(false),
});

// Step 2: Project Details Schema
export const projectDetailsSchema = z.object({
  project_type: z.string().min(1, 'Please select a project type'),

  project_description: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your project')
    .max(2000, 'Description must be less than 2000 characters'),

  budget_range: z.string().min(1, 'Please select a budget range'),

  timeline: z.string().min(1, 'Please select a timeline'),

  features: z
    .array(z.string())
    .min(1, 'Please select at least one feature')
    .max(15, 'Maximum 15 features allowed'),

  additional_notes: z
    .string()
    .max(1000, 'Additional notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  referral_source: z.string().min(1, 'Please tell us how you found us'),
});

// Step 3: Scheduling Schema
export const schedulingSchema = z.object({
  preferred_date: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: 'Date must be today or in the future',
      }
    ),

  preferred_time: z.string().min(1, 'Please select a preferred time'),

  timezone: z.string().min(1, 'Please select your timezone'),
});

// Combined Schema for Complete Form Validation
export const bookingFormSchema = z.object({
  // Step 1: Personal Information
  ...personalInfoSchema.shape,

  // Step 2: Project Details
  ...projectDetailsSchema.shape,

  // Step 3: Scheduling
  ...schedulingSchema.shape,
});

// Type inference for TypeScript
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;
export type SchedulingFormData = z.infer<typeof schedulingSchema>;
export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Export schema object for easy access
export const formSchemas = {
  step1: personalInfoSchema,
  step2: projectDetailsSchema,
  step3: schedulingSchema,
  complete: bookingFormSchema,
};
