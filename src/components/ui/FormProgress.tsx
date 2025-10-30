import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormProgressStep {
  id: number;
  label: string;
  description?: string;
}

export interface FormProgressProps {
  steps: FormProgressStep[];
  currentStep: number;
  className?: string;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Progress */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                      isCompleted && 'bg-emerald-600 text-white ring-4 ring-emerald-100',
                      isCurrent && 'bg-emerald-600 text-white ring-4 ring-emerald-200 scale-110',
                      !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        (isCompleted || isCurrent) && 'text-emerald-600',
                        !isCompleted && !isCurrent && 'text-gray-500'
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-4 mb-8">
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        isCompleted ? 'bg-emerald-600' : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">{steps[currentStep].label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormProgress;
