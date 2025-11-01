import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Link } from '@react-email/components';
import { Appointment } from '@/lib/supabase/appointments';
import { formatDate, formatPhoneNumber } from '@/lib/utils/formatters';

function AdminNotificationEmail({ appointment }: { appointment: Appointment }) {
  const formattedDate = formatDate(new Date(appointment.preferred_date));
  const formattedPhone = formatPhoneNumber(appointment.phone);
  const createdAt = formatDate(new Date(appointment.created_at));
  const createdTime = new Date(appointment.created_at).toLocaleTimeString();

  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>🔔 New Appointment Booking</Heading>
            <Text style={styles.headerSubtitle}>
              {createdAt} - {createdTime}
            </Text>
          </Section>

          <Section style={styles.content}>
            <Section style={styles.sectionBlue}>
              <Heading as="h2" style={styles.sectionTitleBlue}>
                Client Information
              </Heading>
              <table style={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Name:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.full_name}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Email:</strong>
                    </td>
                    <td style={styles.detailValue}>
                      <Link href={`mailto:${appointment.email}`} style={styles.link}>
                        {appointment.email}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Phone:</strong>
                    </td>
                    <td style={styles.detailValue}>
                      <Link href={`tel:${appointment.phone}`} style={styles.link}>
                        {formattedPhone}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Company:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.company_name}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Industry:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.industry}</td>
                  </tr>
                  {appointment.website_url && (
                    <tr>
                      <td style={styles.detailLabel}>
                        <strong>Website:</strong>
                      </td>
                      <td style={styles.detailValue}>
                        <Link href={appointment.website_url} style={styles.link} target="_blank">
                          {appointment.website_url}
                        </Link>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Current Website:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.current_website ? 'Yes' : 'No'}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={styles.sectionGreen}>
              <Heading as="h2" style={styles.sectionTitleGreen}>
                Scheduling Details
              </Heading>
              <table style={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Preferred Date:</strong>
                    </td>
                    <td style={styles.detailValue}>{formattedDate}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Preferred Time:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.preferred_time}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Timezone:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.timezone}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={styles.sectionYellow}>
              <Heading as="h2" style={styles.sectionTitleYellow}>
                Project Details
              </Heading>
              <table style={styles.detailsTable}>
                <tbody>
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
                      <strong>Timeline:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.timeline}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>
                      <strong>Referral Source:</strong>
                    </td>
                    <td style={styles.detailValue}>{appointment.referral_source}</td>
                  </tr>
                </tbody>
              </table>

              <Section style={styles.subsection}>
                <Text style={styles.subsectionLabel}>
                  <strong>Description:</strong>
                </Text>
                <Text style={styles.descriptionText}>{appointment.project_description}</Text>
              </Section>

              {appointment.features && appointment.features.length > 0 && (
                <Section style={styles.subsection}>
                  <Text style={styles.subsectionLabel}>
                    <strong>Desired Features:</strong>
                  </Text>
                  <ul style={styles.featuresList}>
                    {appointment.features.map((feature, index) => (
                      <li key={index} style={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {appointment.additional_notes && (
                <Section style={styles.subsection}>
                  <Text style={styles.subsectionLabel}>
                    <strong>Additional Notes:</strong>
                  </Text>
                  <Text style={styles.descriptionText}>{appointment.additional_notes}</Text>
                </Section>
              )}
            </Section>

            <Section style={styles.metadata}>
              <Heading as="h3" style={styles.metadataTitle}>
                METADATA
              </Heading>
              <Text style={styles.metadataText}>
                <strong>Appointment ID:</strong> {appointment.id}
                <br />
                <strong>Status:</strong> {appointment.status}
                <br />
                <strong>Created:</strong> {new Date(appointment.created_at).toLocaleString()}
                <br />
                {appointment.ip_address && (
                  <>
                    <strong>IP Address:</strong> {appointment.ip_address}
                    <br />
                  </>
                )}
                {appointment.user_agent && (
                  <>
                    <strong>User Agent:</strong> {appointment.user_agent}
                  </>
                )}
              </Text>
            </Section>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>Automated notification from SetAppointmentApp</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function generateAdminNotificationEmail(appointment: Appointment): {
  subject: string;
  react: React.ReactElement;
} {
  const formattedDate = formatDate(new Date(appointment.preferred_date));
  const subject = `New Appointment: ${appointment.full_name} - ${formattedDate}`;

  return {
    subject,
    react: React.createElement(AdminNotificationEmail, { appointment }),
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
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    padding: '30px',
    textAlign: 'center' as const,
  },
  headerTitle: {
    margin: '0',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    margin: '10px 0 0 0',
    color: '#dbeafe',
    fontSize: '14px',
  },
  content: {
    padding: '30px',
  },
  sectionBlue: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '4px',
  },
  sectionTitleBlue: {
    margin: '0 0 15px 0',
    color: '#1e40af',
    fontSize: '18px',
    fontWeight: '600',
  },
  sectionGreen: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f0fdf4',
    borderLeft: '4px solid #10b981',
    borderRadius: '4px',
  },
  sectionTitleGreen: {
    margin: '0 0 15px 0',
    color: '#065f46',
    fontSize: '18px',
    fontWeight: '600',
  },
  sectionYellow: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #f59e0b',
    borderRadius: '4px',
  },
  sectionTitleYellow: {
    margin: '0 0 15px 0',
    color: '#92400e',
    fontSize: '18px',
    fontWeight: '600',
  },
  detailsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  detailLabel: {
    padding: '6px 0',
    color: '#1f2937',
    fontSize: '14px',
    width: '160px',
    verticalAlign: 'top',
  },
  detailValue: {
    padding: '6px 0',
    color: '#374151',
    fontSize: '14px',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  subsection: {
    marginTop: '15px',
  },
  subsectionLabel: {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  descriptionText: {
    margin: '0',
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap' as const,
  },
  featuresList: {
    margin: '0',
    paddingLeft: '20px',
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  featureItem: {
    marginBottom: '4px',
  },
  metadata: {
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  },
  metadataTitle: {
    margin: '0 0 10px 0',
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  metadataText: {
    margin: '0',
    color: '#6b7280',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  footer: {
    padding: '20px',
    backgroundColor: '#f3f4f6',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center' as const,
  },
  footerText: {
    margin: '0',
    color: '#6b7280',
    fontSize: '12px',
  },
};
