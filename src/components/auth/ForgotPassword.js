// src/components/auth/ForgotPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmailService from '../../services/EmailService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);
  const [emailServiceStatus, setEmailServiceStatus] = useState(null);
  const { requestPasswordReset, loading, error, setError, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Limpar erros quando o componente é montado e verificar status do EmailJS
  useEffect(() => {
    setError('');
    
    // Verificar se as variáveis de ambiente estão sendo carregadas
    console.log('Verificando configurações do EmailJS...');
    console.log('REACT_APP_EMAILJS_SERVICE_ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID ? 'Definido' : 'Não definido');
    console.log('REACT_APP_EMAILJS_TEMPLATE_ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID ? 'Definido' : 'Não definido');
    console.log('REACT_APP_EMAILJS_PUBLIC_KEY:', process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? 'Definido' : 'Não definido');
    
    // Verificar status do serviço
    const checkEmailService = async () => {
      try {
        const status = await EmailService.checkServiceStatus();
        console.log('Status do serviço EmailJS:', status);
        setEmailServiceStatus(status);
      } catch (err) {
        console.error('Erro ao verificar serviço de email:', err);
      }
    };
    
    checkEmailService();
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
      const result = await requestPasswordReset(email);
      setEmailSent(true);
      
      // Armazenar informações de debug apenas em ambiente de desenvolvimento
      if (process.env.NODE_ENV === 'development' && result.debug) {
        setResetInfo(result.debug);
      }
      
      if (result.emailSent) {
        showToast('Instruções de recuperação enviadas para seu email', 'success');
      } else {
        showToast('Email simulado enviado (modo de desenvolvimento)', 'info');
      }
    } catch (error) {
      // O erro já é tratado no contexto de autenticação
      showToast(error.message || 'Erro ao enviar email de recuperação', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para copiar link de reset para o clipboard (apenas para desenvolvimento)
  const copyResetLink = () => {
    if (resetInfo?.resetUrl) {
      navigator.clipboard.writeText(resetInfo.resetUrl)
        .then(() => showToast('Link copiado para a área de transferência', 'success'))
        .catch(() => showToast('Falha ao copiar link', 'error'));
    }
  };

  // Função para testar o serviço de email
  const testEmailService = async () => {
    try {
      const result = await EmailService.testEmailService();
      if (result.success) {
        showToast('Teste de email realizado com sucesso', 'success');
      } else {
        showToast(`Falha no teste: ${result.message}`, 'error');
      }
      console.log('Resultado do teste de email:', result);
    } catch (err) {
      showToast('Erro ao testar serviço de email', 'error');
      console.error('Erro no teste de email:', err);
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
      
      {/* Status do serviço de email (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && emailServiceStatus && (
        <div className={`mb-4 p-2 text-sm rounded ${emailServiceStatus.available 
          ? 'bg-green-100 text-green-700 border border-green-400' 
          : 'bg-yellow-100 text-yellow-700 border border-yellow-400'}`}>
          <p>
            <span className="font-medium">Status EmailJS:</span> {emailServiceStatus.message}
          </p>
          {!emailServiceStatus.available && (
            <button 
              onClick={testEmailService}
              className="mt-1 text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Testar serviço
            </button>
          )}
        </div>
      )}
      
      {emailSent ? (
        <div className="text-center space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Instruções de recuperação enviadas para <strong>{email}</strong>.</p>
            <p className="mt-2">Verifique sua caixa de entrada para redefinir sua senha.</p>
            
            {/* Informações de debug apenas em ambiente de desenvolvimento */}
            {process.env.NODE_ENV === 'development' && resetInfo && (
              <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded text-left">
                <p className="font-bold text-gray-700">Informações de desenvolvimento:</p>
                <div className="mt-2 text-sm text-gray-600 break-all">
                  <p>Token: {resetInfo.token}</p>
                  <p>Expira em: {new Date(resetInfo.expiresAt).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <span className="mr-2">Link de reset:</span>
                    <button 
                      onClick={copyResetLink}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Copiar link
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Estas informações são visíveis apenas em ambiente de desenvolvimento.
                </p>
              </div>
            )}
            
            {process.env.NODE_ENV !== 'development' && (
              <p className="mt-2 text-sm text-gray-600">
                Caso não receba o email, verifique sua pasta de spam.
              </p>
            )}
          </div>
          
          <button
            onClick={() => {
              setEmailSent(false);
              setResetInfo(null);
            }}
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
