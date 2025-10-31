/**
 * Calendar Integration Server Actions
 * =============================================================================
 * Server actions for syncing appointments to Google/Outlook Calendar
 * Phase: 4 - Sprint 4
 * =============================================================================
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/auth/admin';
import {
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from '@/lib/calendar/google';
import {
  createOutlookCalendarEvent,
  updateOutlookCalendarEvent,
  deleteOutlookCalendarEvent,
} from '@/lib/calendar/outlook';

/**
 * Get calendar integration for admin
 */
export async function getCalendarIntegration(adminEmail: string, provider: 'google' | 'outlook') {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('calendar_integrations')
    .select('*')
    .eq('admin_email', adminEmail)
    .eq('provider', provider)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching calendar integration:', error);
    return null;
  }

  return data;
}

/**
 * Disconnect calendar integration
 */
export async function disconnectCalendar(adminEmail: string, provider: 'google' | 'outlook') {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('calendar_integrations')
    .delete()
    .eq('admin_email', adminEmail)
    .eq('provider', provider);

  if (error) {
    console.error('Error disconnecting calendar:', error);
    return { success: false, error: 'Failed to disconnect calendar' };
  }

  revalidatePath('/admin/settings');
  return { success: true };
}

/**
 * Sync appointment to Google Calendar
 */
export async function syncAppointmentToGoogle(appointmentId: string, adminEmail: string) {
  try {
    const supabase = createServiceClient();

    // Get appointment details
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // Get Google Calendar integration
    const integration = await getCalendarIntegration(adminEmail, 'google');

    if (!integration || !integration.access_token || !integration.refresh_token) {
      return { success: false, error: 'Google Calendar not connected' };
    }

    // Check if event already exists
    if (appointment.google_calendar_event_id) {
      // Update existing event
      await updateGoogleCalendarEvent(
        integration.access_token,
        integration.refresh_token,
        appointment.google_calendar_event_id,
        {
          summary: `Appointment: ${appointment.full_name}`,
          description: `Project: ${appointment.project_type}\nBudget: ${appointment.budget_range}\n\nEmail: ${appointment.email}\nPhone: ${appointment.phone || 'N/A'}\n\n${appointment.project_description || ''}`,
          attendeeEmail: appointment.email,
        }
      );

      return { success: true, message: 'Calendar event updated' };
    } else {
      // Create new event
      // Default to 1-hour slot starting tomorrow at 10 AM
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(10, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(11, 0, 0, 0);

      const event = await createGoogleCalendarEvent(
        integration.access_token,
        integration.refresh_token,
        {
          summary: `Appointment: ${appointment.full_name}`,
          description: `Project: ${appointment.project_type}\nBudget: ${appointment.budget_range}\n\nEmail: ${appointment.email}\nPhone: ${appointment.phone || 'N/A'}\n\n${appointment.project_description || ''}`,
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
          attendeeEmail: appointment.email,
        }
      );

      // Save event ID to appointment
      await supabase
        .from('appointments')
        .update({
          google_calendar_event_id: event.id,
          calendar_synced_at: new Date().toISOString(),
        })
        .eq('id', appointmentId);

      return { success: true, message: 'Calendar event created' };
    }
  } catch (error: any) {
    console.error('Error syncing to Google Calendar:', error);

    // Handle token refresh if needed
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return {
        success: false,
        error: 'Calendar authorization expired. Please reconnect.',
      };
    }

    return { success: false, error: 'Failed to sync to Google Calendar' };
  } finally {
    revalidatePath(`/admin/appointments/${appointmentId}`);
  }
}

/**
 * Remove appointment from Google Calendar
 */
