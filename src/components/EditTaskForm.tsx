/**
 * Edit Task Form Component
 *
 * Validation rules:
 * - title: required, non-empty after trim, max 200 chars
 * - priorityId: must be one of ["1","2","3","4","5"]
 * - dueAt: valid ISO datetime, recommended today or future
 * - estimateMinutes: integer >= 0
 * - descriptionMd: optional, max 10k chars
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useEditUserTaskMutation } from '../service/user';
import type { EditTaskRequest, TaskItem } from '../types/userTask';

interface EditTaskFormProps {
  task: TaskItem;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  priorityId?: string;
  dueAt?: string;
  estimateMinutes?: string;
  descriptionMd?: string;
  general?: string;
}

const PRIORITY_OPTIONS = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'High' },
  { value: '4', label: 'Critical' },
  { value: '5', label: 'Urgent' },
];

export const EditTaskForm = ({
  task,
  onSuccess,
  onCancel,
}: EditTaskFormProps) => {
  const [editTask, { isLoading }] = useEditUserTaskMutation();

  const [formData, setFormData] = useState({
    title: task.title,
    descriptionMd: task.descriptionMd,
    priorityId: task.priorityId.toString(),
    dueAt: task.dueAt.slice(0, 16), // Convert ISO to datetime-local format
    estimateMinutes: task.estimateMinutes,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    // Priority validation
    if (!['1', '2', '3', '4', '5'].includes(formData.priorityId)) {
      newErrors.priorityId = 'Invalid priority selected';
    }

    // Due date validation
    if (!formData.dueAt) {
      newErrors.dueAt = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueAt);
      if (isNaN(dueDate.getTime())) {
        newErrors.dueAt = 'Invalid date format';
      }
    }

    // Estimate validation
    if (formData.estimateMinutes < 0) {
      newErrors.estimateMinutes = 'Estimate must be 0 or greater';
    }

    // Description validation
    if (formData.descriptionMd.length > 10000) {
      newErrors.descriptionMd =
        'Description must be less than 10,000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(
        `[name="${firstErrorField}"]`
      ) as HTMLElement;
      element?.focus();
      return;
    }

    try {
      const taskData: EditTaskRequest = {
        ...formData,
        title: formData.title.trim(),
        dueAt: new Date(formData.dueAt).toISOString(),
      };

      await editTask({ id: task.id, body: taskData }).unwrap();
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as {
        status?: number;
        data?: { errors?: Record<string, string>; message?: string };
      };
      if (apiError?.status === 400 || apiError?.status === 422) {
        const serverErrors = apiError?.data?.errors || {};
        setErrors({
          ...errors,
          ...serverErrors,
          general: apiError?.data?.message,
        });
      } else if (apiError?.status === 404) {
        setErrors({ general: 'Task not found or already removed' });
      } else if (apiError?.status === 409) {
        setErrors({
          general:
            'This task was changed elsewhere. Please refresh and try again.',
        });
      } else {
        setErrors({ general: 'Failed to update task. Please try again.' });
      }
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
          role="alert"
        >
          {errors.general}
        </div>
      )}

      <div>
        <label
          htmlFor="edit-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          type="text"
          id="edit-title"
          name="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={errors.title ? 'edit-title-error' : undefined}
        />
        {errors.title && (
          <p
            id="edit-title-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-descriptionMd"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="edit-descriptionMd"
          name="descriptionMd"
          value={formData.descriptionMd}
          onChange={(e) => handleInputChange('descriptionMd', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.descriptionMd ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={
            errors.descriptionMd ? 'edit-description-error' : undefined
          }
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.descriptionMd.length}/10,000 characters
        </p>
        {errors.descriptionMd && (
          <p
            id="edit-description-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.descriptionMd}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-priorityId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Priority *
        </label>
        <select
          id="edit-priorityId"
          name="priorityId"
          value={formData.priorityId}
          onChange={(e) => handleInputChange('priorityId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.priorityId ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={
            errors.priorityId ? 'edit-priority-error' : undefined
          }
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.priorityId && (
          <p
            id="edit-priority-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.priorityId}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-dueAt"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Due Date & Time *
        </label>
        <input
          type="datetime-local"
          id="edit-dueAt"
          name="dueAt"
          value={formData.dueAt}
          onChange={(e) => handleInputChange('dueAt', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.dueAt ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={errors.dueAt ? 'edit-dueAt-error' : undefined}
        />
        {errors.dueAt && (
          <p
            id="edit-dueAt-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.dueAt}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="edit-estimateMinutes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Estimated Time (minutes) *
        </label>
        <input
          type="number"
          id="edit-estimateMinutes"
          name="estimateMinutes"
          value={formData.estimateMinutes}
          onChange={(e) =>
            handleInputChange('estimateMinutes', parseInt(e.target.value) || 0)
          }
          min="0"
          step="15"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.estimateMinutes ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={
            errors.estimateMinutes ? 'edit-estimate-error' : undefined
          }
        />
        <p className="mt-1 text-sm text-gray-500">
          {Math.floor(formData.estimateMinutes / 60)}h{' '}
          {formData.estimateMinutes % 60}m
        </p>
        {errors.estimateMinutes && (
          <p
            id="edit-estimate-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.estimateMinutes}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
