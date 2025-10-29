# Phase 1: Foundation & Setup (Week 1-2)

> **File**: `.claude/phases/PHASE-1-FOUNDATION.md`
> **Last Updated**: October 29, 2025
> **Status**: 🚧 CURRENT PHASE

---

## Prerequisites

Before starting this phase, read:

- [Architecture](../reference/ARCHITECTURE.md) - System overview and tech stack
- [Development Guidelines](../guides/DEVELOPMENT.md) - Coding standards
- [Git Workflow](../guides/GIT-WORKFLOW.md) - Branch strategy and commit conventions

## Related Files

- [CI/CD Guide](../guides/CI-CD.md) - Pipeline setup details
- [Common Tasks](../guides/COMMON-TASKS.md) - Component creation workflows

---

## Phase Overview

**Duration**: Week 1-2
**Focus**: Project initialization, development environment setup, CI/CD pipeline, basic infrastructure

**Goals**:

- Set up Next.js 14 project with TypeScript and Tailwind CSS
- Configure development tools (ESLint, Prettier, Husky)
- Establish CI/CD pipeline with GitHub Actions
- Set up Supabase database
- Configure Vercel hosting
- Prepare Cloudflare (DNS ready for later phases)
- Create basic component structure

---

## Checklist

### Git Repository Setup

- [ ] Clone repository: `git clone https://github.com/pau21nxn-prog/setappointmentapp.git`
- [ ] Create `develop` branch: `git checkout -b develop`
- [ ] Push develop to remote: `git push -u origin develop`
- [ ] Configure branch protection rules on GitHub

### Next.js Project Initialization

- [ ] Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir`
- [ ] Or manually set up if directory not empty
- [ ] Configure `next.config.js`
- [ ] Set up `tailwind.config.ts` with custom theme
- [ ] Create basic directory structure

### Development Tools Setup

- [ ] Install ESLint: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- [ ] Configure `.eslintrc.json`
- [ ] Install Prettier: `npm install -D prettier eslint-config-prettier`
- [ ] Configure `.prettierrc`
- [ ] Install Husky: `npm install -D husky lint-staged`
- [ ] Set up pre-commit hooks
- [ ] Install commitlint: `npm install -D @commitlint/cli @commitlint/config-conventional`

### CI/CD Pipeline Setup

- [ ] Create `.github/workflows/develop.yml`
- [ ] Create `.github/workflows/production.yml`
- [ ] Create `.github/workflows/pr-checks.yml`
- [ ] Add GitHub secrets (Vercel tokens)
- [ ] Test workflows with dummy commit

### Supabase Setup

- [ ] Create Supabase project
- [ ] Get project URL and anon key
- [ ] Create `appointments` table (see [Database Schema](../reference/DATABASE.md))
- [ ] Create `email_logs` table
- [ ] Set up Row Level Security (RLS) policies
- [ ] Install Supabase client: `npm install @supabase/supabase-js`

### Vercel Setup

- [ ] Create Vercel project
- [ ] Link to GitHub repository
- [ ] Configure environment variables
- [ ] Set up preview deployments
- [ ] Configure custom domain (when ready)

### Cloudflare Preparation

- [ ] Register domain name
- [ ] Create Cloudflare account
- [ ] Add site to Cloudflare
- [ ] Update nameservers at registrar
- [ ] Wait for DNS propagation

### Basic Component Structure

- [ ] Create `components/ui/Button` component
- [ ] Create `components/ui/Input` component
- [ ] Create `components/layout/Header` component
- [ ] Create `components/layout/Footer` component
- [ ] Set up component testing with Jest

---

## Commands

### Initialize Next.js project

```bash
npx create-next-app@latest . --typescript --tailwind --app
```

### Install dependencies

```bash
npm install @supabase/supabase-js
npm install resend
npm install react-hook-form zod @hookform/resolvers
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

### Git workflow commands

```bash
# Create develop branch
git checkout -b develop
git push -u origin develop

# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/setup-project

# Commit with proper format
git add .
git commit -m "feat(setup): initialize Next.js project with TypeScript

Set up Next.js 14 project with App Router, TypeScript, and Tailwind CSS.
Configured basic directory structure and development tools.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin feature/setup-project
```

---

## Context7 Prompts for Phase 1

Use these prompts to fetch the latest documentation:

- `use context7 for Next.js 14 project setup with TypeScript and App Router`
- `use context7 for Tailwind CSS configuration in Next.js 14`
- `use context7 for Supabase JavaScript client setup in Next.js`
- `use context7 for GitHub Actions CI/CD with Vercel deployment`
- `use context7 for ESLint configuration for Next.js and TypeScript`
- `use context7 for Husky pre-commit hooks setup`

---

## Key Configurations

### ESLint Configuration (`.eslintrc.json`)

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Commitlint Configuration (`commitlint.config.js`)

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### Husky Pre-commit Hook (`.husky/pre-commit`)

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Lint-staged Configuration (`package.json`)

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Verification Steps

After completing this phase, verify:

1. **Project Structure**:

   ```bash
   ls -la
   # Should see: src/, public/, .next/, node_modules/, etc.
   ```

2. **Development Server**:

   ```bash
   npm run dev
   # Should start on http://localhost:3000
   ```

3. **Linting**:

   ```bash
   npm run lint
   # Should pass without errors
   ```

4. **Type Checking**:

   ```bash
   npm run type-check
   # Should pass without errors
   ```

5. **Git Hooks**:

   ```bash
   # Try committing with wrong format
   git commit -m "wrong format"
   # Should fail with commitlint error
   ```

6. **Supabase Connection**:
   - Test connection in development
   - Verify tables are created
   - Check RLS policies are active

7. **Vercel Deployment**:
   - Push to develop branch
   - Verify automatic deployment
   - Check preview URL works

---

## Common Issues

### Issue: Port 3000 already in use

**Solution**:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: Husky hooks not working

**Solution**:

```bash
# Reinstall Husky
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Issue: Supabase connection fails

**Solution**:

- Verify `.env.local` exists with correct credentials
- Check Supabase project is not paused
- Ensure network connectivity

---

## Success Criteria

Phase 1 is complete when:

- ✅ Next.js project runs successfully in development
- ✅ All linters and type checks pass
- ✅ Git hooks prevent bad commits
- ✅ CI/CD pipeline runs on PR creation
- ✅ Vercel automatic deployments work
- ✅ Supabase connection is established
- ✅ Basic component structure is created
- ✅ All tests pass

---

## Next Phase

Once Phase 1 is complete, proceed to:

- [Phase 2: Core Features Development](./PHASE-2-CORE-FEATURES.md)

---

[Return to Main Index](../CLAUDE.md)
