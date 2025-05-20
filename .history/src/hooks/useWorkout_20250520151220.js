// src/hooks/useWorkout.js
import { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export const useWorkout = (workoutId) => {
  const context = useContext(WorkoutContext);
  const { workouts, updateWorkout, deleteWorkout } = context;
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        // Encontrar o treino pelo ID no contexto
        const foundWorkout = workouts.find(w => w.id === workoutId);

        if (foundWorkout) {
          setWorkout(foundWorkout);
        } else {
          setError('Treino não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar treino:', err);
        setError('Falha ao carregar o treino');
      } finally {
        setLoading(false);
      }
    };

    if (workoutId) {
      fetchWorkout();
    } else {
      // Se não houver ID, apenas definir loading como false
      setLoading(false);
    }
  }, [workoutId, workouts]);

  const saveWorkout = async (updatedWorkout) => {
    try {
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      return false;
    }
  };

  const removeWorkout = async () => {
    try {
      if (!workout) return false;
      await deleteWorkout(workout.id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      return false;
    }
  };

  // Nova função para marcar um exercício como concluído
  const markExerciseCompleted = async (exerciseIndex, completed = true) => {
    if (!workout) return false;
    
    try {
      const updatedWorkout = { ...workout };
      updatedWorkout.exercises[exerciseIndex].completed = completed;
      
      // Atualizar a data de conclusão se todos os exercícios estiverem concluídos
      const allCompleted = updatedWorkout.exercises.every(ex => ex.completed);
      if (allCompleted) {
        updatedWorkout.completedAt = new Date().toISOString();
        updatedWorkout.completed = true;
      } else {
        // Se algum exercício não estiver concluído, remover a data de conclusão
        delete updatedWorkout.completedAt;
        updatedWorkout.completed = false;
      }
      
      // Calcular o progresso geral (porcentagem de exercícios concluídos)
      const completedCount = updatedWorkout.exercises.filter(ex => ex.completed).length;
      updatedWorkout.progress = Math.round((completedCount / updatedWorkout.exercises.length) * 100);
      
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao marcar exercício como concluído:', error);
      return false;
    }
  };

  // Nova função para resetar o progresso de um treino
  const resetWorkoutProgress = async () => {
    if (!workout) return false;
    
    try {
      const updatedWorkout = { ...workout };
      updatedWorkout.exercises = updatedWorkout.exercises.map(ex => ({
        ...ex,
        completed: false
      }));
      
      // Remover data de conclusão e zerar progresso
      delete updatedWorkout.completedAt;
      updatedWorkout.completed = false;
      updatedWorkout.progress = 0;
      
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao resetar progresso do treino:', error);
      return false;
    }
  };

  // Função para obter todos os treinos concluídos, opcionalmente filtrados por data
  const getCompletedWorkouts = (date = null) => {
    const completedWorkouts = workouts.filter(w => w.completed || w.completedAt);
    
    if (!date) {
      return completedWorkouts;
    }
    
    // Se uma data for fornecida, filtrar por essa data específica
    return completedWorkouts.filter(workout => {
      if (!workout.completedAt) return false;
      
      const workoutDate = new Date(workout.completedAt);
      const targetDate = new Date(date);
      
      return workoutDate.getFullYear() === targetDate.getFullYear() &&
             workoutDate.getMonth() === targetDate.getMonth() &&
             workoutDate.getDate() === targetDate.getDate();
    });
  };

  // Função para obter estatísticas por período
  const getWorkoutStatsByPeriod = (period = 'week') => {
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
    }
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date || workout.completedAt);
      return workoutDate >= startDate && workoutDate <= now;
    });
  };

  return {
    workout,
    workouts, // Expondo todos os treinos
    loading,
    error,
    saveWorkout,
    removeWorkout,
    markExerciseCompleted,
    resetWorkoutProgress,
    getCompletedWorkouts,
    getWorkoutStatsByPeriod
  };
};
