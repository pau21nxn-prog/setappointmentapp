import { Appointment } from '@/lib/supabase/appointments';
import { formatDate, formatPhoneNumber } from '@/lib/utils/formatters';

export function generateAdminNotificationEmail(appointment: Appointment): {
  subject: string;
  html: string;
  text: string;
} {
  const formattedDate = formatDate(new Date(appointment.preferred_date));
  const formattedPhone = formatPhoneNumber(appointment.phone);
  const createdAt = formatDate(new Date(appointment.created_at));

  const subject = `New Appointment: ${appointment.full_name} - ${formattedDate}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Appointment Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 700px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🔔 New Appointment Booking
              </h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 14px;">
                ${createdAt} - ${new Date(appointment.created_at).toLocaleTimeString()}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">

              <!-- Client Information -->
              <div style="margin-bottom: 30px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                  Client Information
                </h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px; width: 160px;">
                      <strong>Name:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.full_name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Email:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      <a href="mailto:${appointment.email}" style="color: #3b82f6; text-decoration: none;">
                        ${appointment.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Phone:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      <a href="tel:${appointment.phone}" style="color: #3b82f6; text-decoration: none;">
                        ${formattedPhone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Company:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.company_name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Industry:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.industry}
                    </td>
                  </tr>
                  ${
                    appointment.website_url
                      ? `
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Website:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      <a href="${appointment.website_url}" style="color: #3b82f6; text-decoration: none;" target="_blank">
                        ${appointment.website_url}
                      </a>
                    </td>
                  </tr>
                  `
                      : ''
                  }
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Current Website:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.current_website ? 'Yes' : 'No'}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Scheduling Details -->
              <div style="margin-bottom: 30px; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px; font-weight: 600;">
                  Scheduling Details
                </h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px; width: 160px;">
                      <strong>Preferred Date:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${formattedDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Preferred Time:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.preferred_time}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Timezone:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.timezone}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Project Details -->
              <div style="margin-bottom: 30px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">
                  Project Details
                </h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px; width: 160px;">
                      <strong>Project Type:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.project_type}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Budget Range:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.budget_range}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Timeline:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.timeline}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">
                      <strong>Referral Source:</strong>
                    </td>
                    <td style="padding: 6px 0; color: #374151; font-size: 14px;">
                      ${appointment.referral_source}
                    </td>
                  </tr>
                </table>

                <div style="margin-top: 15px;">
                  <strong style="color: #1f2937; font-size: 14px; display: block; margin-bottom: 8px;">
                    Description:
                  </strong>
                  <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                    ${appointment.project_description}
                  </p>
                </div>

                ${
                  appointment.features && appointment.features.length > 0
                    ? `
                <div style="margin-top: 15px;">
                  <strong style="color: #1f2937; font-size: 14px; display: block; margin-bottom: 8px;">
                    Desired Features:
                  </strong>
                  <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
                    ${appointment.features.map((feature) => `<li>${feature}</li>`).join('\n                    ')}
                  </ul>
                </div>
                `
                    : ''
                }

                ${
                  appointment.additional_notes
                    ? `
                <div style="margin-top: 15px;">
                  <strong style="color: #1f2937; font-size: 14px; display: block; margin-bottom: 8px;">
                    Additional Notes:
                  </strong>
                  <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                    ${appointment.additional_notes}
                  </p>
                </div>
                `
                    : ''
                }
              </div>

              <!-- Metadata -->
              <div style="padding: 15px; background-color: #f9fafb; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Metadata
                </h3>
                <p style="margin: 0; color: #6b7280; font-size: 12px; font-family: monospace;">
                  <strong>Appointment ID:</strong> ${appointment.id}<br>
                  <strong>Status:</strong> ${appointment.status}<br>
                  <strong>Created:</strong> ${new Date(appointment.created_at).toLocaleString()}<br>
                  ${appointment.ip_address ? `<strong>IP Address:</strong> ${appointment.ip_address}<br>` : ''}
                  ${appointment.user_agent ? `<strong>User Agent:</strong> ${appointment.user_agent}` : ''}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f3f4f6; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Automated notification from SetAppointmentApp
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
NEW APPOINTMENT BOOKING
${createdAt} - ${new Date(appointment.created_at).toLocaleTimeString()}

CLIENT INFORMATION:
- Name: ${appointment.full_name}
- Email: ${appointment.email}
- Phone: ${formattedPhone}
- Company: ${appointment.company_name}
- Industry: ${appointment.industry}
${appointment.website_url ? `- Website: ${appointment.website_url}` : ''}
- Current Website: ${appointment.current_website ? 'Yes' : 'No'}

SCHEDULING DETAILS:
- Preferred Date: ${formattedDate}
- Preferred Time: ${appointment.preferred_time}
- Timezone: ${appointment.timezone}

PROJECT DETAILS:
- Project Type: ${appointment.project_type}
- Budget Range: ${appointment.budget_range}
- Timeline: ${appointment.timeline}
- Referral Source: ${appointment.referral_source}

Description:
${appointment.project_description}

${
  appointment.features && appointment.features.length > 0
    ? `
Desired Features:
${appointment.features.map((feature) => `- ${feature}`).join('\n')}
`
    : ''
}

${
  appointment.additional_notes
    ? `
Additional Notes:
${appointment.additional_notes}
`
    : ''
}

METADATA:
- Appointment ID: ${appointment.id}
- Status: ${appointment.status}
- Created: ${new Date(appointment.created_at).toLocaleString()}
${appointment.ip_address ? `- IP Address: ${appointment.ip_address}` : ''}
${appointment.user_agent ? `- User Agent: ${appointment.user_agent}` : ''}

---
Automated notification from SetAppointmentApp
  `.trim();

  return { subject, html, text };
}
