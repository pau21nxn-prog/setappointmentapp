import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import DatePicker from '@/components/ui/DatePicker';
import Select from '@/components/ui/Select';
import { BookingFormData } from '@/lib/validation/bookingSchema';
import { PREFERRED_TIME_OPTIONS, VIDEO_CALL_PLATFORM_OPTIONS } from '@/constants/formOptions';
import { Calendar, Clock, Video } from 'lucide-react';

export interface SchedulingStepProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
}

const SchedulingStep: React.FC<SchedulingStepProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule Your Consultation</h3>
        <p className="text-gray-600">
          Choose your preferred date and time for our consultation call
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-emerald-800">What to expect</h4>
            <p className="mt-1 text-sm text-emerald-700">
              Our consultation typically lasts 30-45 minutes. We'll discuss your project
              requirements, answer your questions, and provide initial recommendations.
            </p>
          </div>
        </div>
      </div>

      <DatePicker
        label="Preferred Date"
        {...register('preferred_date')}
        error={errors.preferred_date?.message}
        required
        helperText="Select a date from today onwards"
      />

      <Select
        label="Preferred Time"
        {...register('preferred_time')}
        error={errors.preferred_time?.message}
        options={PREFERRED_TIME_OPTIONS}
        required
        helperText="Choose your preferred time of day for the consultation"
      />

      <Select
        label="Video Call Platform"
        {...register('video_call_platform')}
        error={errors.video_call_platform?.message}
        options={VIDEO_CALL_PLATFORM_OPTIONS}
        required
        helperText="Select your preferred platform for the video consultation"
      />

      {/* Quick Selection Helpers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Calendar className="h-8 w-8 text-emerald-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Flexible Scheduling</p>
            <p className="text-xs text-gray-600">
              Don't see your preferred time? Let us know in the notes.
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Clock className="h-8 w-8 text-emerald-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Quick Response</p>
            <p className="text-xs text-gray-600">We'll confirm your appointment within 24 hours.</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Video className="h-8 w-8 text-emerald-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Video Call Ready</p>
            <p className="text-xs text-gray-600">We'll send you a meeting link before the call.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingStep;
