// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import LocalStorageService from '../services/LocalStorageService'; // Importe o serviço

export const AuthContext = createContext();

// EXPORTAR O useAuth AQUI PARA QUE COMPONENTES POSSAM IMPORTÁ-LO DIRETAMENTE
export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = LocalStorageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      const user = LocalStorageService.findUser(email, password);
      if (!user) {
        throw new Error("Email ou senha inválidos.");
      }
      // Remover a senha do objeto do usuário antes de salvar no contexto e localStorage
      const { password: _, ...userWithoutPassword } = user;
      LocalStorageService.saveCurrentUser(userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      return userWithoutPassword;
    } catch (err) {
      setError(err.message || 'Falha ao fazer login.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setError('');
      setLoading(true);
      
      const users = LocalStorageService.getUsers();
      const userExists = users.some(u => u.email === email);
      if (userExists) {
        throw new Error("Este email já está registrado.");
      }

      const newUser = { email, password, name, uid: `user_${Date.now()}` };

      // Adicionar à lista de usuários
      LocalStorageService.addUser(newUser); // Usar a função addUser do serviço
      
      // Definir usuário atual
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Salvar usuário atual no localStorage
      LocalStorageService.saveCurrentUser(userWithoutPassword);
      
      // Atualizar estados
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);

      // ==== NOVO: SALVAR TREINOS DE DEMONSTRAÇÃO PARA O NOVO USUÁRIO ====
      const createDemoWorkouts = (userId) => { // Agora aceita userId
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        const demoWorkouts = [];
        
        const day19Date = new Date(currentYear, currentMonth, 19);
        demoWorkouts.push({
          id: `demo_day19_${userId}`, // ID único por usuário
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
          id: `demo_day22_${userId}`, // ID único por usuário
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
        return demoWorkouts;
      };

      const initialDemoWorkouts = createDemoWorkouts(newUser.uid); // Passa o UID do novo usuário
      LocalStorageService.saveInitialDemoWorkouts(newUser.uid, initialDemoWorkouts);
      // ====================================================================
      
      return userWithoutPassword;
    } catch (err) {
      setError(err.message || 'Falha ao registrar.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    LocalStorageService.clearCurrentUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};