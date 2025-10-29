# Appointment Validation Website - Claude AI Instructions

> **Version**: 1.0.1
> **Last Updated**: October 29, 2025
> **Current Phase**: 1 - Foundation & Setup
> **Repository**: https://github.com/pau21nxn-prog/setappointmentapp

---

## 🚀 Quick Start

**Project**: Single-page appointment booking website for client pre-qualification
**Tech Stack**: Next.js 14 + TypeScript + Tailwind CSS + Supabase + Vercel + Cloudflare
**Budget**: $0-15/month (using free tiers)
**Timeline**: 5-6 weeks total development

### Critical AI Assistant Guidelines

- ✅ Always use **Conventional Commits** with Claude co-author attribution
- ✅ Read files before editing
- ✅ Use **Context7** for latest docs (`use context7 for Next.js 14`, etc.)
- ✅ Run `npm run test:ci` before committing
- ❌ Never commit `.env` files or secrets
- ❌ All deployments are automatic via GitHub Actions

---

## 📋 Implementation Phases

| Phase                      | Status         | Duration | Focus                        | Documentation                                                 |
| -------------------------- | -------------- | -------- | ---------------------------- | ------------------------------------------------------------- |
| **1. Foundation & Setup**  | 🚧 In Progress | Week 1-2 | Project init, CI/CD, tools   | [PHASE-1-FOUNDATION.md](./phases/PHASE-1-FOUNDATION.md)       |
| **2. Core Features**       | ⏳ Upcoming    | Week 2-3 | UI components, forms         | [PHASE-2-CORE-FEATURES.md](./phases/PHASE-2-CORE-FEATURES.md) |
| **3. Backend Integration** | ⏳ Upcoming    | Week 3-4 | API, email, tests            | [PHASE-3-BACKEND.md](./phases/PHASE-3-BACKEND.md)             |
| **4. Optimization**        | ⏳ Upcoming    | Week 4-5 | Performance, SEO, Cloudflare | [PHASE-4-OPTIMIZATION.md](./phases/PHASE-4-OPTIMIZATION.md)   |
| **5. Launch**              | ⏳ Upcoming    | Week 5-6 | Testing, release, deploy     | [PHASE-5-LAUNCH.md](./phases/PHASE-5-LAUNCH.md)               |

---

## 📚 Technical Reference

### Core Documentation

- [**Architecture**](./reference/ARCHITECTURE.md) - System design, tech stack, directory structure
- [**Database Schema**](./reference/DATABASE.md) - Tables, types, Supabase queries
- [**API Specifications**](./reference/API.md) - Endpoint specs, validation, implementation
- [**Component Architecture**](./reference/COMPONENTS.md) - Component structure, patterns
- [**Design System**](./reference/DESIGN-SYSTEM.md) - Colors, typography, components

### Infrastructure & Configuration

- [**SEO & Performance**](./reference/SEO-PERFORMANCE.md) - Meta tags, optimization techniques
- [**Cloudflare Configuration**](./reference/CLOUDFLARE.md) - DNS, SSL, caching, firewall
- [**Email Templates**](./reference/EMAIL.md) - Resend integration, React Email templates
- [**Testing Strategy**](./reference/TESTING.md) - Jest, MSW, Playwright setup

---

## 🛠️ Development Guides

### Essential Workflows

- [**Development Guidelines**](./guides/DEVELOPMENT.md) - Coding standards, TypeScript, React patterns
- [**Git Workflow**](./guides/GIT-WORKFLOW.md) - GitFlow, branches, commit conventions
- [**CI/CD Pipeline**](./guides/CI-CD.md) - GitHub Actions, environment variables
- [**Deployment Strategy**](./guides/DEPLOYMENT.md) - Environments, rollback procedures

### Day-to-Day Operations

- [**Common Tasks**](./guides/COMMON-TASKS.md) - Creating components, API routes, running tests
- [**Troubleshooting**](./guides/TROUBLESHOOTING.md) - Common issues and solutions
- [**AI Guidelines**](./guides/AI-GUIDELINES.md) - How Claude should work with this project

---

## 📖 Project Meta

