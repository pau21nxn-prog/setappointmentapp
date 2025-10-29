import { Appointment } from '@/lib/supabase/appointments';
import { formatDate } from '@/lib/utils/formatters';

export function generateClientConfirmationEmail(appointment: Appointment): {
  subject: string;
  html: string;
  text: string;
} {
  const formattedDate = formatDate(new Date(appointment.preferred_date));

  const subject = `Appointment Confirmed - ${formattedDate} at ${appointment.preferred_time}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Appointment Confirmed!
              </h1>
              <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">
                We're excited to discuss your project
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                Dear ${appointment.full_name},
              </p>

              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for booking a consultation with us! We've received your appointment request and are looking forward to discussing your <strong>${appointment.project_type}</strong> project.
              </p>

              <!-- Appointment Details Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">
                      Appointment Details
                    </h2>

                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">
                          <strong>Date:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                          ${formattedDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Time:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                          ${appointment.preferred_time} (${appointment.timezone})
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Project Type:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                          ${appointment.project_type}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Budget Range:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                          ${appointment.budget_range}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Reference ID:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                          ${appointment.id.substring(0, 8).toUpperCase()}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What to Expect -->
              <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">
                What to Expect
              </h3>
              <ul style="margin: 0 0 30px 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Our consultation typically lasts 30-45 minutes</li>
                <li style="margin-bottom: 8px;">We'll discuss your project requirements in detail</li>
                <li style="margin-bottom: 8px;">You'll receive initial recommendations and next steps</li>
                <li style="margin-bottom: 8px;">We'll answer all your questions about our services</li>
              </ul>

              <!-- Call to Action -->
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 14px; line-height: 1.6;">
                Need to reschedule or have questions before our call? Simply reply to this email or contact us at:
              </p>

              <p style="margin: 0 0 30px 0; color: #374151; font-size: 14px;">
                <strong>Email:</strong> hello@setappointmentapp.com<br>
                <strong>Phone:</strong> (123) 456-7890
              </p>

              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
                Looking forward to speaking with you soon!
              </p>

              <p style="margin: 20px 0 0 0; color: #374151; font-size: 14px;">
                Best regards,<br>
                <strong>The SetAppointmentApp Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                This is an automated confirmation email for your appointment booking.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} SetAppointmentApp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Appointment Confirmed!

Dear ${appointment.full_name},

Thank you for booking a consultation with us! We've received your appointment request and are looking forward to discussing your ${appointment.project_type} project.

APPOINTMENT DETAILS:
- Date: ${formattedDate}
- Time: ${appointment.preferred_time} (${appointment.timezone})
- Project Type: ${appointment.project_type}
- Budget Range: ${appointment.budget_range}
- Reference ID: ${appointment.id.substring(0, 8).toUpperCase()}

WHAT TO EXPECT:
- Our consultation typically lasts 30-45 minutes
- We'll discuss your project requirements in detail
- You'll receive initial recommendations and next steps
- We'll answer all your questions about our services

Need to reschedule or have questions before our call? Contact us at:
Email: hello@setappointmentapp.com
Phone: (123) 456-7890

Looking forward to speaking with you soon!

Best regards,
The SetAppointmentApp Team

---
This is an automated confirmation email for your appointment booking.
© ${new Date().getFullYear()} SetAppointmentApp. All rights reserved.
  `.trim();

  return { subject, html, text };
}
