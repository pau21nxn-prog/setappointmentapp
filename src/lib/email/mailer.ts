import nodemailer from 'nodemailer';
import { createServerClient } from '@/lib/supabase/server';
import { render } from '@react-email/render';
import * as React from 'react';

// Gmail OAuth2 Configuration
const gmailUser = process.env.GMAIL_USER || '';
const gmailClientId = process.env.GMAIL_CLIENT_ID || '';
const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET || '';
const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN || '';
const gmailAccessToken = process.env.GMAIL_ACCESS_TOKEN || '';

// Create Nodemailer transporter with Gmail OAuth2
const createTransporter = () => {
  // For build time, return a dummy transporter
  if (!gmailUser || !gmailClientId || !gmailClientSecret || !gmailRefreshToken) {
    console.warn('Gmail OAuth2 credentials not fully configured');
    return null;
  }

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: gmailUser,
      clientId: gmailClientId,
      clientSecret: gmailClientSecret,
      refreshToken: gmailRefreshToken,
      accessToken: gmailAccessToken || undefined,
    },
  });
};

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
 * Send an email using Gmail via Nodemailer and log to database
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, text, react, replyTo } = params;
  const fromEmail = process.env.EMAIL_FROM || gmailUser || 'noreply@gmail.com';

  // Create transporter
  const transporter = createTransporter();

  // Check if Gmail is properly configured
  if (!transporter) {
    console.warn('Gmail OAuth2 not configured. Skipping email send.');
    await logEmail({
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      status: 'failed',
      error_message: 'Gmail OAuth2 credentials not configured',
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

    // Send email via Gmail using Nodemailer
    const info = await transporter.sendMail({
      from: fromEmail,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html: emailHtml,
      text: emailText,
      replyTo: replyTo || fromEmail,
    });

    // Log successful email
    await logEmail({
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      status: 'sent',
      message_id: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Gmail sending error:', error);

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
