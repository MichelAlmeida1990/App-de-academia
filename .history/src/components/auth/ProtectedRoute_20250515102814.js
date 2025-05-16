import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Corrigido o caminho de importação

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Verificar tanto isAuthenticated quanto currentUser para maior segurança
  if (!isAuthenticated && !currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
