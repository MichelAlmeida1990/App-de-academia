import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import initialWorkouts from '../data/workouts';
import { calculateWorkoutProgress } from '../utils/helpers';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  // Usar o hook useLocalStorage para persistir os treinos
  const [workouts, setWorkouts] = useLocalStorage('workouts', initialWorkouts);
  
  // Usar o hook useLocalStorage para persistir o progresso dos treinos
  const [progress, setProgress] = useLocalStorage('workout-progress', {});
  
  // Adicionar um novo treino
  const addWorkout = (workout) => {
    setWorkouts([...workouts, workout]);
  };
  
  // Atualizar um treino existente
  const updateWorkout = (id, updatedWorkout) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id ? { ...workout, ...updatedWorkout } : workout
    ));
  };
  
  // Remover um treino
  const removeWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
    
    // Também remover o progresso associado a este treino
    const newProgress = { ...progress };
    delete newProgress[id];
    setProgress(newProgress);
  };
  
  // Atualizar o progresso de um treino
  const updateWorkoutProgress = (workoutId, exerciseProgress) => {
    setProgress(prev => ({
      ...prev,
      [workoutId]: {
        ...prev[workoutId],
        exercises: exerciseProgress,
        lastUpdated: new Date().toISOString(),
        overallProgress: calculateWorkoutProgress(exerciseProgress)
      }
    }));
  };
  
  // Obter o progresso de um treino específico
  const getWorkoutProgress = (workoutId) => {
    return progress[workoutId] || { 
      exercises: {}, 
      overallProgress: 0, 
      lastUpdated: null 
    };
  };
  
  // Obter o progresso geral de todos os treinos
  const getOverallProgress = () => {
    const progressValues = Object.values(progress).map(p => p.overallProgress || 0);
    if (progressValues.length === 0) return 0;
    
    return progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
  };

  const value = {
    workouts,
    progress,
    addWorkout,
    updateWorkout,
    removeWorkout,
    updateWorkoutProgress,
    getWorkoutProgress,
    getOverallProgress
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
