# Testing - Context7 Prompt Template

## Objective

Guide Claude through comprehensive testing strategies for the appointment booking website, ensuring code quality, reliability, and preventing regressions through unit tests, integration tests, and end-to-end tests.

---

## Testing Philosophy

**Test-Driven Development (TDD)**: Write tests before implementation whenever possible.

**Testing Pyramid**:

```
        /\
       /E2E\       (Few) - End-to-end tests
      /------\
     /  Int   \    (Some) - Integration tests
    /----------\
   /    Unit    \  (Many) - Unit tests
  /--------------\
```

**Coverage Goals**:

- Overall code coverage: >80%
- New code coverage: >90%
- Critical paths: 100%

---

## Testing Stack

### Unit Testing

- **Framework**: Jest
- **React Testing**: React Testing Library
- **Coverage**: Istanbul (built into Jest)

### Integration Testing

- **Mocking**: MSW (Mock Service Worker)
- **API Testing**: Supertest (if needed)

### End-to-End Testing

- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Simulated devices

### Performance Testing

- **Tool**: Lighthouse CI
- **Metrics**: Core Web Vitals, Performance Score

---

## Unit Testing

**Use Context7**:

```
use context7 for Jest testing best practices
use context7 for React Testing Library patterns
use context7 for testing React hooks
```

### Component Testing

#### Basic Component Test Template

```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);

    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<ComponentName onClick={handleClick} />);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display error state', () => {
    render(<ComponentName error="Error message" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Error message');
  });

  it('should be accessible', () => {
    const { container } = render(<ComponentName />);

    expect(screen.getByRole('button')).toHaveAccessibleName();
    // Add more accessibility tests
  });
});
```

### Form Testing

**Use Context7**:

```
use context7 for testing React Hook Form with Jest
use context7 for testing form validation with Zod
```

#### Form Component Test Example

```typescript
// BookingForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from './BookingForm';

describe('BookingForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<BookingForm onSubmit={handleSubmit} />);

    // Fill in form fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify submission
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        })
      );
    });
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(<BookingForm onSubmit={jest.fn()} />);

    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Check for error messages
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(<BookingForm onSubmit={jest.fn()} />);

    // Enter invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Check for error
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('should move between steps in multi-step form', async () => {
    const user = userEvent.setup();

    render(<BookingForm onSubmit={jest.fn()} />);

    // Fill step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');

    // Go to step 2
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Verify step 2 is visible
    expect(screen.getByLabelText(/business nature/i)).toBeInTheDocument();

    // Go back to step 1
    await user.click(screen.getByRole('button', { name: /back/i }));

    // Verify step 1 data preserved
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
  });
});
```

### Hook Testing

```typescript
// useFormState.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFormState } from './useFormState';

describe('useFormState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormState({ name: '' }));

    expect(result.current.values).toEqual({ name: '' });
  });

  it('should update field value', () => {
    const { result } = renderHook(() => useFormState({ name: '' }));

    act(() => {
      result.current.updateField('name', 'John');
    });

    expect(result.current.values).toEqual({ name: 'John' });
  });

  it('should validate on change', () => {
    const { result } = renderHook(() => useFormState({ email: '' }, { validateOnChange: true }));

    act(() => {
      result.current.updateField('email', 'invalid');
    });

    expect(result.current.errors.email).toBeDefined();
  });
});
```

### Utility Function Testing

```typescript
// validation.test.ts
import { validateEmail, validatePhone, isValidDate } from './validation';

describe('validation utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(validatePhone('+12345678901')).toBe(true);
      expect(validatePhone('+442071234567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(isValidDate(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2020-01-01');

      expect(isValidDate(pastDate)).toBe(false);
    });
  });
});
```

---

## Integration Testing

**Use Context7**:

```
use context7 for API testing with Next.js
use context7 for Mock Service Worker (MSW) setup
```

### API Route Testing

```typescript
// route.test.ts
import { POST } from './route';
import { NextRequest } from 'next/server';
import { createAppointment } from '@/lib/supabase/queries';

// Mock database functions
jest.mock('@/lib/supabase/queries');

describe('POST /api/appointments/create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create appointment with valid data', async () => {
    const mockAppointment = {
      id: 'test-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      // ... other fields
    };

    (createAppointment as jest.Mock).mockResolvedValue(mockAppointment);

    const request = new NextRequest('http://localhost/api/appointments/create', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        businessNature: 'E-commerce business',
        systemRequest: 'Web Application Development',
        videoPlatform: 'zoom',
        appointmentDate: '2025-11-01',
        timeSlot: 'morning',
        timezone: 'America/New_York',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe('test-id');
    expect(createAppointment).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for invalid data', async () => {
    const request = new NextRequest('http://localhost/api/appointments/create', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'J', // Too short
        email: 'invalid-email',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
  });

  it('should return 500 on database error', async () => {
    (createAppointment as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost/api/appointments/create', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        // ... other valid fields
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
```

