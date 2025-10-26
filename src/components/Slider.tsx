import React from 'react';

interface SliderProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClass?: string;
}

const Slider: React.FC<SliderProps> = ({ open, onClose, title, children, widthClass = 'max-w-md' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-transparent transition-opacity"
        onClick={onClose}
      />
      <div className={`relative ml-auto w-full ${widthClass} bg-white h-full shadow-xl z-50 animate-slide-in-right`}>
        <div className="flex justify-between items-center p-4 border-b">
          {title && <h3 className="text-xl font-bold">{title}</h3>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
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

export default Slider;
