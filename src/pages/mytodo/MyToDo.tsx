
import MyToDoList from '@/components/MyToDoList';
import { useState } from 'react';

import AddTodoForm from '@/components/AddTodoForm';
import Slider from '@/components/Slider';


const MyToDosPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 font-semibold transition-colors"
        >
          + Add Todo
        </button>
      </div>
      <MyToDoList />
      {/* Slider for AddTodoForm */}
      <Slider open={open} onClose={() => setOpen(false)} title="Add New Todo">
        <AddTodoForm onSubmit={() => setOpen(false)} />
      </Slider>
      {/* Add animation for slider */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}

export default MyToDosPage