# Phase 3: Backend Integration & Testing (Week 3-4)

> **File**: `.claude/phases/PHASE-3-BACKEND.md`
> **Last Updated**: October 29, 2025
> **Status**: ⏳ UPCOMING

---

## Prerequisites

Before starting this phase, ensure:

- Phase 2 is complete
- Read [API Specifications](../reference/API.md)
- Read [Database Schema](../reference/DATABASE.md)
- Read [Email Templates](../reference/EMAIL.md)
- Read [Testing Strategy](../reference/TESTING.md)

## Related Files

- [Common Tasks](../guides/COMMON-TASKS.md) - API route creation
- [Development Guidelines](../guides/DEVELOPMENT.md) - Error handling patterns

---

## Phase Overview

**Duration**: Week 3-4
**Focus**: Backend API routes, email integration, comprehensive testing (unit, integration, E2E)

**Goals**:

- Create API endpoints for appointment management
- Integrate Resend for email delivery
- Build React Email templates
- Implement error handling and logging
- Write integration tests with MSW
- Implement E2E tests with Playwright

---

## Checklist

### API Routes (`feature/api-endpoints`)

- [ ] Create `/api/appointments/create/route.ts`
- [ ] Create `/api/appointments/validate/route.ts`
- [ ] Implement request validation with Zod
- [ ] Implement error handling
- [ ] Add rate limiting (via Cloudflare)
- [ ] Write API tests

### Email Service (`feature/email-integration`)

- [ ] Set up Resend API client
- [ ] Create confirmation email template
- [ ] Create reminder email template (24hr before)
- [ ] Create admin notification template
- [ ] Implement email sending function
- [ ] Add email logging to database
- [ ] Test email delivery

### Email Templates

- [ ] Create `lib/email/templates/confirmation.tsx`
- [ ] Create `lib/email/templates/reminder.tsx`
- [ ] Create `lib/email/templates/admin-notification.tsx`
- [ ] Add calendar invite (.ics) attachment
- [ ] Style emails with React Email

### Error Handling & Logging

- [ ] Create custom error classes
- [ ] Implement error logging
- [ ] Add user-friendly error messages
- [ ] Create error boundary component
- [ ] Add Sentry integration (optional)

### Integration Testing

- [ ] Write integration tests for booking flow
- [ ] Test API routes with MSW (Mock Service Worker)
- [ ] Test email service
- [ ] Test database operations
- [ ] Test error scenarios

### E2E Testing (`feature/e2e-tests`)

- [ ] Set up Playwright
- [ ] Write E2E test for complete booking flow
- [ ] Write E2E test for form validation
- [ ] Write E2E test for error handling
- [ ] Run E2E tests in CI

---

## Commands

### Install email dependencies

```bash
npm install resend
npm install react-email @react-email/components
```

### Install testing dependencies

```bash
npm install -D msw                    # Mock Service Worker
npm install -D @playwright/test       # E2E testing
```

### Run tests

```bash
npm run test           # Unit tests
npm run test:ci        # CI tests with coverage
npm run test:e2e       # E2E tests
```

---

## Context7 Prompts for Phase 3

- `use context7 for Next.js 14 API Routes with TypeScript`
- `use context7 for Resend email API with React Email templates`
- `use context7 for Playwright E2E testing in Next.js`
- `use context7 for Mock Service Worker integration testing`
- `use context7 for error handling best practices in Next.js API routes`

---

## Key Implementations

### API Route: Create Appointment

See full implementation in [API Specifications](../reference/API.md)

```typescript
// app/api/appointments/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAppointment } from '@/lib/supabase/queries';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email/resend';

const createAppointmentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  // ... other fields
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createAppointmentSchema.parse(body);

    // Create appointment in database
    const appointment = await createAppointment(validated);

    // Send emails
    await sendConfirmationEmail(appointment);
    await sendAdminNotification(appointment);

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Email Sending Function

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
```

### MSW Mock Handlers

```typescript
// src/__tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/appointments/create', async ({ request }) => {
    const body = await request.json();

    // Simulate validation
    if (!body.email) {
      return HttpResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    // Simulate success
    return HttpResponse.json({
      success: true,
      data: {
        id: 'mock-id',
        appointmentDate: '2025-11-01',
        timeSlot: 'morning',
        confirmationEmailSent: true,
      },
    });
  }),
];
```

### Playwright E2E Test

```typescript
// src/__tests__/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Booking Flow', () => {
  test('should complete full booking process', async ({ page }) => {
    await page.goto('/');

    // Click "Book Now" button
    await page.click('text=Book Your Consultation');

    // Fill Step 1: Personal Information
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+1234567890');
    await page.click('text=Next');

    // Fill Step 2: Business Details
    await page.fill('[name="businessNature"]', 'E-commerce business selling products');
    await page.selectOption('[name="systemRequest"]', 'Web Application Development');
    await page.selectOption('[name="videoPlatform"]', 'zoom');
    await page.click('text=Next');

    // Fill Step 3: Schedule Selection
    await page.fill('[name="appointmentDate"]', '2025-11-01');
    await page.click('text=Morning');
    await page.click('text=Submit');

    // Verify success message
    await expect(page.locator('text=Appointment Confirmed')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Book Your Consultation');

    // Try to proceed without filling fields
    await page.click('text=Next');

    // Check for validation errors
    await expect(page.locator('text=First name must be at least 2 characters')).toBeVisible();
  });
});
```

---

## Testing Strategy

### Unit Tests

- Test individual components
- Test utility functions
- Test validation schemas
- Target: 80% coverage

### Integration Tests

- Test API routes with MSW
- Test database operations
- Test email sending
- Test error scenarios

### E2E Tests

- Test complete booking flow
- Test form validation
- Test error handling
- Test responsive design

---

## Success Criteria

Phase 3 is complete when:

- ✅ All API endpoints work correctly
- ✅ Emails send successfully (confirmation + admin notification)
- ✅ Database operations handle errors gracefully
- ✅ Integration tests pass with mocked dependencies
- ✅ E2E tests pass in all browsers (Chrome, Firefox, Safari)
- ✅ Error handling provides user-friendly messages
- ✅ Test coverage is >80%
- ✅ All tests pass in CI pipeline

---

## Next Phase

Once Phase 3 is complete, proceed to:

- [Phase 4: Polish, Optimization & Cloudflare](./PHASE-4-OPTIMIZATION.md)

---

[Return to Main Index](../CLAUDE.md)
