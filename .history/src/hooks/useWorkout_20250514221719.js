// src/hooks/useWorkout.js
import { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

// Remova a palavra "default" e exporte diretamente a função
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

  return {
    workout,
    loading,
    error,
    saveWorkout,
    removeWorkout
  };
};
