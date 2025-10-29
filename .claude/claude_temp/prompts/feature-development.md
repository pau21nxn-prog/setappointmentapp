# Feature Development - Context7 Prompt Template

## Objective

Guide Claude through implementing a new feature for the appointment booking website following best practices, test-driven development, and maintaining consistency with the existing codebase.

---

## Prerequisites

Before starting feature development, ensure:

- [ ] Feature branch created from `develop`
- [ ] Feature requirements are clear and documented
- [ ] Related issue/ticket number available (if applicable)
- [ ] Design mockups or specifications available (if UI feature)
- [ ] Acceptance criteria defined

---

## Context to Provide

When using this prompt, provide Claude with:

1. **Feature Description**: Clear explanation of what needs to be built
2. **User Story** (if applicable): "As a [user], I want to [action], so that [benefit]"
3. **Acceptance Criteria**: List of requirements that must be met
4. **Related Files**: Existing components or files that will be affected
5. **Design Specifications**: Colors, spacing, responsive behavior (if UI)
6. **API Requirements**: Endpoints needed, request/response formats (if backend)

---

## Execution Steps

### Step 1: Research & Planning

**Use Context7** to fetch latest documentation:

```
use context7 for Next.js 14 App Router [specific feature]
use context7 for React [specific hook or pattern]
use context7 for Tailwind CSS [specific utility classes]
use context7 for TypeScript [specific type pattern]
```

**Actions**:

1. Read existing related code to understand current patterns
2. Identify which files need to be created or modified
3. Plan component structure and data flow
4. Identify dependencies that need to be installed

### Step 2: Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/feature-name
```

### Step 3: Set Up File Structure

**For UI Components**:

```bash
mkdir -p src/components/[category]/ComponentName
cd src/components/[category]/ComponentName
touch ComponentName.tsx
touch ComponentName.types.ts
touch ComponentName.test.tsx
touch index.ts
```

**For API Routes**:

```bash
mkdir -p src/app/api/resource/action
touch src/app/api/resource/action/route.ts
touch src/app/api/resource/action/route.test.ts
```

**For Utility Functions**:

```bash
mkdir -p src/lib/category
touch src/lib/category/utilityName.ts
touch src/lib/category/utilityName.test.ts
```

### Step 4: Write Tests First (TDD)

**Component Test Template**:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('should display correct data', () => {
    const testData = { ... };
    render(<ComponentName data={testData} />);

    expect(screen.getByText(testData.field)).toBeInTheDocument();
  });
});
```

**API Route Test Template**:

```typescript
import { POST } from './route';
import { NextRequest } from 'next/server';

describe('POST /api/resource/action', () => {
  it('should return success with valid data', async () => {
    const request = new NextRequest('http://localhost/api/resource/action', {
      method: 'POST',
      body: JSON.stringify({ field: 'value' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should return error with invalid data', async () => {
    const request = new NextRequest('http://localhost/api/resource/action', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
```

### Step 5: Implement Feature

**Component Implementation Pattern**:

```typescript
// ComponentName.tsx
import { useState, useEffect } from 'react';
import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  onAction,
}) => {
  // State
  const [state, setState] = useState<StateType>(initialState);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
    onAction?.();
  };

  // Early returns for edge cases
  if (!prop1) {
    return <div>Loading...</div>;
  }

  // Main render
  return (
    <div className="component-name" data-testid="component-name">
      {/* JSX */}
    </div>
  );
};
```

**Types Definition**:

```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: () => void;
}

export interface ComponentNameState {
  field1: string;
  field2: boolean;
}
```

**Index File**:

