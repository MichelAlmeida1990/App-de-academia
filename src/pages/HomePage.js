// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Remover import do useToast pois não está sendo usado corretamente
import { 
  FaPlay, 
  FaArrowRight, 
  FaChartLine, 
  FaBrain, 
  FaTrophy, 
  FaUsers, 
  FaDumbbell, 
  FaMobile,
  FaPalette,
  FaCheckCircle,
  FaStar,
  FaFire,
  FaClock,
  FaHeart,
  FaUser
} from 'react-icons/fa';
import HeroSection from '../components/common/HeroSection';
import FeaturesSection from '../components/common/FeaturesSection';
import ImageCard from '../components/common/ImageCard';
import { 
  HERO_IMAGES, 
  FEATURE_IMAGES, 
  COLOR_PALETTES, 
  setActivePalette, 
  getPaletteColors 
} from '../utils/imageAssets';

// Componente Toast
const Toast = ({ type, message, onClose }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaHeart />;
      default:
        return <FaStar />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${getToastStyles()}`}>
      {getIcon()}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">×</button>
    </div>
  );
};

// Componente AuthForm
const AuthForm = ({ onSubmit, loading, toast, setToast, onGoogleAuth, palette }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !name)) {
      setToast({ type: 'error', message: 'Por favor, preencha todos os campos' });
      return;
    }
    await onSubmit(email, password, name, isRegistering);
  };

  const handleGoogleClick = async () => {
    try {
      await onGoogleAuth();
    } catch (error) {
      setToast({ type: 'error', message: 'Erro no login com Google' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="backdrop-blur-2xl border border-white/30 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)`,
          border: '2px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)'
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -inset-1 rounded-3xl opacity-50"
          style={{ 
            background: palette.gradient,
            filter: 'blur(15px)',
            zIndex: -1
          }}
        />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: palette.gradient }}>
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </h2>
          <p className="text-white/80 text-lg">
            {isRegistering ? 'Junte-se à nossa comunidade fitness' : 'Bem-vindo de volta!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-white/15 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 transition-all duration-300 text-lg"
              style={{
                boxShadow: `0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)`,
                borderColor: palette.primary,
                outlineColor: palette.primary,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
              }}
              placeholder="Seu nome completo"
              required
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white/15 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 transition-all duration-300 text-lg"
            style={{
              boxShadow: `0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)`,
              borderColor: palette.primary,
              outlineColor: palette.primary,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            }}
            placeholder="Seu email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-white/15 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 transition-all duration-300 text-lg"
            style={{
              boxShadow: `0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)`,
              borderColor: palette.primary,
              outlineColor: palette.primary,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            }}
            placeholder="Sua senha"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg hover:scale-105 active:scale-95"
            style={{
              background: palette.gradient,
              boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)`,
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <FaCheckCircle className="text-xl" />
                {isRegistering ? 'Criar Conta' : 'Entrar'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleClick}
            className="w-full py-4 px-8 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg hover:scale-105 active:scale-95 border-2 border-white/30 hover:bg-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: `0 4px 20px rgba(0,0,0,0.1)`
            }}
          >
            <FaStar className="text-xl" />
            Continuar com Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105"
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente HomePage
const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser, loginWithGoogle } = useAuth();
  // Remover useToast pois não está sendo usado corretamente
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPalette, setCurrentPalette] = useState('ice');
  const [showPaletteSelector, setShowPaletteSelector] = useState(false);

  const globalIsAuthenticated = !!currentUser;

  useEffect(() => {
    setActivePalette(currentPalette);
  }, [currentPalette]);

  const palette = getPaletteColors();

  const handleShowToast = (type, message) => {
    setToast({ type, message });
  };

  const handleSubmit = async (email, password, name, isRegistering) => {
    setLoading(true);
    try {
      // Simular login/registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleShowToast('success', isRegistering ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!');
      if (isRegistering) {
        navigate('/dashboard');
      }
    } catch (error) {
      handleShowToast('error', 'Erro no processo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      handleShowToast('success', 'Login com Google realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      handleShowToast('error', 'Erro no login com Google');
    }
  };

  const handleComecarAgora = () => {
    if (globalIsAuthenticated) {
      navigate('/dashboard');
    } else {
      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleComecarGratuitamente = () => {
    if (globalIsAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <style>{`
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

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .palette-transition {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Palette Selector */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowPaletteSelector(!showPaletteSelector)}
          className="p-3 rounded-full text-white shadow-lg hover:scale-110 transition-all duration-200"
          style={{ 
            background: palette.gradient,
            boxShadow: palette.glow
          }}
        >
          <FaPalette className="text-xl" />
        </button>
        
        {showPaletteSelector && (
          <div className="absolute right-0 mt-2 p-4 rounded-lg border border-white/20"
               style={{ 
                 background: palette.glass,
                 backdropFilter: 'blur(10px)'
               }}>
            <h3 className="text-white font-bold mb-3">Escolha sua Paleta</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => {
                    setCurrentPalette(name);
                    setShowPaletteSelector(false);
                  }}
                  className={`p-2 rounded text-xs font-medium transition-all duration-200 ${
                    currentPalette === name 
                      ? 'ring-2 ring-white' 
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: colors.gradient,
                    color: colors.light
                  }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <HeroSection
        title="Transforme sua Jornada Fitness"
        subtitle="Acompanhe progresso, alcance objetivos e supere limites com tecnologia de ponta"
        backgroundImage={HERO_IMAGES.fitness}
        palette={palette}
        stats={[
          { value: "10k+", label: "Usuários Ativos" },
          { value: "4.9/5", label: "Avaliações" },
          { value: "24/7", label: "Suporte" }
        ]}
      >
        <button 
          onClick={handleComecarAgora}
          className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          style={{ 
            background: palette.gradient,
            boxShadow: palette.glow
          }}
        >
          <FaPlay className="mr-2" />
          Começar Agora
        </button>
      </HeroSection>

      {/* Auth Form Section */}
      {!globalIsAuthenticated && (
        <section id="auth-section" className="py-20 flex items-center min-h-[70vh] relative overflow-hidden">
          {/* Background com gradiente mais vibrante */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}20 0%, ${palette.secondary}30 50%, ${palette.accent}20 100%)`,
              backdropFilter: 'blur(10px)',
            }}
          />
          
          {/* Overlay com padrão sutil */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${palette.primary} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${palette.secondary} 0%, transparent 50%)`
            }}
          />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Coluna de conteúdo - Mais vibrante */}
                <div className="text-white">
                  <div className="mb-8">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Junte-se a milhares de atletas
                    </h2>
                    <div className="w-20 h-1 rounded-full mb-6" style={{ background: palette.gradient }}></div>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      Acesse recursos premium, acompanhe seu progresso e conecte-se com uma comunidade global de fitness.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="p-2 rounded-full" style={{ background: palette.gradient }}>
                        <FaCheckCircle className="text-white text-lg" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg">Analytics avançado</span>
                        <p className="text-white/70 text-sm">Acompanhe seu progresso detalhado</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="p-2 rounded-full" style={{ background: palette.gradient }}>
                        <FaCheckCircle className="text-white text-lg" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg">Treinos personalizados</span>
                        <p className="text-white/70 text-sm">Adaptados ao seu nível e objetivos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="p-2 rounded-full" style={{ background: palette.gradient }}>
                        <FaCheckCircle className="text-white text-lg" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg">Comunidade ativa</span>
                        <p className="text-white/70 text-sm">Conecte-se com outros atletas</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Formulário - Mais vibrante e contrastante */}
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl" style={{ background: palette.gradient, opacity: 0.3, filter: 'blur(20px)' }}></div>
                  <AuthForm 
                    onSubmit={handleSubmit}
                    loading={loading}
                    toast={toast}
                    setToast={setToast}
                    onGoogleAuth={handleGoogleAuth}
                    palette={palette}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default HomePage;
