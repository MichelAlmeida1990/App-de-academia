// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import { useAuth } from './AuthContext';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) {
        setWorkouts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const workoutData = LocalStorageService.getWorkouts(currentUser.uid);
        setWorkouts(workoutData);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        setError("Falha ao carregar treinos. Por favor, tente novamente mais tarde.");
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser]);

  const addWorkout = async (workout) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Inicializar propriedades de progresso
      const workoutWithUser = {
        ...workout,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        progress: 0
      };
      
      const newWorkout = LocalStorageService.addWorkout(workoutWithUser);
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
      throw error;
    }
  };

  const updateWorkout = async (updatedWorkout) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Garantir que o treino pertence ao usuário atual
      if (updatedWorkout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para editar este treino");
      }

      const updated = LocalStorageService.updateWorkout(updatedWorkout);
      
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === updatedWorkout.id ? updated : workout
        )
      );
      
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw error;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se o treino pertence ao usuário atual
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout || workout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para excluir este treino");
      }

      LocalStorageService.deleteWorkout(workoutId);
      
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  };

  const getWeeklyWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workouts.filter(workout => {
      if (!workout || !workout.date) return false;
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo && workoutDate <= today;
    });
  };

  // Função para obter treinos concluídos
  const getCompletedWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    return workouts.filter(workout => workout.completedAt);
  };

  // Função para obter treinos em andamento
  const getInProgressWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    return workouts.filter(workout => 
      workout.progress > 0 && workout.progress < 100
    );
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts: workouts || [], 
        loading, 
        error,
        addWorkout, 
        updateWorkout, 
        deleteWorkout,
        getWeeklyWorkouts,
        getCompletedWorkouts,
        getInProgressWorkouts
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