```typescript
// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### Step 6: API Route Implementation (if applicable)

**Use Context7**:

```
use context7 for Next.js 14 API Routes with TypeScript and error handling
```

**Implementation Pattern**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema
const requestSchema = z.object({
  field1: z.string().min(1, 'Field1 is required'),
  field2: z.number().positive('Field2 must be positive'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const validated = requestSchema.parse(body);

    // Process request (database, external API, etc.)
    const result = await processData(validated);

    // Return success response
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 7: Styling (for UI components)

**Use Context7**:

```
use context7 for Tailwind CSS responsive design patterns
use context7 for Tailwind CSS accessibility best practices
```

**Best Practices**:

- Use existing design tokens from `tailwind.config.ts`
- Maintain consistency with existing components
- Implement responsive design (mobile-first)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test on multiple screen sizes

**Example**:

```typescript
<div className="
  container mx-auto px-4
  py-8 md:py-12 lg:py-16
  bg-white rounded-lg shadow-lg
  hover:shadow-xl transition-shadow duration-200
">
  <h2 className="
    text-2xl md:text-3xl lg:text-4xl
    font-bold text-neutral-dark
    mb-4
  ">
    {title}
  </h2>
  {/* Rest of component */}
</div>
```

### Step 8: Integration

1. **Import in parent component** or page
2. **Pass required props** with proper types
3. **Handle callbacks** and state updates
4. **Test integration** with existing features

### Step 9: Run Tests

```bash
# Run new tests
npm run test -- ComponentName.test.tsx

# Run all tests to ensure nothing broke
npm run test

# Run type checking
npm run type-check

# Run linter
npm run lint
```

### Step 10: Manual Testing

1. Start development server: `npm run dev`
2. Navigate to feature in browser
3. Test all user interactions
4. Test responsive behavior (mobile, tablet, desktop)
5. Test error scenarios
6. Verify accessibility (keyboard navigation, screen readers)

### Step 11: Documentation

Update relevant documentation:

- Add JSDoc comments to complex functions
- Update README if feature affects setup/usage
- Document new environment variables (if any)
- Update API documentation (if new endpoints)

### Step 12: Commit Changes

```bash
# Stage files
git add .

# Commit with Conventional Commits format
git commit -m "feat(scope): add feature description

Detailed explanation of what was implemented and why.
List any important technical decisions or tradeoffs.

Acceptance criteria met:
- Criterion 1
- Criterion 2
- Criterion 3

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin feature/feature-name
```

### Step 13: Create Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base branch to `develop`
4. Fill in PR template:

```markdown
## Feature Description

[Brief description of the feature]

## Related Issue

Closes #[issue-number]

## Changes Made

- Added ComponentName component
- Implemented API endpoint /api/resource/action
- Added form validation with Zod
- Updated database schema
- Added unit and integration tests

## Testing Performed

- [ ] Unit tests pass (100% coverage for new code)
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Responsive design verified
- [ ] Accessibility tested
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

## Screenshots (if UI changes)

[Add screenshots or GIFs]

## Checklist

- [ ] Code follows project conventions
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Lighthouse score maintained (90+)
- [ ] TypeScript types properly defined
- [ ] Accessibility requirements met (WCAG 2.1 AA)

## Additional Notes

