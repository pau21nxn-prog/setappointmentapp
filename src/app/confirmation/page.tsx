'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, Calendar, Clock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');
  const email = searchParams.get('email');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  // If no appointment data, show error state
  if (!appointmentId || !email || !date || !time) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Appointment Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find your appointment details. Please check your email for confirmation or
              contact us for assistance.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Appointment Confirmed!
          </h1>
          <p className="text-lg text-gray-600">We're excited to discuss your project with you</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Appointment Details */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Details</h2>

            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-emerald-600 mt-0.5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg text-gray-900">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-emerald-600 mt-0.5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg text-gray-900">{time}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-emerald-600 mt-0.5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Confirmation sent to</p>
                  <p className="text-lg text-gray-900">{email}</p>
                </div>
              </div>

              {/* Reference ID */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Reference ID</p>
                <p className="text-sm font-mono text-gray-700 mt-1">
                  {appointmentId.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-emerald-50 p-6 sm:p-8 border-t border-emerald-100">
            <h3 className="text-lg font-semibold text-emerald-900 mb-4">What's Next?</h3>
            <ul className="space-y-3 text-emerald-800">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-semibold">1</span>
                </span>
                <span>Check your email for a detailed confirmation with meeting instructions</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-semibold">2</span>
                </span>
                <span>We'll send you a calendar invite with video call details</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-semibold">3</span>
                </span>
                <span>Prepare any questions or materials you'd like to discuss</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-semibold">4</span>
                </span>
                <span>Join the meeting at the scheduled time using the link in your email</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need to Make Changes?</h3>
          <p className="text-gray-600 mb-4">
            If you need to reschedule or cancel your appointment, please contact us as soon as
            possible:
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:hello@setappointmentapp.com"
                className="text-emerald-600 hover:text-emerald-700"
              >
                hello@setappointmentapp.com
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong>{' '}
              <a href="tel:+11234567890" className="text-emerald-600 hover:text-emerald-700">
                (123) 456-7890
              </a>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <a
            href={`data:text/calendar;charset=utf-8,${encodeURIComponent(`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${date.replace(/-/g, '')}T${time.replace(':', '')}00
SUMMARY:Consultation - SetAppointmentApp
DESCRIPTION:Your consultation appointment with SetAppointmentApp
LOCATION:Video Call (link to be sent via email)
END:VEVENT
END:VCALENDAR`)}`}
            download="appointment.ics"
          >
            <Button className="w-full sm:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
