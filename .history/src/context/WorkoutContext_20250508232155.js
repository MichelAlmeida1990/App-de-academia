import React, { createContext, useState, useEffect } from 'react';
import workoutsData from '../data/workouts';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState(workoutsData);
  const [completedWorkouts, setCompletedWorkouts] = useState({});

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    const savedCompletedWorkouts = localStorage.getItem('completedWorkouts');
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
    }
  }, []);

  // Salvar no localStorage quando completedWorkouts mudar
  useEffect(() => {
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);

  const toggleWorkoutCompletion = (id, isCompleted) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [id]: isCompleted,
    }));
  };

  const resetProgress = () => {
    setCompletedWorkouts({});
  };

  const getCompletedCount = () => {
    return Object.values(completedWorkouts).filter(Boolean).length;
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        completedWorkouts,
        toggleWorkoutCompletion,
        resetProgress,
        getCompletedCount,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
