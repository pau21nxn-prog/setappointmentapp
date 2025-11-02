/**
 * Admin Bulk Actions
 * =============================================================================
 * Server actions for performing bulk operations on multiple appointments
 * - Bulk status updates
 * - Bulk email sending
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 3)
 * =============================================================================
 */

'use server';

import { getAdminSession, createServiceClient } from '@/lib/auth/admin';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email/mailer';
import { getEmailTemplate, EmailTemplateType } from '@/lib/email/adminTemplates';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface BulkStatusUpdateResult {
  success: boolean;
  message: string;
  updatedCount: number;
  failedCount: number;
  errors?: string[];
}

interface BulkEmailResult {
  success: boolean;
  message: string;
  sentCount: number;
  failedCount: number;
  errors?: string[];
}

/**
 * Update status for multiple appointments
 *
 * @param appointmentIds - Array of appointment UUIDs
 * @param newStatus - New status to set
 * @param changeReason - Optional reason for the change
 * @returns Result object with success counts and errors
 */
export async function bulkUpdateAppointmentStatus(
  appointmentIds: string[],
  newStatus: AppointmentStatus,
  changeReason?: string
): Promise<BulkStatusUpdateResult> {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
        updatedCount: 0,
        failedCount: appointmentIds.length,
        errors: ['You must be logged in as an admin to perform this action'],
      };
    }

    if (!appointmentIds || appointmentIds.length === 0) {
      return {
        success: false,
        message: 'No appointments selected',
        updatedCount: 0,
        failedCount: 0,
      };
    }

    const supabase = createServiceClient();
    const errors: string[] = [];
    let updatedCount = 0;
    let failedCount = 0;

    // Process each appointment
    for (const appointmentId of appointmentIds) {
      try {
        // Get current appointment status
        const { data: appointment, error: fetchError } = await supabase
          .from('appointments')
          .select('status, full_name')
          .eq('id', appointmentId)
          .single();

        if (fetchError || !appointment) {
          errors.push(`Appointment ${appointmentId}: Not found`);
          failedCount++;
          continue;
        }

        const previousStatus = appointment.status;

        // Skip if status is already the same
        if (previousStatus === newStatus) {
          errors.push(`${appointment.full_name}: Already has status ${newStatus}`);
          failedCount++;
          continue;
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
          errors.push(`${appointment.full_name}: ${updateError.message}`);
          failedCount++;
          continue;
        }

        // Create status history record
        await supabase.from('status_history').insert({
          appointment_id: appointmentId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: session.user.email,
          change_reason: changeReason || 'Bulk status update',
        });

        updatedCount++;
      } catch (err) {
        errors.push(`${appointmentId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        failedCount++;
      }
    }

    // Revalidate pages
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/appointments');

    const totalProcessed = updatedCount + failedCount;
    const message =
      failedCount === 0
        ? `Successfully updated ${updatedCount} appointment${updatedCount !== 1 ? 's' : ''}`
        : `Updated ${updatedCount} of ${totalProcessed} appointments (${failedCount} failed)`;

    return {
      success: updatedCount > 0,
      message,
      updatedCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error in bulk status update:', error);
    return {
      success: false,
      message: 'An error occurred during bulk update',
      updatedCount: 0,
      failedCount: appointmentIds.length,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Send emails to multiple appointments
 *
 * @param appointmentIds - Array of appointment UUIDs
 * @param templateType - Type of email template to use
 * @param customData - Optional custom data for templates
 * @returns Result object with success counts and errors
 */
export async function bulkSendAppointmentEmails(
  appointmentIds: string[],
  templateType: EmailTemplateType,
  customData?: {
    subject?: string;
    message?: string;
    reason?: string;
    updateTitle?: string;
    updateDetails?: string;
  }
): Promise<BulkEmailResult> {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
        sentCount: 0,
        failedCount: appointmentIds.length,
        errors: ['You must be logged in as an admin to perform this action'],
      };
    }

    if (!appointmentIds || appointmentIds.length === 0) {
      return {
        success: false,
        message: 'No appointments selected',
        sentCount: 0,
        failedCount: 0,
      };
    }

    const supabase = createServiceClient();
    const errors: string[] = [];
    let sentCount = 0;
    let failedCount = 0;

    // Process each appointment
    for (const appointmentId of appointmentIds) {
      try {
        // Fetch appointment data
        const { data: appointment, error: fetchError } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', appointmentId)
          .single();

        if (fetchError || !appointment) {
          errors.push(`Appointment ${appointmentId}: Not found`);
          failedCount++;
          continue;
        }

        // Generate email template
        const { subject, html } = getEmailTemplate(templateType, appointment, customData);

        // Send email using our mailer service
        const result = await sendEmail({
          to: appointment.email,
          subject,
          html,
          replyTo: process.env.EMAIL_ADMIN,
        });

        if (!result.success) {
          // Email logging is handled in sendEmail function
          errors.push(
            `${appointment.full_name} (${appointment.email}): ${result.error || 'Unknown error'}`
          );
          failedCount++;
          continue;
        }

        sentCount++;
      } catch (err) {
        errors.push(`${appointmentId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        failedCount++;
      }
    }

    const totalProcessed = sentCount + failedCount;
    const message =
      failedCount === 0
        ? `Successfully sent ${sentCount} email${sentCount !== 1 ? 's' : ''}`
        : `Sent ${sentCount} of ${totalProcessed} emails (${failedCount} failed)`;

    return {
      success: sentCount > 0,
      message,
      sentCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error in bulk email send:', error);
    return {
      success: false,
      message: 'An error occurred during bulk email send',
      sentCount: 0,
      failedCount: appointmentIds.length,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
