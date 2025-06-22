// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaArrowLeft, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaShieldAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { logger } from '../utils/logger';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!email) {
      setError('Por favor, digite seu email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, digite um email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
      addToast('Email de recuperação enviado com sucesso!', 'success');
      logger.log('Email de recuperação enviado para:', email);
    } catch (error) {
      logger.error('Erro ao enviar email de recuperação:', error);
      
      // Tratamento de erros específicos do Firebase
      let errorMessage = 'Erro ao enviar email de recuperação';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Não encontramos uma conta com este email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
      }
      
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    setSuccess(false);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaShieldAlt className="text-3xl text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Recuperar Senha
          </h1>
          <p className="text-white/80">
            {success 
              ? 'Verifique seu email para continuar'
              : 'Digite seu email para receber o link de recuperação'
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 border ${
                      error ? 'border-red-400' : 'border-white/20'
                    } rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200`}
                    placeholder="seu.email@exemplo.com"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-300 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-2" />
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-white text-purple-800 hover:bg-gray-100 focus:ring-2 focus:ring-white/30'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Enviando...
                  </div>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </motion.button>
            </form>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <FaCheckCircle className="text-3xl text-green-400" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Email Enviado!
                </h2>
                <p className="text-white/80 mb-4">
                  Enviamos um link de recuperação para:
                </p>
                <p className="text-white font-medium bg-white/10 rounded-lg py-2 px-4">
                  {email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 text-left">
                  <h3 className="text-white font-medium mb-2">Próximos passos:</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Verifique sua caixa de entrada</li>
                    <li>• Clique no link do email</li>
                    <li>• Defina sua nova senha</li>
                    <li>• Faça login com a nova senha</li>
                  </ul>
                </div>

                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="text-white/80 hover:text-white underline text-sm transition-colors duration-200"
                >
                  Não recebeu o email? Enviar novamente
                </button>
              </div>
            </motion.div>
          )}

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center space-y-4">
            <Link
              to="/auth"
              className="flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Voltar para Login
            </Link>

            <p className="text-white/60 text-sm">
              Lembrou da senha?{' '}
              <Link to="/auth" className="text-white hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center"
        >
          <p className="text-white/70 text-xs">
            🔒 Seus dados estão protegidos. O link de recuperação expira em 1 hora.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
