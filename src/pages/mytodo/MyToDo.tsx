import MyToDoList from '@/components/MyToDoList';
import { useState } from 'react';

import AddTodoForm from '@/components/AddTodoForm';
import Slider from '@/components/Slider';

const MyToDosPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
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
};

export default MyToDosPage;
