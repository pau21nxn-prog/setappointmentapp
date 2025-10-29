# API Specifications

> **File**: `.claude/reference/API.md`
> **Last Updated**: October 29, 2025

---

## POST /api/appointments/create

Creates a new appointment and sends confirmation email.

### Request Body

```typescript
{
  firstName: string;
  lastName: string;
  email: string;  // Valid email format
  phone: string;  // E.164 format recommended
  companyName?: string;
  businessNature: string;
  systemRequest: string;
  customRequest?: string;
  videoPlatform: 'zoom' | 'teams' | 'meet' | 'skype' | 'webex' | 'gotomeeting';
  budgetRange?: string;
  appointmentDate: string;  // ISO 8601 date
  timeSlot: 'morning' | 'afternoon' | 'evening';
  timezone: string;  // IANA timezone (e.g., 'America/New_York')
  additionalNotes?: string;
}
```

### Response (Success - 200)

```typescript
{
  success: true;
  data: {
    id: string;
    appointmentDate: string;
    timeSlot: string;
    confirmationEmailSent: boolean;
  }
}
```

### Response (Error - 400)

```typescript
{
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
```

### Response (Error - 500)

```typescript
{
  error: 'Internal server error';
}
```

---

## Implementation Example

```typescript
// app/api/appointments/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAppointment } from '@/lib/supabase/queries';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email/resend';
import { logEmail } from '@/lib/supabase/queries';

const createAppointmentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  companyName: z.string().optional(),
  businessNature: z.string().min(10),
  systemRequest: z.string().min(1),
  customRequest: z.string().optional(),
  videoPlatform: z.enum(['zoom', 'teams', 'meet', 'skype', 'webex', 'gotomeeting']),
  budgetRange: z.string().optional(),
  appointmentDate: z.string().datetime(),
  timeSlot: z.enum(['morning', 'afternoon', 'evening']),
  timezone: z.string(),
  additionalNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createAppointmentSchema.parse(body);

    // Create appointment in database
    const appointment = await createAppointment({
      first_name: validated.firstName,
      last_name: validated.lastName,
      email: validated.email,
      phone: validated.phone,
      company_name: validated.companyName,
      business_nature: validated.businessNature,
      system_request: validated.systemRequest,
      custom_request: validated.customRequest,
      video_platform: validated.videoPlatform,
      budget_range: validated.budgetRange,
      appointment_date: validated.appointmentDate,
      time_slot: validated.timeSlot,
      timezone: validated.timezone,
      additional_notes: validated.additionalNotes,
      status: 'scheduled',
    });

    // Send confirmation email to client
    let emailSent = false;
    try {
      await sendConfirmationEmail(appointment);
      await logEmail(appointment.id, 'confirmation', 'sent');
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      await logEmail(appointment.id, 'confirmation', 'failed', String(emailError));
    }

    // Send notification to admin
    try {
      await sendAdminNotification(appointment);
      await logEmail(appointment.id, 'admin_notification', 'sent');
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      await logEmail(appointment.id, 'admin_notification', 'failed', String(emailError));
    }

    return NextResponse.json({
      success: true,
      data: {
        id: appointment.id,
        appointmentDate: appointment.appointment_date,
        timeSlot: appointment.time_slot,
        confirmationEmailSent: emailSent,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

**Context7**: `use context7 for Next.js 14 API Routes best practices with error handling`

[Return to Main Index](../CLAUDE.md)
