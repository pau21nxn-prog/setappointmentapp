'use client';

/**
 * Bulk Actions Bar Component
 * =============================================================================
 * Sticky bottom bar that appears when appointments are selected
 * Provides bulk operations: status update and email sending
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 3)
 * =============================================================================
 */

import { useState } from 'react';
import { bulkUpdateAppointmentStatus, bulkSendAppointmentEmails } from '@/app/admin/bulk-actions';
import type { EmailTemplateType } from '@/lib/email/adminTemplates';

interface BulkActionsBarProps {
  selectedIds: string[];
  appointments?: any[]; // Array of selected appointments with full data (optional, for future use)
  onComplete: () => void;
}

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export function BulkActionsBar({ selectedIds, onComplete }: BulkActionsBarProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showEmailMenu, setShowEmailMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBulkStatusUpdate = async (status: AppointmentStatus) => {
    setIsLoading(true);
    setMessage(null);
    setShowStatusMenu(false);

    try {
      const result = await bulkUpdateAppointmentStatus(selectedIds, status);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onComplete();
          setMessage(null);
          // Reload the page to refresh the data
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
        if (result.errors && result.errors.length > 0) {
          console.error('Bulk update errors:', result.errors);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update appointments' });
      console.error('Bulk status update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkEmailSend = async (templateType: EmailTemplateType) => {
    setIsLoading(true);
    setMessage(null);
    setShowEmailMenu(false);

    try {
      const result = await bulkSendAppointmentEmails(selectedIds, templateType);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onComplete();
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
        if (result.errors && result.errors.length > 0) {
          console.error('Bulk email errors:', result.errors);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send emails' });
      console.error('Bulk email send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-500 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Selection Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{selectedIds.length}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedIds.length} appointment{selectedIds.length !== 1 ? 's' : ''} selected
                </p>
                <button
                  onClick={onComplete}
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Clear selection
                </button>
              </div>
            </div>
          </div>

          {/* Center - Message Display */}
          {message && (
            <div
              className={`px-4 py-2 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Bulk Status Update */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Update Status
              </button>

              {/* Status Dropdown Menu */}
              {showStatusMenu && !isLoading && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => handleBulkStatusUpdate('pending')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Pending
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('confirmed')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Confirmed
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('completed')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Completed
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('cancelled')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Cancelled
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Email Send */}
            <div className="relative">
              <button
                onClick={() => setShowEmailMenu(!showEmailMenu)}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Emails
              </button>

              {/* Email Template Dropdown Menu */}
              {showEmailMenu && !isLoading && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => handleBulkEmailSend('confirmation')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">Confirmation</div>
                    <div className="text-xs text-gray-500">Confirm appointments</div>
                  </button>
                  <button
                    onClick={() => handleBulkEmailSend('reschedule')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">Reschedule Request</div>
                    <div className="text-xs text-gray-500">Request to reschedule</div>
                  </button>
                  <button
                    onClick={() => handleBulkEmailSend('update')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">Project Update</div>
                    <div className="text-xs text-gray-500">Send status update</div>
                  </button>
                </div>
              )}
            </div>

            {/* Loading Spinner */}
            {isLoading && (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-emerald-600"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
