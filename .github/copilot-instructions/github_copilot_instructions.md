# Project overview
This repo is a **React + TypeScript** SPA using **Tailwind CSS**. The goals for Copilot-generated code and contributions are:

- Keep **business logic** (data fetching, state transformations, side effects) separate from **presentational/UI components**.
- Use modern React (function components, hooks) and TypeScript best practices (strict types, `unknown`/`never` where appropriate).
- Make the UI easily maintainable and support **multi-color theming** via design tokens and Tailwind configuration.
- Produce production-ready code: accessible, testable, performant, and linted/formatted.

---

## Recommended stack & versions
- React 19.2 (use concurrent-safe APIs and React 19 features where appropriate).
- TypeScript latest stable (strict mode enabled).
- Tailwind CSS latest (JIT enabled) with PostCSS and autoprefixer.
- Build: **Vite** (recommended) or Next.js when SSR/SSG required.
- Testing: Jest + React Testing Library + MSW (for network mocking).
- Storybook for component-driven development and visual review.

---

## File structure (recommended)
```
src/
  api/                # API client(s) and typed endpoints (fetch/axios/msw handlers)
  app/                # App root, providers, routes
  assets/             # images, fonts, icons (svgr)
  components/         # Presentational (dumb) components, atomic-structured
    ui/               # reusable UI primitives (Button, Icon, Input)
    layout/           # Layout components (Header, Footer, Grid)
  features/           # Feature folders (co-locate component + hooks + tests)
    user/
      UserView.tsx    # container/composed component
      UserCard.tsx    # presentational component
      useUser.ts      # business logic / hooks
      user.service.ts # API calls + adapters
      user.test.tsx
  hooks/              # shared hooks that encapsulate logic
  services/           # business services (payroll, billing) / domain logic
  store/              # global state (optional: Zustand/Redux toolkit)
  styles/             # Tailwind configs, design tokens, css variables
  utils/              # pure util functions
  types/              # global TypeScript types
  tests/              # e2e or integration tests (if not colocated)
```

> **Pattern:** `features/<feature>/` holds the feature’s composed container (wires together hooks + UI) while `components/ui` are purely presentational.

---

## Component conventions
- Use **presentational components**: accept props, render UI only, no side-effects, no data fetching.
- Use **container / view components** or `use` hooks to orchestrate fetching and transformations.
- Prefer small components (single responsibility). Compose complex UIs from primitives.
- Type props precisely (no `any`). Use `PropsWithChildren` when children used.
- Prefer `forwardRef` for components that might be focused/styled externally.
- Use `className` merging helpers (`clsx`, `classnames`, or Tailwind `twMerge`) to combine classes safely.

Example presentational component signature:
```ts
export type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children, variant = 'primary', className, ...rest
}, ref) => {
  return (
    <button ref={ref} className={twMerge(baseStyles, variantStyles[variant], className)} {...rest}>
      {children}
    </button>
  );
});
```

---

## Business logic & data layer
- Keep network and domain logic in `api/`, `services/`, or `features/*/service` files.
- Wrap API calls with typed functions returning a typed shape or `Result<T, E>`-like envelope.
- Prefer `async/await` with explicit error handling (no swallowing errors).
- Use custom hooks (`useUser`, `useOrders`) to encapsulate fetching, caching, and optimistic updates.
- Prefer mission-focused state libraries for complex scenarios: **React Query** for server state, **Zustand/Redux Toolkit** for client state with clear separation from UI.

Example hook responsibilities:
- call typed API client
- map DTOs → view models
- expose loading/error/actions
- keep side effects (analytics, feature flags) out of pure UI components

---

## Theming & multi-color support
Goal: allow easy addition of brand palettes and runtime theme switching with minimal CSS churn.

### Strategy (recommended)
1. **Tailwind tokens + CSS variables**: Extend Tailwind theme with semantic tokens and delegate runtime color changes to CSS variables.
2. **Design tokens**: Store canonical token names (e.g., `--color-primary-500`) in `styles/tokens.css` and import into `index.css`.
3. **Theme provider / hook**: Provide `ThemeProvider` context exposing `setTheme(name)` and `currentTheme`; switch between themes by toggling a top-level class or updating CSS variables.

### Tailwind config snippet (conceptual)
- Add semantic colors in `tailwind.config.ts` using CSS variables:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-500': 'var(--color-primary-500)',
        // semantic tokens...
      },
    },
  },
};
```

### CSS variables (styles/tokens.css)
```css
:root {
  /* default (light) */
  --color-primary: 255 99 71; /* rgb triple for tailwind-friendly usage */
  --color-primary-500: rgb(255,99,71);
}

