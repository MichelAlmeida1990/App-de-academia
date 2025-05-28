import React, { createContext, useState, useEffect } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import EmailService from '../services/EmailService'; // Certifique-se de que este serviço existe e funciona conforme o esperado

// Criar o contexto
export const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => React.useContext(AuthContext);

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null); // Pode ser redundante com currentUser, mas manter por enquanto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para buscar dados do usuário do localStorage
  // Esta função já é essencialmente coberta por LocalStorageService.getUsers() e findUser
  // Manter por enquanto, mas pode ser simplificada no futuro.
  const fetchUserData = async (uid) => {
    try {
      const users = LocalStorageService.getUsers();
      const userData = users.find(u => u.uid === uid);
      
      if (userData) {
        // Remover a senha antes de retornar (boa prática)
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
  // Esta função também é coberta pelo LocalStorageService.addUser()
  // Manter por enquanto, mas pode ser simplificada.
  const createUserProfile = async (uid, userData) => {
    try {
      // O LocalStorageService.addUser já lida com a adição e a verificação de existência.
      // Se você chamar esta função para atualizar, precisaria de uma lógica de 'updateUser' no LocalStorageService.
      // Por enquanto, esta função está mais voltada para a criação inicial.
      const users = LocalStorageService.getUsers();
      const userIndex = users.findIndex(u => u.uid === uid);
      
      if (userIndex >= 0) {
        // Lógica de atualização se o usuário já existe
        users[userIndex] = {
          ...users[userIndex],
          ...userData,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Lógica de adição de novo usuário
        users.push({
          ...userData,
          uid,
          createdAt: new Date().toISOString()
        });
      }
      // Note: Você está salvando diretamente aqui. O ideal seria ter um `LocalStorageService.saveUsers(users)`
      // ou `LocalStorageService.updateUser(user)` se você tiver essa função.
      localStorage.setItem('fitness_tracker_users', JSON.stringify(users)); // Use a chave correta para usuários
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
      
      // LocalStorageService.addUser já verifica se o email está em uso
      const newUser = await LocalStorageService.addUser({ email, password, name, role: 'user' });
      
      // Remover a senha antes de definir no estado e salvar como usuário atual
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Salvar usuário atual no localStorage usando a função CORRETA
      LocalStorageService.saveCurrentUser(userWithoutPassword); // CORREÇÃO AQUI
      
      // Atualizar estados
      setUser(userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      
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
      
      // Usar a função findUser do LocalStorageService
      const user = LocalStorageService.findUser(email, password); // CORREÇÃO AQUI
      
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }
      
      // Remover a senha antes de retornar
      const { password: _, ...userWithoutPassword } = user;
      
      // Salvar usuário atual no localStorage usando a função CORRETA
      LocalStorageService.saveCurrentUser(userWithoutPassword); // CORREÇÃO AQUI
      
      // Atualizar estados
      setUser(userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      
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
      
      // Remover usuário do localStorage usando a função CORRETA
      LocalStorageService.clearCurrentUser(); // CORREÇÃO AQUI
      
      // Atualizar estados
      setUser(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (err) {
      setError('Falha ao fazer logout: ' + err.message);
      throw err;
    }
  };

  // Gerar token de recuperação de senha (lógica interna, não precisa de LocalStorageService para isso)
  const generatePasswordResetToken = (email) => {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
    
    const filteredTokens = resetTokens.filter(item => item.email !== email);
    
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

  // Verificar validade do token de recuperação (lógica interna)
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
      
      // Usar getUsers para encontrar o email
      const users = LocalStorageService.getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Email não encontrado');
      }
      
      const { token, expiresAt } = generatePasswordResetToken(email);
      
      const resetUrl = `${window.location.origin}/reset-password?token=${token}`;
      
      const emailServiceStatus = await EmailService.checkServiceStatus();
      
      let emailResult = { success: false };
      
      if (emailServiceStatus.available) {
        try {
          emailResult = await EmailService.sendPasswordResetEmail(email, resetUrl);
        } catch (emailError) {
          console.error('Erro ao enviar email via EmailJS:', emailError);
        }
      }
      
      if (!emailResult.success || process.env.NODE_ENV === 'development') {
        console.log(`Email de recuperação simulado para ${email}`);
        console.log(`Link de recuperação: ${resetUrl}`);
      }
      
      return { 
        success: true, 
        message: 'Email de recuperação enviado',
        emailSent: emailResult.success,
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
      
      const { valid, message, email } = verifyPasswordResetToken(token);
      
      if (!valid) {
        throw new Error(message || 'Token inválido');
      }
      
      const users = LocalStorageService.getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }
      
      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();
      
      // Use a chave correta para usuários ao salvar
      localStorage.setItem('fitness_tracker_users', JSON.stringify(users)); 
      
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
      
      const password = users[userIndex].password;
      
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        password,
        updatedAt: new Date().toISOString()
      };
      
      // Use a chave correta para usuários ao salvar
      localStorage.setItem('fitness_tracker_users', JSON.stringify(users)); 
      
      const { password: _, ...updatedUser } = users[userIndex];
      
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      
      // Atualizar o usuário atual no localStorage usando a função CORRETA
      LocalStorageService.saveCurrentUser(updatedUser); // CORREÇÃO AQUI
      
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
        // Usar a função CORRETA para obter o usuário atual
        const storedUser = LocalStorageService.getCurrentUser(); // CORREÇÃO AQUI
        
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