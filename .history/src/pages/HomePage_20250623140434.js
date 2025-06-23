// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaRocket, 
  FaChartLine, 
  FaDumbbell, 
  FaFire, 
  FaUsers,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGoogle,
  FaShieldAlt,
  FaStar,
  FaTrophy,
  FaMobile
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Componente de Feature Card Refinado
const FeatureCard = ({ icon, title, description, delay = 0, gradient }) => {
  return (
    <div 
      className="feature-card group"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className={`feature-icon ${gradient}`}>
        {icon}
      </div>
      <h3 className="feature-title">
        {title}
      </h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

// Componente de estatística refinado
const StatCard = ({ number, label, icon, delay = 0, color = "purple" }) => {
  return (
    <div 
      className="stat-card"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

// Componente de notificação Toast refinado
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return { 
          bg: 'rgba(16, 185, 129, 0.95)', 
          icon: <FaCheckCircle className="text-white" />,
          border: '1px solid rgba(16, 185, 129, 0.3)'
        };
      case 'error':
        return { 
          bg: 'rgba(239, 68, 68, 0.95)', 
          icon: <FaExclamationTriangle className="text-white" />,
          border: '1px solid rgba(239, 68, 68, 0.3)'
        };
      default:
        return { 
          bg: 'rgba(99, 102, 241, 0.95)', 
          icon: <span className="text-white">ℹ️</span>,
          border: '1px solid rgba(99, 102, 241, 0.3)'
        };
    }
  };

  const config = getToastConfig();

  return (
    <div 
      className="toast-notification"
      style={{ 
        background: config.bg,
        border: config.border
      }}
    >
      {config.icon}
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close">
        ✕
      </button>
    </div>
  );
};

// Componente principal
const HomePage = () => {
  const { login: contextLogin, signup: contextSignup, loginWithGoogle, isAuthenticated: globalIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        if (!name.trim()) {
          throw new Error('Nome é obrigatório');
        }
        if (password.length < 6) {
          throw new Error('Senha deve ter pelo menos 6 caracteres');
        }
        await contextSignup(email, password, name); 
        showToast('success', 'Conta criada com sucesso! Bem-vindo!');
      } else {
        await contextLogin(email, password);
        showToast('success', 'Login realizado com sucesso! Bem-vindo de volta!');
      }
    } catch (error) {
      showToast('error', error.message || 'Ocorreu um erro.'); 
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast('success', 'Login com Google realizado com sucesso!');
    } catch (error) {
      console.error('Erro no Google Auth:', error);
      showToast('error', error.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@fitness.com');
    setPassword('demo123');
    setIsRegistering(false);
    
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }, 100);
  };

  return (
    <>
      <style>{`
        /* ===== CORE ANIMATIONS ===== */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
          }
          50% {
            text-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* ===== GLASSMORPHISM REFINADO ===== */
        .glass-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          box-shadow: 
            0 20px 35px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .premium-form {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 450px;
          margin: 0 auto;
        }

        .premium-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(168, 85, 247, 0.8), 
            rgba(236, 72, 153, 0.8), 
            rgba(168, 85, 247, 0.8)
          );
        }

        /* ===== FEATURE CARDS REFINADAS ===== */
        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s;
        }

        .feature-card:hover::before {
          left: 100%;
        }

        .feature-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          margin: 0 auto 1rem;
          position: relative;
          overflow: hidden;
        }

        .feature-icon.gradient-purple {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
        }

        .feature-icon.gradient-blue {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .feature-icon.gradient-green {
          background: linear-gradient(135deg, #10b981, #34d399);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }

        .feature-icon.gradient-orange {
          background: linear-gradient(135deg, #f59e0b, #fb923c);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .feature-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        /* ===== STAT CARDS REFINADAS ===== */
        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          color: #a855f7;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        /* ===== INPUTS PREMIUM ===== */
        .premium-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .premium-input:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 
            0 0 0 3px rgba(168, 85, 247, 0.1),
            0 6px 20px rgba(168, 85, 247, 0.15);
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }

        .premium-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ===== BOTÕES PREMIUM ===== */
        .btn-premium {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.875rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 6px 20px rgba(139, 92, 246, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .btn-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s;
        }

        .btn-premium:hover::before {
          left: 100%;
        }

        .btn-premium:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 10px 25px rgba(139, 92, 246, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-premium:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-premium:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        /* ===== TOAST NOTIFICATION ===== */
        .toast-notification {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 350px;
          min-width: 280px;
        }

        .toast-message {
          flex: 1;
          font-weight: 600;
          color: white;
          font-size: 0.9rem;
        }

        .toast-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* ===== LAYOUT SIDE-BY-SIDE ===== */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 0;
          position: relative;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 75vh;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1.5rem;
        }

        .form-section {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content-sections {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 1rem;
          position: relative;
          z-index: 1;
        }

        /* ===== RESPONSIVE DESIGN ===== */
        @media (max-width: 1024px) {
          .hero-container {
            gap: 1.5rem;
            min-height: 70vh;
          }
          
          .brand-section {
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            min-height: auto;
          }

          .brand-section {
            text-align: center;
            padding: 1rem;
            order: 1;
          }

          .form-section {
            order: 2;
          }

          .premium-form {
            padding: 1.25rem;
            border-radius: 16px;
            max-width: 100%;
            margin: 0;
          }

          .feature-card {
            padding: 1rem;
          }

          .feature-icon {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .stat-icon {
            font-size: 1.5rem;
          }

          .toast-notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
            min-width: auto;
          }

          .hero-section {
            min-height: 100vh;
            padding: 1rem 0;
          }

          .content-sections {
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .premium-form {
            padding: 1rem;
          }

          .premium-input {
            padding: 0.625rem 0.75rem;
            font-size: 0.85rem;
          }

          .btn-premium {
            padding: 0.625rem 1rem;
            font-size: 0.9rem;
          }

          .hero-section {
            min-height: 100vh;
            padding: 0.5rem 0;
          }

          .feature-card {
            padding: 0.875rem;
          }

          .stat-card {
            padding: 0.875rem;
          }

          .brand-section {
            padding: 0.5rem;
          }
        }

        /* ===== FLOATING ANIMATIONS ===== */
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        /* ===== BACKGROUND EFFECTS ===== */
        .gradient-bg {
          background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #8b5cf6 50%, 
            #ec4899 75%, 
            #f093fb 100%
          );
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* ===== VISUAL HIERARCHY ===== */
        .section-spacing {
          margin: 3rem 0;
        }

        @media (min-width: 640px) {
          .section-spacing {
            margin: 3.5rem 0;
          }
        }

        @media (min-width: 1024px) {
          .section-spacing {
            margin: 4rem 0;
          }
        }
      `}</style>

      <div className="min-h-screen gradient-bg relative overflow-hidden">
        {/* Background Decorativo Sutil */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block opacity-20">
          <div className="absolute top-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Seção Hero Side-by-Side */}
        <div className="hero-section relative z-10">
          <div className="container mx-auto px-4">
            <div className="hero-container">
              {/* Seção da Marca - Esquerda */}
              <div className="brand-section" style={{ animation: 'fadeInUp 1s ease-out' }}>
                <div className="flex flex-col">
                  <div className="animate-float mb-3">
                    <span className="text-5xl sm:text-6xl lg:text-7xl">🏋️</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 animate-glow leading-tight">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      FitnessTracker
                    </span>
                  </h1>
                  <div className="space-y-3">
                    <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed font-light">
                      Transforme sua jornada fitness com tecnologia de ponta
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-white/70 font-light">
                      Monitore progresso • Alcance objetivos • Supere limites
                    </p>
                    
                    {/* Features highlights na seção da marca */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        <span className="text-white/80 font-medium text-xs lg:text-sm">Analytics Avançado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        <span className="text-white/80 font-medium text-xs lg:text-sm">IA Personalizada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <span className="text-white/80 font-medium text-xs lg:text-sm">Gamificação</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💪</span>
                        <span className="text-white/80 font-medium text-xs lg:text-sm">Comunidade Ativa</span>
                      </div>
                    </div>

                    {/* Estatísticas rápidas */}
                    <div className="flex items-center gap-4 mt-4 pt-3">
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-white">10k+</div>
                        <div className="text-xs text-white/70">Atletas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-white">500+</div>
                        <div className="text-xs text-white/70">Exercícios</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-white">24/7</div>
                        <div className="text-xs text-white/70">Suporte</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção do Formulário - Direita */}
              <div className="form-section" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
                <div className="premium-form" style={{ maxWidth: '420px', width: '100%' }}>
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <span className="text-xl">{isRegistering ? '✨' : '🔐'}</span>
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        {isRegistering ? 'Criar Conta Premium' : 'Acesso Premium'}
                      </span>
                    </h2>
                    <p className="text-white/80 text-sm">
                      {isRegistering ? 'Junte-se à elite do fitness digital' : 'Bem-vindo de volta, atleta!'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {isRegistering && (
                      <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                        <label className="block text-white font-semibold mb-1 flex items-center gap-2 text-sm">
                          <FaUser className="text-purple-400" /> Nome Completo
                        </label>
                        <input
                          type="text"
                          placeholder="Seu nome completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={isRegistering}
                          className="premium-input"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-white font-semibold mb-1 flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-purple-400" /> Email
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="premium-input"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-1 flex items-center gap-2 text-sm">
                        <FaLock className="text-purple-400" /> Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha segura"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="premium-input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-premium w-full flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <span>{isRegistering ? <FaRocket /> : <FaUser />}</span>
                          <span>{isRegistering ? 'Criar Conta Premium' : 'Acessar Plataforma'}</span>
                        </>
                      )}
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-white/60 font-medium">ou continue com</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                      <FaGoogle className="text-red-400" />
                      {loading ? 'Conectando...' : (isRegistering ? 'Registrar com Google' : 'Continuar com Google')}
                    </button>

                    {!isRegistering && (
                      <button
                        type="button"
                        onClick={handleDemoLogin}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        <span>🎯</span>
                        Experimentar Demo
                      </button>
                    )}

                    <div className="text-center space-y-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-white/80 hover:text-white font-medium underline transition-colors duration-300 flex items-center justify-center gap-2 mx-auto text-sm"
                      >
                        <span>{isRegistering ? '🔙' : '📝'}</span>
                        {isRegistering ? 
                          'Já tem conta? Faça login' : 
                          'Não tem conta? Registre-se'
                        }
                      </button>
                      
                      {!isRegistering && (
                        <button 
                          type="button"
                          className="text-white/60 hover:text-white text-xs underline transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                        >
                          <span>🔑</span>
                          Esqueceu sua senha?
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seções de Conteúdo Abaixo */}
        <div className="content-sections bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            {/* Feature Cards Grid */}
            <div 
              className="section-spacing"
              style={{ 
                animationDelay: '1000ms',
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  🚀 <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Recursos Premium
                  </span>
                </h2>
                <p className="text-white/70 text-base lg:text-lg max-w-3xl mx-auto">
                  Descubra ferramentas avançadas que vão transformar sua rotina de exercícios
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard
                  icon="📊"
                  title="Analytics Avançado"
                  description="Dashboards inteligentes com insights profundos sobre seu progresso"
                  delay={100}
                  gradient="gradient-purple"
                />
                
                <FeatureCard
                  icon="🎯"
                  title="IA Personalizada"
                  description="Algoritmos que adaptam treinos às suas necessidades específicas"
                  delay={200}
                  gradient="gradient-blue"
                />
                
                <FeatureCard
                  icon="🔥"
                  title="Gamificação"
                  description="Sistema de conquistas e desafios para manter você motivado"
                  delay={300}
                  gradient="gradient-orange"
                />
                
                <FeatureCard
                  icon="💪"
                  title="Comunidade Ativa"
                  description="Conecte-se com atletas e compartilhe sua evolução"
                  delay={400}
                  gradient="gradient-green"
                />
              </div>
            </div>

            {/* Seção Premium */}
            <div 
              className="glass-container p-6 lg:p-8 section-spacing"
              style={{ 
                animationDelay: '1200ms',
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Experiência Premium
                  </span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <FaShieldAlt className="text-green-400 text-lg flex-shrink-0" />
                  <span className="text-white font-medium text-sm">Dados protegidos e seguros</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <FaMobile className="text-blue-400 text-lg flex-shrink-0" />
                  <span className="text-white font-medium text-sm">App móvel nativo</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <FaStar className="text-yellow-400 text-lg flex-shrink-0" />
                  <span className="text-white font-medium text-sm">Suporte premium 24/7</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <FaTrophy className="text-orange-400 text-lg flex-shrink-0" />
                  <span className="text-white font-medium text-sm">Certificações fitness</span>
                </div>
              </div>
            </div>

            {/* Estatísticas Refinadas */}
            <div 
              className="section-spacing text-center"
              style={{ 
                animationDelay: '1400ms',
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
                  🌟 Números que Impressionam 🌟
                </h2>
                <p className="text-white/70 text-sm lg:text-base max-w-3xl mx-auto">
                  Milhares de pessoas já transformaram suas vidas conosco. Seja o próximo!
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <StatCard
                  number="10k+"
                  label="Atletas Ativos"
                  icon={<FaUsers />}
                  delay={100}
                />
                <StatCard
                  number="500+"
                  label="Exercícios Pro"
                  icon={<FaDumbbell />}
                  delay={200}
                />
                <StatCard
                  number="24/7"
                  label="Suporte Expert"
                  icon={<span>🏆</span>}
                  delay={300}
                />
              </div>
            </div>

            {/* Footer Refinado */}
            <div className="text-center section-spacing">
              <div className="glass-container p-6 max-w-4xl mx-auto">
                <p className="text-white/70 text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span>© 2025 FitnessTracker Pro.</span>
                  <span>Tecnologia de ponta para atletas de elite.</span>
                  <span className="flex items-center gap-1">
                    <span>❤️</span> Feito com <span>💪</span> por especialistas
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
