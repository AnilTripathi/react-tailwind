/**
 * User task-related type definitions
 * Contains DTOs for task management and paginated responses
 */

export interface TaskItem {
  id: string;
  title: string;
  descriptionMd: string;
  statusId: number;
  statusName: string;
  priorityId: number;
  priorityName: string;
  dueAt: string;
  estimateMinutes: number;
  spentMinutes: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  descriptionMd: string;
  priorityId: string;
  dueAt: string;
  estimateMinutes: number;
}

export interface EditTaskRequest {
  title: string;
  descriptionMd: string;
  priorityId: string;
  dueAt: string;
  estimateMinutes: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface TaskQueryParams {
  status?: number;
  q?: string;
  fromDue?: string;
  toDue?: string;
  page: number;
  size: number;
  sort: string;
}