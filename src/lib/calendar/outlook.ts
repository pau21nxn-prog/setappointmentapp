/**
 * Microsoft Outlook Calendar Integration
 * =============================================================================
 * OAuth 2.0 + Microsoft Graph API for syncing appointments to Outlook Calendar
 * Phase: 4 - Sprint 4
 * =============================================================================
 */

import { Client } from '@microsoft/microsoft-graph-client';
import type { Event } from '@microsoft/microsoft-graph-types';
import { convertUTCOffsetToIANA } from '@/lib/utils/timezone';

/**
 * Microsoft OAuth Configuration
 */
export function getMicrosoftAuthUrl(): string {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  const redirectUri = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/outlook/callback`
    : 'http://localhost:3000/api/calendar/outlook/callback';

  if (!clientId) {
    throw new Error('Microsoft OAuth credentials not configured');
  }

  const scopes = encodeURIComponent('Calendars.ReadWrite offline_access openid email');

  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_mode=query`;
}

/**
 * Exchange authorization code for tokens
 */
export async function getMicrosoftTokensFromCode(code: string) {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  const redirectUri = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/outlook/callback`
    : 'http://localhost:3000/api/calendar/outlook/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Microsoft OAuth credentials not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

/**
 * Create Graph API client
 */
function createGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

/**
 * Create Outlook Calendar event
 */
export async function createOutlookCalendarEvent(
  accessToken: string,
  event: {
    summary: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    attendeeEmail?: string;
    location?: string;
    timezone?: string; // UTC offset format (e.g., "UTC +8 (Manila)")
  }
) {
  const client = createGraphClient(accessToken);

  // Convert UTC offset format to IANA timezone if provided
  const ianaTimezone = event.timezone ? convertUTCOffsetToIANA(event.timezone) : 'UTC';

  const calendarEvent: Event = {
    subject: event.summary,
    body: {
      contentType: 'text',
      content: event.description,
    },
    start: {
      dateTime: event.startDateTime,
      timeZone: ianaTimezone,
    },
    end: {
      dateTime: event.endDateTime,
      timeZone: ianaTimezone,
    },
    location: event.location
      ? {
          displayName: event.location,
        }
      : undefined,
    attendees: event.attendeeEmail
      ? [
          {
            emailAddress: {
              address: event.attendeeEmail,
            },
            type: 'required',
          },
        ]
      : [],
  };

  const result = await client.api('/me/events').post(calendarEvent);

  return result;
}

/**
 * Update Outlook Calendar event
 */
export async function updateOutlookCalendarEvent(
  accessToken: string,
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    startDateTime?: string;
    endDateTime?: string;
    attendeeEmail?: string;
    location?: string;
    timezone?: string; // UTC offset format (e.g., "UTC +8 (Manila)")
  }
) {
  const client = createGraphClient(accessToken);

  // Convert UTC offset format to IANA timezone if provided
  const ianaTimezone = updates.timezone ? convertUTCOffsetToIANA(updates.timezone) : 'UTC';

  const event: Partial<Event> = {};
  if (updates.summary) event.subject = updates.summary;
  if (updates.description) {
    event.body = {
      contentType: 'text',
      content: updates.description,
    };
  }
  if (updates.startDateTime) {
    event.start = {
      dateTime: updates.startDateTime,
      timeZone: ianaTimezone,
    };
  }
  if (updates.endDateTime) {
    event.end = {
      dateTime: updates.endDateTime,
      timeZone: ianaTimezone,
    };
  }
  if (updates.location) {
    event.location = {
      displayName: updates.location,
    };
  }
  if (updates.attendeeEmail) {
    event.attendees = [
      {
        emailAddress: {
          address: updates.attendeeEmail,
        },
        type: 'required',
      },
    ];
  }

  const result = await client.api(`/me/events/${eventId}`).patch(event);

  return result;
}

/**
 * Delete Outlook Calendar event
 */
export async function deleteOutlookCalendarEvent(accessToken: string, eventId: string) {
  const client = createGraphClient(accessToken);
  await client.api(`/me/events/${eventId}`).delete();
}

/**
 * Refresh Microsoft access token
 */
export async function refreshMicrosoftAccessToken(refreshToken: string) {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';

  if (!clientId || !clientSecret) {
    throw new Error('Microsoft OAuth credentials not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}
