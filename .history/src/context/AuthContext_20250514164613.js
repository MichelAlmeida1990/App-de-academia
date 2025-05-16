// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userDoc.data()
            });
          } else {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName || 'Usuário'
            });
          }
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || 'Usuário'
          });
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Salvar informações adicionais no Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });
      
      setUser({
        uid: user.uid,
        email: user.email,
        name
      });
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setError(
        err.code === 'auth/email-already-in-use' 
          ? 'Este email já está em uso' 
          : 'Erro ao criar conta. Tente novamente.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Buscar informações adicionais do Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUser({
          uid: user.uid,
          email: user.email,
          ...userDoc.data()
        });
      } else {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'Usuário'
        });
      }
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError(
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Email ou senha incorretos'
          : 'Erro ao fazer login. Tente novamente.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      setError('Erro ao fazer logout. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
