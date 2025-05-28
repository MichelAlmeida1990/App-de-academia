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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-6">Redirecionando...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-6xl">🏋️</span>
            FitnessTracker
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Sua jornada fitness começa aqui! Acompanhe treinos, monitore progresso e alcance seus objetivos.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Features */}
          <div className="space-y-8">
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-white/20">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2">Progresso</h3>
                <p className="text-sm text-white/80">Acompanhe sua evolução</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-white/20">
                <div className="text-4xl mb-3">🏋️</div>
                <h3 className="font-bold text-lg mb-2">Exercícios</h3>
                <p className="text-sm text-white/80">Biblioteca completa</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-white/20">
                <div className="text-4xl mb-3">🔥</div>
                <h3 className="font-bold text-lg mb-2">Treinos</h3>
                <p className="text-sm text-white/80">Personalizados</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white border border-white/20">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-bold text-lg mb-2">Comunidade</h3>
                <p className="text-sm text-white/80">Conecte-se</p>
              </div>
            </div>

            {/* Ready to Start Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                🚀 Pronto para começar?
              </h3>
              <div className="space-y-3 text-white/90">
                <div className="flex items-center gap-3">
                  <span className="text-green-300">➤</span>
                  <span>Crie treinos personalizados</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">➤</span>
                  <span>Acompanhe seu progresso</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">➤</span>
                  <span>Acesse biblioteca de exercícios</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">➤</span>
                  <span>Monitore estatísticas detalhadas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    🔐 {isRegistering ? 'Criar Conta' : 'Fazer Login'}
                  </h2>
                  <p className="text-white/80">
                    {isRegistering ? 'Junte-se a nós!' : 'Bem-vindo de volta!'}
                  </p>
                </div>

                {(error || formError) && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
                    {error || formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegistering && (
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        👤 Nome
                      </label>
                      <input
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isRegistering}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      ✉️ Email
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      🔒 Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Sua senha segura"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Carregando...
                      </>
                    ) : (
                      <>
                        ▶️ {isRegistering ? 'Registrar' : 'Entrar'}
                      </>
                    )}
                  </button>

                  <div className="text-center space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-white/80 hover:text-white text-sm underline"
                    >
                      {isRegistering ? 
                        '🔙 Já tem conta? Faça login' : 
                        '📝 Não tem conta? Registre-se'
                      }
                    </button>
                    
                    {!isRegistering && (
                      <div>
                        <Link 
                          to="/forgot-password" 
                          className="text-white/70 hover:text-white text-sm underline"
                        >
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
        <div className="mt-16 text-center">
          <p className="text-white/90 text-lg mb-8">
            Junte-se a milhares de pessoas que já transformaram suas vidas!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Exercícios</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Disponível</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            © 2025 FitnessTracker. Todos os direitos reservados. ❤️ Feito com 💪 para fitness
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