export async function removeAppointmentFromGoogle(appointmentId: string, adminEmail: string) {
  try {
    const supabase = createServiceClient();

    // Get appointment
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select('google_calendar_event_id')
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment?.google_calendar_event_id) {
      return { success: false, error: 'No calendar event found' };
    }

    // Get integration
    const integration = await getCalendarIntegration(adminEmail, 'google');

    if (!integration || !integration.access_token || !integration.refresh_token) {
      return { success: false, error: 'Google Calendar not connected' };
    }

    // Delete event
    await deleteGoogleCalendarEvent(
      integration.access_token,
      integration.refresh_token,
      appointment.google_calendar_event_id
    );

    // Clear event ID from appointment
    await supabase
      .from('appointments')
      .update({
        google_calendar_event_id: null,
        calendar_synced_at: null,
      })
      .eq('id', appointmentId);

    return { success: true, message: 'Removed from calendar' };
  } catch (error) {
    console.error('Error removing from Google Calendar:', error);
    return { success: false, error: 'Failed to remove from calendar' };
  } finally {
    revalidatePath(`/admin/appointments/${appointmentId}`);
  }
}

/**
 * Sync appointment to Outlook Calendar
 */
export async function syncAppointmentToOutlook(appointmentId: string, adminEmail: string) {
  try {
    const supabase = createServiceClient();

    // Get appointment details
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // Get Outlook Calendar integration
    const integration = await getCalendarIntegration(adminEmail, 'outlook');

    if (!integration || !integration.access_token) {
      return { success: false, error: 'Outlook Calendar not connected' };
    }

    // Check if event already exists
    if (appointment.outlook_calendar_event_id) {
      // Update existing event
      await updateOutlookCalendarEvent(
        integration.access_token,
        appointment.outlook_calendar_event_id,
        {
          summary: `Appointment: ${appointment.full_name}`,
          description: `Project: ${appointment.project_type}\nBudget: ${appointment.budget_range}\n\nEmail: ${appointment.email}\nPhone: ${appointment.phone || 'N/A'}\n\n${appointment.project_description || ''}`,
          attendeeEmail: appointment.email,
        }
      );

      return { success: true, message: 'Calendar event updated' };
    } else {
      // Create new event
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(10, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(11, 0, 0, 0);

      const event = await createOutlookCalendarEvent(integration.access_token, {
        summary: `Appointment: ${appointment.full_name}`,
        description: `Project: ${appointment.project_type}\nBudget: ${appointment.budget_range}\n\nEmail: ${appointment.email}\nPhone: ${appointment.phone || 'N/A'}\n\n${appointment.project_description || ''}`,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        attendeeEmail: appointment.email,
      });

      // Save event ID to appointment
      await supabase
        .from('appointments')
        .update({
          outlook_calendar_event_id: event.id,
          calendar_synced_at: new Date().toISOString(),
        })
        .eq('id', appointmentId);

      return { success: true, message: 'Calendar event created' };
    }
  } catch (error: any) {
    console.error('Error syncing to Outlook Calendar:', error);

    if (error.statusCode === 401 || error.message?.includes('token')) {
      return {
        success: false,
        error: 'Calendar authorization expired. Please reconnect.',
      };
    }

    return { success: false, error: 'Failed to sync to Outlook Calendar' };
  } finally {
    revalidatePath(`/admin/appointments/${appointmentId}`);
  }
}

/**
 * Remove appointment from Outlook Calendar
 */
export async function removeAppointmentFromOutlook(appointmentId: string, adminEmail: string) {
  try {
    const supabase = createServiceClient();

    // Get appointment
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select('outlook_calendar_event_id')
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment?.outlook_calendar_event_id) {
      return { success: false, error: 'No calendar event found' };
    }

    // Get integration
    const integration = await getCalendarIntegration(adminEmail, 'outlook');

    if (!integration || !integration.access_token) {
      return { success: false, error: 'Outlook Calendar not connected' };
    }

    // Delete event
    await deleteOutlookCalendarEvent(
      integration.access_token,
      appointment.outlook_calendar_event_id
    );

    // Clear event ID from appointment
    await supabase
      .from('appointments')
      .update({
        outlook_calendar_event_id: null,
        calendar_synced_at: null,
      })
      .eq('id', appointmentId);

    return { success: true, message: 'Removed from calendar' };
  } catch (error) {
    console.error('Error removing from Outlook Calendar:', error);
    return { success: false, error: 'Failed to remove from calendar' };
  } finally {
    revalidatePath(`/admin/appointments/${appointmentId}`);
  }
}
