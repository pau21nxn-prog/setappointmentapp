/**
 * Reschedule Server Actions
 * =============================================================================
 * Server actions for managing appointment reschedule requests
 * Phase: 4 - Sprint 5
 * =============================================================================
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/auth/admin';

/**
 * Get all reschedule requests
 */
export async function getRescheduleRequests(status?: 'pending' | 'approved' | 'rejected') {
  const supabase = createServiceClient();

  let query = supabase
    .from('reschedule_requests')
    .select(
      `
      *,
      appointments:appointment_id (
        id,
        full_name,
        email,
        project_type,
        status
      )
    `
    )
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reschedule requests:', error);
    return { success: false, error: 'Failed to fetch reschedule requests' };
  }

  return { success: true, data };
}

/**
 * Create reschedule request (admin or client)
 */
export async function createRescheduleRequest(
  appointmentId: string,
  newDateTime: string,
  requestedBy: 'client' | 'admin',
  reason?: string
) {
  try {
    const supabase = createServiceClient();

    // Get current scheduled time
    const { data: appointment } = await supabase
      .from('appointments')
      .select('scheduled_date_time')
      .eq('id', appointmentId)
      .single();

    // Create reschedule request
    const { error } = await supabase.from('reschedule_requests').insert({
      appointment_id: appointmentId,
      requested_by: requestedBy,
      old_date_time: appointment?.scheduled_date_time || null,
      new_date_time: newDateTime,
      reason,
      status: 'pending',
    });

    if (error) {
      console.error('Error creating reschedule request:', error);
      return { success: false, error: 'Failed to create reschedule request' };
    }

    revalidatePath('/admin/appointments');
    revalidatePath(`/admin/appointments/${appointmentId}`);

    return { success: true, message: 'Reschedule request created' };
  } catch (error) {
    console.error('Reschedule request error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Approve reschedule request
 */
export async function approveRescheduleRequest(requestId: string, handledByEmail: string) {
  try {
    const supabase = createServiceClient();

    // Get request details
    const { data: request, error: fetchError } = await supabase
      .from('reschedule_requests')
      .select('*, appointments:appointment_id(id, scheduled_date_time)')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      return { success: false, error: 'Reschedule request not found' };
    }

    // Update appointment scheduled time
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        scheduled_date_time: request.new_date_time,
        original_scheduled_date_time:
          request.appointments.scheduled_date_time || request.new_date_time,
      })
      .eq('id', request.appointment_id);

    if (updateError) {
      console.error('Error updating appointment time:', updateError);
      return { success: false, error: 'Failed to update appointment' };
    }

    // Mark request as approved
    const { error: approveError } = await supabase
      .from('reschedule_requests')
      .update({
        status: 'approved',
        handled_by_email: handledByEmail,
        handled_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (approveError) {
      console.error('Error approving reschedule request:', approveError);
      return { success: false, error: 'Failed to approve request' };
    }

    revalidatePath('/admin/appointments');
    revalidatePath(`/admin/appointments/${request.appointment_id}`);

    return { success: true, message: 'Reschedule request approved' };
  } catch (error) {
    console.error('Approve reschedule error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Reject reschedule request
 */
export async function rejectRescheduleRequest(
  requestId: string,
  handledByEmail: string,
  rejectionReason?: string
) {
  try {
    const supabase = createServiceClient();

    const { data: request, error } = await supabase
      .from('reschedule_requests')
      .update({
        status: 'rejected',
        handled_by_email: handledByEmail,
        handled_at: new Date().toISOString(),
        rejection_reason: rejectionReason,
      })
      .eq('id', requestId)
      .select('appointment_id')
      .single();

    if (error) {
      console.error('Error rejecting reschedule request:', error);
      return { success: false, error: 'Failed to reject request' };
    }

    revalidatePath('/admin/appointments');
    if (request) {
      revalidatePath(`/admin/appointments/${request.appointment_id}`);
    }

    return { success: true, message: 'Reschedule request rejected' };
  } catch (error) {
    console.error('Reject reschedule error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Get reschedule requests for a specific appointment
 */
export async function getAppointmentRescheduleRequests(appointmentId: string) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('reschedule_requests')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching appointment reschedule requests:', error);
    return { success: false, error: 'Failed to fetch requests' };
  }

  return { success: true, data };
}
