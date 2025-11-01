'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  BookingFormData,
  bookingFormSchema,
  personalInfoSchema,
  projectDetailsSchema,
  schedulingSchema,
} from '@/lib/validation/bookingSchema';
import FormProgress, { FormProgressStep } from '@/components/ui/FormProgress';
import PersonalInfoStep from '@/components/sections/booking/PersonalInfoStep';
import ProjectDetailsStep from '@/components/sections/booking/ProjectDetailsStep';
import SchedulingStep from '@/components/sections/booking/SchedulingStep';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { trackFormSubmission } from '@/lib/analytics/gtag';

const FORM_STORAGE_KEY = 'booking-form-draft';

const formSteps: FormProgressStep[] = [
  {
    id: 1,
    label: 'Personal Info',
    description: 'Tell us about yourself',
  },
  {
    id: 2,
    label: 'Project Details',
    description: 'Describe your project',
  },
  {
    id: 3,
    label: 'Schedule',
    description: 'Pick a consultation time',
  },
];

const BookingForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
    getValues,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onBlur',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company_name: '',
      industry: '',
      industry_other: '',
      website_url: '',
      current_website: false,
      project_type: '',
      project_description: '',
      features: [],
      additional_notes: '',
      referral_source: '',
      preferred_date: '',
      preferred_time: '',
      video_call_platform: '',
      website: '', // Honeypot field for spam detection
    },
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        reset(draftData);
      } catch (error) {
        console.error('Failed to load form draft:', error);
      }
    }
  }, [reset]);

  // Save draft to localStorage on form data change
  useEffect(() => {
    const subscription = watch((formData) => {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Failed to save form draft:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Get the appropriate schema for current step
  const getCurrentStepSchema = () => {
    switch (currentStep) {
      case 0:
        return personalInfoSchema;
      case 1:
        return projectDetailsSchema;
      case 2:
        return schedulingSchema;
      default:
        return personalInfoSchema;
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = getCurrentStepSchema();
    const currentData = getValues();

    try {
      schema.parse(currentData);
      return true;
    } catch {
      // Trigger validation to show errors
      await trigger();
      return false;
    }
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to booking section instead of top of page
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      // Scroll to booking section instead of top of page
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle form submission
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Call the appointments API
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle error responses
        if (response.status === 409) {
          setSubmitError(result.message || 'You already have a pending appointment for this date.');
        } else if (response.status === 400) {
          setSubmitError('Please check your form data and try again.');
        } else {
          setSubmitError(
            result.message ||
              'Failed to submit your booking. Please try again or contact us directly.'
          );
        }
        return;
      }

      // Clear draft from localStorage on successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);

      // Track conversion in Google Analytics
      trackFormSubmission({
        email: data.email,
        company_name: data.company_name,
        project_type: data.project_type,
      });

      // Redirect to confirmation page with appointment details
      const confirmationUrl = `/confirmation?id=${result.data.id}&email=${encodeURIComponent(result.data.email)}&date=${result.data.preferred_date}&time=${encodeURIComponent(result.data.preferred_time)}`;
      router.push(confirmationUrl);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to submit your booking. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep register={register} errors={errors} watch={watch} setValue={setValue} />
        );
      case 1:
        return <ProjectDetailsStep register={register} errors={errors} watch={watch} />;
      case 2:
        return <SchedulingStep register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <section id="booking" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Book Your Free Consultation
          </h2>
          <p className="text-lg text-gray-600">
            Tell us about your project and let's schedule a call to discuss how we can help bring
            your vision to life.
          </p>
        </div>

        {/* Form Progress */}
        <div className="mb-8">
          <FormProgress steps={formSteps} currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Honeypot field - hidden from users, visible to bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                {...register('website')}
                type="text"
                id="website"
                name="website"
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            {/* Step Content */}
            <div className="mb-8">{renderStep()}</div>

            {/* Submit Error */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < formSteps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="order-1 sm:order-2"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="order-1 sm:order-2">
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Booking
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help or have questions?{' '}
            <a
              href="mailto:hello@setappointmentapp.com"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Contact us directly
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
