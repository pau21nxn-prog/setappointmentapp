# Phase 2: Core Features Development (Week 2-3)

> **File**: `.claude/phases/PHASE-2-CORE-FEATURES.md`
> **Last Updated**: October 29, 2025
> **Status**: ⏳ UPCOMING

---

## Prerequisites

Before starting this phase, ensure:

- Phase 1 is complete
- Read [Component Architecture](../reference/COMPONENTS.md)
- Read [Design System](../reference/DESIGN-SYSTEM.md)
- Read [Development Guidelines](../guides/DEVELOPMENT.md)

## Related Files

- [Common Tasks](../guides/COMMON-TASKS.md) - Component and form creation
- [Database Schema](../reference/DATABASE.md) - For database integration
- [Testing Strategy](../reference/TESTING.md) - Unit testing approach

---

## Phase Overview

**Duration**: Week 2-3
**Focus**: Building core UI components, multi-step booking form, portfolio carousel, database integration

**Goals**:

- Create Hero section with video embed
- Build portfolio carousel with 12 project images
- Implement 3-step booking form with validation
- Integrate React Hook Form + Zod
- Connect booking form to Supabase
- Create success confirmation screen

---

## Checklist

### Hero Section (`feature/hero-section`)

- [ ] Create `components/sections/Hero` component
- [ ] Implement video embedding (Cloudinary)
- [ ] Add headline and subheadline
- [ ] Add primary CTA button
- [ ] Implement responsive design
- [ ] Add lazy loading for video
- [ ] Write unit tests

### Portfolio Carousel (`feature/carousel`)

- [ ] Create `components/sections/Portfolio` component
- [ ] Implement carousel with auto-rotation
- [ ] Add manual navigation controls
- [ ] Implement hover effects
- [ ] Add lightbox for full view
- [ ] Implement mobile swipe gestures
- [ ] Optimize image loading
- [ ] Write unit tests

### Booking Form - Step 1 (`feature/booking-form-step1`)

- [ ] Create `components/sections/BookingForm` component
- [ ] Implement personal information step
- [ ] Add form validation with Zod
- [ ] Integrate React Hook Form
- [ ] Add proper error messages
- [ ] Write unit tests

**Fields**: First Name, Last Name, Email, Phone, Company Name (optional)

### Booking Form - Step 2 (`feature/booking-form-step2`)

- [ ] Implement business details step
- [ ] Add system request dropdown with all options
- [ ] Add conditional "Other" input field
- [ ] Add video platform selection
- [ ] Add budget range dropdown
- [ ] Validate all fields
- [ ] Write unit tests

**Fields**: Business Nature, System Request, Custom Request (conditional), Video Platform, Budget Range (optional)

### Booking Form - Step 3 (`feature/booking-form-step3`)

- [ ] Implement schedule selection step
- [ ] Add date picker (disable past dates)
- [ ] Add time slot selection (radio buttons)
- [ ] Auto-detect timezone
- [ ] Add additional notes textarea
- [ ] Validate all fields
- [ ] Write unit tests

**Fields**: Appointment Date, Time Slot (morning/afternoon/evening), Timezone, Additional Notes (optional)

### Booking Form - Success Screen (`feature/booking-form-success`)

- [ ] Create success confirmation component
- [ ] Display appointment summary
- [ ] Show next steps information
- [ ] Add return to homepage button
- [ ] Write unit tests

### Database Integration

- [ ] Create Supabase queries module
- [ ] Implement `createAppointment` function
- [ ] Implement `getAppointments` function
- [ ] Add error handling
- [ ] Write integration tests

---

## Commands

### Create feature branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/hero-section
```

### Install additional dependencies

```bash
npm install swiper         # For carousel
npm install react-datepicker
npm install date-fns       # For date formatting
```

### Component creation example

```bash
# Create component directory
mkdir -p src/components/sections/Hero
cd src/components/sections/Hero

# Create component files
touch Hero.tsx Hero.types.ts Hero.test.tsx index.ts
```

### Run tests

```bash
# Watch mode during development
npm run test:watch

