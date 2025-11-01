import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { BookingFormData } from '@/lib/validation/bookingSchema';
import { INDUSTRY_OPTIONS } from '@/constants/formOptions';

export interface PersonalInfoStepProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  watch: UseFormWatch<BookingFormData>;
  setValue: (name: keyof BookingFormData, value: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const selectedIndustry = watch('industry');
  const phoneValue = watch('phone');
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Tell us about yourself and your company</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          {...register('first_name')}
          error={errors.first_name?.message}
          required
          placeholder="John"
        />

        <Input
          label="Last Name"
          {...register('last_name')}
          error={errors.last_name?.message}
          required
          placeholder="Doe"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          required
          placeholder="john@example.com"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            international
            defaultCountry="US"
            value={phoneValue}
            onChange={(value) => setValue('phone', value || '')}
            className="phone-input-custom"
          />
          {errors.phone?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
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

      {selectedIndustry === 'other' && (
        <Input
          label="Please specify your industry"
          {...register('industry_other')}
          error={errors.industry_other?.message}
          required
          placeholder="Enter your industry"
        />
      )}

      <Input
        label="Current Website URL or Desired Website URL (Optional)"
        type="url"
        {...register('website_url')}
        error={errors.website_url?.message}
        placeholder="https://example.com"
        helperText="Provide your current website or the URL you'd like for your new website"
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
