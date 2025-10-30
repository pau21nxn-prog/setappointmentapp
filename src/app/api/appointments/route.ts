import { NextRequest, NextResponse } from 'next/server';
import { bookingFormSchema } from '@/lib/validation/bookingSchema';
import { createAppointment, checkDuplicateAppointment } from '@/lib/supabase/appointments';
import { ZodError } from 'zod';
import { sendBulkEmails } from '@/lib/email/resend';
import { generateClientConfirmationEmail } from '@/lib/email/templates/clientConfirmation';
import { generateAdminNotificationEmail } from '@/lib/email/templates/adminNotification';

/**
 * POST /api/appointments
 * Create a new appointment booking
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

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

    // Check for duplicate appointments
    const { isDuplicate, error: duplicateError } = await checkDuplicateAppointment(
      validatedData.email,
      validatedData.preferred_date
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

    // Create appointment
    const { data: appointment, error: createError } = await createAppointment({
      ...validatedData,
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
    const adminEmailAddress = process.env.ADMIN_EMAIL || 'admin@setappointmentapp.com';

    // Send emails in parallel (non-blocking - don't fail if emails fail)
    sendBulkEmails([
      {
        to: appointment.email,
        ...clientEmail,
      },
      {
        to: adminEmailAddress,
        ...adminEmail,
        replyTo: appointment.email,
      },
    ]).catch((error) => {
      // Log error but don't fail the request
      console.error('Error sending emails:', error);
    });

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
