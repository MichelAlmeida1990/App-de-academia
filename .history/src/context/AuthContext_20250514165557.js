// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
      
      // Atualizar o displayName no perfil de autenticação
      await updateProfile(user, {
        displayName: name
      });
      
      // Salvar informações adicionais no Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        workouts: [],
        stats: {
          totalWorkouts: 0,
          totalExercises: 0,
          lastWorkout: null
        }
      });
      
      setUser({
        uid: user.uid,
        email: user.email,
        name,
        photoURL: user.photoURL || '',
        workouts: [],
        stats: {
          totalWorkouts: 0,
          totalExercises: 0,
          lastWorkout: null
        }
      });
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      console.error("Erro ao registrar:", err);
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      switch(err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
          break;
        default:
          errorMessage = 'Erro ao criar conta. Tente novamente.';
      }
      
      setError(errorMessage);
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
        // Se por algum motivo não existir documento do usuário, criar um
        const userData = {
          name: user.displayName || 'Usuário',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          workouts: [],
          stats: {
            totalWorkouts: 0,
            totalExercises: 0,
            lastWorkout: null
          }
        };
        
        await setDoc(userDocRef, userData);
        
        setUser({
          uid: user.uid,
          ...userData
        });
      }
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      switch(err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Email ou senha incorretos';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta conta foi desativada';
          break;
        default:
          errorMessage = 'Erro ao fazer login. Tente novamente.';
      }
      
      setError(errorMessage);
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

  const updateUserProfile = async (userData) => {
    setLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, { ...userData }, { merge: true });
      
      // Atualizar o estado local
      setUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
      
      // Se o nome foi atualizado, também atualizar no Auth
      if (userData.name && userData.name !== user.name) {
        await updateProfile(auth.currentUser, {
          displayName: userData.name
        });
      }
      
      return true;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError('Erro ao atualizar perfil. Tente novamente.');
      throw err;
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
    logout,
    updateUserProfile,
    setError // Exportando para permitir limpar erros em componentes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