[Any additional context or information]
```

---

## Expected Outputs

After completing this workflow, you should have:

- [ ] **Component Files**:
  - Component implementation (`.tsx`)
  - Type definitions (`.types.ts`)
  - Unit tests (`.test.tsx`)
  - Index exports (`index.ts`)

- [ ] **API Route** (if applicable):
  - Route handler (`route.ts`)
  - Request validation schema
  - Error handling
  - Tests

- [ ] **Tests**:
  - Unit tests for all functions/components
  - Integration tests for API routes
  - All tests passing
  - Coverage >80%

- [ ] **Documentation**:
  - JSDoc comments for complex logic
  - Updated README (if needed)
  - API documentation (if new endpoints)

- [ ] **Git**:
  - Feature branch with descriptive name
  - Clean commit history
  - Conventional Commits format
  - Pull request created

---

## Quality Checks

Before marking feature complete, verify:

### Code Quality

- [ ] No TypeScript errors: `npm run type-check`
- [ ] No ESLint errors: `npm run lint`
- [ ] Code follows existing patterns and conventions
- [ ] No hardcoded values (use constants or config)
- [ ] No console.log statements (use proper logging)
- [ ] Error handling implemented for all edge cases

### Testing

- [ ] All tests pass: `npm run test:ci`
- [ ] Test coverage >80% for new code
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Integration with existing features tested

### Performance

- [ ] Images optimized (use Next.js Image component)
- [ ] No unnecessary re-renders
- [ ] Lazy loading implemented where appropriate
- [ ] Bundle size impact acceptable (<50KB for new code)

### Accessibility

- [ ] Semantic HTML used
- [ ] ARIA labels where necessary
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Screen reader tested

### Responsive Design

- [ ] Mobile (320px - 768px) tested
- [ ] Tablet (768px - 1024px) tested
- [ ] Desktop (1024px+) tested
- [ ] Touch gestures work on mobile
- [ ] No horizontal scrolling

### Security

- [ ] User input validated (client and server)
- [ ] No XSS vulnerabilities
- [ ] No SQL injection risks
- [ ] Sensitive data not exposed
- [ ] Rate limiting considered (for API routes)

---

## Common Feature Types

### 1. Form Component

**Context7 Prompts**:

```
use context7 for React Hook Form with Zod validation
use context7 for accessible form patterns in React
```

**Key Considerations**:

- Form validation with Zod
- Error message display
- Loading states during submission
- Success confirmation
- Accessibility (labels, ARIA)

### 2. Data Display Component

**Context7 Prompts**:

```
use context7 for React data fetching patterns
use context7 for loading and error states in React
```

**Key Considerations**:

- Loading skeleton
- Error handling and retry
- Empty states
- Pagination (if large dataset)

### 3. Interactive Component (carousel, modal, etc.)

**Context7 Prompts**:

```
use context7 for React animations and transitions
use context7 for accessible modal patterns
```

**Key Considerations**:

- Animation performance
- Keyboard controls
- Focus management
- Mobile gestures

### 4. API Endpoint

**Context7 Prompts**:

```
use context7 for Next.js 14 API Routes best practices
use context7 for Supabase database queries with TypeScript
```

**Key Considerations**:

- Request validation
- Authentication (if needed)
- Rate limiting
- Error responses
- Database transactions

---

## Troubleshooting

### Issue: Tests failing

**Solution**:

1. Read error messages carefully
2. Check test setup and mocks
3. Verify component renders correctly
4. Check async operations are awaited
5. Update snapshots if needed: `npm run test -- -u`

### Issue: TypeScript errors

**Solution**:

1. Run `npm run type-check` to see all errors
2. Ensure all props have defined types
3. Check import statements
4. Verify types match function signatures
5. Use `as const` for literal types when needed

### Issue: Component not rendering correctly

**Solution**:

1. Check browser console for errors
2. Verify props are passed correctly
3. Check CSS classes are applied
4. Test with simplified version
5. Use React DevTools to inspect component tree

### Issue: API route not working

**Solution**:

1. Check Vercel/terminal logs for errors
2. Verify request format matches schema
3. Test with curl or Postman
4. Check CORS settings
5. Verify environment variables loaded

---

## Example: Complete Feature Implementation

**Feature**: Add "Time Slot Selection" component to booking form

**User Story**: As a user, I want to select a time slot for my appointment so that I can choose the most convenient time.

**Acceptance Criteria**:

- Display three time slots: Morning, Afternoon, Evening
- Allow single selection (radio button behavior)
- Show time ranges for each slot
- Highlight selected slot
- Validate that a slot is selected before proceeding
- Mobile-responsive design

**Implementation**:

```typescript
// 1. Create types
// TimeSlotSelector.types.ts
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface TimeSlotOption {
  value: TimeSlot;
  label: string;
  timeRange: string;
  icon?: React.ReactNode;
}

export interface TimeSlotSelectorProps {
  value?: TimeSlot;
  onChange: (slot: TimeSlot) => void;
  error?: string;
}

