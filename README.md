# React + Redux + RTK Query Project

A modern React application built with TypeScript, Redux Toolkit, RTK Query, and Tailwind CSS.

## Tech Stack

- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **RTK Query** for API requests
- **Tailwind CSS** for styling
- **ESLint + Prettier** for code quality
- **Vite** for build tooling

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Format code:
   ```bash
   npm run format
   ```

4. Lint code:
   ```bash
   npm run lint
   ```

## Project Structure

- `src/services/api.ts` - Central API configuration with RTK Query
- `src/store/index.ts` - Redux store configuration
- `src/hooks/redux.ts` - Typed Redux hooks
- `src/components/` - React components
  - `Card.tsx` - Reusable card component
  - `UserList.tsx` - User list with card display
- `.prettierrc` - Prettier configuration
- `.vscode/settings.json` - VS Code settings (format on save)
- `eslint.config.js` - ESLint configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Features

- Auto-format on save with Prettier
- ESLint auto-fix on save
- Reusable Card component for consistent UI
- User list with API integration

## Adding New API Endpoints

Extend the `appAPI` in `src/services/api.ts`:

```typescript
export const userApi = appAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;
```