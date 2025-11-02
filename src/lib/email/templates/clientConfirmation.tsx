import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading } from '@react-email/components';
import { Appointment } from '@/lib/supabase/appointments';
import { formatDate } from '@/lib/utils/formatters';

function ClientConfirmationEmail({ appointment }: { appointment: Appointment }) {
  const formattedDate = formatDate(new Date(appointment.preferred_date));
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>Appointment Confirmed!</Heading>
            <Text style={styles.headerSubtitle}>We are excited to discuss your project</Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.greeting}>Dear {appointment.full_name},</Text>
            <Text style={styles.paragraph}>
              Thank you for booking a consultation with us! We have received your appointment
              request and are looking forward to discussing your{' '}
              <strong>{appointment.project_type}</strong> project.
            </Text>

            <Section style={styles.detailsBox}>
              <Heading as="h2" style={styles.detailsTitle}>
                Appointment Details
              </Heading>
              <table style={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Date:</strong>
                    </td>
                    <td style={styles.detailValue}>{formattedDate}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Time:</strong>
                    </td>
                    <td style={styles.detailValue}>
                      {appointment.preferred_time} ({appointment.timezone})
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Project Type:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.project_type}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Budget Range:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.budget_range}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Reference ID:</strong>
                    </td>
                    <td style={styles.detailValueMono}>
                      {appointment.id.substring(0, 8).toUpperCase()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Heading as="h3" style={styles.sectionTitle}>
              What to Expect
            </Heading>
            <ul style={styles.list}>
              <li style={styles.listItem}>Our consultation typically lasts 30-45 minutes</li>
              <li style={styles.listItem}>We will discuss your project requirements in detail</li>
              <li style={styles.listItem}>
                You will receive initial recommendations and next steps
              </li>
              <li style={styles.listItem}>We will answer all your questions about our services</li>
            </ul>

            <Text style={styles.paragraphSmall}>
              Need to reschedule or have questions before our call? Simply reply to this email or
              contact us at:
            </Text>
            <Text style={styles.contactInfo}>
              <strong>Email:</strong> hello@setappointmentapp.com
            </Text>
            <Text style={styles.paragraphSmall}>Looking forward to speaking with you soon!</Text>
            <Text style={styles.signature}>
              Best regards,
              <br />
              <strong>The SetAppointmentApp Team</strong>
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This is an automated confirmation email for your appointment booking.
            </Text>
            <Text style={styles.footerCopyright}>
              © {currentYear} SetAppointmentApp. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function generateClientConfirmationEmail(appointment: Appointment): {
  subject: string;
  react: React.ReactElement;
} {
  const formattedDate = formatDate(new Date(appointment.preferred_date));
  const subject = `Appointment Confirmed - ${formattedDate} at ${appointment.preferred_time}`;

  return {
    subject,
    react: React.createElement(ClientConfirmationEmail, { appointment }),
  };
}

const styles = {
  body: {
    margin: '0',
    padding: '0',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#f3f4f6',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    padding: '40px 30px',
    textAlign: 'center' as const,
  },
  headerTitle: { margin: '0', color: '#ffffff', fontSize: '28px', fontWeight: 'bold' },
  headerSubtitle: { margin: '10px 0 0 0', color: '#d1fae5', fontSize: '16px' },
  content: { padding: '40px 30px' },
  greeting: { margin: '0 0 20px 0', color: '#374151', fontSize: '16px', lineHeight: '1.5' },
  paragraph: { margin: '0 0 30px 0', color: '#374151', fontSize: '16px', lineHeight: '1.6' },
  detailsBox: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '30px',
  },
  detailsTitle: { margin: '0 0 20px 0', color: '#111827', fontSize: '18px', fontWeight: '600' },
  detailsTable: { width: '100%', borderCollapse: 'collapse' as const },
  detailLabel: { padding: '8px 0', color: '#6b7280', fontSize: '14px', width: '140px' },
  detailValue: { padding: '8px 0', color: '#111827', fontSize: '14px' },
  detailValueMono: {
    padding: '8px 0',
    color: '#111827',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  sectionTitle: { margin: '0 0 15px 0', color: '#111827', fontSize: '16px', fontWeight: '600' },
  list: {
    margin: '0 0 30px 0',
    paddingLeft: '20px',
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  listItem: { marginBottom: '8px' },
  paragraphSmall: { margin: '0 0 20px 0', color: '#374151', fontSize: '14px', lineHeight: '1.6' },
  contactInfo: { margin: '0 0 30px 0', color: '#374151', fontSize: '14px' },
  signature: { margin: '20px 0 0 0', color: '#374151', fontSize: '14px' },
  footer: {
    padding: '30px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center' as const,
  },
  footerText: { margin: '0 0 10px 0', color: '#6b7280', fontSize: '12px' },
  footerCopyright: { margin: '0', color: '#9ca3af', fontSize: '11px' },
};
