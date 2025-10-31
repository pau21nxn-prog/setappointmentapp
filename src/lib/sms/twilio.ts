/**
 * Twilio SMS Integration (PLACEHOLDER)
 * =============================================================================
 * Send SMS notifications for appointment updates
 * Phase: 4 - Sprint 6
 * =============================================================================
 *
 * TODO: Complete implementation
 * - Install twilio package: npm install twilio
 * - Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
 * - Implement sendAppointmentConfirmationSMS()
 * - Implement sendAppointmentReminderSMS()
 * - Implement sendRescheduleNotificationSMS()
 * - Add server actions in src/app/admin/sms/actions.ts
 * - Create SMS toggle in appointment detail page
 */

export async function sendSMS(to: string, message: string) {
  // TODO: Implement Twilio SMS sending
  console.log(`[SMS PLACEHOLDER] Sending to ${to}: ${message}`);
  return { success: true, sid: 'placeholder' };
}

export async function sendAppointmentConfirmationSMS(
  phone: string,
  appointmentDetails: {
    clientName: string;
    scheduledTime?: string;
  }
) {
  const message = `Hi ${appointmentDetails.clientName}, your appointment request has been received. We'll confirm your time shortly!`;
  return sendSMS(phone, message);
}

export async function sendAppointmentReminderSMS(
  phone: string,
  appointmentDetails: {
    clientName: string;
    scheduledTime: string;
  }
) {
  const message = `Reminder: You have an appointment scheduled for ${new Date(appointmentDetails.scheduledTime).toLocaleString()}. Looking forward to speaking with you!`;
  return sendSMS(phone, message);
}
