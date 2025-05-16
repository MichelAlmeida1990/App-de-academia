import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedCompletedWorkouts = localStorage.getItem('completedWorkouts');
    const storedCompletedExercises = localStorage.getItem('completedExercises');
    const storedActiveWorkout = localStorage.getItem('activeWorkout');
    
    if (storedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
    }
    
    if (storedCompletedExercises) {
      setCompletedExercises(JSON.parse(storedCompletedExercises));
    }
    
    if (storedActiveWorkout) {
      setActiveWorkout(JSON.parse(storedActiveWorkout));
    }
    
    // Simular carregamento de treinos
    setTimeout(() => {
      const dummyWorkouts = [
        {
          id: 1,
          title: 'Treino de Pernas',
          type: 'Força',
          duration: 45,
          difficulty: 'Intermediário',
          completed: false,
          date: '2025-05-12',
          exercises: [
            { name: 'Agachamento', sets: 3, reps: 12 },
            { name: 'Leg Press', sets: 3, reps: 10 },
            { name: 'Extensão de Pernas', sets: 3, reps: 15 }
          ]
        },
        {
          id: 2,
          title: 'Cardio HIIT',
          type: 'Cardio',
          duration: 30,
          difficulty: 'Avançado',
          completed: false,
          date: '2025-05-14',
          exercises: [
            { name: 'Burpees', sets: 4, reps: 15 },
            { name: 'Mountain Climbers', sets: 4, reps: 20 },
            { name: 'Jumping Jacks', sets: 4, reps: 30 }
          ]
        },
        {
          id: 3,
          title: 'Treino de Peito e Braços',
          type: 'Força',
          duration: 50,
          difficulty: 'Intermediário',
          completed: false,
          date: '2025-05-16',
          exercises: [
            { name: 'Supino Reto', sets: 4, reps: 10 },
            { name: 'Rosca Direta', sets: 3, reps: 12 },
            { name: 'Tríceps Corda', sets: 3, reps: 15 }
          ]
        }
      ];
      
      setWorkouts(dummyWorkouts);
      setLoading(false);
    }, 800);
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);
  
  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
  }, [completedExercises]);
  
  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem('activeWorkout');
    }
  }, [activeWorkout]);

  // Iniciar um treino
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setActiveWorkout(workout);
      return true;
    }
    return false;
  };

  // Finalizar um treino
  const completeWorkout = (workoutId) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [workoutId]: true
    }));
    
    if (activeWorkout && activeWorkout.id === workoutId) {
      setActiveWorkout(null);
    }
  };

  // Cancelar um treino ativo
  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
  };

  // Verificar se um exercício está completo
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    if (!completedExercises[workoutId]) return false;
    return completedExercises[workoutId][exerciseIndex] || false;
  };

  // Marcar/desmarcar um exercício como completo
  const toggleExerciseCompletion = (workoutId, exerciseIndex, isCompleted) => {
    setCompletedExercises(prev => {
      const workoutExercises = prev[workoutId] || {};
      return {
        ...prev,
        [workoutId]: {
          ...workoutExercises,
          [exerciseIndex]: isCompleted
        }
      };
    });
  };

  const value = {
    workouts,
    loading,
    completedWorkouts,
    activeWorkout,
    startWorkout,
    completeWorkout,
    cancelActiveWorkout,
    isExerciseCompleted,
    toggleExerciseCompletion
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  return context;
};
