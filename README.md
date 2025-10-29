# SetAppointmentApp

A modern, single-page appointment booking web application built with Next.js 14, TypeScript, and Tailwind CSS. This application allows clients to pre-qualify for web development consultations.

## 🚀 Project Overview

**Status:** Phase 1 - Foundation & Setup ✅
**Version:** 0.1.0
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase, Vercel

This is a professional appointment booking system designed for web development consultation services. Clients can book appointments, view portfolio work, and pre-qualify for custom development projects.

## 📋 Phase 1 Completion Checklist

- ✅ Git repository initialized
- ✅ Next.js 14 project with TypeScript and Tailwind
- ✅ ESLint, Prettier, and code formatting configured
- ✅ Husky git hooks and commitlint setup
- ✅ Core dependencies installed (Supabase, Resend, React Hook Form, Zod)
- ✅ Testing infrastructure (Jest, React Testing Library, Playwright)
- ✅ GitHub Actions CI/CD pipelines
- ✅ Supabase database schema and migrations
- ✅ Vercel deployment configuration
- ✅ Basic UI components with tests
- ✅ Environment variables documented

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form + Zod** - Form management and validation

### Backend & Services

- **Supabase** - PostgreSQL database and authentication
- **Resend** - Email delivery service
- **Vercel** - Hosting and deployment platform

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting
- **Jest + React Testing Library** - Unit testing
- **Playwright** - End-to-end testing

### CI/CD

- **GitHub Actions** - Automated testing and deployment
- **Vercel** - Continuous deployment

## 🏗️ Project Structure

```
setappointmentapp/
├── .claude/                    # AI assistant documentation
├── .github/workflows/          # GitHub Actions CI/CD
│   ├── develop.yml
│   ├── production.yml
│   └── pr-checks.yml
├── .husky/                     # Git hooks
├── public/                     # Static assets
│   ├── images/
│   └── videos/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── __tests__/
│   │   ├── sections/           # Page sections
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── __tests__/
│   ├── lib/
│   │   ├── supabase/           # Supabase client & migrations
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── migrations/
│   │   └── utils/              # Utility functions
│   ├── types/                  # TypeScript type definitions
│   └── __tests__/              # Test files
├── .env.example                # Environment variables template
├── .env.local.example          # Local env template
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── commitlint.config.js        # Commit message rules
├── jest.config.js              # Jest configuration
├── next.config.js              # Next.js configuration
├── playwright.config.ts        # Playwright configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment config
└── package.json                # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Git**
- **Supabase account** (free tier)
- **Vercel account** (optional, for deployment)
- **Resend account** (optional, for email features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pau21nxn-prog/setappointmentapp.git
   cd setappointmentapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   RESEND_API_KEY=your-resend-api-key
   ```

4. **Run database migrations**

   Go to your Supabase SQL Editor and execute these files in order:
   - `src/lib/supabase/migrations/001_create_appointments_table.sql`
   - `src/lib/supabase/migrations/002_create_email_logs_table.sql`
   - `src/lib/supabase/migrations/003_create_rls_policies.sql`

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run format           # Format code with Prettier

# Testing
npm run test             # Run tests in watch mode
npm run test:ci          # Run tests with coverage (CI)
npm run test:e2e         # Run end-to-end tests with Playwright
```

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)

```bash
npm run test
```

All UI components have associated test files in `__tests__` directories.

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

Playwright tests will be added in Phase 2.

### Test Coverage

```bash
npm run test:ci
```

## 🔐 Environment Variables

Required environment variables:

| Variable                        | Description                             | Example                   |
| ------------------------------- | --------------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                    | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                  | `eyJh...`                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server-side) | `eyJh...`                 |
| `RESEND_API_KEY`                | Resend email API key                    | `re_...`                  |

See `.env.example` for all available variables.

## 🗃️ Database Schema

### Tables

**appointments**

- Stores client appointment bookings
- Fields: personal info, business details, project description, scheduling
- Status: pending, confirmed, completed, cancelled

**email_logs**

- Tracks all email communications
- Links to appointments via foreign key
- Stores delivery status and provider responses

See `src/lib/supabase/migrations/README.md` for detailed schema documentation.

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy**
   - `main` branch → Production
   - `develop` branch → Staging
   - Feature branches → Preview deployments

### Manual Deployment

```bash
npm run build
npm run start
```

## 📝 Git Workflow

This project uses **GitFlow** workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Commit Message Convention

We use **Conventional Commits** enforced by Commitlint:

```
feat: add new booking form
fix: resolve email validation issue
docs: update README with deployment steps
style: format code with prettier
refactor: restructure component hierarchy
test: add tests for Button component
chore: update dependencies
ci: configure GitHub Actions workflow
```

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Environment variables for sensitive data
- Security headers configured in `vercel.json`
- Email validation and sanitization
- Rate limiting (to be implemented in Phase 2)

## 🎨 Design System

### Colors

- **Primary (Emerald):** `#10B981` to `#059669` (gradient)
- **Secondary (Gray):** `#6B7280`, `#9CA3AF`
- **Error:** `#EF4444`
- **Success:** `#10B981`

### Typography

- **Font:** Inter (Google Fonts)
- **Scale:** 0.875rem, 1rem, 1.125rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 3rem

### Breakpoints

- `xs`: 320px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- **Developer:** Paulo
- **Project:** SetAppointmentApp
- **Phase:** 1 - Foundation & Setup

## 📞 Support

For questions or support, please contact:

- Email: contact@example.com
- GitHub Issues: [Create an issue](https://github.com/pau21nxn-prog/setappointmentapp/issues)

## 🗺️ Roadmap

### ✅ Phase 1: Foundation & Setup (Current)

- Project initialization and configuration
- Development tooling setup
- Basic component library
- Database schema and migrations
- CI/CD pipeline

### 📅 Phase 2: Core Features (Weeks 2-3)

- Hero section with video
- Portfolio carousel
- Multi-step booking form
- Form validation and submission
- Email notifications

### 📅 Phase 3: Enhancement & Polish (Week 4)

- Responsive design refinement
- Performance optimization
- SEO optimization
- Analytics integration
- Final testing and bug fixes

### 📅 Phase 4: Launch (Week 4)

- Production deployment
- Domain configuration
- Monitoring setup
- Launch checklist completion

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