### MSW Setup for Integration Tests

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Mock Supabase API
  rest.post('https://*.supabase.co/rest/v1/appointments', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'mock-id',
        created_at: new Date().toISOString(),
        ...req.body,
      })
    );
  }),

  // Mock Resend API
  rest.post('https://api.resend.com/emails', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'mock-email-id',
      })
    );
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// jest.setup.js
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Full Flow Integration Test

```typescript
// booking-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { rest } from 'msw';
import App from '@/app/page';

describe('Booking Flow Integration', () => {
  it('should complete full booking flow', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Click "Book Now" button
    await user.click(screen.getByRole('button', { name: /book now/i }));

    // Fill Step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Fill Step 2
    await user.type(
      screen.getByLabelText(/business nature/i),
      'E-commerce business needing inventory management'
    );
    await user.selectOptions(
      screen.getByLabelText(/system request/i),
      'Web Application Development'
    );
    await user.selectOptions(
      screen.getByLabelText(/video platform/i),
      'zoom'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Fill Step 3
    await user.type(
      screen.getByLabelText(/appointment date/i),
      '2025-11-01'
    );
    await user.click(screen.getByRole('radio', { name: /morning/i }));
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/appointment confirmed/i)).toBeInTheDocument();
    });

    // Verify email sent message
    expect(
      screen.getByText(/confirmation email sent/i)
    ).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Override handler to return error
    server.use(
      rest.post('/api/appointments/create', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        );
      })
    );

    const user = userEvent.setup();

    render(<App />);

    // Fill and submit form (abbreviated)
    // ... fill all fields ...
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify error message displayed
    await waitFor(() => {
      expect(
        screen.getByText(/something went wrong/i)
      ).toBeInTheDocument();
    });
  });
});
```

---

## End-to-End Testing

**Use Context7**:

```
use context7 for Playwright testing best practices
use context7 for E2E testing patterns in Next.js
```

### Playwright Configuration

```typescript
// playwright.config.ts
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
    screenshot: 'only-on-failure',
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Appointment Booking Flow', () => {
  test('should complete full booking process', async ({ page }) => {
    await page.goto('/');

    // Verify homepage loaded
    await expect(page.locator('h1')).toContainText('Transform Your Business');

    // Click "Book Now"
    await page.click('text=Book Your Consultation');

    // Step 1: Personal Information
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+1234567890');
    await page.click('text=Next');

    // Step 2: Business Details
    await page.fill('[name="businessNature"]', 'E-commerce business');
    await page.selectOption('[name="systemRequest"]', 'Web Application Development');
    await page.selectOption('[name="videoPlatform"]', 'zoom');
    await page.click('text=Next');

    // Step 3: Schedule Selection
    await page.fill('[name="appointmentDate"]', '2025-11-01');
    await page.click('text=Morning');
    await page.click('text=Submit');

    // Verify success
    await expect(page.locator('text=Appointment Confirmed')).toBeVisible();
    await expect(page.locator('text=confirmation email')).toBeVisible();
  });

  test('should validate form fields', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Book Your Consultation');

    // Try to proceed without filling fields
    await page.click('text=Next');

    // Check for validation errors
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should allow going back in multi-step form', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Book Your Consultation');

    // Fill Step 1
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+1234567890');
    await page.click('text=Next');

    // Go to Step 2
    await expect(page.locator('text=Business Nature')).toBeVisible();

    // Go back to Step 1
    await page.click('text=Back');

    // Verify data preserved
    await expect(page.locator('[name="firstName"]')).toHaveValue('John');
    await expect(page.locator('[name="lastName"]')).toHaveValue('Doe');
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check mobile menu
    await page.click('[aria-label="Open menu"]');
    await expect(page.locator('nav')).toBeVisible();

    // Test carousel swipe gesture
    const carousel = page.locator('[data-testid="carousel"]');
    await carousel.hover();
    // Simulate swipe left
    await page.mouse.down();
    await page.mouse.move(-100, 0);
    await page.mouse.up();

    // Verify carousel moved
    await expect(carousel).toHaveAttribute('data-index', '1');
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="book-now-button"]')).toBeFocused();

    await page.keyboard.press('Enter');

    // Form should open
    await expect(page.locator('text=Personal Information')).toBeVisible();

    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="firstName"]')).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check important elements have ARIA labels
    await expect(page.locator('[aria-label="Book consultation"]')).toBeVisible();
    await expect(page.locator('[aria-label="Portfolio carousel"]')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('load');

    const loadTime = Date.now() - startTime;

    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    // LCP should be less than 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });
});
```

