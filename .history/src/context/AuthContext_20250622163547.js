// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase'; // Importar a instância auth do firebase.js
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile, // Para definir o nome do usuário (displayName)
  sendEmailVerification, // Adicione esta linha para importar o sendEmailVerification
  GoogleAuthProvider,
  signInWithPopup
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

  useEffect(() => {
    setLoading(true);
    // onAuthStateChanged retorna uma função para unsubscribe
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado
        // Podemos querer pegar mais detalhes do usuário aqui se necessário
        // ou normalizar o objeto user para o que nosso app espera.
        // Por agora, vamos usar o objeto user do Firebase diretamente.
        // O objeto user do Firebase já tem: uid, email, displayName, photoURL, emailVerified etc.
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          // Adicione outros campos que você precisa do objeto user do Firebase
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
  }, []);

  const login = async (email, password) => {
    setError(null); // Limpar erros anteriores
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // O onAuthStateChanged vai lidar com a atualização de currentUser e isAuthenticated
      // userCredential.user contém o objeto do usuário logado
      return userCredential.user; 
    } catch (err) {
      // Mapear erros do Firebase para mensagens mais amigáveis se desejar
      // Exemplos de códigos de erro: auth/user-not-found, auth/wrong-password, auth/invalid-email
      console.error("Erro de login no Firebase:", err.code, err.message);
      setError(err.message || 'Falha ao fazer login.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      
      // Se é um novo usuário, criar treinos demo
      if (userCredential.user && userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime) {
        createAndSaveDemoWorkouts(userCredential.user.uid);
      }
      
      return userCredential.user;
    } catch (err) {
      console.error("Erro de login com Google:", err.code, err.message);
      setError(err.message || 'Falha ao fazer login com Google.');
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
      // Não vamos propagar o erro para não quebrar o fluxo de signup
      // setError("Houve um problema ao configurar os treinos de demonstração.");
    }
  };

  const signup = async (email, password, name) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Usuário criado. Agora, atualize o perfil com o nome.
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        // Atualizar o currentUser no estado local imediatamente após definir o displayName
        // para que o nome apareça sem precisar de um novo ciclo do onAuthStateChanged completo
        // ou recarregar a página.
        setCurrentUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name, 
        });
        setIsAuthenticated(true); // Definir como autenticado imediatamente

        // Salvar treinos de demonstração para o novo usuário
        createAndSaveDemoWorkouts(userCredential.user.uid);
      }
      // O onAuthStateChanged também vai disparar, mas já atualizamos o estado aqui.
      return userCredential.user;
    } catch (err) {
      // Exemplos: auth/email-already-in-use, auth/weak-password, auth/invalid-email
      console.error("Erro de signup no Firebase:", err.code, err.message);
      setError(err.message || 'Falha ao registrar.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Não precisa de setError ou setLoading aqui, pois é uma operação geralmente rápida
    // e o onAuthStateChanged cuidará da atualização do estado.
    try {
      await signOut(auth);
      // onAuthStateChanged vai limpar currentUser e setIsAuthenticated(false)
    } catch (err) {
      console.error("Erro ao fazer logout no Firebase:", err.message);
      // Normalmente, o logout não deve falhar catastroficamente.
      // Mesmo que falhe, podemos limpar o estado local como fallback,
      // mas o ideal é que o signOut do Firebase funcione.
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError("Erro ao tentar sair. Por favor, tente novamente.");
      throw err; // Propagar para que o chamador possa saber
    }
  };
  
  // Função para enviar e-mail de verificação
  // Esta é uma nova função, não estava no seu AuthContext original
  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        // Você pode querer mostrar uma notificação para o usuário aqui
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

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    setError, // Expor setError para que outros componentes possam limpar/definir erros
    login,
    loginWithGoogle,
    signup,
    logout,
    sendVerificationEmail // Expor a nova função
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};