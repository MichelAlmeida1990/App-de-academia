// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase'; // Importar a instância auth do firebase.js
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile, // Para definir o nome do usuário (displayName)
  sendEmailVerification, // Para verificação de email
  sendPasswordResetEmail // Para reset de senha
} from 'firebase/auth';
import LocalStorageService from '../services/LocalStorageService'; // Manter para treinos demo

export const AuthContext = createContext();

// EXPORTAR O useAuth AQUI PARA QUE COMPONENTES POSSAM IMPORTÁ-LO DIRETAMENTE
export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Começa true até o primeiro onAuthStateChanged
  const [error, setError] = useState(null);

  // Modo demo para testar sem Firebase
  const DEMO_MODE = !process.env.REACT_APP_FIREBASE_API_KEY || 
                   process.env.REACT_APP_FIREBASE_API_KEY === 'sua_api_key_aqui';

  useEffect(() => {
    setLoading(true);
    
    if (DEMO_MODE) {
      // Simular estado offline para demonstração
      console.log('🚀 MODO DEMO ATIVO - Firebase simulado');
      setLoading(false);
      return;
    }

    // onAuthStateChanged retorna uma função para unsubscribe
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        setIsAuthenticated(true);
      } else {
        // Usuário está deslogado
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [DEMO_MODE]);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      if (DEMO_MODE) {
        // Simular login para demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoUser = {
          uid: 'demo_user_123',
          email: email,
          displayName: 'Usuário Demo'
        };
        setCurrentUser(demoUser);
        setIsAuthenticated(true);
        return demoUser;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user; 
    } catch (err) {
      console.error("Erro de login:", err.code, err.message);
      setError(err.message || 'Falha ao fazer login.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para criar treinos demo (movida para dentro para ter acesso ao setError)
  const createAndSaveDemoWorkouts = (userId) => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const demoWorkouts = [];
      
      const day19Date = new Date(currentYear, currentMonth, 19);
      demoWorkouts.push({
        id: `demo_day19_${userId}`, 
        name: `Treino D - Ombros e Abdômen`,
        category: 'Ombros e Abdômen',
        date: day19Date.toISOString(),
        completedAt: day19Date.toISOString(),
        duration: 55,
        exercises: [
          { id: 0, name: 'Desenvolvimento com halteres', sets: 3, reps: 12, completed: true },
          { id: 1, name: 'Elevação lateral', sets: 3, reps: 15, completed: true },
          { id: 2, name: 'Abdominal crunch', sets: 4, reps: 20, completed: true },
          { id: 3, name: 'Prancha', sets: 3, reps: 30, completed: true }
        ],
        completed: true,
        progress: 100,
        userId: userId 
      });
      
      const day22Date = new Date(currentYear, currentMonth, 22);
      demoWorkouts.push({
        id: `demo_day22_${userId}`,
        name: `Treino A - Peito e Tríceps`,
        category: 'Peito e Tríceps',
        date: day22Date.toISOString(),
        completedAt: day22Date.toISOString(),
        duration: 55,
        exercises: [
          { id: 0, name: 'Supino reto', sets: 3, reps: 10, completed: true },
          { id: 1, name: 'Crucifixo', sets: 3, reps: 12, completed: true },
          { id: 2, name: 'Tríceps corda', sets: 3, reps: 15, completed: true },
          { id: 3, name: 'Tríceps francês', sets: 3, reps: 12, completed: true }
        ],
        completed: true,
        progress: 100,
        userId: userId
      });
      LocalStorageService.saveInitialDemoWorkouts(userId, demoWorkouts);
    } catch (e) {
      console.error("Erro ao criar treinos demo:", e);
    }
  };

  const signup = async (email, password, name) => {
    setError(null);
    setLoading(true);
    
    try {
      if (DEMO_MODE) {
        // Simular signup para demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        const demoUser = {
          uid: `demo_${Date.now()}`,
          email: email,
          displayName: name
        };
        setCurrentUser(demoUser);
        setIsAuthenticated(true);
        createAndSaveDemoWorkouts(demoUser.uid);
        return demoUser;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        
        setCurrentUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name, 
        });
        setIsAuthenticated(true);
        createAndSaveDemoWorkouts(userCredential.user.uid);
      }
      return userCredential.user;
    } catch (err) {
      console.error("Erro de signup:", err.code, err.message);
      setError(err.message || 'Falha ao registrar.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (DEMO_MODE) {
        // Simular logout para demo
        setCurrentUser(null);
        setIsAuthenticated(false);
        return;
      }

      await signOut(auth);
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError("Erro ao tentar sair. Por favor, tente novamente.");
      throw err;
    }
  };
  
  // Função para enviar e-mail de verificação
  const sendVerificationEmail = async () => {
    if (DEMO_MODE) {
      console.log('📧 DEMO: Email de verificação "enviado"');
      alert('DEMO: Email de verificação enviado! (simulado)');
      return;
    }

    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        alert('E-mail de verificação enviado! Por favor, cheque sua caixa de entrada.');
      } catch (error) {
        console.error("Erro ao enviar e-mail de verificação:", error);
        setError("Falha ao enviar e-mail de verificação.");
        throw error;
      }
    } else {
      setError("Nenhum usuário logado para enviar e-mail de verificação.");
      throw new Error("Nenhum usuário logado.");
    }
  };

  // Função para reset de senha usando Firebase (GRATUITO) ou DEMO
  const resetPassword = async (email) => {
    setError(null);
    
    try {
      // Validação básica de email
      if (!email || !email.includes('@')) {
        throw new Error('Por favor, insira um email válido.');
      }

      if (DEMO_MODE) {
        // Simular envio de email para demo
        console.log('📧 DEMO: Email de recuperação "enviado" para:', email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: `✅ DEMO: Email de recuperação "enviado" para ${email}! 
          
🎯 Em uma implementação real, o usuário receberia um email do Firebase para redefinir a senha.

📝 Funcionalidade implementada e funcionando corretamente!`
        };
      }

      // Usar o Firebase para enviar email de reset (100% gratuito)
      await sendPasswordResetEmail(auth, email);
      
      return {
        success: true,
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada e spam.'
      };
    } catch (error) {
      console.error("Erro ao enviar email de reset:", error);
      
      // Mapear erros do Firebase para mensagens amigáveis
      let errorMessage = 'Erro ao enviar email de recuperação.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Não encontramos uma conta com este email.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido. Verifique o formato.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet.';
            break;
          default:
            errorMessage = error.message || 'Erro inesperado. Tente novamente.';
        }
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    setError, // Expor setError para que outros componentes possam limpar/definir erros
    login,
    signup,
    logout,
    sendVerificationEmail, // Expor a função de verificação
    resetPassword, // Expor a função de reset de senha
    DEMO_MODE // Expor o modo demo para componentes saberem
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};