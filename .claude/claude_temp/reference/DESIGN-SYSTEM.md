# Design System

> **File**: `.claude/reference/DESIGN-SYSTEM.md`
> **Last Updated**: October 29, 2025

---

## Color Palette

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Primary
          600: '#059669', // Primary Dark
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F3F4F6',
          gray: '#6B7280',
          dark: '#1F2937',
          black: '#111827',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
    },
  },
};
```

---

## Typography

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        hero: ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        body: ['1rem', { lineHeight: '1.625' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      },
    },
  },
};
```

---

## Responsive Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      sm: '640px', // Mobile landscape
      md: '768px', // Tablet
      lg: '1024px', // Desktop
      xl: '1280px', // Large desktop
      '2xl': '1536px', // Extra large
    },
  },
};
```

---

## Button Component Pattern

```typescript
// components/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}) => {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-neutral-light hover:bg-neutral-gray text-neutral-dark',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

[Return to Main Index](../CLAUDE.md)
