'use client';

/**
 * Calendar Sync Button Component
 * =============================================================================
 * Button to sync appointment to Google/Outlook Calendar
 * Phase: 4 - Sprint 4
 * =============================================================================
 */

import { useState } from 'react';
import {
  syncAppointmentToGoogle,
  removeAppointmentFromGoogle,
  syncAppointmentToOutlook,
  removeAppointmentFromOutlook,
} from '@/app/admin/calendar/actions';

interface CalendarSyncButtonProps {
  appointmentId: string;
  adminEmail: string;
  googleEventId?: string | null;
  outlookEventId?: string | null;
}

export function CalendarSyncButton({
  appointmentId,
  adminEmail,
  googleEventId,
  outlookEventId,
}: CalendarSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeProvider, setActiveProvider] = useState<'google' | 'outlook'>('google');

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    setMessage(null);

    try {
      const result = await syncAppointmentToGoogle(appointmentId, adminEmail);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Synced successfully' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to sync' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unexpected error occurred' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncOutlook = async () => {
    setIsSyncing(true);
    setMessage(null);

    try {
      const result = await syncAppointmentToOutlook(appointmentId, adminEmail);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Synced successfully' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to sync' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unexpected error occurred' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveGoogle = async () => {
    if (!confirm('Remove this appointment from Google Calendar?')) {
      return;
    }

    setIsSyncing(true);
    setMessage(null);

    try {
      const result = await removeAppointmentFromGoogle(appointmentId, adminEmail);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Removed successfully' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to remove' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unexpected error occurred' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveOutlook = async () => {
    if (!confirm('Remove this appointment from Outlook Calendar?')) {
      return;
    }

    setIsSyncing(true);
    setMessage(null);

    try {
      const result = await removeAppointmentFromOutlook(appointmentId, adminEmail);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Removed successfully' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to remove' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unexpected error occurred' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Provider Toggle */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveProvider('google')}
          className={`px-3 py-1 text-sm font-medium rounded ${
            activeProvider === 'google'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Google Calendar
        </button>
        <button
          onClick={() => setActiveProvider('outlook')}
          className={`px-3 py-1 text-sm font-medium rounded ${
            activeProvider === 'outlook'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Outlook Calendar
        </button>
      </div>

      {/* Google Calendar Actions */}
      {activeProvider === 'google' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleSyncGoogle}
              disabled={isSyncing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
            >
              {isSyncing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Syncing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {googleEventId ? 'Update Google Calendar' : 'Add to Google Calendar'}
                </>
              )}
            </button>
            {googleEventId && (
              <button
                onClick={handleRemoveGoogle}
                disabled={isSyncing}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                Remove
              </button>
            )}
          </div>
          {googleEventId && <div className="text-xs text-gray-500">Synced to Google Calendar</div>}
        </div>
      )}

      {/* Outlook Calendar Actions */}
      {activeProvider === 'outlook' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleSyncOutlook}
              disabled={isSyncing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
            >
              {isSyncing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Syncing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {outlookEventId ? 'Update Outlook Calendar' : 'Add to Outlook Calendar'}
                </>
              )}
            </button>
            {outlookEventId && (
              <button
                onClick={handleRemoveOutlook}
                disabled={isSyncing}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                Remove
              </button>
            )}
          </div>
          {outlookEventId && (
            <div className="text-xs text-gray-500">Synced to Outlook Calendar</div>
          )}
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div
          className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
