// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children, navigate }) => {
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });
  
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  
  const addWorkout = (workout) => {
    setWorkouts(prevWorkouts => [...prevWorkouts, workout]);
  };
  
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setActiveWorkout({
        ...workout,
        startTime: new Date().toISOString()
      });
      navigate('/active-workout');
    }
  };
  
  const completeSet = (exerciseIndex, setIndex, weight, reps) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      const newWorkout = { ...prev };
      newWorkout.exercises[exerciseIndex].sets[setIndex] = {
        weight,
        reps,
        completed: true
      };
      return newWorkout;
    });
  };
  
  const completeWorkout = () => {
    if (!activeWorkout) return;
    
    const endTime = new Date().toISOString();
    const duration = new Date(endTime) - new Date(activeWorkout.startTime);
    
    setWorkouts(prev => 
      prev.map(w => 
        w.id === activeWorkout.id 
          ? { 
              ...activeWorkout, 
              completed: true, 
              endTime, 
              duration 
            } 
          : w
      )
    );
    
    setActiveWorkout(null);
    navigate('/dashboard');
  };
  
  const cancelWorkout = () => {
    setActiveWorkout(null);
    navigate('/dashboard');
  };
  
  const getWeeklyWorkouts = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek;
    });
  };
  
  const getTotalTrainingMinutes = () => {
    return workouts
      .filter(w => w.completed && w.duration)
      .reduce((total, workout) => total + (workout.duration / (1000 * 60)), 0);
  };
  
  return (
    <WorkoutContext.Provider value={{
      workouts,
      activeWorkout,
      addWorkout,
      startWorkout,
      completeSet,
      completeWorkout,
      cancelWorkout,
      getWeeklyWorkouts,
      getTotalTrainingMinutes
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};
