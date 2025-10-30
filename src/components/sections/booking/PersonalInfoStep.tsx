import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BookingFormData } from '@/lib/validation/bookingSchema';
import { INDUSTRY_OPTIONS } from '@/constants/formOptions';

export interface PersonalInfoStepProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Tell us about yourself and your company</p>
      </div>

      <Input
        label="Full Name"
        {...register('full_name')}
        error={errors.full_name?.message}
        required
        placeholder="John Doe"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          required
          placeholder="john@example.com"
        />

        <Input
          label="Phone Number"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          required
          placeholder="(123) 456-7890"
        />
      </div>

      <Input
        label="Company Name"
        {...register('company_name')}
        error={errors.company_name?.message}
        required
        placeholder="Your Company Inc."
      />

      <Select
        label="Industry"
        {...register('industry')}
        error={errors.industry?.message}
        options={INDUSTRY_OPTIONS}
        required
      />

      <Input
        label="Current Website URL (Optional)"
        type="url"
        {...register('website_url')}
        error={errors.website_url?.message}
        placeholder="https://example.com"
        helperText="If you have an existing website, please provide the URL"
      />

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            {...register('current_website')}
            id="current_website"
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
          />
        </div>
        <label htmlFor="current_website" className="ml-3 text-sm text-gray-700">
          I currently have a website that needs improvement or replacement
        </label>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
