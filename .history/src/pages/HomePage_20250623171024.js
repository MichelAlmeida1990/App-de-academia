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
  FaHeart,
  FaBullseye,
  FaStar
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Simulação de autenticação - ESTE MOCK NÃO SERÁ MAIS USADO DIRETAMENTE NO HANDLESUBMIT
/*
const mockAuth = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@fitness.com' && password === 'demo123') {
          resolve({ user: { name: 'Demo User', email } });
        } else {
          reject(new Error('Email ou senha incorretos'));
        }
      }, 1500);
    });
  },
  
  signup: (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          resolve({ user: { name, email } });
        } else {
          reject(new Error('Todos os campos são obrigatórios'));
        }
      }, 1500);
    });
  }
};
*/

// Componente de Feature Card
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-6 text-center text-white hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className="text-2xl md:text-4xl mb-2 md:mb-4 animate-bounce">{icon}</div>
      <h3 className="font-bold text-sm md:text-lg mb-2 md:mb-3 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-white/80">{description}</p>
    </div>
  );
};

// Componente de Estatística
const StatCard = ({ number, label, icon, delay = 0 }) => {
  return (
    <div 
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 text-center hover:bg-white/15 transition-all duration-500 hover:scale-105"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-1 md:mb-2 mobile-stats-text">
        {number}
      </div>
      <div className="text-white/80 text-xs md:text-sm font-medium flex items-center justify-center gap-1 md:gap-2">
        {icon} {label}
      </div>
    </div>
  );
};

