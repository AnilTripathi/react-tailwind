/**
 * Todo-related type definitions
 * Contains DTOs for todo management and todo data models
 */

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  assignDate: string; // ISO date string
  dueDate: string; // ISO date string
  completedDate?: string; // ISO date string or undefined
}

export interface UpdateTodoPayload {
  id: number;
  completed: boolean;
  completedDate: string;
}