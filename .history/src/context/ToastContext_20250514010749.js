import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Você precisará instalar: npm install uuid

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Função para adicionar uma nova notificação
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = uuidv4();
    const newToast = { id, message, type, duration };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Remove a notificação após o tempo definido
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
  };

  // Função para remover uma notificação específica
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Adicionando a função showToast para compatibilidade com o código existente
  const showToast = (title, message, type = 'info', duration = 5000) => {
    // Combina título e mensagem se ambos forem fornecidos
    const displayMessage = title && message ? `${title}: ${message}` : (message || title);
    addToast(displayMessage, type, duration);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

export default ToastContext;
