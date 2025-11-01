import { useState, useRef, useEffect, useMemo } from 'react';
import { useGetUserTasksQuery } from '../service/user';
import type { TaskQueryParams, TaskItem } from '../types/userTask';
import { toStartOfDay, toEndOfDay } from '../utils/dateUtils';
import Slider from './Slider';
import { CreateTaskForm } from './CreateTaskForm';
import { EditTaskForm } from './EditTaskForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

// Status mapping for display
const statusColors = {
  1: 'bg-gray-100 text-gray-700', // Backlog
  2: 'bg-blue-100 text-blue-700', // Todo
  3: 'bg-yellow-100 text-yellow-700', // In Progress
  4: 'bg-red-100 text-red-700', // Blocked
  5: 'bg-green-100 text-green-700', // Done
};

const priorityColors = {
  1: 'bg-green-100 text-green-700', // Low
  2: 'bg-yellow-100 text-yellow-700', // Medium
  3: 'bg-red-100 text-red-700', // High
};



const MyToDoList = () => {
  // Filter state
  const [filters, setFilters] = useState({
    status: undefined as number | undefined,
    q: '',
    fromDue: '',
    toDue: '',
    page: 0,
    size: 20,
    sort: 'dueAt,asc', // Default sort by due date ascending
  });
  
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isCreateSliderOpen, setIsCreateSliderOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  // Build query params with date normalization
  const queryParams: TaskQueryParams = useMemo(() => ({
    ...filters,
    fromDue: filters.fromDue ? toStartOfDay(filters.fromDue) : undefined,
    toDue: filters.toDue ? toEndOfDay(filters.toDue) : undefined,
    q: filters.q || undefined,
  }), [filters]);
  
  // Fetch tasks using RTK Query
  const { data: tasksPage, error, isLoading, refetch } = useGetUserTasksQuery(queryParams);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }
    if (menuOpenId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenId]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.q !== queryParams.q) {
        setFilters(prev => ({ ...prev, page: 0 })); // Reset page on search
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.q]);
  
  const handleFilterChange = (key: keyof typeof filters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 0 : (value as number), // Reset page when changing filters
    }));
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading tasks</div>
        <button
          onClick={() => refetch()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }
  
  const tasks = tasksPage?.content || [];
  
  const handleCreateSuccess = () => {
    setIsCreateSliderOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingTask(null);
    setMenuOpenId(null);
  };

  const handleDeleteSuccess = () => {
    setDeletingTask(null);
    setMenuOpenId(null);
  };

  const handleMenuAction = (action: 'edit' | 'delete', task: TaskItem) => {
    setMenuOpenId(null);
    if (action === 'edit') {
      setEditingTask(task);
    } else {
      setDeletingTask(task);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <button
          onClick={() => setIsCreateSliderOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Task
        </button>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="1">Backlog</option>
              <option value="2">Todo</option>
              <option value="3">In Progress</option>
              <option value="4">Blocked</option>
              <option value="5">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Search tasks..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.fromDue}
              onChange={(e) => handleFilterChange('fromDue', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.toDue}
              onChange={(e) => handleFilterChange('toDue', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-lg">
          No tasks found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {tasks.map((task) => (
            <li
              key={task.id}
              className={`relative bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-start gap-4 border-l-4 ${
                task.statusId === 5 ? 'border-green-400' : 'border-indigo-400'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-semibold text-lg ${task.statusId === 5 ? 'line-through text-gray-400' : 'text-gray-900'}`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${statusColors[task.statusId as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {task.statusName}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${priorityColors[task.priorityId as keyof typeof priorityColors] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {task.priorityName}
                  </span>
                </div>
                <div
                  className={`text-gray-600 mb-2 ${task.statusId === 5 ? 'line-through' : ''}`}
                >
                  {task.descriptionMd.length > 100 ? `${task.descriptionMd.substring(0, 100)}...` : task.descriptionMd}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    Due:{' '}
                    <span className="font-medium text-gray-700">
                      {formatDate(task.dueAt)}
                    </span>
                  </span>
                  <span>
                    Time:{' '}
                    <span className="font-medium text-gray-700">
                      {formatTime(task.spentMinutes)} / {formatTime(task.estimateMinutes)}
                    </span>
                  </span>
                  {task.completedAt && (
                    <span>
                      Completed:{' '}
                      <span className="font-medium text-green-600">
                        {formatDate(task.completedAt)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions Menu */}
              <div className="relative" ref={menuOpenId === task.id ? menuRef : null}>
                <button
                  onClick={() => setMenuOpenId(menuOpenId === task.id ? null : task.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                  aria-label="Task actions"
                  aria-expanded={menuOpenId === task.id}
                  aria-haspopup="true"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {menuOpenId === task.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => handleMenuAction('edit', task)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        role="menuitem"
                      >
                        Edit Task
                      </button>
                      <button
                        onClick={() => handleMenuAction('delete', task)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
                        role="menuitem"
                      >
                        Delete Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        {/* Pagination */}
        {tasksPage && tasksPage.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handleFilterChange('page', Math.max(0, filters.page - 1))}
              disabled={filters.page === 0}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {filters.page + 1} of {tasksPage.totalPages}
            </span>
            <button
              onClick={() => handleFilterChange('page', Math.min(tasksPage.totalPages - 1, filters.page + 1))}
              disabled={filters.page >= tasksPage.totalPages - 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </>
      )}
      
      {/* Create Task Slider */}
      <Slider open={isCreateSliderOpen} onClose={() => setIsCreateSliderOpen(false)} title="Create New Task">
        <CreateTaskForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateSliderOpen(false)} />
      </Slider>
      
      {/* Edit Task Slider */}
      {editingTask && (
        <Slider open={true} onClose={() => setEditingTask(null)} title="Edit Task">
          <EditTaskForm task={editingTask} onSuccess={handleEditSuccess} onCancel={() => setEditingTask(null)} />
        </Slider>
      )}
      
      {/* Delete Confirmation Dialog */}
      {deletingTask && (
        <DeleteConfirmDialog
          task={deletingTask}
          onSuccess={handleDeleteSuccess}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
};

export default MyToDoList;
