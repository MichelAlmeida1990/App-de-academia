// src/hooks/useWorkout.js
import { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export const useWorkout = (workoutId) => {
  const { workouts, updateWorkout, deleteWorkout } = useContext(WorkoutContext);
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
      } else {
        // Se algum exercício não estiver concluído, remover a data de conclusão
        delete updatedWorkout.completedAt;
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
      updatedWorkout.progress = 0;
      
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao resetar progresso do treino:', error);
      return false;
    }
  };

  return {
    workout,
    loading,
    error,
    saveWorkout,
    removeWorkout,
    markExerciseCompleted,
    resetWorkoutProgress
  };
};
