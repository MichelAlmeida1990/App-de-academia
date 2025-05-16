import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Redireciona para a página de login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Renderiza o conteúdo protegido se estiver autenticado
  return children;
};

export default ProtectedRoute;
