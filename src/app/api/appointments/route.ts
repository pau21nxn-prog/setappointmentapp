import { NextRequest, NextResponse } from 'next/server';
import { bookingFormSchema } from '@/lib/validation/bookingSchema';
import { createAppointment, checkDuplicateAppointment } from '@/lib/supabase/appointments';
import { ZodError } from 'zod';
import { sendBulkEmails } from '@/lib/email/resend';
import { generateClientConfirmationEmail } from '@/lib/email/templates/clientConfirmation';
import { generateAdminNotificationEmail } from '@/lib/email/templates/adminNotification';
import {
  sanitizeBookingFormData,
  containsSqlInjection,
  containsXss,
} from '@/lib/security/sanitize';

/**
 * POST /api/appointments
 * Create a new appointment booking
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Honeypot spam detection
    // If the 'website' field is filled, it's likely a bot
    if (body.website && body.website.trim() !== '') {
      // Log spam attempt (optional)
      console.warn('Honeypot triggered - potential spam submission blocked', {
        ip:
          request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip'),
        timestamp: new Date().toISOString(),
      });

      // Return success to the bot (don't let them know they were caught)
      // This prevents them from adjusting their spam tactics
      return NextResponse.json(
        {
          success: true,
          message: 'Booking received successfully',
          data: {
            id: 'spam-blocked',
            email: body.email || 'unknown',
          },
        },
        { status: 200 }
      );
    }

    // Validate request body against schema
    let validatedData;
    try {
      validatedData = bookingFormSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.issues.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Additional security: Check for SQL injection and XSS attempts
    const suspiciousFields = Object.entries(validatedData).filter(([_key, value]) => {
      if (typeof value === 'string') {
        return containsSqlInjection(value) || containsXss(value);
      }
      return false;
    });

    if (suspiciousFields.length > 0) {
      console.warn('Security: Suspicious input detected', {
        fields: suspiciousFields.map(([key]) => key),
        ip:
          request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip'),
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input detected',
          message:
            'Your submission contains invalid characters. Please review your input and try again.',
        },
        { status: 400 }
      );
    }

    // Sanitize all input data before processing
    const sanitizedData = sanitizeBookingFormData(validatedData) as typeof validatedData;

    // Check for duplicate appointments
    const { isDuplicate, error: duplicateError } = await checkDuplicateAppointment(
      sanitizedData.email as string,
      sanitizedData.preferred_date as string
    );

    if (duplicateError) {
      console.error('Error checking duplicate:', duplicateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to validate appointment',
        },
        { status: 500 }
      );
    }

    if (isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate booking',
          message:
            'You already have a pending appointment for this date. Please check your email or contact us for assistance.',
        },
        { status: 409 }
      );
    }

    // Extract request metadata
    const ip_address =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      undefined;
    const user_agent = request.headers.get('user-agent') || undefined;

    // Create appointment with sanitized data
    const { data: appointment, error: createError } = await createAppointment({
      ...sanitizedData,
      ip_address,
      user_agent,
    });

    if (createError || !appointment) {
      console.error('Error creating appointment:', createError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create appointment',
          message:
            'We encountered an error while booking your appointment. Please try again or contact us directly.',
        },
        { status: 500 }
      );
    }

    // Send confirmation emails (client + admin)
    const clientEmail = generateClientConfirmationEmail(appointment);
    const adminEmail = generateAdminNotificationEmail(appointment);
    const adminEmailAddress = process.env.EMAIL_ADMIN || 'admin@setappointmentapp.com';

    console.log('📧 Sending appointment confirmation emails:', {
      client: appointment.email,
      admin: adminEmailAddress,
      appointmentId: appointment.id,
    });

    // Send emails and await completion (critical for serverless functions)
    try {
      const results = await sendBulkEmails([
        {
          to: appointment.email,
          ...clientEmail,
        },
        {
          to: adminEmailAddress,
          ...adminEmail,
          replyTo: appointment.email,
        },
      ]);
      console.log('✅ Emails sent successfully:', {
        clientSuccess: results[0]?.success,
        adminSuccess: results[1]?.success,
        clientMessageId: results[0]?.messageId,
        adminMessageId: results[1]?.messageId,
      });
    } catch (error) {
      // Log error but don't fail the booking request
      console.error('❌ Error sending emails:', error);
    }

    // Return success response with appointment ID
    return NextResponse.json(
      {
        success: true,
        message: 'Appointment booked successfully',
        data: {
          id: appointment.id,
          email: appointment.email,
          preferred_date: appointment.preferred_date,
          preferred_time: appointment.preferred_time,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/appointments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}