---

## Visual Regression Testing (Optional)

```typescript
// visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage should match screenshot', async ({ page }) => {
    await page.goto('/');

    // Take screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('booking form should match screenshot', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Book Your Consultation');

    await expect(page).toHaveScreenshot('booking-form-step1.png');
  });
});
```

---

## Test Organization

### Directory Structure

```
src/__tests__/
├── unit/
│   ├── components/
│   │   ├── BookingForm.test.tsx
│   │   ├── Hero.test.tsx
│   │   └── Portfolio.test.tsx
│   ├── utils/
│   │   ├── validation.test.ts
│   │   └── formatting.test.ts
│   └── hooks/
│       └── useFormState.test.ts
├── integration/
│   ├── api/
│   │   └── appointments.test.ts
│   └── flows/
│       └── booking-flow.test.tsx
└── e2e/
    ├── booking-flow.spec.ts
    ├── navigation.spec.ts
    └── responsive.spec.ts
```

---

## Running Tests

### Commands

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- BookingForm.test.tsx

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run E2E tests for specific browser
npm run test:e2e -- --project=chromium

# Run CI test suite (all tests + coverage)
npm run test:ci
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds (jest.config.js)

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

---

## Test Best Practices

### 1. Write Tests That Test Behavior, Not Implementation

```typescript
// ❌ BAD: Testing implementation details
expect(component.state.count).toBe(0);

// ✅ GOOD: Testing behavior
expect(screen.getByText('Count: 0')).toBeInTheDocument();
```

### 2. Use Descriptive Test Names

```typescript
// ❌ BAD
it('works', () => {});

// ✅ GOOD
it('should submit form when all required fields are filled', () => {});
```

### 3. Follow AAA Pattern (Arrange, Act, Assert)

```typescript
it('should increment counter', async () => {
  // Arrange
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });

  // Act
  await userEvent.click(button);

  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 4. Test Edge Cases

```typescript
describe('validateEmail', () => {
  // Happy path
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  // Edge cases
  it('should reject email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('should handle empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should handle null/undefined', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});
```

### 5. Don't Test External Libraries

```typescript
// ❌ BAD: Testing React Hook Form's functionality
it('should validate with react-hook-form', () => {
  // Testing library internals
});

// ✅ GOOD: Test your integration with the library
it('should display validation errors from form schema', () => {
  // Test your validation logic
});
```

### 6. Keep Tests Independent

```typescript
// ❌ BAD: Tests depend on each other
let user;
it('should create user', () => {
  user = createUser(); // Sets global variable
});
it('should update user', () => {
  updateUser(user); // Depends on previous test
});

// ✅ GOOD: Each test is independent
it('should create user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});
it('should update user', () => {
  const user = createUser();
  updateUser(user);
  expect(user.updated).toBe(true);
});
```

---

## Debugging Tests

### Debug Single Test

```bash
# Run specific test in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand ComponentName.test.tsx

# Then open chrome://inspect in Chrome
```

### Use screen.debug()

```typescript
import { render, screen } from '@testing-library/react';

it('should render component', () => {
  render(<Component />);

  // Print current DOM
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### Playwright Debug Mode

```bash
# Run in debug mode with browser visible
npm run test:e2e -- --debug

# Run in UI mode
npm run test:e2e:ui
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Quick Reference

### Testing Checklist

- [ ] Unit tests for all components
- [ ] Unit tests for all utility functions
- [ ] Integration tests for API routes
- [ ] E2E tests for critical user flows
- [ ] Tests for error scenarios
- [ ] Tests for edge cases
- [ ] Accessibility tests
- [ ] Responsive design tests
- [ ] Coverage >80%
- [ ] All tests passing

### Common Test Commands

```bash
# Development
npm run test                 # Watch mode
npm run test:coverage        # With coverage

# CI
npm run test:ci             # Full test suite

# E2E
npm run test:e2e            # All E2E tests
npm run test:e2e:headed     # With browser visible
npm run test:e2e:debug      # Debug mode

# Specific tests
npm run test -- ComponentName.test.tsx
npm run test:e2e -- booking-flow.spec.ts
```

---

**End of Testing Prompt Template**
