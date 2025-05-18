import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedWorkouts = localStorage.getItem('workouts');
      const storedCompletedWorkouts = localStorage.getItem('completedWorkouts');
      const storedCompletedExercises = localStorage.getItem('completedExercises');

      if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
      if (storedCompletedWorkouts) setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
      if (storedCompletedExercises) setCompletedExercises(JSON.parse(storedCompletedExercises));
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      setError('Falha ao carregar dados. Por favor, recarregue a página.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar dados no localStorage quando houver alterações
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('workouts', JSON.stringify(workouts));
      localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
      localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
    }
  }, [workouts, completedWorkouts, completedExercises, loading]);

  // Adicionar novo treino
  const addWorkout = (workout) => {
    try {
      const newWorkout = {
        ...workout,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
      return newWorkout.id;
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
      throw new Error('Não foi possível adicionar o treino');
    }
  };

  // Atualizar treino existente
  const updateWorkout = (id, updatedWorkout) => {
    try {
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          String(workout.id) === String(id) 
            ? { ...workout, ...updatedWorkout, id: workout.id } 
            : workout
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw new Error('Não foi possível atualizar o treino');
    }
  };

  // Excluir treino - CORRIGIDO
  const deleteWorkout = (id) => {
    try {
      // Converter para string para garantir comparação correta
      const workoutId = String(id);
      
      // Verificar se o treino existe
      const workoutExists = workouts.some(w => String(w.id) === workoutId);
      
      if (!workoutExists) {
        throw new Error('Treino não encontrado');
      }
      
      // Remover o treino da lista
      setWorkouts(prevWorkouts => 
        prevWorkouts.filter(workout => String(workout.id) !== workoutId)
      );
      
      // Limpar dados de conclusão relacionados ao treino
      setCompletedWorkouts(prev => {
        const updated = { ...prev };
        delete updated[workoutId];
        return updated;
      });
      
      setCompletedExercises(prev => {
        const updated = { ...prev };
        delete updated[workoutId];
        return updated;
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  };

  // Marcar/desmarcar treino como concluído
  const toggleWorkoutCompletion = (workoutId, isCompleted) => {
    try {
      setCompletedWorkouts(prev => {
        const updated = { ...prev };
        
        if (isCompleted) {
          updated[workoutId] = true;
        } else {
          delete updated[workoutId];
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Erro ao alterar status do treino:', error);
    }
  };

  // Marcar/desmarcar exercício como concluído
  const toggleExerciseCompletion = (workoutId, exerciseIndex, isCompleted) => {
    try {
      setCompletedExercises(prev => {
        const updated = { ...prev };
        
        if (!updated[workoutId]) {
          updated[workoutId] = {};
        }
        
        if (isCompleted) {
          updated[workoutId][exerciseIndex] = true;
        } else {
          delete updated[workoutId][exerciseIndex];
          
          // Se não houver mais exercícios concluídos, remover o treino do objeto
          if (Object.keys(updated[workoutId]).length === 0) {
            delete updated[workoutId];
          }
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Erro ao alterar status do exercício:', error);
    }
  };

  // Verificar se um exercício está concluído
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    return completedExercises[workoutId] && completedExercises[workoutId][exerciseIndex] === true;
  };

  // Calcular progresso do treino
  const getWorkoutProgress = (workoutId) => {
    try {
      const workout = workouts.find(w => String(w.id) === String(workoutId));
      
      if (!workout || !workout.exercises || workout.exercises.length === 0) {
        return { overallProgress: 0, completedCount: 0, totalCount: 0 };
      }
      
      const totalExercises = workout.exercises.length;
      let completedCount = 0;
      
      if (completedExercises[workoutId]) {
        workout.exercises.forEach((_, index) => {
          if (isExerciseCompleted(workoutId, index)) {
            completedCount++;
          }
        });
      }
      
      const overallProgress = totalExercises > 0 
        ? Math.round((completedCount / totalExercises) * 100) 
        : 0;
      
      return {
        overallProgress,
        completedCount,
        totalCount: totalExercises
      };
    } catch (error) {
      console.error('Erro ao calcular progresso:', error);
      return { overallProgress: 0, completedCount: 0, totalCount: 0 };
    }
  };

  const value = {
    workouts,
    loading,
    error,
    completedWorkouts,
    completedExercises,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    toggleWorkoutCompletion,
    toggleExerciseCompletion,
    isExerciseCompleted,
    getWorkoutProgress
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
