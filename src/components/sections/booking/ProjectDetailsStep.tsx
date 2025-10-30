import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { BookingFormData } from '@/lib/validation/bookingSchema';
import {
  PROJECT_TYPE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  TIMELINE_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  FEATURE_OPTIONS,
} from '@/constants/formOptions';

export interface ProjectDetailsStepProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  watch: UseFormWatch<BookingFormData>;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({ register, errors, watch }) => {
  const selectedFeatures = watch('features') || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h3>
        <p className="text-gray-600">Help us understand your project requirements</p>
      </div>

      <Select
        label="Project Type"
        {...register('project_type')}
        error={errors.project_type?.message}
        options={PROJECT_TYPE_OPTIONS}
        required
      />

      <Textarea
        label="Project Description"
        {...register('project_description')}
        error={errors.project_description?.message}
        required
        rows={5}
        placeholder="Please describe your project, goals, and any specific requirements..."
        helperText="Minimum 20 characters"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Budget Range"
          {...register('budget_range')}
          error={errors.budget_range?.message}
          options={BUDGET_RANGE_OPTIONS}
          required
        />

        <Select
          label="Timeline"
          {...register('timeline')}
          error={errors.timeline?.message}
          options={TIMELINE_OPTIONS}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Desired Features <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURE_OPTIONS.map((feature) => (
            <div key={feature} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  value={feature}
                  {...register('features')}
                  id={`feature-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
              </div>
              <label
                htmlFor={`feature-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                className="ml-3 text-sm text-gray-700"
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
        {errors.features && <p className="mt-2 text-xs text-red-500">{errors.features.message}</p>}
        <p className="mt-2 text-xs text-gray-500">Selected: {selectedFeatures.length} / 15</p>
      </div>

      <Textarea
        label="Additional Notes (Optional)"
        {...register('additional_notes')}
        error={errors.additional_notes?.message}
        rows={4}
        placeholder="Any additional information you'd like us to know..."
      />

      <Select
        label="How did you hear about us?"
        {...register('referral_source')}
        error={errors.referral_source?.message}
        options={REFERRAL_SOURCE_OPTIONS}
        required
      />
    </div>
  );
};

export default ProjectDetailsStep;
