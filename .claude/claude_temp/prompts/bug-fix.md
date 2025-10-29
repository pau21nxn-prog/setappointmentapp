# Bug Fix - Context7 Prompt Template

## Objective

Guide Claude through systematically identifying, reproducing, fixing, and verifying bugs in the appointment booking website while maintaining code quality and preventing regressions.

---

## Prerequisites

Before starting bug fix, ensure:

- [ ] Bug is confirmed and reproducible
- [ ] Steps to reproduce are documented
- [ ] Expected vs actual behavior is clear
- [ ] Issue number or ticket available (if applicable)
- [ ] Severity/priority is understood
- [ ] Hotfix branch created (if critical)

---

## Context to Provide

When using this prompt, provide Claude with:

1. **Bug Description**: Clear explanation of what's wrong
2. **Steps to Reproduce**: Exact steps to trigger the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device (if relevant)
6. **Error Messages**: Console errors, stack traces, logs
7. **Affected Files**: Known or suspected files (if known)
8. **Severity**: Critical, High, Medium, Low
9. **User Impact**: How many users affected, what functionality broken

---

## Execution Steps

### Step 1: Understand the Bug

**Use Context7** to research related areas:

```
use context7 for debugging React components
use context7 for Next.js error handling patterns
use context7 for common TypeScript errors
use context7 for browser debugging tools
```

**Actions**:

1. Read bug report carefully
2. Identify affected feature/component
3. Check recent commits for related changes: `git log --oneline -- path/to/file`
4. Search for similar issues in codebase
5. Review error logs if available

### Step 2: Reproduce the Bug

**Critical**: You must be able to reproduce the bug reliably before fixing it.

**Actions**:

1. Follow exact reproduction steps
2. Try to reproduce in different environments (if applicable)
3. Note any conditions required (logged in, specific data, timing, etc.)
4. Document minimal reproduction steps
5. Take screenshots/recordings if helpful

**If unable to reproduce**:

- Ask for more details from bug reporter
- Check if issue was already fixed
- Verify environment setup matches reporter's

### Step 3: Create Branch

**For Regular Bugs** (targeting develop):

```bash
git checkout develop
git pull origin develop
git checkout -b fix/bug-description
```

