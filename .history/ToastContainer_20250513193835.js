import React from 'react';
import { useToast } from './ToastContext';

const Toast = ({ toast }) => {
  const { removeToast } = useToast();
  const { id, message, type } = toast;

  // Definir classes com base no tipo de notificação
  const getToastClasses = () => {
    const baseClasses = "flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg transition-all transform animate-slideIn";
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-500 text-white`;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="mr-3">{message}</div>
      <button
        onClick={() => removeToast(id)}
        className="text-white hover:text-gray-200 focus:outline-none"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 w-72">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
