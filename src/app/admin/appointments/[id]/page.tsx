/**
 * Admin Appointment Detail Page
 * =============================================================================
 * View full appointment details, update status, add notes, and send emails
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard (Sprint 2)
 * =============================================================================
 */

import { getAdminSession, createServiceClient } from '@/lib/auth/admin';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { StatusUpdateButton } from '@/components/admin/StatusUpdateButton';
import { AddNoteButton } from '@/components/admin/AddNoteButton';
import { NotesSection } from '@/components/admin/NotesSection';
import { SendEmailButton } from '@/components/admin/SendEmailButton';
import { CalendarSyncButton } from '@/components/admin/CalendarSyncButton';

// Force dynamic rendering for this page (uses cookies for authentication)
export const dynamic = 'force-dynamic';

interface AppointmentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  // Verify admin session
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch appointment data
  const supabase = createServiceClient();

  const { data: appointment, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !appointment) {
    notFound();
  }

  // Fetch email history for this appointment
  const { data: emailLogs } = await supabase
    .from('email_logs')
    .select('*')
    .eq('appointment_id', params.id)
    .order('created_at', { ascending: false });

  // Fetch appointment notes
  const { data: notes } = await supabase
    .from('appointment_notes')
    .select('*')
    .eq('appointment_id', params.id)
    .order('created_at', { ascending: false });

  // Fetch status history
  const { data: statusHistory } = await supabase
    .from('status_history')
    .select('*')
    .eq('appointment_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/admin/dashboard" className="hover:text-emerald-600">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/admin/appointments" className="hover:text-emerald-600">
            Appointments
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{appointment.full_name}</span>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{appointment.full_name}</h1>
            <p className="mt-2 text-gray-600">
              Submitted on{' '}
              {new Date(appointment.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
              appointment.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : appointment.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : appointment.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Client Information
            </h2>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{appointment.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={`mailto:${appointment.email}`}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    {appointment.email}
                  </a>
                </dd>
              </div>
              {appointment.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={`tel:${appointment.phone}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {appointment.phone}
                    </a>
                  </dd>
                </div>
              )}
              {appointment.company_name && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.company_name}</dd>
                </div>
              )}
              {appointment.company_website && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={appointment.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {appointment.company_website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Project Details Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Project Details
            </h2>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointment.project_type && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Project Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.project_type}</dd>
                </div>
              )}
              {appointment.budget_range && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Budget Range</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.budget_range}</dd>
                </div>
              )}
              {appointment.timeline && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.timeline}</dd>
                </div>
              )}
              {appointment.industry && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Industry</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.industry}</dd>
                </div>
              )}
            </dl>

            {appointment.project_description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500 mb-2">Project Description</dt>
                <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                  {appointment.project_description}
                </dd>
              </div>
            )}
          </div>

          {/* Preferred Contact Panel */}
          {(appointment.preferred_contact_time ||
            appointment.preferred_contact_method ||
            appointment.additional_notes) && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Preferred Contact
              </h2>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointment.preferred_contact_method && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {appointment.preferred_contact_method}
                    </dd>
                  </div>
                )}
                {appointment.preferred_contact_time && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Preferred Time</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {appointment.preferred_contact_time}
                    </dd>
                  </div>
                )}
              </dl>

              {appointment.additional_notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Additional Notes</dt>
                  <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                    {appointment.additional_notes}
                  </dd>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Actions & Timeline */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

            <div className="space-y-3">
              <SendEmailButton appointmentId={appointment.id} appointmentData={appointment} />
              <CalendarSyncButton
                appointmentId={appointment.id}
                adminEmail={session.user.email!}
                googleEventId={appointment.google_calendar_event_id}
                outlookEventId={appointment.outlook_calendar_event_id}
              />
              <StatusUpdateButton
                appointmentId={appointment.id}
                currentStatus={appointment.status}
              />
              <AddNoteButton appointmentId={appointment.id} />
              <a
                href={`mailto:${appointment.email}`}
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Open Email Client
              </a>
              {appointment.phone && (
                <a
                  href={`tel:${appointment.phone}`}
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  Call Client
                </a>
              )}
            </div>
          </div>

          {/* Email History Panel */}
          {emailLogs && emailLogs.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Email History</h2>

              <div className="space-y-3">
                {emailLogs.map((email) => (
                  <div key={email.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {email.email_type === 'client_confirmation'
                          ? 'Confirmation'
                          : 'Admin Notification'}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          email.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : email.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {email.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(email.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">To: {email.recipient_email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status History Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>

            <div className="space-y-4">
              {/* Appointment Created */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Appointment Created</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(appointment.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Status Changes */}
              {statusHistory &&
                statusHistory.length > 0 &&
                statusHistory.map((history) => (
                  <div key={history.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Status changed to <span className="capitalize">{history.new_status}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {history.changed_by} •{' '}
                        {new Date(history.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {history.change_reason && (
                        <p className="text-xs text-gray-600 mt-1 italic">{history.change_reason}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Notes Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h2>
            <NotesSection
              notes={notes || []}
              appointmentId={appointment.id}
              currentUserEmail={session.user.email || ''}
            />
          </div>

          {/* Metadata Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>

            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-gray-500">Appointment ID</dt>
                <dd className="mt-1 text-xs text-gray-900 font-mono">{appointment.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-xs text-gray-900">
                  {new Date(appointment.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Last Modified</dt>
                <dd className="mt-1 text-xs text-gray-900">
                  {new Date(appointment.updated_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Link
          href="/admin/appointments"
          className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Appointments
        </Link>
      </div>
    </div>
  );
}
