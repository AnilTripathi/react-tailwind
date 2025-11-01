/**
 * Task validation tests
 */

import { validateTaskRequest, hasValidationErrors } from '../taskValidation';
import type { EditTaskRequest } from '../../types/userTask';

describe('validateTaskRequest', () => {
  const validTask: EditTaskRequest = {
    title: 'Valid Task',
    descriptionMd: 'Valid description',
    priorityId: '2',
    dueAt: '2024-12-31T23:59:59Z',
    estimateMinutes: 60,
  };

  it('should return no errors for valid task', () => {
    const errors = validateTaskRequest(validTask);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('should require title', () => {
    const errors = validateTaskRequest({ ...validTask, title: '' });
    expect(errors.title).toBe('Title is required');
  });

  it('should require title after trim', () => {
    const errors = validateTaskRequest({ ...validTask, title: '   ' });
    expect(errors.title).toBe('Title is required');
  });

  it('should limit title length', () => {
    const longTitle = 'a'.repeat(201);
    const errors = validateTaskRequest({ ...validTask, title: longTitle });
    expect(errors.title).toBe('Title must be less than 200 characters');
  });

  it('should validate priority options', () => {
    const errors = validateTaskRequest({ ...validTask, priorityId: '6' });
    expect(errors.priorityId).toBe('Invalid priority selected');
  });

  it('should require due date', () => {
    const errors = validateTaskRequest({ ...validTask, dueAt: '' });
    expect(errors.dueAt).toBe('Due date is required');
  });

  it('should validate date format', () => {
    const errors = validateTaskRequest({ ...validTask, dueAt: 'invalid-date' });
    expect(errors.dueAt).toBe('Invalid date format');
  });

  it('should require non-negative estimate', () => {
    const errors = validateTaskRequest({ ...validTask, estimateMinutes: -1 });
    expect(errors.estimateMinutes).toBe('Estimate must be 0 or greater');
  });

  it('should limit description length', () => {
    const longDescription = 'a'.repeat(10001);
    const errors = validateTaskRequest({ ...validTask, descriptionMd: longDescription });
    expect(errors.descriptionMd).toBe('Description must be less than 10,000 characters');
  });
});