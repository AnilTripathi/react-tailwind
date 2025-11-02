# Refresh Token Flow Implementation

## Overview
The authentication system now stores both `accessToken` and `refreshToken` in Redux state as the single source of truth, with automatic token refresh on 401 responses.

## Architecture Changes

### AuthState Structure
```typescript
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;  // NEW: Stored in Redux state
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Token Storage Strategy
- **Access Token**: Stored in Redux state only (cleared on page refresh)
- **Refresh Token**: Stored in Redux state + persisted via redux-persist
- **Security Trade-off**: Refresh tokens in localStorage are vulnerable to XSS attacks but provide better UX than HttpOnly cookies for SPAs

## Refresh Flow Sequence

1. **Protected Request with Expired Access Token**
   - API request receives 401 response
   - Base query interceptor checks for `refreshToken` in Redux state

2. **Token Refresh Process**
   - If `refreshToken` exists: Call `POST /auth/refresh` with refresh token
   - If successful: Update Redux state with new tokens and retry original request
   - If refresh fails: Dispatch logout action and redirect to login

3. **Concurrency Handling**
   - Single in-flight refresh promise prevents multiple concurrent refresh requests
   - Waiting requests reuse the same refresh outcome

## Key Implementation Details

### Redux Actions
- `loginSuccess`: Now accepts both `accessToken` and `refreshToken`
- `tokenRefreshed`: Updates access token and optionally rotates refresh token
- `logout`: Clears both tokens from state and persisted storage

### API Service (services/api.ts)
```typescript
// Reads refreshToken from Redux state (single source of truth)
const refreshToken = (api.getState() as RootState).auth.refreshToken;

// Updates both tokens after successful refresh
api.dispatch(tokenRefreshed({ 
  accessToken: refreshData.accessToken,
  refreshToken: refreshData.refreshToken 
}));
```

### Error Handling
- **No refresh token**: Immediate logout
- **Invalid/expired refresh token**: Logout and redirect to login
- **Network errors during refresh**: Logout and redirect to login

## Security Considerations

### Current Implementation
- Refresh tokens stored in Redux state with redux-persist (localStorage)
- Vulnerable to XSS attacks but provides seamless user experience
- Access tokens have shorter lifespan and are memory-only

### Production Recommendations
1. **HttpOnly Cookies**: Store refresh tokens in HttpOnly cookies for better XSS protection
2. **Token Rotation**: Implement refresh token rotation on each use
3. **Secure Headers**: Use CSP headers to mitigate XSS risks
4. **Token Binding**: Consider binding tokens to device/browser fingerprints

## Testing Coverage

### Unit Tests
- Redux slice handles refresh token in all actions
- Token clearing on logout
- State persistence and rehydration

### Integration Tests
- 401 → successful refresh → retry original request
- 401 → failed refresh → logout flow
- Concurrent 401s handled by single refresh promise
- No refresh token available → immediate logout

## Migration Notes

### Breaking Changes
- `loginSuccess` action now requires `refreshToken` parameter
- `tokenRefreshed` action signature updated to support token rotation
- Removed dependency on `tokenStorage` utility for refresh tokens

### Backward Compatibility
- Existing localStorage refresh tokens will be ignored
- Users will need to re-login once to populate Redux state
- All existing auth flows remain functional

## Usage Examples

### Login Flow
```typescript
const result = await loginMutation(credentials).unwrap();
dispatch(loginSuccess({ 
  accessToken: result.accessToken,
  refreshToken: result.refreshToken 
}));
```

### Manual Token Refresh
```typescript
// Automatic via API interceptor, but can be triggered manually:
dispatch(tokenRefreshed({ 
  accessToken: 'new-access-token',
  refreshToken: 'new-refresh-token' // Optional for rotation
}));
```

### Logout
```typescript
// Clears both tokens from Redux state and persistence
dispatch(logout());
```