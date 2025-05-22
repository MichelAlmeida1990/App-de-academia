// src/components/auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('Por favor, insira seu email', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      showToast('Email de recuperação enviado com sucesso!', 'success');
    } catch (error) {
      let errorMessage = 'Erro ao enviar email de recuperação';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Nenhuma conta encontrada com este email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800/50 rounded-xl shadow-md overflow-hidden p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recuperar Senha</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {!emailSent 
            ? 'Enviaremos um link para redefinir sua senha' 
            : 'Verifique seu email para redefinir sua senha'}
        </p>
      </div>

      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              placeholder="seu@email.com"
            />
          </div>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full flex justify-center"
          >
            Enviar link de recuperação
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
            Email enviado para {email}
          </div>
          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full"
          >
            Tentar com outro email
          </Button>
        </div>
      )}
      
      <div className="text-center mt-4">
        <Link 
          to="/login" 
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
