# Email Templates & Configuration

> **File**: `.claude/reference/EMAIL.md`
> **Last Updated**: October 29, 2025

---

## Email Service Setup

### Resend Configuration

```typescript
// lib/email/resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
```

---

## 1. Confirmation Email Template

**Location**: `lib/email/templates/confirmation.tsx`

```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface ConfirmationEmailProps {
  firstName: string;
  appointmentDate: string;
  timeSlot: string;
  videoPlatform: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  firstName,
  appointmentDate,
  timeSlot,
  videoPlatform,
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={heading}>Appointment Confirmed!</Text>
            <Text style={paragraph}>Hi {firstName},</Text>
            <Text style={paragraph}>
              Thank you for booking a consultation with us.
            </Text>
            <Hr style={hr} />
            <Text style={subheading}>Appointment Details</Text>
            <Text style={detail}><strong>Date:</strong> {appointmentDate}</Text>
            <Text style={detail}><strong>Time:</strong> {timeSlot}</Text>
            <Text style={detail}><strong>Platform:</strong> {videoPlatform}</Text>
            <Hr style={hr} />
            <Text style={paragraph}>
              We'll send you a reminder 24 hours before your appointment.
            </Text>
            <Text style={footer}>
              Best regards,<br />
              [Company Name] Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const heading = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#10B981',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#333',
};

const hr = {
  borderTop: '1px solid #e6e6e6',
  margin: '20px 0',
};
```

---

## 2. Reminder Email Template

**Location**: `lib/email/templates/reminder.tsx`

Similar structure to confirmation, includes:

- Reminder that appointment is tomorrow
- Video call link
- Preparation checklist
- Rescheduling option

---

## 3. Admin Notification Template

**Location**: `lib/email/templates/admin-notification.tsx`

Includes:

- Full client details
- Business nature and requirements
- Scheduled time
- Direct link to contact client

---

## Email Sending Functions

```typescript
// lib/email/resend.ts
import { Resend } from 'resend';
import { ConfirmationEmail } from './templates/confirmation';
import type { Appointment } from '@/types/appointment';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(appointment: Appointment) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'appointments@yourdomain.com',
      to: appointment.email,
      subject: 'Appointment Confirmed - [Company Name]',
      react: ConfirmationEmail({
        firstName: appointment.first_name,
        appointmentDate: appointment.appointment_date,
        timeSlot: appointment.time_slot,
        videoPlatform: appointment.video_platform,
      }),
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendReminderEmail(appointment: Appointment, videoLink: string) {
  // Implementation
}

export async function sendAdminNotification(appointment: Appointment) {
  // Implementation
}
```

---

**Context7**: `use context7 for Resend API with React Email templates`

[Return to Main Index](../CLAUDE.md)
