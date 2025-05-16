import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { signup, loading, error, currentUser } = useAuth();
  const navigate = useNavigate();

  // Limpar erros quando o componente é montado
  useEffect(() => {
    setFormError('');
  }, []);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação de senha
    if (password !== confirmPassword) {
      setFormError('As senhas não coincidem');
      return;
    }
    
    // Validação de senha forte
    if (password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    setFormError('');
    
    try {
      await signup(email, password, name);
      // O redirecionamento será feito pelo useEffect quando currentUser mudar
    } catch (error) {
      setFormError(error.message || 'Erro ao registrar usuário');
      console.error('Erro de registro:', error);
    }
  };

  return (
    <div className="card max-w-md mx-auto fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar conta</h2>
      
      {(error || formError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{formError || error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">Nome completo</label>
          <input
            id="name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="register-email" className="form-label">Email</label>
          <input
            id="register-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="register-password" className="form-label">Senha</label>
          <input
            id="register-password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            A senha deve ter pelo menos 8 caracteres
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirm-password" className="form-label">Confirmar senha</label>
          <input
            id="confirm-password"
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
