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

  // Estado para rastrear exercícios concluídos
  const [completedExercises, setCompletedExercises] = useLocalStorage('completed-exercises', {});

  // Estado para rastrear treinos concluídos
  const [completedWorkouts, setCompletedWorkouts] = useLocalStorage('completed-workouts', {});

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

  // Verificar se um exercício está concluído
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    const key = `${workoutId}-${exerciseIndex}`;
    return completedExercises[key] === true;
  };

  // Alternar o status de conclusão de um exercício
  const toggleExerciseCompletion = (workoutId, exerciseIndex, isCompleted) => {
    const key = `${workoutId}-${exerciseIndex}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: isCompleted
    }));
    
    console.log(`Exercício ${exerciseIndex} do treino ${workoutId} marcado como ${isCompleted ? "concluído" : "não concluído"}`);
    
    // Atualizar o progresso do treino
    const workout = workouts.find(w => w.id === workoutId);
    if (workout && workout.exercises) {
      const exerciseProgress = {};
      workout.exercises.forEach((_, index) => {
        exerciseProgress[index] = isExerciseCompleted(workoutId, index) ? 100 : 0;
      });
      updateWorkoutProgress(workoutId, exerciseProgress);
    }
  };

  // Alternar o status de conclusão de um treino
  const toggleWorkoutCompletion = (workoutId, isCompleted) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [workoutId]: isCompleted
    }));
    
    // Se marcar como concluído, marcar todos os exercícios como concluídos também
    if (isCompleted) {
      const workout = workouts.find(w => w.id === workoutId);
      if (workout && workout.exercises) {
        const newCompletedExercises = { ...completedExercises };
        workout.exercises.forEach((_, index) => {
          const key = `${workoutId}-${index}`;
          newCompletedExercises[key] = true;
        });
        setCompletedExercises(newCompletedExercises);
        
        // Atualizar o progresso para 100%
        const exerciseProgress = {};
        workout.exercises.forEach((_, index) => {
          exerciseProgress[index] = 100;
        });
        updateWorkoutProgress(workoutId, exerciseProgress);
      }
    }
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
    isExerciseCompleted,
    toggleExerciseCompletion,
    toggleWorkoutCompletion
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
