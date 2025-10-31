/**
 * User-related type definitions
 * Contains DTOs for user management and user data models
 */

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
}