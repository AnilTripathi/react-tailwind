/**
 * Create Task Form Component
 * 
 * Validation rules:
 * - title: required, non-empty after trim
 * - priorityId: must be one of ["1","2","3","4","5"] 
 * - dueAt: valid ISO datetime, today or future
 * - estimateMinutes: integer >= 0
 * - descriptionMd: optional, max 10k chars
 * 
 * Cache behavior: On success, invalidates UserTask cache to refresh task list
 */

import { useState, FormEvent } from 'react';
import { useCreateUserTaskMutation } from '../service/user';
import type { CreateTaskRequest } from '../types/userTask';

interface CreateTaskFormProps {
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

export const CreateTaskForm = ({ onSuccess, onCancel }: CreateTaskFormProps) => {
  const [createTask, { isLoading }] = useCreateUserTaskMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    descriptionMd: '',
    priorityId: '2', // Default to Medium
    dueAt: '',
    estimateMinutes: 60,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(dueDate.getTime())) {
        newErrors.dueAt = 'Invalid date format';
      } else if (dueDate < today) {
        newErrors.dueAt = 'Due date must be today or in the future';
      }
    }
    
    // Estimate validation
    if (formData.estimateMinutes < 0) {
      newErrors.estimateMinutes = 'Estimate must be 0 or greater';
    }
    
    // Description validation
    if (formData.descriptionMd.length > 10000) {
      newErrors.descriptionMd = 'Description must be less than 10,000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus first invalid field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      element?.focus();
      return;
    }

    try {
      const taskData: CreateTaskRequest = {
        ...formData,
        title: formData.title.trim(),
        dueAt: new Date(formData.dueAt).toISOString(),
      };
      
      await createTask(taskData).unwrap();
      onSuccess();
    } catch (error: any) {
      // Handle server validation errors
      if (error?.status === 400 || error?.status === 422) {
        const serverErrors = error?.data?.errors || {};
        setErrors({ ...errors, ...serverErrors, general: error?.data?.message });
      } else {
        setErrors({ general: 'Failed to create task. Please try again.' });
      }
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
          {errors.general}
        </div>
      )}
      
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="descriptionMd" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="descriptionMd"
          name="descriptionMd"
          value={formData.descriptionMd}
          onChange={(e) => handleInputChange('descriptionMd', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.descriptionMd ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter task description (Markdown supported)"
          aria-describedby={errors.descriptionMd ? 'description-error' : undefined}
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.descriptionMd.length}/10,000 characters
        </p>
        {errors.descriptionMd && (
          <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.descriptionMd}
          </p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priorityId" className="block text-sm font-medium text-gray-700 mb-1">
          Priority *
        </label>
        <select
          id="priorityId"
          name="priorityId"
          value={formData.priorityId}
          onChange={(e) => handleInputChange('priorityId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.priorityId ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={errors.priorityId ? 'priority-error' : undefined}
        >
          {PRIORITY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.priorityId && (
          <p id="priority-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.priorityId}
          </p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueAt" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date & Time *
        </label>
        <input
          type="datetime-local"
          id="dueAt"
          name="dueAt"
          value={formData.dueAt}
          onChange={(e) => handleInputChange('dueAt', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.dueAt ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={errors.dueAt ? 'dueAt-error' : undefined}
        />
        {errors.dueAt && (
          <p id="dueAt-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.dueAt}
          </p>
        )}
      </div>

      {/* Estimate */}
      <div>
        <label htmlFor="estimateMinutes" className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Time (minutes) *
        </label>
        <input
          type="number"
          id="estimateMinutes"
          name="estimateMinutes"
          value={formData.estimateMinutes}
          onChange={(e) => handleInputChange('estimateMinutes', parseInt(e.target.value) || 0)}
          min="0"
          step="15"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.estimateMinutes ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={errors.estimateMinutes ? 'estimate-error' : undefined}
        />
        <p className="mt-1 text-sm text-gray-500">
          {Math.floor(formData.estimateMinutes / 60)}h {formData.estimateMinutes % 60}m
        </p>
        {errors.estimateMinutes && (
          <p id="estimate-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.estimateMinutes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};