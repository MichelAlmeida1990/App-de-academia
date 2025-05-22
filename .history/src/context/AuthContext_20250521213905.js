import React, { createContext, useState, useEffect } from 'react';
import LocalStorageService from '../services/LocalStorageService';

// Criar o contexto
export const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => React.useContext(AuthContext);

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para buscar dados do usuário do localStorage
  const fetchUserData = async (uid) => {
    try {
      const users = LocalStorageService.getUsers();
      const userData = users.find(u => u.uid === uid);
      
      if (userData) {
        // Remover a senha antes de retornar
        const { password, ...userWithoutPassword } = userData;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  };

  // Função para criar um perfil de usuário no localStorage
  const createUserProfile = async (uid, userData) => {
    try {
      const users = LocalStorageService.getUsers();
      const userIndex = users.findIndex(u => u.uid === uid);
      
      if (userIndex >= 0) {
        // Atualizar usuário existente
        users[userIndex] = {
          ...users[userIndex],
          ...userData,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Adicionar novo usuário
        users.push({
          ...userData,
          uid,
          createdAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao criar perfil de usuário:', error);
      throw error;
    }
  };

  // Registrar um novo usuário
  const signup = async (email, password, name) => {
    try {
      setError('');
      setLoading(true);
      
      // Verificar se o email já está em uso
      const users = LocalStorageService.getUsers();
      if (users.some(u => u.email === email)) {
        throw new Error('Este email já está em uso');
      }
      
      // Criar novo usuário
      const newUser = {
        uid: Date.now().toString(), // ID único baseado no timestamp
        email,
        password, // Em produção, nunca armazene senhas em texto puro
        name,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      // Adicionar à lista de usuários
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Definir usuário atual
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Salvar usuário atual no localStorage
      LocalStorageService.setCurrentUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (err) {
      setError('Falha ao criar conta: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login de usuário
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const users = LocalStorageService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }
      
      // Remover a senha antes de retornar
      const { password: _, ...userWithoutPassword } = user;
      
      // Salvar usuário atual no localStorage
      LocalStorageService.setCurrentUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (err) {
      setError('Falha ao fazer login: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout de usuário
  const logout = async () => {
    try {
      setError('');
      
      // Remover usuário do localStorage
      LocalStorageService.logoutUser();
      
      setUser(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError('Falha ao fazer logout: ' + err.message);
      throw err;
    }
  };

  // Gerar token de recuperação de senha
  const generatePasswordResetToken = (email) => {
    // Gera um token aleatório
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Define a expiração para 1 hora a partir de agora
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Armazena o token no localStorage
    const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
    
    // Remove tokens antigos para o mesmo email
    const filteredTokens = resetTokens.filter(item => item.email !== email);
    
    // Adiciona o novo token
    filteredTokens.push({
      email,
      token,
      expiresAt: expiresAt.toISOString()
    });
    
    localStorage.setItem('passwordResetTokens', JSON.stringify(filteredTokens));
    
    return {
      token,
      expiresAt: expiresAt.toISOString()
    };
  };

  // Verificar validade do token de recuperação
  const verifyPasswordResetToken = (token) => {
    try {
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
      const tokenData = resetTokens.find(item => item.token === token);
      
      if (!tokenData) {
        return { valid: false, message: 'Token inválido' };
      }
      
      const expiresAt = new Date(tokenData.expiresAt);
      const now = new Date();
      
      if (now > expiresAt) {
        return { valid: false, message: 'Token expirado' };
      }
      
      return { valid: true, email: tokenData.email };
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return { valid: false, message: 'Erro ao verificar token' };
    }
  };

  // Recuperação de senha - solicitar reset
  const requestPasswordReset = async (email) => {
    try {
      setError('');
      setLoading(true);
      
      const users = LocalStorageService.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Email não encontrado');
      }
      
      // Gerar token de recuperação
      const { token, expiresAt } = generatePasswordResetToken(email);
      
      // Construir URL de reset (em produção, seria um link real)
      const resetUrl = `${window.location.origin}/reset-password?token=${token}`;
      
      // Em uma aplicação real, enviaria um email com o link
      // Aqui vamos simular o envio e retornar os dados para teste
      console.log(`Email de recuperação enviado para ${email}`);
      console.log(`Link de recuperação: ${resetUrl}`);
      
      return { 
        success: true, 
        message: 'Email de recuperação enviado',
        // Apenas para desenvolvimento/teste:
        debug: { 
          resetUrl, 
          token, 
          expiresAt 
        }
      };
    } catch (err) {
      setError('Falha ao enviar email de recuperação: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirmar redefinição de senha com token
  const confirmPasswordReset = async (token, newPassword) => {
    try {
      setError('');
      setLoading(true);
      
      // Verificar se o token é válido
      const { valid, message, email } = verifyPasswordResetToken(token);
      
      if (!valid) {
        throw new Error(message || 'Token inválido');
      }
      
      // Atualizar a senha do usuário
      const users = LocalStorageService.getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }
      
      // Atualizar a senha
      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();
      
      // Salvar no localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remover o token usado
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
      const updatedTokens = resetTokens.filter(item => item.token !== token);
      localStorage.setItem('passwordResetTokens', JSON.stringify(updatedTokens));
      
      return { 
        success: true, 
        message: 'Senha atualizada com sucesso' 
      };
    } catch (err) {
      setError('Falha ao redefinir senha: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (userData) => {
    try {
      if (!currentUser) throw new Error('Nenhum usuário autenticado');
      
      const users = LocalStorageService.getUsers();
      const userIndex = users.findIndex(u => u.uid === currentUser.uid);
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }
      
      // Preservar a senha
      const password = users[userIndex].password;
      
      // Atualizar dados do usuário
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        password, // Manter a senha original
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('users', JSON.stringify(users));
      
      // Atualizar o usuário atual
      const { password: _, ...updatedUser } = users[userIndex];
      
      // Atualizar o estado local do usuário
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      
      // Atualizar o usuário atual no localStorage
      LocalStorageService.setCurrentUser(updatedUser);
      
      return true;
    } catch (err) {
      setError('Falha ao atualizar perfil: ' + err.message);
      throw err;
    }
  };

  // Efeito para verificar se há um usuário salvo no localStorage
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const storedUser = LocalStorageService.getUser();
        
        if (storedUser) {
          setCurrentUser(storedUser);
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao verificar usuário armazenado:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  const value = {
    currentUser,
    user,
    loading,
    error,
    setError,
    isAuthenticated,
    login,
    signup,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    verifyPasswordResetToken,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
