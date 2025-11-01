import { createServerClient } from './server';
import { BookingFormData } from '@/lib/validation/bookingSchema';

export interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  industry: string;
  website_url?: string;
  current_website: boolean;
  project_type: string;
  project_description: string;
  budget_range: string;
  timeline: string;
  features: string[];
  additional_notes?: string;
  referral_source: string;
  preferred_date: string;
  preferred_time: string;
  timezone: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  ip_address?: string;
  user_agent?: string;
}

export interface CreateAppointmentData
  extends Omit<BookingFormData, 'website_url' | 'additional_notes'> {
  website_url?: string;
  additional_notes?: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Create a new appointment in the database
 */
export async function createAppointment(
  data: CreateAppointmentData
): Promise<{ data: Appointment | null; error: Error | null }> {
  try {
    const supabase = createServerClient();

    const appointmentData = {
      full_name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone: data.phone,
      company_name: data.company_name,
      industry: data.industry === 'other' ? data.industry_other || 'Other' : data.industry,
      website_url: data.website_url || null,
      current_website: data.current_website,
      project_type: data.project_type,
      project_description: data.project_description,
      budget_range: 'not-specified', // Default value since field removed from form
      timeline: 'flexible', // Default value since field removed from form
      features: data.features,
      additional_notes: data.additional_notes || null,
      referral_source: data.referral_source,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      timezone: 'UTC', // Default value since field removed from form
      status: 'pending' as const,
      ip_address: data.ip_address || null,
      user_agent: data.user_agent || null,
    };

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: appointment, error: null };
  } catch (error) {
    console.error('Unexpected error creating appointment:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Get an appointment by ID
 */
export async function getAppointmentById(
  id: string
): Promise<{ data: Appointment | null; error: Error | null }> {
  try {
    const supabase = createServerClient();

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: appointment, error: null };
  } catch (error) {
    console.error('Unexpected error fetching appointment:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<{ data: Appointment | null; error: Error | null }> {
  try {
    const supabase = createServerClient();

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: appointment, error: null };
  } catch (error) {
    console.error('Unexpected error updating appointment status:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Get appointments by email
 */
export async function getAppointmentsByEmail(
  email: string
): Promise<{ data: Appointment[] | null; error: Error | null }> {
  try {
    const supabase = createServerClient();

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: appointments, error: null };
  } catch (error) {
    console.error('Unexpected error fetching appointments:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Check for duplicate appointments (same email and date within last 24 hours)
 */
export async function checkDuplicateAppointment(
  email: string,
  preferred_date: string
): Promise<{ isDuplicate: boolean; error: Error | null }> {
  try {
    const supabase = createServerClient();

    // Check if there's an appointment with the same email created in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('email', email)
      .eq('preferred_date', preferred_date)
      .gte('created_at', twentyFourHoursAgo)
      .limit(1);

    if (error) {
      console.error('Error checking duplicate appointment:', error);
      return { isDuplicate: false, error: new Error(error.message) };
    }

    return { isDuplicate: appointments && appointments.length > 0, error: null };
  } catch (error) {
    console.error('Unexpected error checking duplicate appointment:', error);
    return {
      isDuplicate: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
