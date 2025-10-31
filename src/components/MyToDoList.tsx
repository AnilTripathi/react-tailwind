import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import {
  selectTotoList,
  deleteTodo,
  toggleTodo,
  updateToto,
} from '@/service/mytodo';
import { useState, useRef, useEffect } from 'react';
import type { Todo } from '@/types/todo';
import AddTodoForm from './AddTodoForm';
import Slider from './Slider';

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const MyToDoList = () => {
  const todoList = useAppSelector(selectTotoList);
  const dispatch = useAppDispatch();
  const [editId, setEditId] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const handleToggle = (todo: Todo) => {
    dispatch(
      toggleTodo({
        id: todo.id,
        completed: !todo.completed,
        completedDate: !todo.completed
          ? new Date().toISOString().slice(0, 10)
          : '',
      })
    );
    setMenuOpenId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(id));
    }
    setMenuOpenId(null);
  };

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditTodo(todo);
    setMenuOpenId(null);
  };

  const handleUpdate = (updated: Todo) => {
    dispatch(updateToto(updated));
    setEditId(null);
    setEditTodo(null);
  };

  return (
    <div className="space-y-6">
      {todoList.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-lg">
          No todos yet. Add your first todo!
        </div>
      ) : (
        <ul className="space-y-4">
          {todoList.map((todo) => (
            <li
              key={todo.id}
              className={`relative bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center gap-4 border-l-4 ${
                todo.completed ? 'border-green-400' : 'border-indigo-400'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => handleToggle(todo)}
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none ${
                      todo.completed
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 bg-white'
                    }`}
                    title={
                      todo.completed ? 'Mark as uncomplete' : 'Mark as complete'
                    }
                  >
                    {todo.completed && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                  >
                    {todo.title}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${priorityColors[todo.priority]}`}
                  >
                    {todo.priority}
                  </span>
                </div>
                <div
                  className={`text-gray-600 mb-2 ${todo.completed ? 'line-through' : ''}`}
                >
                  {todo.description}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    Assigned:{' '}
                    <span className="font-medium text-gray-700">
                      {todo.assignDate}
                    </span>
                  </span>
                  <span>
                    Due:{' '}
                    <span className="font-medium text-gray-700">
                      {todo.dueDate}
                    </span>
                  </span>
                  {todo.completed && todo.completedDate && (
                    <span>
                      Completed:{' '}
                      <span className="font-medium text-green-600">
                        {todo.completedDate}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <div className="relative md:ml-4 md:items-end flex items-center">
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === todo.id ? null : todo.id)
                  }
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                  title="More Actions"
                  aria-label="More Actions"
                >
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
                {menuOpenId === todo.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-fade-in py-2 px-1"
                    style={{ minWidth: '13rem' }}
                  >
                    <div className="px-3 py-2 text-xs text-gray-400 font-semibold tracking-wide uppercase select-none">
                      More Actions
                    </div>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="flex items-center w-full gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium"
                    >
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="flex items-center w-full gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                    >
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggle(todo)}
                      className="flex items-center w-full gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                    >
                      {todo.completed ? (
                        <>
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Mark as Uncomplete
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              {/* Edit slider using AddTodoForm */}
              <Slider
                open={editId === todo.id}
                onClose={() => {
                  setEditId(null);
                  setEditTodo(null);
                }}
                title="Edit Todo"
              >
                <AddTodoForm
                  initialData={editTodo || todo}
                  onSubmit={(updated) => {
                    handleUpdate(updated);
                  }}
                  onCancel={() => {
                    setEditId(null);
                    setEditTodo(null);
                  }}
                  isEdit
                />
              </Slider>
              {/* Add animation for dropdown */}
              <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease;
        }
      `}</style>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyToDoList;
