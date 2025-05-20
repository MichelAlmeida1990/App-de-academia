// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carregar treinos do localStorage na inicialização
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const savedWorkouts = localStorage.getItem('workouts');
        if (savedWorkouts) {
          setWorkouts(JSON.parse(savedWorkouts));
        }
      } catch (err) {
        console.error('Erro ao carregar treinos:', err);
        setError('Falha ao carregar treinos');
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkouts();
  }, []);
  
  // Salvar treinos no localStorage quando mudam
  useEffect(() => {
    if (workouts.length > 0) {
      localStorage.setItem('workouts', JSON.stringify(workouts));
    }
  }, [workouts]);
  
  // Adicionar um novo treino
  const addWorkout = useCallback(async (workout) => {
    try {
      const newWorkout = {
        ...workout,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        completed: false,
        progress: 0,
        exercises: workout.exercises.map(ex => ({
          ...ex,
          completed: false
        }))
      };
      
      setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
      return newWorkout;
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
      throw error;
    }
  }, []);
  
  // Atualizar um treino existente
  const updateWorkout = useCallback(async (updatedWorkout) => {
    try {
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        )
      );
      return updatedWorkout;
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw error;
    }
  }, []);
  
  // Excluir um treino
  const deleteWorkout = useCallback(async (workoutId) => {
    try {
      setWorkouts(prevWorkouts => 
        prevWorkouts.filter(workout => workout.id !== workoutId)
      );
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  }, []);
  
  // Marcar um exercício como concluído
  const toggleExerciseCompletion = useCallback((workoutId, exerciseIndex, completed = true) => {
    setWorkouts(prevWorkouts => {
      return prevWorkouts.map(workout => {
        if (workout.id !== workoutId) return workout;
        
        // Criar uma cópia dos exercícios e atualizar o status do exercício específico
        const updatedExercises = [...workout.exercises];
        if (updatedExercises[exerciseIndex]) {
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            completed: completed
          };
        }
        
        // Calcular o progresso geral (porcentagem de exercícios concluídos)
        const completedCount = updatedExercises.filter(ex => ex.completed).length;
        const progress = Math.round((completedCount / updatedExercises.length) * 100);
        
        // Verificar se todos os exercícios estão concluídos
        const allCompleted = updatedExercises.every(ex => ex.completed);
        
        // Atualizar o treino
        return {
          ...workout,
          exercises: updatedExercises,
          progress: progress,
          completed: allCompleted,
          completedAt: allCompleted ? new Date().toISOString() : workout.completedAt
        };
      });
    });
  }, []);
  
  // Verificar se um exercício está concluído
  const isExerciseCompleted = useCallback((workoutId, exerciseIndex) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout || !workout.exercises || !workout.exercises[exerciseIndex]) {
      return false;
    }
    return workout.exercises[exerciseIndex].completed;
  }, [workouts]);
  
  // Marcar um treino inteiro como concluído ou não concluído
  const toggleWorkoutCompletion = useCallback((workoutId, completed = true) => {
    setWorkouts(prevWorkouts => {
      return prevWorkouts.map(workout => {
        if (workout.id !== workoutId) return workout;
        
        // Se estiver marcando como concluído, marcar todos os exercícios como concluídos
        const updatedExercises = completed 
          ? workout.exercises.map(ex => ({ ...ex, completed: true }))
          : workout.exercises.map(ex => ({ ...ex, completed: false }));
        
        // Atualizar o treino
        return {
          ...workout,
          exercises: updatedExercises,
          progress: completed ? 100 : 0,
          completed: completed,
          completedAt: completed ? new Date().toISOString() : null
        };
      });
    });
  }, []);
  
  // Calcular o progresso de um treino
  const getWorkoutProgress = useCallback((workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout || !workout.exercises || workout.exercises.length === 0) {
      return { overallProgress: 0, exerciseProgress: [] };
    }
    
    const exerciseProgress = workout.exercises.map(ex => ex.completed ? 100 : 0);
    const completedCount = workout.exercises.filter(ex => ex.completed).length;
    const overallProgress = Math.round((completedCount / workout.exercises.length) * 100);
    
    return { overallProgress, exerciseProgress };
  }, [workouts]);
  
  // Obter treinos concluídos
  const getCompletedWorkouts = useCallback(() => {
    return workouts.filter(workout => workout.completed || workout.completedAt);
  }, [workouts]);
  
  // Obter estatísticas por período
  const getWorkoutStatsByPeriod = useCallback((period = 'week') => {
    const now = new Date();
    let startDate;
    
    if (period === 'week') {
      // Últimos 7 dias
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      // Últimos 30 dias
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    } else {
      // Padrão: últimos 7 dias
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }
    
    // Filtrar treinos concluídos dentro do período
    return workouts.filter(workout => {
      // Usar a data de conclusão se disponível, caso contrário usar a data de criação
      if (!workout.completed && !workout.completedAt) return false;
      
      const workoutDate = new Date(workout.completedAt || workout.date || workout.createdAt);
      return workoutDate >= startDate && workoutDate <= now;
    });
  }, [workouts]);

  const value = {
    workouts,
    loading,
    error,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    toggleExerciseCompletion,
    isExerciseCompleted,
    toggleWorkoutCompletion,
    getWorkoutProgress,
    getCompletedWorkouts,
    getWorkoutStatsByPeriod
  };
  
  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
