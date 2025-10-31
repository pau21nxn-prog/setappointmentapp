/**
 * Admin Email Templates
 * =============================================================================
 * Email templates for sending emails to clients from admin panel
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 2)
 * =============================================================================
 */

interface AppointmentData {
  full_name: string;
  email: string;
  company_name?: string;
  project_type?: string;
  preferred_contact_time?: string;
}

/**
 * Status Confirmation Email Template
 * Sent when admin changes appointment status to confirmed
 */
export function getStatusConfirmationTemplate(appointmentData: AppointmentData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Appointment Confirmed! ✓</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${appointmentData.full_name},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Great news! Your appointment for <strong>${appointmentData.project_type || 'your project'}</strong> has been confirmed.
    </p>

    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0; color: #059669;">What's Next?</h3>
      <p style="margin: 10px 0;">We'll reach out to you ${appointmentData.preferred_contact_time ? `during your preferred time: <strong>${appointmentData.preferred_contact_time}</strong>` : 'soon'} to discuss your project in detail.</p>
    </div>

    <p style="font-size: 16px; margin-bottom: 20px;">
      In the meantime, feel free to prepare any questions or materials you'd like to share about your project.
    </p>

    <p style="font-size: 16px; margin-bottom: 10px;">Looking forward to working with you!</p>

    <p style="font-size: 16px; color: #6B7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Best regards,<br>
      <strong>The Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Rescheduling Request Email Template
 * Sent when admin needs to reschedule an appointment
 */
export function getRescheduleRequestTemplate(
  appointmentData: AppointmentData,
  reason?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Reschedule Request</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${appointmentData.full_name},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      We need to reschedule your appointment for <strong>${appointmentData.project_type || 'your project'}</strong>.
    </p>

    ${
      reason
        ? `
    <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3B82F6;">
      <p style="margin: 0; font-style: italic;">${reason}</p>
    </div>
    `
        : ''
    }

    <p style="font-size: 16px; margin-bottom: 20px;">
      Could you please reply with your availability for the coming days? We'd like to find a time that works best for you.
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      We apologize for any inconvenience and appreciate your understanding.
    </p>

    <p style="font-size: 16px; margin-bottom: 10px;">Thank you,</p>

    <p style="font-size: 16px; color: #6B7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Best regards,<br>
      <strong>The Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Custom Message Template
 * Flexible template for any custom admin message
 */
export function getCustomMessageTemplate(
  appointmentData: AppointmentData,
  subject: string,
  message: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${subject}</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${appointmentData.full_name},</p>

    <div style="font-size: 16px; margin-bottom: 20px; white-space: pre-wrap;">
      ${message}
    </div>

    <p style="font-size: 16px; color: #6B7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Best regards,<br>
      <strong>The Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Project Update Template
 * Sent to provide project updates to clients
 */
export function getProjectUpdateTemplate(
  appointmentData: AppointmentData,
  updateTitle: string,
  updateDetails: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Project Update 📊</h1>
  </div>

  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${appointmentData.full_name},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      We have an update regarding <strong>${appointmentData.project_type || 'your project'}</strong>.
    </p>

    <div style="background: #F5F3FF; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8B5CF6;">
      <h3 style="margin-top: 0; color: #7C3AED;">${updateTitle}</h3>
      <div style="white-space: pre-wrap;">${updateDetails}</div>
    </div>

    <p style="font-size: 16px; margin-bottom: 20px;">
      If you have any questions or would like to discuss these updates, feel free to reply to this email.
    </p>

    <p style="font-size: 16px; color: #6B7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Best regards,<br>
      <strong>The Team</strong>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Get template by type
 */
export type EmailTemplateType = 'confirmation' | 'reschedule' | 'custom' | 'update';

export function getEmailTemplate(
  type: EmailTemplateType,
  appointmentData: AppointmentData,
  options?: {
    subject?: string;
    message?: string;
    reason?: string;
    updateTitle?: string;
    updateDetails?: string;
  }
): { subject: string; html: string } {
  switch (type) {
    case 'confirmation':
      return {
        subject: `Appointment Confirmed - ${appointmentData.project_type || 'Your Project'}`,
        html: getStatusConfirmationTemplate(appointmentData),
      };
    case 'reschedule':
      return {
        subject: 'Reschedule Request for Your Appointment',
        html: getRescheduleRequestTemplate(appointmentData, options?.reason),
      };
    case 'update':
      return {
        subject: options?.updateTitle || 'Project Update',
        html: getProjectUpdateTemplate(
          appointmentData,
          options?.updateTitle || 'Update',
          options?.updateDetails || ''
        ),
      };
    case 'custom':
    default:
      return {
        subject: options?.subject || 'Message from The Team',
        html: getCustomMessageTemplate(
          appointmentData,
          options?.subject || 'Message from The Team',
          options?.message || ''
        ),
      };
  }
}
