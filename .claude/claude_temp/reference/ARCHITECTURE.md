# System Architecture & Tech Stack

> **File**: `.claude/reference/ARCHITECTURE.md`
> **Last Updated**: October 29, 2025

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Cloudflare CDN                        │
│                    (Global Edge Network)                     │
│          SSL, DDoS Protection, Caching, WAF                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      Vercel (Hosting)                        │
│                      Next.js 14 App                          │
├──────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Tailwind CSS)               │
│  ├─ Landing Page (Hero, Portfolio, CTA)                     │
│  ├─ Booking Form (Multi-step wizard)                        │
│  └─ Success/Confirmation Page                               │
├──────────────────────────────────────────────────────────────┤
│  Backend (Next.js API Routes)                               │
│  ├─ /api/appointments/create                                │
│  ├─ /api/appointments/validate                              │
│  └─ /api/email/send                                         │
└────┬─────────────────────────────────┬─────────────────────┘
     │                                  │
     ▼                                  ▼
┌─────────────────┐          ┌─────────────────────┐
│    Supabase     │          │   Resend Email API  │
│   (PostgreSQL)  │          │  (Email Delivery)   │
│  - Appointments │          │  - Confirmations    │
│  - Email Logs   │          │  - Reminders        │
└─────────────────┘          └─────────────────────┘
```

---

## Technology Stack

### Frontend Framework

- **Next.js 14+** with React
  - Why: Server-side rendering for SEO, excellent performance
  - Cost: Free
  - **Context7**: `use context7 for Next.js 14 App Router documentation`

### Language

- **TypeScript**
  - Why: Type safety, catches errors early
  - Cost: Free
  - **Context7**: `use context7 for TypeScript latest best practices`

### Styling

- **Tailwind CSS**
  - Why: Rapid development, consistent design
  - Cost: Free
  - **Context7**: `use context7 for Tailwind CSS v3 documentation`

### Hosting & Deployment

- **Vercel**
  - Why: Optimized for Next.js, automatic deployments
  - Cost: Free tier
  - Features: Auto-deploy on push, preview URLs

### Database

- **Supabase (PostgreSQL)**
  - Why: Generous free tier, real-time capabilities
  - Cost: Free (500MB database, 2GB bandwidth)
  - **Context7**: `use context7 for Supabase JavaScript client documentation`

### Email Service

- **Resend**
  - Why: Developer-friendly, React email templates
  - Cost: Free (100 emails/day, 3000/month)
  - **Context7**: `use context7 for Resend API documentation`

### Form Management

- **React Hook Form + Zod**
  - Why: Performance, validation, TypeScript support
  - Cost: Free
  - **Context7**: `use context7 for React Hook Form v7 and Zod validation`

### CDN & Security

- **Cloudflare Free Tier**
  - Global CDN, Free SSL, DDoS protection
  - Cost: Free

### Analytics

- **Google Analytics 4**
  - Cost: Free
  - **Context7**: `use context7 for Google Analytics 4 Next.js integration`

### Version Control & CI/CD

- **GitHub** + **GitHub Actions**
  - Repository: https://github.com/pau21nxn-prog/setappointmentapp
  - Cost: Free

---

## Directory Structure

```
setappointmentapp/
├── .claude/                           # AI instruction files
│   ├── CLAUDE.md                      # Main index
│   ├── phases/                        # Phase-specific docs
│   ├── reference/                     # Technical references
│   ├── guides/                        # Development guides
│   └── meta/                          # Project metadata
├── .github/workflows/                 # CI/CD pipelines
├── public/
│   ├── images/                        # Portfolio images
│   └── videos/                        # Hero video
├── src/
│   ├── app/                           # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/                       # API routes
│   ├── components/
│   │   ├── ui/                        # Reusable components
│   │   ├── sections/                  # Page sections
│   │   └── layout/                    # Layout components
│   ├── lib/
│   │   ├── supabase/                  # Database client
│   │   ├── email/                     # Email service
│   │   └── utils/                     # Utilities
│   ├── types/                         # TypeScript types
│   └── __tests__/                     # Test files
├── .env.local                         # Environment vars (gitignored)
├── .env.example                       # Example env file
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

[Return to Main Index](../CLAUDE.md)
