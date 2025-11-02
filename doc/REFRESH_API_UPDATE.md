# Refresh API Integration Update

## Overview
Updated frontend integration to use the new `/auth/refresh` API contract that requires both `accessToken` and `refreshToken` in the request body.

## API Contract Changes

### New Refresh Request Body
```typescript
// Before: Only refresh token
{ "refreshToken": "refresh-token-123" }

// After: Both tokens required
{
  "accessToken": "access-token-456",
  "refreshToken": "refresh-token-123"
}
```

### Response (Unchanged)
```typescript
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token", // May be rotated
  "expiresIn": 3600
}
```

## Implementation Changes

### 1. Type Definitions
- **RefreshRequest**: New type requiring both `accessToken` and `refreshToken`
- **RefreshResponse**: Existing type maintained for consistency

### 2. Central Refresh Logic (services/api.ts)
```typescript
// Reads both tokens from Redux state
const authState = (api.getState() as RootState).auth;
const { accessToken, refreshToken } = authState;

// Sends both tokens in request body
const refreshRequestBody: RefreshRequest = {
  accessToken,
  refreshToken,
};
```

### 3. State Management
- **Redux Persist**: Added `refreshToken` to whitelist for proper persistence
- **Token Rotation**: Both tokens updated atomically after successful refresh
- **Logout**: Both tokens cleared from state and persistence

### 4. Error Handling
- **Missing Tokens**: Immediate logout if either token is missing
- **Refresh Failure**: Automatic logout and redirect to login
- **Concurrency**: Single in-flight refresh prevents multiple concurrent requests

## Security Benefits

### Backend Validation
- Server can validate both token signatures before processing
- Access token provides user context even if expired
- Refresh token confirms authorization to refresh

### Frontend Safety
- Always uses latest tokens from Redux state (no stale closures)
- Single retry attempt prevents infinite loops
- Proper token rotation maintains security

## Testing Coverage

### Unit Tests
- RefreshRequest type validation
- Redux state token management
- Token persistence configuration

### Integration Tests
- 401 → refresh with both tokens → success → retry original request
- 401 → refresh failure → logout flow
- Request body validation in mock handlers

## Migration Notes

### Breaking Changes
- Refresh endpoint now requires `accessToken` in request body
- Auth service mutation signature updated to use `RefreshRequest`

### Backward Compatibility
- Existing login/logout flows unchanged
- Token storage mechanism preserved
- Error handling patterns maintained

## Verification Steps

1. **Login Flow**: Verify both tokens stored in Redux state
2. **Token Refresh**: Check network tab shows both tokens in refresh request
3. **Automatic Retry**: Confirm original request retries after successful refresh
4. **Logout on Failure**: Verify user redirected to login on refresh failure
5. **Persistence**: Confirm tokens survive page refresh via redux-persist

## Usage Example

```typescript
// Automatic refresh on 401 (no manual intervention needed)
const result = await api.getUserTasks({ page: 0, size: 10 });

// Manual refresh (if needed)
const refreshData = await refreshMutation({
  accessToken: currentAccessToken,
  refreshToken: currentRefreshToken,
}).unwrap();
```