// 2. Write tests
// TimeSlotSelector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeSlotSelector } from './TimeSlotSelector';

describe('TimeSlotSelector', () => {
  it('should render all time slots', () => {
    render(<TimeSlotSelector onChange={() => {}} />);

    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Afternoon')).toBeInTheDocument();
    expect(screen.getByText('Evening')).toBeInTheDocument();
  });

  it('should call onChange when slot is selected', () => {
    const handleChange = jest.fn();
    render(<TimeSlotSelector onChange={handleChange} />);

    fireEvent.click(screen.getByText('Morning'));
    expect(handleChange).toHaveBeenCalledWith('morning');
  });

  it('should highlight selected slot', () => {
    render(<TimeSlotSelector value="afternoon" onChange={() => {}} />);

    const afternoonSlot = screen.getByText('Afternoon').closest('button');
    expect(afternoonSlot).toHaveClass('bg-primary-500');
  });

  it('should display error message', () => {
    render(
      <TimeSlotSelector
        onChange={() => {}}
        error="Please select a time slot"
      />
    );

    expect(screen.getByText('Please select a time slot')).toBeInTheDocument();
  });
});

// 3. Implement component
// TimeSlotSelector.tsx
import type { TimeSlotSelectorProps, TimeSlotOption } from './TimeSlotSelector.types';

const TIME_SLOTS: TimeSlotOption[] = [
  { value: 'morning', label: 'Morning', timeRange: '8:00 AM - 12:00 PM' },
  { value: 'afternoon', label: 'Afternoon', timeRange: '1:00 PM - 5:00 PM' },
  { value: 'evening', label: 'Evening', timeRange: '6:00 PM - 11:00 PM' },
];

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-dark">
        Select Time Slot *
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => onChange(slot.value)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${
                value === slot.value
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-neutral-light bg-white text-neutral-dark hover:border-primary-300'
              }
            `}
            aria-pressed={value === slot.value}
          >
            <div className="text-lg font-semibold">{slot.label}</div>
            <div className={`text-sm ${value === slot.value ? 'text-white' : 'text-neutral-gray'}`}>
              {slot.timeRange}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// 4. Export
// index.ts
export { TimeSlotSelector } from './TimeSlotSelector';
export type { TimeSlotSelectorProps, TimeSlot } from './TimeSlotSelector.types';

// 5. Integrate in booking form
// In BookingForm component, use the TimeSlotSelector
import { TimeSlotSelector } from '@/components/ui/TimeSlotSelector';

// Inside form
<TimeSlotSelector
  value={formData.timeSlot}
  onChange={(slot) => setFormData({ ...formData, timeSlot: slot })}
  error={errors.timeSlot}
/>

// 6. Commit
git add .
git commit -m "feat(booking): add time slot selector component

Implemented TimeSlotSelector component for Step 3 of booking form.
Users can now select Morning, Afternoon, or Evening time slots.

Features:
- Three time slot options with time ranges
- Visual feedback for selected slot
- Error message display
- Responsive grid layout
- Accessibility support (ARIA attributes)

Tests:
- Unit tests for rendering and interactions
- 100% coverage for new component

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Notes

- **Always use Context7** to fetch latest documentation before implementing
- **Test-driven development** is mandatory - write tests first
- **Follow existing patterns** in the codebase for consistency
- **Ask for clarification** if requirements are unclear
- **Consider edge cases** and error scenarios
- **Think about accessibility** from the start, not as an afterthought
- **Keep components small** and focused on single responsibility
- **Document complex logic** with comments

---

## Quick Reference Commands

```bash
# Create feature branch
git checkout -b feature/feature-name

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- ComponentName.test.tsx

# Type check
npm run type-check

# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Start dev server
npm run dev

# Build for production
npm run build

# Commit
git commit -m "feat(scope): description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
git push origin feature/feature-name
```

---

**End of Feature Development Prompt Template**