# Run all tests
npm run test

# Run specific test
npm run test -- Hero.test.tsx
```

---

## Context7 Prompts for Phase 2

- `use context7 for React Hook Form with Zod validation in Next.js 14`
- `use context7 for creating accessible multi-step forms in React`
- `use context7 for image carousel with Swiper.js in React`
- `use context7 for date picker component in React`
- `use context7 for form validation error messages with Zod`
- `use context7 for Next.js Image component optimization`

---

## Key Implementations

### Booking Form Zod Schema Example

```typescript
import { z } from 'zod';

export const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  companyName: z.string().optional(),
});

export const step2Schema = z.object({
  businessNature: z.string().min(10, 'Please provide more details'),
  systemRequest: z.string().min(1, 'Please select a system type'),
  customRequest: z.string().optional(),
  videoPlatform: z.enum(['zoom', 'teams', 'meet', 'skype', 'webex', 'gotomeeting']),
  budgetRange: z.string().optional(),
});

export const step3Schema = z.object({
  appointmentDate: z.date().min(new Date(), 'Date must be in the future'),
  timeSlot: z.enum(['morning', 'afternoon', 'evening']),
  timezone: z.string(),
  additionalNotes: z.string().optional(),
});

export const bookingFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type BookingFormData = z.infer<typeof bookingFormSchema>;
```

### Multi-step Form State Management

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({});

  const form = useForm<BookingFormData>({
    resolver: zodResolver(getCurrentStepSchema(step)),
    defaultValues: formData,
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setFormData({ ...formData, ...form.getValues() });
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setFormData({ ...formData, ...form.getValues() });
    setStep(step - 1);
  };

  const handleSubmit = async (data: BookingFormData) => {
    // Submit to API
    const response = await fetch('/api/appointments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setStep(4); // Show success screen
    }
  };

  return (
    <div>
      <StepIndicator currentStep={step} totalSteps={3} />
      {step === 1 && <Step1 form={form} onNext={handleNext} />}
      {step === 2 && <Step2 form={form} onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <Step3 form={form} onSubmit={form.handleSubmit(handleSubmit)} onBack={handleBack} />}
      {step === 4 && <SuccessScreen />}
    </div>
  );
};
```

### Portfolio Carousel with Swiper

```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const PortfolioCarousel = () => {
  const projects = [
    { id: 1, title: 'Project 1', image: '/images/portfolio/project1.jpg' },
    // ... 11 more projects
  ];

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {projects.map((project) => (
        <SwiperSlide key={project.id}>
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={600}
            className="rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
```

---

## Testing Examples

### Component Test Example

```typescript
// components/sections/Hero/Hero.test.tsx
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders headline correctly', () => {
    render(<Hero />);
    expect(screen.getByText(/Transform Your Business/i)).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<Hero />);
    const button = screen.getByRole('button', { name: /Book Your Consultation/i });
    expect(button).toBeInTheDocument();
  });
});
```

### Form Validation Test

```typescript
// components/sections/BookingForm/BookingForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from './BookingForm';

describe('BookingForm Step 1', () => {
  it('shows validation errors for empty required fields', async () => {
    render(<BookingForm />);

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/First name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('proceeds to step 2 with valid data', async () => {
    render(<BookingForm />);

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone/i), '+1234567890');

    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
    });
  });
});
```

---

## Success Criteria

Phase 2 is complete when:

- ✅ Hero section displays with responsive video
- ✅ Portfolio carousel works with all 12 images
- ✅ All 3 booking form steps validate correctly
- ✅ Form data persists across steps
- ✅ Form submits to Supabase successfully
- ✅ Success screen displays after submission
- ✅ All components have unit tests
- ✅ All tests pass with >80% coverage
- ✅ Components are responsive on mobile/tablet/desktop

---

## Next Phase

Once Phase 2 is complete, proceed to:

- [Phase 3: Backend Integration & Testing](./PHASE-3-BACKEND.md)

---

[Return to Main Index](../CLAUDE.md)