**For Critical Hotfixes** (targeting main):

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-description
```

### Step 4: Write Failing Test

**Test-Driven Bug Fixing**: Write a test that reproduces the bug (should fail initially).

**Component Bug Test Example**:

```typescript
// ComponentName.test.tsx
describe('ComponentName - Bug Fix', () => {
  it('should handle edge case that causes bug', () => {
    // Arrange: Set up conditions that trigger bug
    const problematicData = { ... };

    // Act: Perform action that causes bug
    render(<ComponentName data={problematicData} />);

    // Assert: Verify correct behavior (this should fail initially)
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

**API Bug Test Example**:

```typescript
// route.test.ts
describe('POST /api/endpoint - Bug Fix', () => {
  it('should handle malformed request without crashing', async () => {
    const malformedRequest = new NextRequest('http://localhost/api/endpoint', {
      method: 'POST',
      body: JSON.stringify({ unexpected: 'field' }),
    });

    const response = await POST(malformedRequest);

    // Should return error, not crash
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
```

**Run test to confirm it fails**:

```bash
npm run test -- ComponentName.test.tsx
```

### Step 5: Investigate Root Cause

**Debugging Techniques**:

1. **Add Logging**:

```typescript
console.log('Debug: value at this point:', value);
console.log('Debug: state before update:', state);
```

2. **Use Browser DevTools**:
   - Breakpoints in Sources tab
   - React DevTools to inspect component state
   - Network tab for API calls
   - Console for errors

3. **Check Common Issues**:
   - Null/undefined values
   - Type mismatches
   - Async timing issues
   - Missing error handling
   - Incorrect state updates
   - Memory leaks
   - Race conditions

4. **Use Context7** for specific issues:

```
use context7 for React useEffect dependencies
use context7 for Next.js async component patterns
use context7 for TypeScript type narrowing
```

**Document Findings**:

- What was causing the bug
- Why it wasn't caught earlier
- What assumptions were wrong

### Step 6: Implement Fix

**Principles**:

- Make minimal changes necessary
- Don't refactor unrelated code
- Maintain existing patterns
- Add defensive programming (null checks, validation)
- Consider edge cases

**Common Fix Patterns**:

**Null/Undefined Check**:

```typescript
// ❌ BAD: Crashes if data is null
const result = data.field.toLowerCase();

// ✅ GOOD: Safe access
const result = data?.field?.toLowerCase() ?? '';
```

**Async Error Handling**:

```typescript
// ❌ BAD: Unhandled promise rejection
const data = await fetchData();

// ✅ GOOD: Proper error handling
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch:', error);
  throw new Error('Data fetch failed');
}
```

**Type Safety**:

```typescript
// ❌ BAD: Unsafe type assertion
const value = data as string;

// ✅ GOOD: Type guard
if (typeof data === 'string') {
  const value = data;
  // Use value safely
}
```

**State Update**:

```typescript
// ❌ BAD: Direct state mutation
state.field = newValue;

// ✅ GOOD: Immutable update
setState({ ...state, field: newValue });
```

**Race Condition**:

```typescript
// ❌ BAD: Race condition possible
useEffect(() => {
  fetchData().then(setData);
}, []);

// ✅ GOOD: Cleanup to prevent race condition
useEffect(() => {
  let cancelled = false;

  fetchData().then((result) => {
    if (!cancelled) {
      setData(result);
    }
  });

  return () => {
    cancelled = true;
  };
}, []);
```

### Step 7: Verify Fix

**Run the failing test**:

```bash
npm run test -- ComponentName.test.tsx
```

**Test should now pass**.

**Additional Verification**:

1. Manually test the original reproduction steps
2. Test related functionality (ensure no new issues)
3. Test edge cases
4. Check for performance impact

### Step 8: Run Full Test Suite

Ensure fix doesn't break anything else:

```bash
# Run all unit tests
npm run test

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run build
npm run build

# Run E2E tests (if relevant)
npm run test:e2e
```

### Step 9: Add Regression Test

Ensure this bug can't happen again:

```typescript
describe('Regression Tests', () => {
  it('should not allow duplicate appointments (Issue #123)', () => {
    // Test that prevents bug from recurring
  });
});
```

### Step 10: Clean Up Debug Code

Remove all debugging statements:

- console.log
- debugger statements
- Commented-out code
- Temporary variables

### Step 11: Update Documentation (if needed)

If bug revealed documentation issues:

- Update code comments
- Update README
- Update API documentation
- Add JSDoc if missing

### Step 12: Commit Fix

```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "fix(scope): resolve bug description

Issue: [Brief description of the bug]
Root Cause: [What was causing the bug]
Solution: [How it was fixed]

Fixes #[issue-number]

Changes:
- Fixed null pointer exception in ComponentName
- Added defensive null checks
- Updated tests to cover edge case

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin fix/bug-description
```

### Step 13: Create Pull Request

```markdown
## Bug Fix

### Issue Description

[Clear description of the bug]

Fixes #[issue-number]

### Root Cause

[Explanation of what was causing the bug]

### Solution

[Explanation of how the bug was fixed]

### Changes Made

- [ ] Fixed [specific issue]
- [ ] Added null checks in [component/file]
- [ ] Updated [component] to handle [edge case]
- [ ] Added regression test

### Testing

- [ ] Failing test added and now passes
- [ ] Manual testing completed
- [ ] Regression test added
- [ ] All existing tests still pass
- [ ] No new console errors

### Verification Steps

1. [Step 1 to verify fix]
2. [Step 2 to verify fix]
3. [Step 3 to verify fix]

### Screenshots/Recordings

[If applicable]

### Impact Analysis

- **Affected Users**: [Who was affected]
- **Severity**: [Critical/High/Medium/Low]
- **Workaround Available**: [Yes/No - describe if yes]

### Related Issues

[Link to related issues or PRs]

### Checklist

- [ ] Bug reproduced and verified
- [ ] Failing test added
- [ ] Fix implemented
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated (if needed)
- [ ] Ready for merge
```

---

## Expected Outputs

After completing bug fix workflow:

- [ ] **Bug Reproduced**: Confirmed reproduction steps
- [ ] **Root Cause Identified**: Clear understanding of what caused bug
- [ ] **Failing Test Written**: Test that demonstrates the bug
- [ ] **Fix Implemented**: Minimal, targeted fix
- [ ] **Test Passes**: Fix resolves the issue
- [ ] **No Regressions**: All existing tests still pass
- [ ] **Regression Test Added**: Prevents bug from recurring
- [ ] **Documentation**: Updated if needed
- [ ] **Clean Commit**: Clear commit message with context
- [ ] **Pull Request**: Detailed PR with reproduction and fix details

---

## Quality Checks

Before marking bug as fixed:

### Verification

- [ ] Bug no longer reproduces with original steps
- [ ] Fix works in all environments (dev, staging, production)
- [ ] No error messages in console
- [ ] Performance not negatively impacted
- [ ] Related features still work correctly

### Testing

- [ ] New test added that would catch this bug
- [ ] All tests pass: `npm run test:ci`
- [ ] E2E tests pass (if relevant)
- [ ] Manual testing completed
- [ ] Edge cases tested

### Code Quality

- [ ] Minimal changes made (no unnecessary refactoring)
- [ ] No debug code left in
- [ ] TypeScript types correct
- [ ] Error handling proper
- [ ] Code follows project conventions

### Documentation

- [ ] Code comments added for complex fixes
- [ ] PR description explains root cause and solution
- [ ] Related documentation updated
- [ ] Known limitations documented (if any)

---

## Common Bug Categories

### 1. Null/Undefined Errors

**Symptoms**:

- "Cannot read property 'x' of undefined"
- "Cannot read properties of null"
- Blank screens or missing data

**Context7 Prompts**:

```
use context7 for TypeScript optional chaining and nullish coalescing
use context7 for defensive programming in TypeScript
```

**Common Fixes**:

```typescript
// Optional chaining
const value = data?.field?.nestedField;

// Nullish coalescing
const displayValue = value ?? 'default';

// Type guards
if (data && typeof data.field === 'string') {
  // Safe to use data.field
}

// Early return
if (!data) {
  return <Loading />;
}
```

### 2. Async Timing Issues

**Symptoms**:

- Race conditions
- Stale data displayed
- Updates not reflecting
- "Cannot update component while rendering"

**Context7 Prompts**:

```
use context7 for React useEffect cleanup
use context7 for async state updates in React
```

**Common Fixes**:

```typescript
// Add cleanup to useEffect
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const result = await api.getData();
    if (!cancelled) {
      setData(result);
    }
  }

  fetchData();

  return () => {
    cancelled = true;
  };
}, []);

// Use AbortController for fetch
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then((res) => res.json())
    .then(setData);

  return () => controller.abort();
}, []);
```

### 3. Form Validation Bugs

**Symptoms**:

- Invalid data submitted
- Validation errors not showing
- Form stuck in loading state
- Success message when it should fail

**Context7 Prompts**:

```
use context7 for React Hook Form error handling
use context7 for Zod schema validation edge cases
```

**Common Fixes**:

```typescript
// Ensure proper Zod schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone'),
});

// Handle validation errors in API
try {
  const validated = schema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }
}

// Display errors in form
{errors.email && (
  <span className="text-error text-sm">{errors.email.message}</span>
)}
```

### 4. API/Database Errors

**Symptoms**:

- 500 errors
- Data not saving
- Timeout errors
- Database connection issues

**Context7 Prompts**:

```
use context7 for Next.js API error handling
use context7 for Supabase error handling patterns
```

**Common Fixes**:

```typescript
// Proper error handling
try {
  const { data, error } = await supabase.from('appointments').insert(appointment);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data;
} catch (error) {
  console.error('Failed to create appointment:', error);
  throw error;
}

// Add timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch('/api/endpoint', {
    signal: controller.signal,
  });
  // Process response
} finally {
  clearTimeout(timeoutId);
}
```

### 5. UI/Styling Bugs

**Symptoms**:

- Layout broken
- Elements overlapping
- Responsive design not working
- Missing styles

**Context7 Prompts**:

```
use context7 for Tailwind CSS responsive design debugging
use context7 for CSS flexbox and grid debugging
```

**Common Fixes**:

```typescript
// Fix responsive issues
<div className="
  w-full
  px-4 md:px-6 lg:px-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4
">

// Fix z-index issues
<div className="relative z-10">

// Fix overflow
<div className="overflow-hidden">

// Fix text truncation
<p className="truncate">
```

### 6. State Management Bugs

**Symptoms**:

- State not updating
- Infinite loops
- Stale state
- Unexpected re-renders

**Context7 Prompts**:

```
use context7 for React state update patterns
use context7 for React memo and useMemo optimization
```

**Common Fixes**:

```typescript
// Use functional state update
setCount((prev) => prev + 1);

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component);

// Use useCallback for functions
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

---

## Debugging Tools & Commands

### Browser DevTools

```
F12 or Cmd+Option+I - Open DevTools
Cmd+Shift+C - Inspect element
Cmd+P - Open file
Cmd+F - Search in file
```

**Console Commands**:

```javascript
// React DevTools (if installed)
$r; // Currently selected component

// Get element by selector
$('selector');
$$('selector'); // All matching elements

// Monitor events
monitorEvents(element, 'click');
```

### VS Code Debugging

Launch configuration (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Git Commands for Debugging

```bash
# Find when bug was introduced
git bisect start
git bisect bad # Current version has bug
git bisect good <commit> # Known good commit
# Git will checkout commits for you to test

# See file history
git log -p -- path/to/file

# See who changed a line
git blame path/to/file

# See changes in specific commit
git show <commit-hash>

# Find commits with specific text
git log --all --grep="search term"
```

### npm Commands

```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Check for outdated packages (may cause issues)
npm outdated

# Verify dependencies
npm audit

# Run specific test in watch mode
npm run test -- --watch ComponentName.test.tsx
```

---

## Escalation Guidelines

### When to Escalate

Escalate bug to user/team lead if:

1. **Cannot Reproduce**: Unable to reproduce after multiple attempts
2. **Insufficient Information**: Need more details from bug reporter
3. **Requires Architecture Change**: Fix needs major refactoring
4. **Security Concern**: Bug has security implications
5. **Data Loss Risk**: Fix could affect existing data
6. **Performance Impact**: Fix significantly impacts performance
7. **Breaking Change Required**: Fix requires breaking API changes
8. **External Dependency**: Bug is in third-party library
9. **Time Estimate Exceeded**: Fix taking longer than expected

### Escalation Template

```markdown
## Bug Escalation Required

**Bug**: [Issue number and title]

**Reason for Escalation**: [Why can't be resolved independently]

**Investigation Summary**:

- Steps taken: [What was tried]
- Findings: [What was discovered]
- Blockers: [What's preventing resolution]

**Recommended Actions**:

1. [Suggested next step]
2. [Alternative approach]
3. [Resources needed]

**Impact**:

- Affected users: [Number/description]
- Workaround available: [Yes/No - describe]
- Priority: [Critical/High/Medium/Low]

**Questions for Discussion**:

1. [Question 1]
2. [Question 2]
```

---

## Prevention Strategies

Learn from bugs to prevent similar issues:

### 1. Add Type Safety

```typescript
// If bug was caused by type mismatch
interface StrictType {
  field: string; // not 'any'
}
```

### 2. Add Validation

```typescript
// If bug was caused by invalid data
const schema = z.object({
  field: z.string().min(1),
});
```

### 3. Add Error Boundaries

```typescript
// If bug caused crashes
<ErrorBoundary fallback={<ErrorUI />}>
  <ComponentThatMightFail />
</ErrorBoundary>
```

### 4. Add Logging

```typescript
// If bug was hard to diagnose
console.error('Operation failed:', {
  context,
  error,
  timestamp: new Date().toISOString(),
});
```

### 5. Update Tests

```typescript
// Add test for edge case
it('should handle edge case that caused bug', () => {
  // Test implementation
});
```

---

## Quick Reference

### Bug Fix Checklist

- [ ] Bug reproduced
- [ ] Root cause identified
- [ ] Failing test written
- [ ] Fix implemented
- [ ] Test passes
- [ ] All tests pass
- [ ] Manual testing done
- [ ] No debug code left
- [ ] Commit with clear message
- [ ] PR created with details

### Commit Message Template

```
fix(scope): brief description of bug fix

Issue: [What was wrong]
Root Cause: [Why it happened]
Solution: [How it was fixed]

Fixes #123

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commands

```bash
# Create fix branch
git checkout -b fix/bug-description

# Run failing test
npm run test -- --watch BuggyComponent.test.tsx

# Run all tests
npm run test:ci

# Check types
npm run type-check

# Debug build
npm run build

# Commit fix
git commit -m "fix(scope): description"

# Push
git push origin fix/bug-description
```

---

**End of Bug Fix Prompt Template**
