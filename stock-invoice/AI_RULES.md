# AI Development Rules & Tech Stack

## Tech Stack
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: React Router DOM (v6) for client-side navigation.
- **Styling**: Tailwind CSS with a custom **Neumorphic** design system.
- **UI Components**: shadcn/ui (Radix UI primitives) customized for Neumorphism.
- **Icons**: Lucide React for consistent iconography.
- **State Management**: TanStack Query (React Query) for server state and standard React hooks for local state.
- **Forms & Validation**: React Hook Form with Zod for schema-based validation.
- **Notifications**: Sonner for toast notifications.
- **Utilities**: `clsx` and `tailwind-merge` for dynamic class management.

## Development Rules

### 1. Styling & Design System
- **Neumorphism**: Always use the custom Neumorphic classes defined in `src/index.css`.
  - Use `neu-card` for containers.
  - Use `neu-btn`, `neu-btn-primary`, etc., for buttons.
  - Use `neu-input` for form fields.
  - Use `neu-badge-*` for status indicators.
- **Shadows**: Utilize the custom shadow variables (`--shadow-outset`, `--shadow-inset`) via Tailwind classes like `shadow-neu-outset`.

### 2. Component Architecture
- **Atomic Design**: Keep components small and focused.
- **Location**: 
  - Pages go in `src/pages/`.
  - Reusable UI components go in `src/components/ui/`.
  - Feature-specific components go in `src/components/`.
- **Props**: Always define TypeScript interfaces for component props.

### 3. Library Usage Guidelines
- **Icons**: Exclusively use `lucide-react`.
- **Toasts**: Use the `useToast` hook from `@/hooks/use-toast` or `sonner`.
- **Data Fetching**: Use `useQuery` and `useMutation` from `@tanstack/react-query`.
- **Tables**: Use the custom `neu-table` class for consistent data displays.
- **Printing**: Use the `printDocument` utility in `src/utils/printDocument.ts` for generating PDF/Print views.

### 4. State & Logic
- **Forms**: Always use `react-hook-form` for complex forms.
- **Search**: Use the `ArticleSearchInput` component for any article-related lookups to maintain consistency.
- **Formatting**: Use `toLocaleString('fr-TN', ...)` for currency and number formatting (3 decimal places for TND).

### 5. File Naming
- Use PascalCase for components and pages (e.g., `UserCard.tsx`).
- Use camelCase for hooks and utilities (e.g., `useAuth.ts`, `formatDate.ts`).