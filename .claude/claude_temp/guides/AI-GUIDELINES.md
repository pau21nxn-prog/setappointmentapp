# AI Assistant Guidelines

> **File**: `.claude/guides/AI-GUIDELINES.md`
> **Last Updated**: October 29, 2025

---

## How Claude Should Work with This Project

### General Principles

1. **Always Read Before Edit**: Use Read tool to understand existing code
2. **Follow Conventions**: TypeScript, functional React, Zod validation, Conventional Commits
3. **Test-Driven Development**: Write tests first, implement, verify, commit
4. **Ask for Clarification**: When requirements are unclear or multiple approaches exist
5. **Use Context7 Proactively**: Fetch latest docs for frameworks

---

## Commit Message Format

**Always use this format**:

```
<type>(<scope>): <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Code Generation Preferences

### Component Structure

```typescript
// ✅ GOOD: Complete component with types
import type { ComponentProps } from './Component.types';

export const Component: React.FC<ComponentProps> = ({ prop1, onAction }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleClick = () => {
    // Handler logic
  };

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

// ❌ BAD: Incomplete, missing types
export default function Component(props) {
  return <div>{props.children}</div>;
}
```

### Error Handling

```typescript
// ✅ GOOD: Comprehensive error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  if (error instanceof SpecificError) {
    // Handle specific error
  }
  console.error('Operation failed:', error);
  throw new AppError('User-friendly message', { cause: error });
}

// ❌ BAD: Silent failure
try {
  await riskyOperation();
} catch (error) {
  // Ignore error
}
```

### Validation

```typescript
// ✅ GOOD: Use Zod schemas
const schema = z.object({
  field: z.string().min(2, 'Custom error message'),
});
const validated = schema.parse(data);

// ❌ BAD: Manual validation
if (!data.field || data.field.length < 2) {
  throw new Error('Field too short');
}
```

---

## File Operations

1. **Creating New Components**:
   - Create full directory structure
   - Include all files: `.tsx`, `.types.ts`, `.test.tsx`, `index.ts`
   - Write comprehensive tests
   - Follow existing patterns

2. **Modifying Existing Code**:
   - Read the file first
   - Maintain existing style
   - Update related tests
   - Don't introduce breaking changes without discussion

3. **API Routes**:
   - Always include request validation (Zod)
   - Implement proper error handling
   - Return consistent response format
   - Write API tests

---

## When to Use Context7

**Always use Context7 for**:

- Latest Next.js 14 features and API changes
- Current Tailwind CSS utilities
- Up-to-date Supabase client methods
- Recent React patterns and hooks
- Latest TypeScript features
- Current testing library best practices

**Example prompts**:

- `use context7 for Next.js 14 server actions documentation`
- `use context7 for Tailwind CSS responsive design patterns`
- `use context7 for Supabase Row Level Security policies`
- `use context7 for React Hook Form conditional validation`

---

## Workflows to Follow

### Feature Development

1. Create feature branch from develop
2. Read relevant existing code
3. Write tests first (TDD)
4. Implement feature
5. Run tests and fix failures
6. Run linter and type checker
7. Commit with Conventional Commits format
8. Push and create PR

### Bug Fixing

1. Reproduce the bug
2. Write failing test that demonstrates bug
3. Fix the bug
4. Verify test passes
5. Check for similar bugs elsewhere
6. Commit and create PR

---

## Important Reminders

1. **Always use Context7** when working with frameworks
2. **Never skip tests** - maintain >80% coverage
3. **Follow Conventional Commits** strictly
4. **Read before editing** - maintain consistency
5. **Ask before major decisions**
6. **Check CI/CD passes** before completing task
7. **Budget-conscious** - prefer free tiers
8. **Performance-first** - target Lighthouse 90+
9. **Security-aware** - validate inputs, handle errors
10. **User-focused** - accessibility, responsiveness, UX

---

[Return to Main Index](../CLAUDE.md)