- [**Decision Log**](./meta/DECISIONS.md) - Architectural decisions and rationale
- [**Resources**](./meta/RESOURCES.md) - Official docs, links, Context7 prompts
- [**Changelog**](./meta/CHANGELOG.md) - Version history

---

## ⚡ Quick Reference

### Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production

# Testing
npm run test             # Unit tests
npm run test:ci          # CI test suite
npm run test:e2e         # E2E tests

# Linting
npm run lint             # ESLint
npm run lint:fix         # Auto-fix
```

### Current Phase Actions

**Phase 1 - Foundation & Setup** ([View Checklist](./phases/PHASE-1-FOUNDATION.md))

- [ ] Initialize Next.js project
- [ ] Set up directory structure
- [ ] Configure development tools (ESLint, Prettier, Husky)
- [ ] Set up CI/CD pipeline
- [ ] Create basic components

---

## 🤖 AI Assistant Quick Guide

### Before Starting Any Task

1. Read [AI Guidelines](./guides/AI-GUIDELINES.md) for workflow
2. Check current phase checklist in `./phases/`
3. Review relevant reference docs
4. Use Context7 for latest framework docs

### When Creating Features

1. Check [Development Guidelines](./guides/DEVELOPMENT.md)
2. Follow [Common Tasks](./guides/COMMON-TASKS.md) workflows
3. Reference [Component Architecture](./reference/COMPONENTS.md)
4. Use [Git Workflow](./guides/GIT-WORKFLOW.md) for commits

### When Stuck

1. Check [Troubleshooting Guide](./guides/TROUBLESHOOTING.md)
2. Review [Decision Log](./meta/DECISIONS.md) for context
3. Ask user for clarification

---

## 🎯 Project Overview

### Purpose & Objectives

**Primary Goal**: Create a professional, conversion-optimized landing page that pre-qualifies potential clients through a structured appointment booking system.

**Core Objectives**:

1. Validate genuine client interest before development discussions
2. Showcase portfolio through visual samples (12 project images)
3. Streamline appointment scheduling process
4. Automate initial client communication (confirmation + reminder emails)
5. Collect essential project information upfront

**Success Metrics**:

- Conversion Rate: Landing page visits → bookings
- Form Completion Rate: Started → completed bookings
- Appointment Show Rate: Scheduled → attended
- Page Load Speed: <3 seconds
- Lighthouse Score: 90+
- SEO: First page for local searches

### Project Context

**Volume Expectations**: 20-50 appointments per month
**Budget**: $0-15/month (well under $500 budget)
**Timeline**: 5-6 weeks total development
**Deployment Platform**: Vercel (hosting) + Cloudflare (CDN/security)

---

## 📊 System Architecture Overview

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
│  Backend (Next.js API Routes)                               │
└────┬─────────────────────────────────┬─────────────────────┘
     │                                  │
     ▼                                  ▼
┌─────────────────┐          ┌─────────────────────┐
│    Supabase     │          │   Resend Email API  │
│   (PostgreSQL)  │          │  (Email Delivery)   │
└─────────────────┘          └─────────────────────┘
```

For detailed architecture, see [ARCHITECTURE.md](./reference/ARCHITECTURE.md)

---

## 🔗 Important Links

- **Repository**: https://github.com/pau21nxn-prog/setappointmentapp
- **Tech Stack Details**: [ARCHITECTURE.md](./reference/ARCHITECTURE.md)
- **Getting Started**: [PHASE-1-FOUNDATION.md](./phases/PHASE-1-FOUNDATION.md)

---

**Last Updated**: October 29, 2025
**For questions or updates**: Ask the user or update relevant documentation files

---

## 📁 Documentation Structure

This project uses a modular documentation approach for token optimization:

```
.claude/
├── README.md (this file)          # Main navigation hub
├── phases/                        # Phase-specific implementation guides
├── reference/                     # Technical specifications
├── guides/                        # Development workflows
└── meta/                          # Project metadata
```

**Benefits**:

- 93% token reduction for typical usage
- Focused context loading
- Easy maintenance and updates
- Clear navigation

---

[Return to Top](#appointment-validation-website---claude-ai-instructions)
