# Code Review - Context7 Prompt Template

## Objective

Guide Claude through performing comprehensive code reviews for pull requests, ensuring code quality, security, performance, and adherence to project standards before merging.

---

## Prerequisites

Before starting code review:

- [ ] Pull request created with proper description
- [ ] All CI/CD checks passing (tests, lint, build)
- [ ] Preview deployment available and tested
- [ ] No merge conflicts
- [ ] Proper branch (feature/_ or fix/_ to develop)

---

## Review Checklist

### 1. General Code Quality

#### Readability

- [ ] Code is easy to understand
- [ ] Variable and function names are descriptive
- [ ] Complex logic has explanatory comments
- [ ] No dead code or commented-out blocks
- [ ] Consistent formatting throughout

#### Structure

- [ ] Functions are small and focused (single responsibility)
- [ ] Components are properly organized
- [ ] File structure follows project conventions
- [ ] Imports are organized correctly (external → internal → types → styles)
- [ ] No circular dependencies

#### Maintainability

- [ ] DRY principle followed (no unnecessary duplication)
- [ ] Magic numbers/strings extracted to constants
- [ ] Configuration externalized (no hardcoded values)
- [ ] Code is testable
- [ ] Changes are backwards compatible (or breaking changes documented)

---

### 2. TypeScript & Type Safety

**Use Context7**:

```
use context7 for TypeScript best practices and type safety patterns
```

#### Type Definitions

- [ ] All functions have proper type annotations
- [ ] No use of `any` type (unless absolutely necessary and documented)
- [ ] Interface/type definitions are clear and complete
- [ ] Types are properly exported/imported
- [ ] Generic types used appropriately

#### Type Safety

```typescript
// ❌ BAD
function process(data: any) {
  return data.field;
}

// ✅ GOOD
interface DataType {
  field: string;
}

function process(data: DataType): string {
  return data.field;
}
```

- [ ] No type assertions without justification
- [ ] Proper null/undefined handling
- [ ] Type guards used where appropriate
- [ ] Discriminated unions for complex types

---

### 3. React Component Best Practices

**Use Context7**:

```
use context7 for React component best practices and performance
```

#### Component Structure

- [ ] Functional components with proper typing
- [ ] Props interface defined in separate `.types.ts` file
- [ ] Component exported as named export
- [ ] Index file includes proper exports

#### Hooks Usage