[data-theme='dark'] {
  --color-primary-500: rgb(200,50,30);
}

/* Utility to convert CSS var to rgba in Tailwind via plugin or inline style */
```

### Runtime theme switching options
- Toggle a `data-theme="<name>"` attribute on `<html>` or `<body>` and store preference in `localStorage`.
- Provide `useTheme()` hook to read/set theme and sync with OS preference (`prefers-color-scheme`).
- Keep tokens small and semantic (primary, surface, border, interactive) so adding palettes is largely token mapping.

---

## Styling & Tailwind best practices
- Keep Tailwind classes in UI components; avoid scattering raw CSS unless for complex interactions.
- Use utility composition sparingly: create small, named UI primitives (e.g., `Card`, `Badge`) to avoid repeating long class lists.
- Use `@apply` in component-scoped CSS for complex variants when beneficial.
- Keep global styles minimal and centralized in `src/styles`.

---

## Accessibility (A11y)
- Use semantic HTML and ARIA only when necessary.
- Use accessible patterns for dialogs, menus, and forms (focus trap, aria-modal, keyboard navigation).
- Test with axe-core (CI integration) and manual keyboard navigation.
- Ensure color contrast with WCAG AA for all theme palettes.

---

## Testing & coverage
- Unit tests: React Testing Library + Jest.
- Mock network via MSW to keep tests deterministic.
- Storybook stories + Chromatic or visual regression tests for UI stability.
- Aim for high coverage on business logic and edge cases; UI components should be tested for behavior and accessibility.
- CI: run `npm test -- --coverage` and fail build if major regressions in coverage or failing tests.

---

## Performance & production readiness
- Use code-splitting (dynamic `import()` or route-level lazy loading).
- Memoize heavy computations (`useMemo`) only when necessary.
- Avoid unnecessary rerenders; prefer primitive props and avoid passing inline objects/functions unless stable via `useCallback`/`useMemo`.
- Optimize images (use `<img decoding="async" loading="lazy">`, or next/image when using Next.js).
- Enable Vite/webpack production optimizations and PurgeCSS via Tailwind to remove unused styles.

---

## Dev tooling & CI
- ESLint (with `eslint-plugin-react`, `@typescript-eslint`) and Prettier (consistent formatting). Use `eslint --fix` in pre-commit or CI.
- Husky + lint-staged for pre-commit checks (tests, lint, typecheck for changed files).
- Type-check in CI: `tsc --noEmit`.
- Build commands example (Vite):
  - dev: `npm run dev`
  - build: `npm run build`
  - preview: `npm run preview`
  - test: `npm run test`

---

## Security & configuration
- Do NOT commit secrets. Use env vars and `.env.local` excluded from VCS.
- Use Content Security Policy (CSP) headers in production.
- Keep dependencies up-to-date and monitor vulnerability alerts.

---

## Commit & PR expectations
- Use conventional commits for clarity (`feat:`, `fix:`, `chore:`).
- PRs should include: description, related issue, testing steps, screenshots if UI changes, and link to storybook if relevant.
- Ensure lint, typecheck, tests pass locally and in CI before requesting review.

---

## Copilot guidance and prompts for this repo
- `@workspace Create a presentational Button component in TypeScript in components/ui/Button.tsx using Tailwind utility classes. Make it fully typed and testable (include RTL test). Keep no data fetching or side effects.`
- `@workspace #file:'src/features/user/useUser.ts' Implement a hook that fetches users from /api/users using fetch/axios and maps DTO to view model. Mock network calls in tests with MSW.`
- `@workspace Generate a ThemeProvider that toggles between two color palettes by updating CSS variables and persists preference to localStorage. Add tests for the hook.`
- `@workspace #file:'tailwind.config.ts' Add semantic color tokens backed by CSS variables and example usage for primary/secondary colors.`

---

## What to avoid
- Don’t put API calls or side-effects inside presentational components.
- Don’t use `any` as a shortcut—prefer narrow types or `unknown` + guards.
- Don’t hardcode colors in components—use tokens or Tailwind semantic classes.
- Avoid global mutable state unless necessary; prefer local or server-driven state.

---

## If Copilot seems to miss context
- Open the target files in the editor (make them visible to the workspace).
- Use explicit `#file:` references or paste the relevant snippet into the chat.
- Ask Copilot to generate tests along with code ("generate tests with RTL and MSW").

---

## Additional resources
- Tailwind theming with CSS variables
- React Testing Library + MSW guides
- Vite + React + TypeScript starter templates

---

_Last updated: keep this file current with project conventions and tooling versions._

