import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para buscar dados do usuário do Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      
      // Se estiver offline, continuar com os dados básicos do usuário
      if (error.code === 'failed-precondition' || error.code === 'unavailable') {
        console.log('Offline: usando dados básicos do usuário');
        return { 
          uid: uid,
          email: currentUser.email,
          name: currentUser.displayName || 'Usuário',
          // Dados mínimos para funcionamento offline
        };
      }
      
      throw error;
    }
  };

  // Função para criar um perfil de usuário no Firestore
  const createUserProfile = async (uid, userData) => {
    try {
      await setDoc(doc(firestore, 'users', uid), {
        ...userData,
        createdAt: new Date()
      });
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
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar o perfil do usuário com o nome
      await updateProfile(result.user, { displayName: name });
      
      // Criar perfil no Firestore
      await createUserProfile(result.user.uid, {
        uid: result.user.uid,
        email,
        name,
        role: 'user'
      });
      
      return result.user;
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
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
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
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError('Falha ao fazer logout: ' + err.message);
      throw err;
    }
  };

  // Recuperação de senha
  const resetPassword = async (email) => {
    try {
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError('Falha ao enviar email de recuperação: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (userData) => {
    try {
      if (!currentUser) throw new Error('Nenhum usuário autenticado');
      
      await setDoc(doc(firestore, 'users', currentUser.uid), userData, { merge: true });
      
      // Atualizar o estado local do usuário
      setUser(prev => ({
        ...prev,
        ...userData
      }));
      
      return true;
    } catch (err) {
      setError('Falha ao atualizar perfil: ' + err.message);
      throw err;
    }
  };

  // Efeito para monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          setUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            ...userData
          });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          // Se houver erro, usar pelo menos os dados básicos
          setUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Usuário'
          });
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
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
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
