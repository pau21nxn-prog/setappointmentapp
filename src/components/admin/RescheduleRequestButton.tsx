'use client';

/**
 * Reschedule Request Button Component
 * =============================================================================
 * Create reschedule request for an appointment
 * Phase: 4 - Sprint 5
 * =============================================================================
 */

import { useState } from 'react';
import { createRescheduleRequest } from '@/app/admin/reschedule/actions';

interface RescheduleRequestButtonProps {
  appointmentId: string;
  currentScheduledTime?: string | null;
}

export function RescheduleRequestButton({
  appointmentId,
  currentScheduledTime,
}: RescheduleRequestButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await createRescheduleRequest(appointmentId, newDateTime, 'admin', reason);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Request created' });
        setShowForm(false);
        setNewDateTime('');
        setReason('');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create request' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
        >
          Request Reschedule
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Date & Time</label>
            <input
              type="datetime-local"
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {currentScheduledTime && (
              <p className="text-xs text-gray-500 mt-1">
                Current: {new Date(currentScheduledTime).toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Why reschedule?"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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
