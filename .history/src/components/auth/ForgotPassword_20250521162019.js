// src/components/auth/ForgotPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, loading, error, setError, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Limpar erros quando o componente é montado
  useEffect(() => {
    setError('');
  }, [setError]);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('Por favor, insira seu email', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
      showToast('Instruções de recuperação enviadas para seu email', 'success');
    } catch (error) {
      // O erro já é tratado no contexto de autenticação
      showToast(error.message || 'Erro ao enviar email de recuperação', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {emailSent ? (
        <div className="text-center space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Instruções de recuperação enviadas para <strong>{email}</strong>.</p>
            <p className="mt-2">Verifique sua caixa de entrada para redefinir sua senha.</p>
            <p className="mt-2 text-sm text-gray-600">
              (Nota: Como esta é uma aplicação de demonstração, nenhum email real foi enviado)
            </p>
          </div>
          
          <button
            onClick={() => setEmailSent(false)}
            className="btn-secondary w-full"
          >
            Tentar com outro email
          </button>
          
          <div className="mt-4">
            <Link to="/auth" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Voltar para o login
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Insira o email associado à sua conta para receber instruções de recuperação de senha.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Enviando...' : 'Recuperar senha'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lembrou sua senha?{' '}
              <Link
                to="/auth"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Voltar para o login
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
