import { Resend } from 'resend';
import { createServerClient } from '@/lib/supabase/server';
import { render } from '@react-email/render';
import * as React from 'react';

// Initialize Resend with API key (or dummy key for build time)
const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder_key_for_build';
const resend = new Resend(resendApiKey);

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend and log to database
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, text, react, replyTo } = params;
  const fromEmail = process.env.EMAIL_FROM || 'noreply@setappointmentapp.com';

  // Check if Resend is properly configured
  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === 're_placeholder_key_for_build'
  ) {
    console.warn('Resend API key not configured. Skipping email send.');
    await logEmail({
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      status: 'failed',
      error_message: 'Resend API key not configured',
    });
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    // Render React component to HTML if provided
    let emailHtml = html;
    let emailText = text;

    if (react) {
      emailHtml = await render(react);
      emailText = emailText || (await render(react, { plainText: true }));
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: emailHtml as string,
      text: emailText,
      replyTo: replyTo || fromEmail,
    });

    if (error) {
      console.error('Resend error:', error);
      await logEmail({
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        status: 'failed',
        error_message: error.message || 'Unknown error',
      });

      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    // Log successful email
    await logEmail({
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      status: 'sent',
      message_id: data?.id,
    });

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Unexpected error sending email:', error);

    await logEmail({
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Log email to database
 */
async function logEmail(params: {
  to: string;
  subject: string;
  status: 'sent' | 'failed';
  message_id?: string;
  error_message?: string;
}): Promise<void> {
  try {
    const supabase = createServerClient();

    const { error } = await supabase.from('email_logs').insert({
      recipient: params.to,
      subject: params.subject,
      status: params.status,
      message_id: params.message_id || null,
      error_message: params.error_message || null,
      sent_at: params.status === 'sent' ? new Date().toISOString() : null,
    });

    if (error) {
      console.error('Error logging email:', error);
    }
  } catch (error) {
    console.error('Unexpected error logging email:', error);
  }
}

/**
 * Send multiple emails in parallel
 */
export async function sendBulkEmails(emails: SendEmailParams[]): Promise<SendEmailResult[]> {
  return Promise.all(emails.map((email) => sendEmail(email)));
}
