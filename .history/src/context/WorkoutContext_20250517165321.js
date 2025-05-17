import React, { createContext, useState, useEffect, useContext } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import { useAuth } from './AuthContext';

export const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
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
        
        // Carregar dados de treinos concluídos
        const completedData = LocalStorageService.getCompletedWorkouts(currentUser.uid);
        setCompletedWorkouts(completedData || {});
        
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
        id: Date.now(), // Garantir que um ID único seja gerado
        createdAt: new Date().toISOString(),
        progress: 0,
        exercises: workout.exercises.map((exercise, index) => ({
          ...exercise,
          id: index // Adicionar ID para cada exercício
        }))
      };
      
      // Salvar no localStorage
      const newWorkout = LocalStorageService.addWorkout(workoutWithUser);
      
      // Atualizar o estado
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

  const getWorkoutById = (id) => {
    return workouts.find(workout => workout.id === id) || null;
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
    
    return workouts.filter(workout => completedWorkouts[workout.id]);
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

  // Função para marcar um treino como concluído/não concluído
  const toggleWorkoutCompletion = (workoutId, completed) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const newCompletedWorkouts = { ...completedWorkouts };
      
      if (completed) {
        newCompletedWorkouts[workoutId] = true;
      } else {
        delete newCompletedWorkouts[workoutId];
      }
      
      // Atualizar o estado
      setCompletedWorkouts(newCompletedWorkouts);
      
      // Salvar no localStorage
      LocalStorageService.saveCompletedWorkouts(currentUser.uid, newCompletedWorkouts);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status de conclusão:', error);
      throw error;
    }
  };

  // Função para marcar um exercício como concluído/não concluído
  const toggleExerciseCompletion = (workoutId, exerciseIndex, completed) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Obter o progresso atual do treino
      const workoutProgress = LocalStorageService.getWorkoutProgress(currentUser.uid, workoutId) || {
        exercises: {},
        overallProgress: 0,
        lastUpdated: null
      };
      
      // Atualizar o status do exercício
      const updatedExercises = { ...workoutProgress.exercises };
      updatedExercises[exerciseIndex] = completed;
      
      // Calcular o progresso geral
      const workout = workouts.find(w => w.id === workoutId);
      let overallProgress = 0;
      
      if (workout && workout.exercises && workout.exercises.length > 0) {
        const totalExercises = workout.exercises.length;
        const completedExercises = Object.values(updatedExercises).filter(Boolean).length;
        overallProgress = Math.round((completedExercises / totalExercises) * 100);
      }
      
      // Criar objeto de progresso atualizado
      const updatedProgress = {
        exercises: updatedExercises,
        overallProgress,
        lastUpdated: new Date().toISOString()
      };
      
      // Salvar no localStorage
      LocalStorageService.saveWorkoutProgress(currentUser.uid, workoutId, updatedProgress);
      
      return updatedProgress;
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      throw error;
    }
  };

  // Função para verificar se um exercício está concluído
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    try {
      if (!currentUser) return false;
      
      const workoutProgress = LocalStorageService.getWorkoutProgress(currentUser.uid, workoutId);
      return workoutProgress && workoutProgress.exercises && workoutProgress.exercises[exerciseIndex] === true;
    } catch (error) {
      console.error('Erro ao verificar status do exercício:', error);
      return false;
    }
  };

  // Função para obter o progresso de um treino
  const getWorkoutProgress = (workoutId) => {
    try {
      if (!currentUser) return null;
      
      return LocalStorageService.getWorkoutProgress(currentUser.uid, workoutId) || {
        exercises: {},
        overallProgress: 0,
        lastUpdated: null
      };
    } catch (error) {
      console.error('Erro ao obter progresso do treino:', error);
      return null;
    }
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        loading, 
        error,
        completedWorkouts,
        addWorkout, 
        updateWorkout, 
        deleteWorkout,
        getWorkoutById,
        getWeeklyWorkouts,
        getCompletedWorkouts,
        getInProgressWorkouts,
        toggleWorkoutCompletion,
        toggleExerciseCompletion,
        isExerciseCompleted,
        getWorkoutProgress
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
