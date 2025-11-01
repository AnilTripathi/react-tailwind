/**
 * Task validation utilities
 * Centralized validation logic for task creation and editing
 */

import type { EditTaskRequest } from '../types/userTask';

export interface ValidationErrors {
  title?: string;
  priorityId?: string;
  dueAt?: string;
  estimateMinutes?: string;
  descriptionMd?: string;
}

export const validateTaskRequest = (data: EditTaskRequest): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }
  
  // Priority validation
  if (!['1', '2', '3', '4', '5'].includes(data.priorityId)) {
    errors.priorityId = 'Invalid priority selected';
  }
  
  // Due date validation
  if (!data.dueAt) {
    errors.dueAt = 'Due date is required';
  } else {
    const dueDate = new Date(data.dueAt);
    if (isNaN(dueDate.getTime())) {
      errors.dueAt = 'Invalid date format';
    }
  }
  
  // Estimate validation
  if (data.estimateMinutes < 0) {
    errors.estimateMinutes = 'Estimate must be 0 or greater';
  }
  
  // Description validation
  if (data.descriptionMd.length > 10000) {
    errors.descriptionMd = 'Description must be less than 10,000 characters';
  }
  
  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};