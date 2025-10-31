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

### API & Services
- `src/service/api.ts` - Root API configuration with RTK Query
- `src/service/auth/index.ts` - Authentication service endpoints
- `src/service/user/index.ts` - User management service endpoints
- `src/constants/endpoints.ts` - Centralized API endpoint definitions

### State Management
- `src/store/index.ts` - Redux store configuration
- `src/hooks/redux.ts` - Typed Redux hooks
- `src/services/mytodo/index.ts` - Todo slice (Redux Toolkit)

### Types
- `src/types/auth/index.ts` - Authentication type definitions
- `src/types/user/index.ts` - User type definitions
- `src/types/todo/index.ts` - Todo type definitions

### Components
- `src/components/Card.tsx` - Reusable card component
- `src/components/UserList.tsx` - User list with card display

### Configuration
- `.prettierrc` - Prettier configuration
- `.vscode/settings.json` - VS Code settings (format on save)
- `eslint.config.js` - ESLint configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Features

- Auto-format on save with Prettier
- ESLint auto-fix on save
- Reusable Card component for consistent UI
- User list with API integration

## Architecture

### Authentication System
- **Login API**: POST `auth/login` with `{ username, password }`
- **Token Storage**: Access token in Redux state, refresh token in localStorage
- **Auto-refresh**: Automatic token refresh on 401 responses
- **Route Protection**: Public routes (`/login`, `/about`) and private routes (everything else)

### Service Organization
Services are organized by feature in separate folders:
- Each service has its own `index.ts` file
- Services use centralized endpoints from `constants/endpoints.ts`
- Types are imported from organized type folders
- All services extend the root `appAPI` with automatic token refresh

### Token Management
- Access tokens stored in Redux state (cleared on refresh)
- Refresh tokens stored in localStorage (persistent)
- Automatic refresh on 401 with concurrency handling
- Single refresh promise prevents multiple concurrent refresh requests

### Adding New API Endpoints

1. Add endpoint to `src/constants/endpoints.ts`:
```typescript
export const USER_ENDPOINTS = {
  GET_ALL: 'users',
  CREATE: 'users', // Add new endpoint
} as const;
```

2. Create service in `src/service/user/index.ts`:
```typescript
export const userApi = appAPI.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (userData) => ({
        url: ENDPOINTS.USER.CREATE,
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});
```

3. Define types in `src/types/user/index.ts`:
```typescript
export interface CreateUserRequest {
  name: string;
  email: string;
}
```

## Authentication Usage

### Login
```typescript
const { login, isLoading, error } = useAuth();
await login({ username: 'admin', password: 'password' });
```

### Route Protection
```typescript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### Testing
Run tests with:
```bash
npm test
```