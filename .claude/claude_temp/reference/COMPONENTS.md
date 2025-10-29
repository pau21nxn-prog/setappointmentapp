# Component Architecture

> **File**: `.claude/reference/COMPONENTS.md`
> **Last Updated**: October 29, 2025

---

## Landing Page Structure

```
app/page.tsx (Landing Page)
├── Header
│   ├── Logo
│   ├── Navigation (smooth scroll)
│   └── BookNowButton
├── HeroSection
│   ├── Headline
│   ├── Subheadline
│   ├── VideoEmbed (Cloudinary)
│   └── PrimaryCTA
├── PortfolioSection
│   └── ImageCarousel (12 projects)
│       ├── CarouselItem[]
│       ├── NavigationControls
│       └── Lightbox
├── BookingSection
│   └── BookingForm
│       ├── StepIndicator
│       ├── Step1: PersonalInfo
│       ├── Step2: BusinessDetails
│       ├── Step3: ScheduleSelection
│       └── SuccessScreen
└── Footer
    └── Credentials & Links
```

---

## Hero Section Component

**Location**: `src/components/sections/Hero/Hero.tsx`

**Features**:

- Responsive headline with gradient text
- Embedded video with custom controls
- Lazy loading for performance
- Primary CTA button with smooth scroll

**Example**:

```typescript
export const Hero: React.FC = () => {
  return (
    <section className="hero-section py-20 px-4 bg-gradient-to-br from-emerald-500 to-emerald-600">
      <div className="container mx-auto text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          Transform Your Business with Custom Software
        </h1>
        <p className="text-xl mb-8">
          Book a free consultation to discuss your project needs
        </p>
        <div className="video-container mb-8">
          {/* Video embed */}
        </div>
        <Button onClick={() => scrollToBooking()} size="lg">
          Book Your Consultation
        </Button>
      </div>
    </section>
  );
};
```

---

## Booking Form Component

**Location**: `src/components/sections/BookingForm/BookingForm.tsx`

**Features**:

- Multi-step wizard (3 steps)
- Form validation with Zod
- Progress indicator
- Responsive design
- Success confirmation

**State Management**:

```typescript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState<BookingFormData>({});

const steps = [
  { id: 1, title: 'Personal Information', component: PersonalInfoStep },
  { id: 2, title: 'Business Details', component: BusinessDetailsStep },
  { id: 3, title: 'Schedule Selection', component: ScheduleStep },
];
```

---

**Context7**: `use context7 for accessible multi-step form patterns in React`

[Return to Main Index](../CLAUDE.md)
