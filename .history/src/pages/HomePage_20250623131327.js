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
  FaExclamationTriangle
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
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center text-white hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className="text-4xl mb-4 animate-bounce">{icon}</div>
      <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  );
};

// Componente de Estatística
const StatCard = ({ number, label, icon, delay = 0 }) => {
  return (
    <div 
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-500 hover:scale-105"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-3">
        {number}
      </div>
      <div className="text-white/80 text-lg font-medium flex items-center justify-center gap-2">
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

        <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
          {/* Header */}
          <div className="text-center mb-16" style={{ animation: 'fadeInUp 1s ease-out' }}>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 flex items-center justify-center gap-4 animate-glow">
              <span className="text-7xl md:text-8xl animate-float">🏋️</span>
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                FitnessTracker
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Sua jornada fitness começa aqui! Acompanhe treinos, monitore progresso e alcance seus objetivos com estilo.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left Side - Features */}
            <div className="space-y-8">
              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-6">
                <FeatureCard
                  icon="📊"
                  title="Progresso"
                  description="Acompanhe sua evolução com gráficos detalhados"
                  delay={100}
                />
                
                <FeatureCard
                  icon="🏋️"
                  title="Exercícios"
                  description="Biblioteca completa com instruções"
                  delay={200}
                />
                
                <FeatureCard
                  icon="🔥"
                  title="Treinos"
                  description="Personalizados para seus objetivos"
                  delay={300}
                />
                
                <FeatureCard
                  icon="👥"
                  title="Comunidade"
                  description="Conecte-se e motive-se"
                  delay={400}
                />
              </div>

              {/* Ready to Start Section */}
              <div 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-500"
                style={{ 
                  animationDelay: '500ms',
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="animate-float">🚀</span> 
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Pronto para começar?
                  </span>
                </h3>
                <div className="space-y-4 text-white/90">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                    <span className="text-green-300 text-xl">✨</span>
                    <span className="font-medium">Crie treinos personalizados</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                    <span className="text-green-300 text-xl">📈</span>
                    <span className="font-medium">Acompanhe seu progresso</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                    <span className="text-green-300 text-xl">📚</span>
                    <span className="font-medium">Acesse biblioteca de exercícios</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                    <span className="text-green-300 text-xl">📊</span>
                    <span className="font-medium">Monitore estatísticas detalhadas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div 
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500"
                  style={{ 
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                      <span className="animate-float">{isRegistering ? '✨' : '🔐'}</span>
                      <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        {isRegistering ? 'Criar Conta' : 'Fazer Login'}
                      </span>
                    </h2>
                    <p className="text-white/80 text-lg">
                      {isRegistering ? 'Junte-se a nós e transforme sua vida!' : 'Bem-vindo de volta, campeão!'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegistering && (
                      <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                        <label className="block text-white font-medium mb-2 flex items-center gap-2">
                          <FaUser className="text-purple-300" /> Nome
                        </label>
                        <input
                          type="text"
                          placeholder="Seu nome completo"
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
                          <span>{isRegistering ? <FaRocket /> : <FaUser />}</span>
                          <span>{isRegistering ? 'Registrar' : 'Entrar'}</span>
                        </>
                      )}
                    </button>

                    {/* Google Auth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>🔴</span>
                      {isRegistering ? 'Registrar com Google' : 'Continuar com Google'}
                    </button>

                    {/* Demo Login Button */}
                    {!isRegistering && (
                      <button
                        type="button"
                        onClick={handleDemoLogin}
                        className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>🎯</span>
                        Testar com conta demo
                      </button>
                    )}

                    <div className="text-center space-y-3">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-white/80 hover:text-white text-sm font-medium underline transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                      >
                        <span>{isRegistering ? '🔙' : '📝'}</span>
                        {isRegistering ? 
                          'Já tem conta? Faça login' : 
                          'Não tem conta? Registre-se'
                        }
                      </button>
                      
                      {!isRegistering && (
                        <div>
                          <button 
                            type="button"
                            className="text-white/70 hover:text-white text-sm underline transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                          >
                            <span>🔑</span>
                            Esqueceu sua senha?
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Statistics */}
          <div 
            className="mt-20 text-center"
            style={{ 
              animationDelay: '800ms',
              animation: 'fadeInUp 0.8s ease-out forwards'
            }}
          >
            <p className="text-white/90 text-xl mb-12 font-medium">
              🌟 Junte-se a milhares de pessoas que já transformaram suas vidas! 🌟
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StatCard
                number="1000+"
                label="Usuários Ativos"
                icon={<FaUsers />}
                delay={100}
              />
              <StatCard
                number="50+"
                label="Exercícios"
                icon={<FaDumbbell />}
                delay={200}
              />
              <StatCard
                number="24/7"
                label="Disponível"
                icon={<span>🌍</span>}
                delay={300}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-white/70 text-sm flex items-center justify-center gap-2 flex-wrap">
                <span>© 2025 FitnessTracker.</span>
                <span>Todos os direitos reservados.</span>
                <span className="flex items-center gap-1">
                  <span>❤️</span> Feito com <span>💪</span> para fitness
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
