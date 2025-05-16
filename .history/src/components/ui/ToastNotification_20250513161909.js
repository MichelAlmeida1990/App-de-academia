import React from 'react';
import { useToast } from '../../context/ToastContext';

const ToastNotification = () => {
  const { toasts, removeToast } = useToast();

  const getToastClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-md shadow-lg flex items-center justify-between
                     transform transition-all duration-300 animate-[slideIn_0.3s_ease-out_forwards]
                     ${getToastClasses(toast.type)}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
