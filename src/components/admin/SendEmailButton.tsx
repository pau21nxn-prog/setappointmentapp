'use client';

/**
 * Send Email Button Component
 * =============================================================================
 * Client component for sending emails to appointment clients
 * Now includes email preview before sending
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 3)
 * =============================================================================
 */

import { useState } from 'react';
import { sendAppointmentEmail } from '@/app/admin/actions';
import type { EmailTemplateType } from '@/lib/email/adminTemplates';
import { EmailPreviewModal } from './EmailPreviewModal';

interface SendEmailButtonProps {
  appointmentId: string;
  appointmentData?: any; // Full appointment object for preview
}

const emailTemplates: { value: EmailTemplateType; label: string; description: string }[] = [
  {
    value: 'confirmation',
    label: 'Appointment Confirmation',
    description: 'Confirm the appointment and set expectations',
  },
  {
    value: 'reschedule',
    label: 'Reschedule Request',
    description: 'Request to reschedule the appointment',
  },
  {
    value: 'update',
    label: 'Project Update',
    description: 'Send a project status update',
  },
  {
    value: 'custom',
    label: 'Custom Message',
    description: 'Send a custom message',
  },
];

export function SendEmailButton({ appointmentId, appointmentData }: SendEmailButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDetails, setUpdateDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleShowPreview = () => {
    if (!canSend()) return;
    setShowPreview(true);
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const customData: Record<string, string> = {};

      if (selectedTemplate === 'custom' && subject) customData.subject = subject;
      if (selectedTemplate === 'custom' && message) customData.message = message;
      if (selectedTemplate === 'reschedule' && reason) customData.reason = reason;
      if (selectedTemplate === 'update') {
        if (updateTitle) customData.updateTitle = updateTitle;
        if (updateDetails) customData.updateDetails = updateDetails;
      }

      const result = await sendAppointmentEmail(appointmentId, selectedTemplate, customData);

      if (result.success) {
        setSuccess(result.message);
        setShowPreview(false);
        setTimeout(() => {
          setIsOpen(false);
          setSelectedTemplate(null);
          setSubject('');
          setMessage('');
          setReason('');
          setUpdateTitle('');
          setUpdateDetails('');
          setSuccess(null);
        }, 2000);
      } else {
        setError(result.error || result.message);
        setShowPreview(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Send email error:', err);
      setShowPreview(false);
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = () => {
    if (!selectedTemplate) return false;
    if (selectedTemplate === 'custom' && (!subject.trim() || !message.trim())) return false;
    if (selectedTemplate === 'update' && (!updateTitle.trim() || !updateDetails.trim()))
      return false;
    return true;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
      >
        Send Email
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Send Email to Client</h2>
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

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {emailTemplates.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => setSelectedTemplate(template.value)}
                    disabled={isLoading}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTemplate === template.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{template.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Template-specific fields */}
            {selectedTemplate === 'custom' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows={6}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {selectedTemplate === 'reschedule' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rescheduling (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you need to reschedule..."
                  rows={4}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}

            {selectedTemplate === 'update' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Title
                  </label>
                  <input
                    type="text"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="e.g., Phase 1 Complete"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Details
                  </label>
                  <textarea
                    value={updateDetails}
                    onChange={(e) => setUpdateDetails(e.target.value)}
                    placeholder="Describe the update..."
                    rows={6}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

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
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleShowPreview}
                disabled={!canSend() || isLoading}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {appointmentData && (
        <EmailPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleSendEmail}
          templateType={selectedTemplate!}
          appointmentData={appointmentData}
          customData={{
            subject,
            message,
            reason,
            updateTitle,
            updateDetails,
          }}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
