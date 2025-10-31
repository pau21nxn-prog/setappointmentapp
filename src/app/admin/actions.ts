/**
 * Admin Server Actions
 * =============================================================================
 * Server-side actions for admin operations
 * - Logout
 * - Update appointment status
 * - Add/update/delete appointment notes
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 2)
 * =============================================================================
 */

'use server';

import { signOutAdmin, getAdminSession, createServiceClient } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Type definitions
type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface UpdateStatusResult {
  success: boolean;
  message: string;
  error?: string;
}

interface AddNoteResult {
  success: boolean;
  message: string;
  noteId?: string;
  error?: string;
}

interface DeleteNoteResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Logout Action
 * Logs out the current admin user and redirects to login page
 */
export async function logoutAction() {
  const result = await signOutAdmin();

  if (result.success) {
    redirect('/admin/login');
  }

  return result;
}

/**
 * Update appointment status and create status history record
 *
 * @param appointmentId - UUID of the appointment
 * @param newStatus - New status to set
 * @param changeReason - Optional reason for the change
 * @returns Result object with success status and message
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
  changeReason?: string
): Promise<UpdateStatusResult> {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'You must be logged in as an admin to perform this action',
      };
    }

    const supabase = createServiceClient();

    // Get current appointment status
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('status')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      return {
        success: false,
        message: 'Appointment not found',
        error: fetchError?.message || 'Could not find appointment',
      };
    }

    const previousStatus = appointment.status;

    // Don't update if status is the same
    if (previousStatus === newStatus) {
      return {
        success: false,
        message: 'Status unchanged',
        error: 'The appointment already has this status',
      };
    }

    // Update appointment status
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId);

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update status',
        error: updateError.message,
      };
    }

    // Create status history record
    const { error: historyError } = await supabase.from('status_history').insert({
      appointment_id: appointmentId,
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by: session.user.email,
      change_reason: changeReason || null,
    });

    if (historyError) {
      console.error('Failed to create status history:', historyError);
      // Don't fail the whole operation if history fails
    }

    // Revalidate pages
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/appointments');
    revalidatePath(`/admin/appointments/${appointmentId}`);

    return {
      success: true,
      message: `Status updated to ${newStatus}`,
    };
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Add a note to an appointment
 *
 * @param appointmentId - UUID of the appointment
 * @param noteText - The note content
 * @param isImportant - Whether to flag the note as important
 * @returns Result object with success status and message
 */
export async function addAppointmentNote(
  appointmentId: string,
  noteText: string,
  isImportant: boolean = false
): Promise<AddNoteResult> {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'You must be logged in as an admin to perform this action',
      };
    }

    // Validate note text
    const trimmedNote = noteText.trim();
    if (!trimmedNote) {
      return {
        success: false,
        message: 'Note cannot be empty',
        error: 'Please enter some text for the note',
      };
    }

    if (trimmedNote.length > 5000) {
      return {
        success: false,
        message: 'Note too long',
        error: 'Notes must be 5000 characters or less',
      };
    }

    const supabase = createServiceClient();

    // Verify appointment exists
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('id')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      return {
        success: false,
        message: 'Appointment not found',
        error: fetchError?.message || 'Could not find appointment',
      };
    }

    // Insert note
    const { data, error: insertError } = await supabase
      .from('appointment_notes')
      .insert({
        appointment_id: appointmentId,
        note_text: trimmedNote,
        created_by: session.user.email || 'unknown',
        is_important: isImportant,
      })
      .select('id')
      .single();

    if (insertError) {
      return {
        success: false,
        message: 'Failed to add note',
        error: insertError.message,
      };
    }

    // Revalidate appointment detail page
    revalidatePath(`/admin/appointments/${appointmentId}`);

    return {
      success: true,
      message: 'Note added successfully',
      noteId: data?.id,
    };
  } catch (error) {
    console.error('Error adding appointment note:', error);
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing note
 *
 * @param noteId - UUID of the note
 * @param noteText - Updated note content
 * @param isImportant - Whether to flag the note as important
 * @returns Result object with success status and message
 */
export async function updateAppointmentNote(
  noteId: string,
  noteText: string,
  isImportant: boolean = false
): Promise<UpdateStatusResult> {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'You must be logged in as an admin to perform this action',
      };
    }

    // Validate note text
    const trimmedNote = noteText.trim();
    if (!trimmedNote) {
      return {
        success: false,
        message: 'Note cannot be empty',
        error: 'Please enter some text for the note',
      };
    }

    if (trimmedNote.length > 5000) {
      return {
        success: false,
        message: 'Note too long',
        error: 'Notes must be 5000 characters or less',
      };
    }

    const supabase = createServiceClient();

    // Update note (RLS will ensure user can only update their own notes)
    const { error: updateError } = await supabase
      .from('appointment_notes')
      .update({
        note_text: trimmedNote,
        is_important: isImportant,
      })
      .eq('id', noteId)
      .eq('created_by', session.user.email || 'unknown');

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update note',
        error: updateError.message,
      };
    }

    // Revalidate pages
    revalidatePath('/admin/appointments');

    return {
      success: true,
      message: 'Note updated successfully',
    };
  } catch (error) {
    console.error('Error updating appointment note:', error);
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a note
 *
 * @param noteId - UUID of the note to delete
 * @param appointmentId - UUID of the appointment (for revalidation)
 * @returns Result object with success status and message
 */
export async function deleteAppointmentNote(
  noteId: string,
  appointmentId: string
): Promise<DeleteNoteResult> {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'You must be logged in as an admin to perform this action',
      };
    }

    const supabase = createServiceClient();

    // Delete note (RLS will ensure user can only delete their own notes)
    const { error: deleteError } = await supabase
      .from('appointment_notes')
      .delete()
      .eq('id', noteId)
      .eq('created_by', session.user.email || 'unknown');

    if (deleteError) {
      return {
        success: false,
        message: 'Failed to delete note',
        error: deleteError.message,
      };
    }

    // Revalidate appointment detail page
    revalidatePath(`/admin/appointments/${appointmentId}`);

    return {
      success: true,
      message: 'Note deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting appointment note:', error);
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
