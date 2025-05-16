import React, { createContext, useState, useContext, useEffect } from 'react';

// Criando o contexto
const AuthContext = createContext(null);

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Em uma aplicação real, você validaria o token com o backend
          // const response = await api.validateToken(token);
          
          // Simulando uma validação de token
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData) {
            setUser(userData);
          } else {
            // Token existe mas não há dados de usuário
            localStorage.removeItem('authToken');
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setError('Sessão expirada. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função para login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Em uma aplicação real, você faria uma chamada API
      // const response = await api.login(email, password);
      
      // Simulando uma chamada de API com timeout
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Validação simples para demonstração
          if (email === 'user@example.com' && password === 'password') {
            const userData = {
              id: '1',
              name: 'Usuário Teste',
              email: email,
              avatar: 'https://i.pravatar.cc/150?u=user@example.com'
            };
            
            // Armazenar token e dados do usuário
            const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
            localStorage.setItem('authToken', fakeToken);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            setUser(userData);
            resolve(userData);
          } else {
            setError('Email ou senha incorretos');
            reject(new Error('Email ou senha incorretos'));
          }
          setLoading(false);
        }, 1000);
      });
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
      setLoading(false);
      throw err;
    }
  };

  // Função para registro
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Em uma aplicação real, você faria uma chamada API
      // const response = await api.register(name, email, password);
      
      // Simulando uma chamada de API com timeout
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulando validação de email já existente
          if (email === 'user@example.com') {
            setError('Este email já está em uso');
            reject(new Error('Este email já está em uso'));
          } else {
            const userData = {
              id: Math.random().toString(36).substring(2),
              name: name,
              email: email,
              avatar: `https://i.pravatar.cc/150?u=${email}`
            };
            
            // Armazenar token e dados do usuário
            const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
            localStorage.setItem('authToken', fakeToken);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            setUser(userData);
            resolve(userData);
          }
          setLoading(false);
        }, 1000);
      });
    } catch (err) {
      setError(err.message || 'Erro ao registrar');
      setLoading(false);
      throw err;
    }
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Em uma aplicação real, você faria uma chamada API
      // const response = await api.updateProfile(userData);
      
      // Simulando uma chamada de API com timeout
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedUser = { ...user, ...userData };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setLoading(false);
          resolve(updatedUser);
        }, 1000);
      });
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil');
      setLoading(false);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
