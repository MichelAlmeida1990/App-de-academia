// src/hooks/useWorkout.js
import { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  
  return context;
};
