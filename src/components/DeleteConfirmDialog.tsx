/**
 * Delete Confirmation Dialog Component
 * 
 * Accessible confirmation dialog for task deletion
 */

import { useEffect, useRef } from 'react';
import { useDeleteUserTaskMutation } from '../service/user';
import type { TaskItem } from '../types/userTask';

interface DeleteConfirmDialogProps {
  task: TaskItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog = ({ task, onSuccess, onCancel }: DeleteConfirmDialogProps) => {
  const [deleteTask, { isLoading }] = useDeleteUserTaskMutation();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus cancel button when dialog opens
    cancelButtonRef.current?.focus();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteTask({ id: task.id }).unwrap();
      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { status?: number; data?: { message?: string } };
      if (apiError?.status === 404) {
        // Task already deleted, treat as success
        onSuccess();
      } else {
        // Show error but don't close dialog
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 id="delete-dialog-title" className="text-lg font-semibold text-gray-900 mb-4">
          Delete Task
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{task.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};