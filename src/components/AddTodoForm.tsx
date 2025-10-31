import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '@/service/mytodo';
import type { Todo } from '@/types/todo';

const initialForm: Omit<Todo, 'id'> = {
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  assignDate: '',
  dueDate: '',
  completedDate: undefined,
};

interface AddTodoFormProps {
  initialData?: Partial<Todo>;
  onSubmit?: (todo: Todo) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit,
}) => {
  const [form, setForm] = useState<Omit<Todo, 'id'> & { id?: number }>(
    initialForm
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialForm, ...initialData });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !form.assignDate) return;
    const todo: Todo = {
      ...form,
      id: form.id ?? Date.now(),
    };
    if (isEdit && onSubmit) {
      onSubmit(todo);
    } else {
      dispatch(addTodo(todo));
      setForm(initialForm);
    }
    if (onCancel && isEdit) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">
        {isEdit ? 'Edit Todo' : 'Add New Todo'}
      </h2>
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1">Assign Date</label>
          <input
            type="date"
            name="assignDate"
            value={form.assignDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="completed"
          checked={form.completed}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="font-medium">Completed</label>
      </div>
      {form.completed && (
        <div>
          <label className="block font-medium mb-1">Completed Date</label>
          <input
            type="date"
            name="completedDate"
            value={form.completedDate || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors font-semibold"
        >
          {isEdit ? 'Update Todo' : 'Add Todo'}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddTodoForm;
