# Development Guidelines

> **File**: `.claude/guides/DEVELOPMENT.md`
> **Last Updated**: October 29, 2025

---

## Coding Standards

### TypeScript Guidelines

**Always use TypeScript** for all files. Prefer explicit types over `any`.

```typescript
// ✅ GOOD: Explicit types
interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

// ❌ BAD: Using 'any'
interface FormProps {
  onSubmit: (data: any) => void;
}
```

---

## File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `BookingForm.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `validation.ts`)
- **Types**: `PascalCase.types.ts` (e.g., `BookingForm.types.ts`)
- **Tests**: `ComponentName.test.tsx`
- **API Routes**: `route.ts` (Next.js 14 convention)

---

## Import Order

```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

// 2. Internal dependencies
import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/lib/utils/validation';

// 3. Type imports
import type { Appointment } from '@/types/appointment';

// 4. Styles
import styles from './Component.module.css';
```

---

## Error Handling

```typescript
// ✅ GOOD: Proper error handling
async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase.from('appointments').select('*');

    if (error) {
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}
```

---

## Validation with Zod

```typescript
import { z } from 'zod';

export const bookingFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  timeSlot: z.enum(['morning', 'afternoon', 'evening']),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
```

---

## Component Structure

```typescript
// ComponentName.tsx
import type { ComponentProps } from './Component.types';

export const Component: React.FC<ComponentProps> = ({ prop1, onAction }) => {
  // State
  const [state, setState] = useState(initialState);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};
```

---

**Context7**: `use context7 for TypeScript latest best practices`

[Return to Main Index](../CLAUDE.md)
