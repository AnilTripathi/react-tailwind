/**
 * Auth types tests
 * Validates type definitions for authentication
 */

import type { RefreshRequest, RefreshResponse } from '../auth';

describe('Auth Types', () => {
  it('should validate RefreshRequest type structure', () => {
    const refreshRequest: RefreshRequest = {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    };

    expect(refreshRequest.accessToken).toBe('access-token-123');
    expect(refreshRequest.refreshToken).toBe('refresh-token-456');
    
    // Type check - should compile without errors
    const validateType = (req: RefreshRequest) => {
      return req.accessToken && req.refreshToken;
    };
    
    expect(validateType(refreshRequest)).toBe(true);
  });

  it('should validate RefreshResponse type structure', () => {
    const refreshResponse: RefreshResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
    };

    expect(refreshResponse.accessToken).toBe('new-access-token');
    expect(refreshResponse.refreshToken).toBe('new-refresh-token');
    expect(refreshResponse.expiresIn).toBe(3600);
  });
});