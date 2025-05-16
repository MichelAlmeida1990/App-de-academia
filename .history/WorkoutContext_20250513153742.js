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
  
  // Adicionar estado para treinos concluídos
  const [completedWorkouts, setCompletedWorkouts] = useLocalStorage('completed-workouts', {});
  
  // Adicionar estado para exercícios concluídos
  const [completedExercises, setCompletedExercises] = useLocalStorage('completed-exercises', {});

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
    
    // Remover dos treinos concluídos
    const newCompletedWorkouts = { ...completedWorkouts };
    delete newCompletedWorkouts[id];
    setCompletedWorkouts(newCompletedWorkouts);
    
    // Remover exercícios concluídos associados a este treino
    const newCompletedExercises = { ...completedExercises };
    Object.keys(newCompletedExercises).forEach(key => {
      if (key.startsWith(`${id}-`)) {
        delete newCompletedExercises[key];
      }
    });
    setCompletedExercises(newCompletedExercises);
  };

  // Marcar/desmarcar um treino como concluído
  const toggleWorkoutCompletion = (workoutId, isCompleted) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [workoutId]: isCompleted
    }));
    
    // Se o treino foi concluído, também atualizamos o progresso para 100%
    if (isCompleted) {
      const workout = workouts.find(w => w.id === workoutId);
      if (workout && workout.exercises) {
        const exerciseProgress = {};
        workout.exercises.forEach((exercise, index) => {
          exerciseProgress[exercise.name] = 100;
          // Também marcar todos os exercícios como concluídos
          const exerciseKey = `${workoutId}-${index}`;
          setCompletedExercises(prev => ({
            ...prev,
            [exerciseKey]: true
          }));
        });
        
        updateWorkoutProgress(workoutId, exerciseProgress);
      }
    }
  };

  // Toggle para marcar/desmarcar um exercício específico como concluído
  const toggleExerciseCompletion = (workoutId, exerciseIndex, isCompleted) => {
    const exerciseKey = `${workoutId}-${exerciseIndex}`;
    
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseKey]: isCompleted
    }));
    
    // Atualizar o progresso do treino com base nos exercícios concluídos
    updateExerciseProgressInWorkout(workoutId);
  };

  // Verificar se um exercício está concluído
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    const exerciseKey = `${workoutId}-${exerciseIndex}`;
    return completedExercises[exerciseKey] || false;
  };

  // Atualizar o progresso do treino com base nos exercícios concluídos
  const updateExerciseProgressInWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout || !workout.exercises) return;
    
    const exerciseProgress = {};
    let completedCount = 0;
    
    workout.exercises.forEach((exercise, index) => {
      const isCompleted = isExerciseCompleted(workoutId, index);
      exerciseProgress[exercise.name] = isCompleted ? 100 : 0;
      if (isCompleted) completedCount++;
    });
    
    // Atualizar o progresso geral do treino
    const overallProgress = workout.exercises.length > 0 
      ? (completedCount / workout.exercises.length) * 100 
      : 0;
      
    // Marcar o treino como concluído se todos os exercícios estiverem concluídos
    if (overallProgress === 100) {
      toggleWorkoutCompletion(workoutId, true);
    } else if (completedWorkouts[workoutId]) {
      // Se algum exercício for desmarcado, o treino não está mais 100% concluído
      toggleWorkoutCompletion(workoutId, false);
    }
    
    setProgress(prev => ({
      ...prev,
      [workoutId]: {
        ...prev[workoutId],
        exercises: exerciseProgress,
        lastUpdated: new Date().toISOString(),
        overallProgress: overallProgress
      }
    }));
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
    completedWorkouts,
    completedExercises,
    addWorkout,
    updateWorkout,
    removeWorkout,
    updateWorkoutProgress,
    getWorkoutProgress,
    getOverallProgress,
    toggleWorkoutCompletion,
    toggleExerciseCompletion,
    isExerciseCompleted
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
