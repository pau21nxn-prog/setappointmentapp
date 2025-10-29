# Common Tasks & Workflows

> **File**: `.claude/guides/COMMON-TASKS.md`
> **Last Updated**: October 29, 2025

---

## Creating a New Component

### 1. Create component directory

```bash
mkdir -p src/components/ui/ComponentName
cd src/components/ui/ComponentName
```

### 2. Create component files

```bash
touch ComponentName.tsx
touch ComponentName.types.ts
touch ComponentName.test.tsx
touch index.ts
```

### 3. Implement component

**ComponentName.tsx**:

```typescript
import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  return (
    <div className="component-name">
      {/* Implementation */}
    </div>
  );
};
```

**ComponentName.types.ts**:

```typescript
export interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: () => void;
}
```

**ComponentName.test.tsx**:

```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName prop1="test" />);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});
```

**index.ts**:

```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

---

## Creating an API Route

### 1. Create route file

```bash
mkdir -p src/app/api/resource/action
touch src/app/api/resource/action/route.ts
```

### 2. Implement route

```typescript
// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  field1: z.string(),
  field2: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = requestSchema.parse(body);

    const result = await processData(validated);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run CI test suite (before PR)
npm run test:ci
```

---

## Committing Changes

```bash
# Stage changes
git add .

# Commit with conventional commit format
git commit -m "feat(scope): add new feature

Detailed description of the changes made.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin feature/branch-name
```

---

## Creating a Pull Request

1. Push branch to remote
2. Go to GitHub repository
3. Click "Compare & pull request"
4. Set base branch to `develop`
5. Fill in PR description
6. Wait for CI checks
7. Request review and merge

---

[Return to Main Index](../CLAUDE.md)