```typescript
// ✅ Proper hook usage
const MemoizedComponent = React.memo(Component);

const value = useMemo(() => expensiveCalculation(data), [data]);

const callback = useCallback(() => {
  handleAction();
}, [dependencies]);

useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

- [ ] Hooks called at top level (not conditional)
- [ ] useEffect has proper dependencies
- [ ] useEffect includes cleanup when needed
- [ ] useMemo/useCallback used for performance
- [ ] No unnecessary re-renders

#### State Management

- [ ] State properly initialized
- [ ] State updates are immutable
- [ ] No direct state mutation
- [ ] State lifted appropriately
- [ ] Derived state computed, not stored

---

### 4. API Routes & Backend

**Use Context7**:

```
use context7 for Next.js 14 API Routes security and best practices
```

#### Request Handling

- [ ] Method validation (GET, POST, etc.)
- [ ] Request body parsing and validation
- [ ] Proper error responses with status codes
- [ ] Consistent response format

```typescript
// ✅ Good API route pattern
export async function POST(request: NextRequest) {
  try {
    // Validate method
    if (request.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Parse and validate
    const body = await request.json();
    const validated = schema.parse(body);

    // Process
    const result = await processData(validated);

    // Success response
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### Validation

- [ ] All inputs validated (Zod schemas)
- [ ] Custom validation messages
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection (if applicable)

#### Database Operations

- [ ] Proper error handling for database calls
- [ ] No SQL injection vulnerabilities
- [ ] Efficient queries (no N+1 problems)
- [ ] Transactions used when needed
- [ ] Connection pooling proper

---

### 5. Security

**Critical Security Checks**:

#### Input Validation

- [ ] All user inputs validated server-side
- [ ] Email validation proper
- [ ] Phone number validation proper
- [ ] File upload validation (if applicable)
- [ ] Size limits enforced

#### Data Exposure

- [ ] No sensitive data in client-side code
- [ ] No API keys or secrets in code
- [ ] Environment variables used properly
- [ ] No sensitive data in logs
- [ ] PII handled appropriately

#### Authentication & Authorization

- [ ] Protected routes require authentication
- [ ] Proper permission checks
- [ ] Session management secure
- [ ] JWT tokens validated properly

#### Common Vulnerabilities

- [ ] No XSS vulnerabilities (sanitized outputs)
- [ ] No SQL injection vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] No open redirects
- [ ] No command injection
- [ ] Rate limiting considered

---

### 6. Performance

**Use Context7**:

```
use context7 for React performance optimization techniques
use context7 for Next.js 14 performance best practices
```

#### Optimization

- [ ] Images optimized (Next.js Image component)
- [ ] Lazy loading implemented where appropriate
- [ ] Code splitting used
- [ ] Bundle size impact acceptable (<50KB for feature)
- [ ] No unnecessary dependencies added

#### React Performance

```typescript
// ✅ Performance optimizations
// 1. Memoization
const MemoizedComponent = React.memo(ExpensiveComponent);

// 2. useMemo for expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// 3. useCallback for functions passed to children
const handleClick = useCallback(() => {
  // Handler
}, [dependencies]);

// 4. Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

- [ ] No infinite loops in useEffect
- [ ] No unnecessary re-renders
- [ ] Large lists virtualized (if applicable)
- [ ] Images have proper dimensions
- [ ] Fonts optimized

#### Network

- [ ] API calls minimized
- [ ] Data fetching efficient
- [ ] Caching used appropriately
- [ ] No redundant requests
- [ ] Proper loading states

---

### 7. Accessibility

**Use Context7**:

```
use context7 for React accessibility (a11y) best practices
use context7 for WCAG 2.1 AA compliance
```

#### Semantic HTML

- [ ] Proper HTML5 semantic elements used
- [ ] Heading hierarchy correct (h1 → h2 → h3)
- [ ] Lists use `<ul>` or `<ol>`
- [ ] Forms use proper `<label>` elements
- [ ] Buttons are `<button>`, not `<div onClick>`

#### ARIA

```typescript
// ✅ Good accessibility
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>

<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

- [ ] ARIA labels where needed
- [ ] ARIA roles appropriate
- [ ] Live regions for dynamic content
- [ ] Hidden elements properly marked

#### Keyboard Navigation

- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Escape key closes modals
- [ ] Enter/Space activates buttons

#### Visual

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Not relying on color alone for information
- [ ] Text resizable
- [ ] Focus indicators visible
- [ ] No flashing content

---

### 8. Testing

**Use Context7**:

```
use context7 for React Testing Library best practices
use context7 for Jest testing patterns
```

#### Test Coverage

- [ ] Unit tests for new functions/components
- [ ] Integration tests for API routes
- [ ] Tests actually test behavior, not implementation
- [ ] Edge cases covered
- [ ] Error scenarios tested

#### Test Quality

```typescript
// ✅ Good test
describe('BookingForm', () => {
  it('should submit form with valid data', async () => {
    const handleSubmit = jest.fn();
    render(<BookingForm onSubmit={handleSubmit} />);

    // User interactions
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify behavior
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
        })
      );
    });
  });
});
```

- [ ] Tests are readable and maintainable
- [ ] No brittle tests (implementation details)
- [ ] Mocks used appropriately
- [ ] Async operations properly handled
- [ ] No flaky tests

#### Coverage Goals

- [ ] > 80% code coverage maintained
- [ ] New code has >90% coverage
- [ ] Critical paths have 100% coverage
- [ ] Coverage report reviewed

---

### 9. Documentation

#### Code Comments

- [ ] Complex logic explained
- [ ] JSDoc for public functions
- [ ] TODOs have issue numbers
- [ ] No obvious/redundant comments

```typescript
// ❌ BAD: Obvious comment
// Increment counter by 1
count++;

// ✅ GOOD: Explains why
// Reset count to 0 after reaching limit to prevent memory overflow
if (count >= MAX_COUNT) {
  count = 0;
}

/**
 * Creates a new appointment and sends confirmation email
 *
 * @param data - The appointment data from booking form
 * @returns The created appointment with generated ID
 * @throws {ValidationError} If data is invalid
 * @throws {DatabaseError} If database operation fails
 */
export async function createAppointment(data: AppointmentInput): Promise<Appointment> {
  // Implementation
}
```

#### Documentation Updates

- [ ] README updated (if setup changed)
- [ ] API documentation updated (if endpoints changed)
- [ ] Environment variables documented (if new vars added)
- [ ] Migration guide (if breaking changes)

---

### 10. Styling & UI

**Use Context7**:

```
use context7 for Tailwind CSS best practices
```

#### Tailwind CSS

- [ ] Uses design tokens from config
- [ ] Consistent spacing (using spacing scale)
- [ ] Responsive design implemented
- [ ] No arbitrary values without reason
- [ ] Classes organized (layout → spacing → colors → typography)

```typescript
// ✅ Good Tailwind usage
<div className="
  container mx-auto px-4
  py-8 md:py-12
  bg-white rounded-lg
  shadow-sm hover:shadow-md
  transition-shadow duration-200
">
  <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">
    {title}
  </h2>
</div>
```

#### Responsive Design

- [ ] Mobile-first approach
- [ ] Breakpoints used appropriately (sm, md, lg, xl)
- [ ] Tested on mobile (320px - 768px)
- [ ] Tested on tablet (768px - 1024px)
- [ ] Tested on desktop (1024px+)
- [ ] No horizontal scrolling

#### Visual Consistency

- [ ] Matches existing design patterns
- [ ] Spacing consistent with design system
- [ ] Colors from theme palette
- [ ] Typography follows scale
- [ ] Animations smooth and purposeful

---

### 11. Error Handling

#### Graceful Degradation

- [ ] User-friendly error messages
- [ ] Error boundaries for React components
- [ ] Fallback UI for errors
- [ ] Retry mechanisms where appropriate
- [ ] Network errors handled

```typescript
// ✅ Good error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  // Log for debugging
  console.error('Operation failed:', {
    error,
    context: { userId, timestamp },
  });

  // User-friendly message
  throw new AppError('Unable to complete operation. Please try again.', { cause: error });
}
```

#### Error Messages

- [ ] Errors logged appropriately (not exposed to users)
- [ ] Stack traces not shown in production
- [ ] Error codes consistent
- [ ] Helpful error messages
- [ ] Contact information for critical errors

---

### 12. Git & Commit Quality

#### Commit History

- [ ] Commits are logical and atomic
- [ ] Commit messages follow Conventional Commits
- [ ] No "fix typo" or "wip" commits (should be squashed)
- [ ] Each commit compiles and tests pass

#### Commit Messages

```
✅ GOOD:
feat(booking): add email validation to booking form

Implemented Zod email validation schema with custom error messages.
Added tests for valid and invalid email formats.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

❌ BAD:
fix stuff
update code
wip
```

- [ ] Type correct (feat, fix, docs, etc.)
- [ ] Scope appropriate
- [ ] Subject clear and concise
- [ ] Body explains what and why (not how)
- [ ] Claude co-author attribution included

#### Branch Management

- [ ] Feature branch from develop
- [ ] Branch name descriptive
- [ ] No merge conflicts
- [ ] Up to date with base branch

---

### 13. Dependencies

#### New Dependencies

- [ ] Necessity justified
- [ ] Package actively maintained
- [ ] No security vulnerabilities (npm audit)
- [ ] License compatible
- [ ] Size impact acceptable
- [ ] Alternatives considered

#### Package.json

- [ ] Dependencies vs devDependencies correct
- [ ] Version ranges appropriate (^x.y.z)
- [ ] No unused dependencies
- [ ] Lock file updated (package-lock.json)

---

### 14. Configuration

#### Environment Variables

- [ ] New variables documented in .env.example
- [ ] No secrets committed
- [ ] Variables validated at startup
- [ ] Proper naming convention (NEXT*PUBLIC* for client)

#### Config Files

- [ ] Changes necessary and minimal
- [ ] Comments explain non-obvious settings
- [ ] No breaking changes to existing config
- [ ] Backwards compatible

---

## Review Process

### Step 1: Automated Checks

Before manual review, ensure CI passes:

```bash
✅ Tests passing
✅ Linting passing
✅ Type checking passing
✅ Build succeeding
✅ Coverage threshold met
✅ Preview deployment successful
```

### Step 2: Code Review

1. **Read PR Description**
   - Understand what changes are made and why
   - Review acceptance criteria
   - Note any special testing instructions

2. **Review Files Changed**
   - Start with test files (understand expected behavior)
   - Review implementation files
   - Check for consistency with existing code

3. **Use GitHub Review Features**
   - Add inline comments for specific issues
   - Use "Request changes" for blockers
   - Use "Comment" for questions
   - Use "Approve" when ready to merge

### Step 3: Testing

1. **Pull branch locally**:

```bash
git fetch origin
git checkout feature/branch-name
npm install
npm run dev
```

2. **Manual testing**:
   - Test the feature works as described
   - Try edge cases
   - Test on different screen sizes
   - Check console for errors
   - Verify loading states
   - Test error scenarios

3. **Check preview deployment**:
   - Test in real environment
   - Share with stakeholders if needed

### Step 4: Provide Feedback

#### Good Feedback Examples

````markdown
## Blocking Issues

### Security: Input Validation Missing

**File**: `src/app/api/appointments/create/route.ts:23`

The email field is not validated server-side. This could allow invalid data into the database.

**Suggestion**: Add Zod validation:

```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
});
```
````

### Performance: Unnecessary Re-renders

**File**: `src/components/BookingForm/BookingForm.tsx:45`

The `handleChange` function is recreated on every render, causing child components to re-render unnecessarily.

**Suggestion**: Wrap with `useCallback`:

```typescript
const handleChange = useCallback((field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
}, []);
```

## Non-Blocking Suggestions

### Code Quality: Extract Magic Number

**File**: `src/lib/utils/validation.ts:12`

The number `10000` appears without context. Consider extracting to a named constant.

**Suggestion**:

```typescript
const MAX_APPOINTMENT_DURATION_MS = 10000;
```

## Questions

### Clarification Needed

**File**: `src/components/Portfolio/Carousel.tsx:78`

Why is the auto-rotation interval set to 3 seconds instead of 5 seconds as specified in the design doc?

## Praise

Great job on the comprehensive test coverage! The edge cases for date validation are well covered.

````

### Step 5: Re-review After Changes

- [ ] Verify requested changes were made
- [ ] Check if changes introduced new issues
- [ ] Approve if all feedback addressed

---

## Review Response Template

### For Author: Responding to Reviews

```markdown
## Response to Review Feedback

### Implemented Changes

✅ **Security: Input Validation**
- Added Zod validation for all API inputs
- Updated tests to cover validation
- Files changed: `route.ts`, `route.test.ts`

✅ **Performance: useCallback optimization**
- Wrapped event handlers in useCallback
- Verified no unnecessary re-renders with React DevTools
- Files changed: `BookingForm.tsx`

✅ **Code Quality: Extract constants**
- Created `constants/timeouts.ts` with named constants
- Updated all usages
- Files changed: `validation.ts`, `constants/timeouts.ts`

### Questions Answered

**Q: Why 3 seconds instead of 5 seconds for carousel?**
A: Based on user testing feedback, 5 seconds felt too slow. Updated design doc to reflect this change.

### Deferred Items

⏸️ **Refactor form state management**
- Agree this would be valuable
- Would prefer to handle in separate PR to keep this focused
- Created issue #456 to track

### Additional Changes

Made additional improvements:
- Fixed typo in error message
- Updated JSDoc comments for clarity
- Added missing ARIA label

Ready for re-review!
````

---

## Approval Criteria

PR can be approved when:

- [ ] All automated checks pass
- [ ] No blocking issues remain
- [ ] Code follows project conventions
- [ ] Tests adequate and passing
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Accessibility checked
- [ ] No merge conflicts
- [ ] At least one approval (per branch protection rules)

---

## Quick Reference

### Review Checklist Summary

```markdown
Code Quality: ✅ Readable, maintainable, DRY
TypeScript: ✅ Type-safe, no any, proper interfaces
React: ✅ Hooks correct, no unnecessary re-renders
API/Backend: ✅ Validation, error handling, security
Security: ✅ Input validated, no XSS/SQL injection
Performance: ✅ Optimized, <50KB impact
Accessibility: ✅ WCAG AA, keyboard nav, ARIA
Testing: ✅ >80% coverage, tests pass
Documentation: ✅ Code comments, docs updated
Styling: ✅ Consistent, responsive, accessible
Errors: ✅ Handled gracefully, user-friendly
Git: ✅ Clean commits, Conventional Commits
```

### Common Review Comments

```markdown
# Blocking

"This needs input validation before merging"
"Security concern: XSS vulnerability"
"TypeScript error needs to be fixed"
"Test coverage below threshold"

# Non-blocking

"Consider extracting this to a separate function"
"Might be more readable if..."
"Could use useMemo here for performance"

# Questions

"Why was this approach chosen over...?"
"Is this change backwards compatible?"
"What happens if the user...?"

# Praise

"Great test coverage!"
"Nice refactoring!"
"This handles the edge case well!"
```

---

**End of Code Review Prompt Template**
