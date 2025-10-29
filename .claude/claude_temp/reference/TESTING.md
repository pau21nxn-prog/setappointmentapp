# Testing Strategy

> **File**: `.claude/reference/TESTING.md`
> **Last Updated**: October 29, 2025

---

## Testing Pyramid

```
        E2E Tests (Playwright)
       /                      \
      /    Integration Tests   \
     /       (MSW, API)          \
    /____________________________\
            Unit Tests
         (Jest, RTL)
```

**Target**: >80% code coverage

---

## Unit Testing with Jest

### Configuration

**jest.config.js**:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Component Test Example

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Button</Button>);
    const button = screen.getByText('Button');
    expect(button).toHaveClass('bg-primary-500');
  });
});
```

---

## Integration Testing with MSW

### Setup

```typescript
// src/__tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/appointments/create', async ({ request }) => {
    const body = await request.json();

    if (!body.email) {
      return HttpResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    return HttpResponse.json({
      success: true,
      data: {
        id: 'mock-id',
        appointmentDate: '2025-11-01',
        timeSlot: 'morning',
        confirmationEmailSent: true,
      },
    });
  }),
];
```

---

## E2E Testing with Playwright

### Configuration

**playwright.config.ts**:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example

```typescript
// src/__tests__/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete full booking process', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Book Your Consultation');

    // Fill Step 1
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+1234567890');
    await page.click('text=Next');

    // Fill Step 2
    await page.fill('[name="businessNature"]', 'E-commerce business');
    await page.selectOption('[name="systemRequest"]', 'Web Application Development');
    await page.selectOption('[name="videoPlatform"]', 'zoom');
    await page.click('text=Next');

    // Fill Step 3
    await page.fill('[name="appointmentDate"]', '2025-11-01');
    await page.click('text=Morning');
    await page.click('text=Submit');

    // Verify success
    await expect(page.locator('text=Appointment Confirmed')).toBeVisible();
  });
});
```

---

## Commands

```bash
# Unit tests
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# E2E tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:headed   # With browser UI

# CI
npm run test:ci           # Full suite
```

---

**Context7**: `use context7 for Playwright E2E testing best practices in Next.js`

[Return to Main Index](../CLAUDE.md)
