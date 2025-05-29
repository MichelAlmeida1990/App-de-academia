// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  const { login, signup, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (isRegistering) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setFormError(err.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  // Loading state
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-6 text-gradient">Redirecionando...</h1>
          <div className="spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements com animações */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-pink-300/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-blue-300/15 rounded-full blur-lg animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 flex items-center justify-center gap-4 animate-glow">
            <span className="text-7xl md:text-8xl animate-float">🏋️</span>
            <span className="text-gradient-light">FitnessTracker</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Sua jornada fitness começa aqui! Acompanhe treinos, monitore progresso e alcance seus objetivos com estilo.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Features */}
          <div className="space-y-8 animate-slide-up">
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="card-glass text-center text-white p-6 hover-glow transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-5xl mb-4 animate-float">📊</div>
                <h3 className="font-bold text-lg mb-3 text-gradient-light">Progresso</h3>
                <p className="text-sm text-white/80">Acompanhe sua evolução com gráficos detalhados</p>
              </div>
              
              <div className="card-glass text-center text-white p-6 hover-glow transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '1s' }}>🏋️</div>
                <h3 className="font-bold text-lg mb-3 text-gradient-light">Exercícios</h3>
                <p className="text-sm text-white/80">Biblioteca completa com instruções</p>
              </div>
              
              <div className="card-glass text-center text-white p-6 hover-glow transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '2s' }}>🔥</div>
                <h3 className="font-bold text-lg mb-3 text-gradient-light">Treinos</h3>
                <p className="text-sm text-white/80">Personalizados para seus objetivos</p>
              </div>
              
              <div className="card-glass text-center text-white p-6 hover-glow transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '3s' }}>👥</div>
                <h3 className="font-bold text-lg mb-3 text-gradient-light">Comunidade</h3>
                <p className="text-sm text-white/80">Conecte-se e motive-se</p>
              </div>
            </div>

            {/* Ready to Start Section */}
            <div className="card-glass p-8 hover-glow animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="animate-float">🚀</span> 
                <span className="text-gradient-light">Pronto para começar?</span>
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
          <div className="flex justify-center animate-slide-in">
            <div className="w-full max-w-md">
              <div className="card-glass p-8 shadow-2xl hover-glow transition-all duration-500 hover:scale-105">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <span className="animate-float">{isRegistering ? '✨' : '🔐'}</span>
                    <span className="text-gradient-light">{isRegistering ? 'Criar Conta' : 'Fazer Login'}</span>
                  </h2>
                  <p className="text-white/80 text-lg">
                    {isRegistering ? 'Junte-se a nós e transforme sua vida!' : 'Bem-vindo de volta, campeão!'}
                  </p>
                </div>

                {(error || formError) && (
                  <div className="toast-error mb-6 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <span className="text-red-300 text-xl">⚠️</span>
                      <span className="text-red-100">{error || formError}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isRegistering && (
                    <div className="animate-fade-in">
                      <label className="form-label flex items-center gap-2">
                        <span className="text-lg">👤</span> Nome
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
                    <label className="form-label flex items-center gap-2">
                      <span className="text-lg">✉️</span> Email
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
                    <label className="form-label flex items-center gap-2">
                      <span className="text-lg">🔒</span> Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Sua senha segura"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-5 h-5"></div>
                        <span>Carregando...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">{isRegistering ? '🚀' : '▶️'}</span>
                        <span>{isRegistering ? 'Registrar' : 'Entrar'}</span>
                      </>
                    )}
                  </button>

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
                        <Link 
                          to="/forgot-password" 
                          className="text-white/70 hover:text-white text-sm underline transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <span>🔑</span>
                          Esqueceu sua senha?
                        </Link>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-white/90 text-xl mb-12 font-medium">
            🌟 Junte-se a milhares de pessoas que já transformaram suas vidas! 🌟
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-glass text-center p-6 hover-glow transition-all duration-500 hover:scale-105">
              <div className="text-5xl font-bold text-gradient-light mb-3">1000+</div>
              <div className="text-white/80 text-lg font-medium flex items-center justify-center gap-2">
                <span>👥</span> Usuários Ativos
              </div>
            </div>
            <div className="card-glass text-center p-6 hover-glow transition-all duration-500 hover:scale-105">
              <div className="text-5xl font-bold text-gradient-light mb-3">50+</div>
              <div className="text-white/80 text-lg font-medium flex items-center justify-center gap-2">
                <span>💪</span> Exercícios
              </div>
            </div>
            <div className="card-glass text-center p-6 hover-glow transition-all duration-500 hover:scale-105">
              <div className="text-5xl font-bold text-gradient-light mb-3">24/7</div>
              <div className="text-white/80 text-lg font-medium flex items-center justify-center gap-2">
                <span>🌍</span> Disponível
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 text-center">
          <div className="card-glass p-6 max-w-2xl mx-auto">
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
    </div>
  );
};

export default HomePage;