// Componente de Toast de Notificação
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500 text-green-100';
      case 'error':
        return 'bg-red-900/90 border-red-500 text-red-100';
      default:
        return 'bg-purple-900/90 border-purple-500 text-purple-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-400" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-400" />;
      default:
        return <FaCheckCircle className="text-purple-400" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-md ${getToastStyles()} animate-slideInRight`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          ×
        </button>
      </div>
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

  // Verificar se já está autenticado - Esta lógica agora é primariamente do SmartRedirect via AuthContext
  useEffect(() => {
    // O SmartRedirect já cuida do redirecionamento se globalIsAuthenticated for true.
    // Se o usuário chegar aqui, significa que globalIsAuthenticated é false.
    // A lógica anterior com localStorage e onLogin não é mais necessária aqui da mesma forma.
  }, []); // Removido onLogin das dependências

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
      // O AuthContext agora é responsável por definir o usuário e isAuthenticated,
      // e também por interagir com o LocalStorageService.
      // SmartRedirect deve reagir à mudança no isAuthenticated do AuthContext.

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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
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
            transform: translateY(-20px);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .btn-gradient {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }

        .btn-gradient:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
        }

        .btn-gradient:active:not(:disabled) {
          transform: translateY(0);
        }

        .floating-bg {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .floating-bg:nth-child(1) { animation-delay: 0s; }
        .floating-bg:nth-child(2) { animation-delay: 2s; }
        .floating-bg:nth-child(3) { animation-delay: 4s; }
        .floating-bg:nth-child(4) { animation-delay: 1s; }
        .floating-bg:nth-child(5) { animation-delay: 3s; }

        /* Responsive grid layout */
        .homepage-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          min-height: calc(100vh - 8rem);
          width: 100%;
        }

        /* Tablet breakpoint */
        @media (max-width: 1024px) {
          .homepage-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            min-height: auto;
            padding: 0;
            align-items: stretch;
            display: flex;
            flex-direction: column;
          }
          
          /* Form first, then content on tablet/mobile */
          .mobile-login-form {
            order: 1;
            width: 100%;
            max-width: 500px;
            margin: 0 auto 2rem auto;
          }
          
          .mobile-content {
            order: 2;
            width: 100%;
          }
        }

        /* Mobile breakpoint */
        @media (max-width: 768px) {
          .homepage-grid {
            gap: 2rem;
            padding: 0 1.5rem;
            display: flex;
            flex-direction: column;
            min-height: auto;
            align-items: stretch;
          }
          
          .floating-bg {
            display: none; /* Hide floating backgrounds on mobile */
          }
          
          /* Ensure login form is visible and properly sized */
          .mobile-login-form {
            width: 100%;
            max-width: 420px;
            margin: 0 auto 2rem auto;
            order: 1;
            flex-shrink: 0;
            padding: 0 0.5rem;
          }
          
          .mobile-content {
            order: 2;
            width: 100%;
            flex: 1;
            padding: 0;
          }
          
          /* Override container to ensure proper scrolling */
          .min-h-screen {
            min-height: 100vh !important;
            min-height: 100dvh !important;
            padding-bottom: 2rem;
          }

          /* Ensure proper overflow handling */
          body {
            overflow-x: hidden !important;
          }

          /* Global minimum margin on mobile */
          * {
            margin-left: max(0px, env(safe-area-inset-left));
            margin-right: max(0px, env(safe-area-inset-right));
          }
        }

        /* Small mobile breakpoint */
        @media (max-width: 480px) {
          .homepage-grid {
            gap: 1rem;
            padding: 0 1rem;
          }
          
          .mobile-login-form {
            max-width: 100%;
            padding: 0 0.5rem;
            margin: 0 auto 1.5rem auto;
          }

          /* Smaller form padding on very small screens */
          .mobile-form-padding {
            padding: 1rem !important;
          }
        }

        /* Mobile-specific classes */
        @media (max-width: 768px) {
          .mobile-text-small {
            font-size: 2.5rem !important;
            line-height: 1.1 !important;
            margin-bottom: 1rem !important;
          }
          
          .mobile-text-small .text-6xl {
            font-size: 3rem !important;
          }
          
          .mobile-description {
            font-size: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .mobile-form-padding {
            padding: 2rem !important;
          }
          
          .mobile-space-y {
            gap: 1.5rem !important;
          }
          
          .mobile-stats-text {
            font-size: 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-text-small {
            font-size: 2rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .mobile-text-small .text-6xl {
            font-size: 2.5rem !important;
          }
          
          .mobile-description {
            font-size: 0.9rem !important;
            margin-bottom: 1rem !important;
          }
          
          .mobile-form-padding {
            padding: 1rem !important;
          }
          
          .mobile-stats-text {
            font-size: 1.25rem !important;
          }
        }

        /* Ultra small mobile devices */
        @media (max-width: 375px) {
          .homepage-grid {
            padding: 0 0.75rem;
            gap: 0.75rem;
          }

          .mobile-login-form {
            margin: 0 auto 1rem auto;
            padding: 0 0.25rem;
          }

          .mobile-form-padding {
            padding: 0.75rem !important;
          }

          .mobile-text-small {
            font-size: 1.75rem !important;
          }

          .mobile-text-small .text-6xl {
            font-size: 2rem !important;
          }
        }

        /* Landscape mobile orientation */
        @media (max-width: 768px) and (orientation: landscape) {
          .homepage-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: start;
            min-height: auto;
          }

          .mobile-login-form {
            order: 2;
            max-width: 400px;
          }

          .mobile-content {
            order: 1;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-bg top-20 left-20 w-32 h-32 bg-white"></div>
          <div className="floating-bg bottom-20 right-20 w-48 h-48 bg-white"></div>
          <div className="floating-bg top-1/2 left-1/4 w-24 h-24 bg-purple-300"></div>
          <div className="floating-bg top-1/3 right-1/3 w-36 h-36 bg-pink-300"></div>
          <div className="floating-bg bottom-1/3 left-1/3 w-20 h-20 bg-blue-300"></div>
        </div>

        <div className="relative z-10 w-full px-6 py-6 md:px-8 md:py-8 min-h-screen overflow-hidden">
          {/* Main Grid Layout */}
          <div className="homepage-grid max-w-7xl mx-auto w-full">
            
            {/* Left Side - Branding & Features */}
            <div className="space-y-6 md:space-y-8 animate-slideInLeft mobile-content">
              {/* Main Branding */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 flex items-center justify-center lg:justify-start gap-4 animate-glow mobile-text-small">
                  <span className="text-6xl lg:text-7xl animate-float">🏋️</span>
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    FitnessTracker
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8 mobile-description">
                  Transforme sua jornada fitness com tecnologia de ponta. 
                  Monitore progresso • Alcance objetivos • Supere limites
                </p>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4">
                <FeatureCard
                  icon={<FaChartLine />}
                  title="Analytics Avançado"
                  description="Gráficos detalhados do seu progresso"
                  delay={100}
                />
                
                <FeatureCard
                  icon={<FaBullseye />}
                  title="IA Personalizada"
                  description="Treinos adaptados aos seus objetivos"
                  delay={200}
                />
                
                <FeatureCard
                  icon={<FaFire />}
                  title="Gamificação"
                  description="Sistema de conquistas e desafios"
                  delay={300}
                />
                
                <FeatureCard
                  icon={<FaUsers />}
                  title="Comunidade Ativa"
                  description="Conecte-se com outros atletas"
                  delay={400}
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <StatCard
                  number="10k+"
                  label="Atletas"
                  icon={<FaUsers />}
                  delay={500}
                />
                <StatCard
                  number="500+"
                  label="Exercícios"
                  icon={<FaDumbbell />}
                  delay={600}
                />
                <StatCard
                  number="24/7"
                  label="Suporte"
                  icon={<FaShieldAlt />}
                  delay={700}
                />
              </div>

              {/* Key Benefits */}
              <div className="hidden sm:block bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-3">
                  <FaStar className="text-yellow-400" />
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Por que escolher o FitnessTracker?
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Interface intuitiva e moderna</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Sincronização em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Relatórios personalizados</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Suporte especializado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end animate-slideInRight mobile-login-form">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8 shadow-2xl mobile-form-padding">
                  {/* Form Header */}
                  <div className="text-center mb-6 md:mb-8">
                    <div className="flex justify-center mb-3 md:mb-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="text-white text-xl md:text-2xl" />
                      </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        Acesso Premium
                      </span>
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      {isRegistering ? 'Bem-vindo de volta, atleta!' : 'Bem-vindo de volta, atleta!'}
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {isRegistering && (
                      <div>
                        <label className="block text-white font-medium mb-2 flex items-center gap-2">
                          <FaUser className="text-purple-300" /> Nome
                        </label>
                        <input
                          type="text"
                          placeholder="seu@email.com"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={isRegistering}
                          className="form-input"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-white font-medium mb-2 flex items-center gap-2">
                        <FaEnvelope className="text-purple-300" /> Email
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2 flex items-center gap-2">
                        <FaLock className="text-purple-300" /> Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha segura"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="form-input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gradient w-full py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Carregando...</span>
                        </>
                      ) : (
                        <>
                          <FaUser />
                          <span>{isRegistering ? 'Acessar Plataforma' : 'Acessar Plataforma'}</span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-white/60 text-sm">ou continue com</div>

                    {/* Google Auth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaGoogle className="text-red-400" />
                      {loading ? 'Conectando...' : (isRegistering ? 'Registrar com Google' : 'Continuar com Google')}
                    </button>

                    {/* Demo Login Button */}
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="w-full py-3 bg-orange-500/20 border border-orange-500/30 text-orange-200 rounded-lg font-medium hover:bg-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>🎯</span>
                      Experimentar Demo
                    </button>

                    <div className="text-center space-y-3">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-white/80 hover:text-white text-sm font-medium underline transition-colors duration-300"
                      >
                        {isRegistering ? 
                          '🔙 Não tem conta? Registre-se' : 
                          '📝 Não tem conta? Registre-se'
                        }
                      </button>
                      
                      {!isRegistering && (
                        <div>
                          <button 
                            type="button"
                            className="text-white/70 hover:text-white text-sm underline transition-colors duration-300"
                          >
                            🔑 Esqueceu sua senha?
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
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
