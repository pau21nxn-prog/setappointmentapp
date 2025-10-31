'use client';

/**
 * Add Note Button Component
 * =============================================================================
 * Client component for adding internal notes to appointments
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 2)
 * =============================================================================
 */

import { useState } from 'react';
import { addAppointmentNote } from '@/app/admin/actions';

interface AddNoteButtonProps {
  appointmentId: string;
}

export function AddNoteButton({ appointmentId }: AddNoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddNote = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await addAppointmentNote(appointmentId, noteText, isImportant);

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          setIsOpen(false);
          setNoteText('');
          setIsImportant(false);
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Add note error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        Add Note
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Internal Note</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Internal notes are only visible to admins and won't be shared with the client.
            </p>

            {/* Note Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
                rows={6}
                disabled={isLoading}
                maxLength={5000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">{noteText.length} / 5000 characters</p>
            </div>

            {/* Important Flag */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Mark as important
                  <span className="text-gray-500 ml-1">(highlights this note)</span>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Note'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
