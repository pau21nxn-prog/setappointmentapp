'use client';

/**
 * Status Update Button Component
 * =============================================================================
 * Client component for updating appointment status with modal
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 2)
 * =============================================================================
 */

import { useState } from 'react';
import { updateAppointmentStatus } from '@/app/admin/actions';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface StatusUpdateButtonProps {
  appointmentId: string;
  currentStatus: string;
}

const statusOptions: { value: AppointmentStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export function StatusUpdateButton({ appointmentId, currentStatus }: StatusUpdateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateAppointmentStatus(
        appointmentId,
        selectedStatus,
        reason || undefined
      );

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          setIsOpen(false);
          setSelectedStatus(null);
          setReason('');
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Status update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Update Status
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
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

            {/* Current Status */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize bg-gray-200 text-gray-800">
                {currentStatus}
              </span>
            </div>

            {/* Status Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    disabled={option.value === currentStatus || isLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === option.value
                        ? `${option.color} ring-2 ring-offset-2 ring-emerald-500`
                        : option.value === currentStatus
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason (Optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for status change..."
                rows={3}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
              />
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
                onClick={handleStatusChange}
                disabled={!selectedStatus || isLoading}
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
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
