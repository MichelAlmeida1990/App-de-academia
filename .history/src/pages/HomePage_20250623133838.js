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
            transform: translateY(40px);
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
            transform: translateY(-15px);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            text-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* ===== GLASSMORPHISM REFINADO ===== */
        .glass-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          box-shadow: 
            0 25px 45px rgba(0, 0, 0, 0.1),
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
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
          position: relative;
          overflow: hidden;
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
          border-radius: 20px;
          padding: 1.75rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
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
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
          position: relative;
          overflow: hidden;
        }

        .feature-icon.gradient-purple {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }

        .feature-icon.gradient-blue {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .feature-icon.gradient-green {
          background: linear-gradient(135deg, #10b981, #34d399);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .feature-icon.gradient-orange {
          background: linear-gradient(135deg, #f59e0b, #fb923c);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }

        .feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .feature-description {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        /* ===== STAT CARDS REFINADAS ===== */
        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #a855f7;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        /* ===== INPUTS PREMIUM ===== */
        .premium-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .premium-input:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 
            0 0 0 4px rgba(168, 85, 247, 0.1),
            0 8px 25px rgba(168, 85, 247, 0.15);
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }

        .premium-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ===== BOTÕES PREMIUM ===== */
        .btn-premium {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 16px;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 1rem 2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 25px rgba(139, 92, 246, 0.3),
            0 3px 10px rgba(0, 0, 0, 0.1);
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
          transform: translateY(-3px);
          box-shadow: 
            0 15px 35px rgba(139, 92, 246, 0.4),
            0 5px 15px rgba(0, 0, 0, 0.1);
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
          border-radius: 16px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.875rem 1.5rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        /* ===== TOAST NOTIFICATION ===== */
        .toast-notification {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 9999;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 400px;
          min-width: 300px;
        }

        .toast-message {
          flex: 1;
          font-weight: 600;
          color: white;
        }

        .toast-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0;
          width: 24px;
          height: 24px;
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

        /* ===== RESPONSIVE DESIGN ===== */
        @media (max-width: 768px) {
          .premium-form {
            padding: 1.5rem;
            border-radius: 20px;
          }

          .feature-card {
            padding: 1.25rem;
          }

          .feature-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }

          .stat-card {
            padding: 1.5rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .stat-icon {
            font-size: 2rem;
          }

          .toast-notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .premium-form {
            padding: 1.25rem;
          }

          .premium-input {
            padding: 0.875rem 1rem;
            font-size: 0.95rem;
          }

          .btn-premium {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }

        /* ===== FLOATING ANIMATIONS ===== */
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
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
            margin: 4rem 0;
          }
        }

        @media (min-width: 1024px) {
          .section-spacing {
            margin: 5rem 0;
          }
        }
      `}</style>

      <div className="min-h-screen gradient-bg relative overflow-hidden">
        {/* Background Decorativo Sutil */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-blue-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 min-h-screen">
          {/* Header Refinado */}
          <div className="text-center section-spacing" style={{ animation: 'fadeInUp 1s ease-out' }}>
            <div className="flex flex-col items-center mb-6">
              <div className="animate-float mb-4">
                <span className="text-6xl sm:text-8xl lg:text-9xl">🏋️</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 animate-glow">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  FitnessTracker
                </span>
              </h1>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 leading-relaxed font-light">
                  Transforme sua jornada fitness com tecnologia de ponta
                </p>
                <p className="text-lg sm:text-xl text-white/70 mt-4 font-light">
                  Monitore progresso • Alcance objetivos • Supere limites
                </p>
              </div>
            </div>
          </div>

          {/* Layout Principal */}
          <div className="flex flex-col xl:grid xl:grid-cols-5 gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
            
            {/* Lado Esquerdo - Features (3/5 do espaço) */}
            <div className="w-full xl:col-span-3 space-y-8 order-2 xl:order-1">
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              {/* Seção Premium */}
              <div 
                className="glass-container p-6 lg:p-8"
                style={{ 
                  animationDelay: '500ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaRocket className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Experiência Premium
                    </span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <FaShieldAlt className="text-green-400 text-xl flex-shrink-0" />
                    <span className="text-white font-medium">Dados protegidos e seguros</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <FaMobile className="text-blue-400 text-xl flex-shrink-0" />
                    <span className="text-white font-medium">App móvel nativo</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <FaStar className="text-yellow-400 text-xl flex-shrink-0" />
                    <span className="text-white font-medium">Suporte premium 24/7</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <FaTrophy className="text-orange-400 text-xl flex-shrink-0" />
                    <span className="text-white font-medium">Certificações fitness</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Formulário Premium (2/5 do espaço) */}
            <div className="w-full xl:col-span-2 order-1 xl:order-2">
              <div 
                className="premium-form"
                style={{ 
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="text-2xl">{isRegistering ? '✨' : '🔐'}</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      {isRegistering ? 'Criar Conta Premium' : 'Acesso Premium'}
                    </span>
                  </h2>
                  <p className="text-white/80 text-lg">
                    {isRegistering ? 'Junte-se à elite do fitness digital' : 'Bem-vindo de volta, atleta!'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isRegistering && (
                    <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                      <label className="block text-white font-semibold mb-3 flex items-center gap-2">
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
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
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
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
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
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-premium w-full flex items-center justify-center gap-3"
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
                    className="btn-secondary w-full flex items-center justify-center gap-3"
                  >
                    <FaGoogle className="text-red-400" />
                    {loading ? 'Conectando...' : (isRegistering ? 'Registrar com Google' : 'Continuar com Google')}
                  </button>

                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="btn-secondary w-full flex items-center justify-center gap-3"
                    >
                      <span>🎯</span>
                      Experimentar Demo
                    </button>
                  )}

                  <div className="text-center space-y-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-white/80 hover:text-white font-medium underline transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
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
                        className="text-white/60 hover:text-white text-sm underline transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
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

          {/* Estatísticas Refinadas */}
          <div 
            className="section-spacing text-center"
            style={{ 
              animationDelay: '800ms',
              animation: 'fadeInUp 0.8s ease-out forwards'
            }}
          >
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                🌟 Números que Impressionam 🌟
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Milhares de pessoas já transformaram suas vidas conosco. Seja o próximo!
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
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
            <div className="glass-container p-6 max-w-3xl mx-auto">
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
