// src/components/auth/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenStatus, setTokenStatus] = useState({ valid: null, message: '', checking: true });
  
  const { confirmPasswordReset, verifyPasswordResetToken, loading, error, setError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Limpar erros quando o componente é montado
  useEffect(() => {
    setError('');
  }, [setError]);

  // Verificar a validade do token quando o componente é montado
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenStatus({ 
          valid: false, 
          message: 'Token de recuperação ausente. Solicite um novo link de recuperação.', 
          checking: false 
        });
        return;
      }

      try {
        const result = verifyPasswordResetToken(token);
        setTokenStatus({ 
          valid: result.valid, 
          message: result.message || '', 
          email: result.email,
          checking: false 
        });
      } catch (error) {
        setTokenStatus({ 
          valid: false, 
          message: 'Erro ao verificar token de recuperação.', 
          checking: false 
        });
      }
    };

    checkToken();
  }, [token, verifyPasswordResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar senha
    if (password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await confirmPasswordReset(token, password);
      setResetComplete(true);
      showToast('Senha redefinida com sucesso!', 'success');
    } catch (error) {
      showToast(error.message || 'Erro ao redefinir senha', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exibir mensagem de carregamento enquanto verifica o token
  if (tokenStatus.checking) {
    return (
      <div className="card max-w-md mx-auto fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  // Exibir erro se o token for inválido
  if (!tokenStatus.valid) {
    return (
      <div className="card max-w-md mx-auto fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">Link Inválido</h2>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{tokenStatus.message || 'O link de recuperação é inválido ou expirou.'}</p>
        </div>
        
        <div className="text-center">
          <Link 
            to="/forgot-password" 
            className="btn-primary inline-block"
          >
            Solicitar novo link
          </Link>
          
          <div className="mt-4">
            <Link 
              to="/auth" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {resetComplete ? (
        <div className="text-center space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Sua senha foi redefinida com sucesso!</p>
            <p className="mt-2">Agora você pode fazer login com sua nova senha.</p>
          </div>
          
          <Link 
            to="/auth" 
            className="btn-primary w-full block"
          >
            Ir para o login
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {tokenStatus.email && (
              <span>Criando nova senha para <strong>{tokenStatus.email}</strong></span>
            )}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Nova senha</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
                minLength="6"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">Confirme a nova senha</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/auth" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Voltar para o login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
