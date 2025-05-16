import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState({
    total: 0,
    completed: 0
  });

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
            { id: 101, name: 'Agachamento', sets: 3, reps: 12 },
            { id: 102, name: 'Leg Press', sets: 3, reps: 10 },
            { id: 103, name: 'Extensão de Pernas', sets: 3, reps: 15 }
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
            { id: 201, name: 'Burpees', sets: 4, reps: 15 },
            { id: 202, name: 'Mountain Climbers', sets: 4, reps: 20 },
            { id: 203, name: 'Jumping Jacks', sets: 4, reps: 30 }
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
            { id: 301, name: 'Supino Reto', sets: 4, reps: 10 },
            { id: 302, name: 'Rosca Direta', sets: 3, reps: 12 },
            { id: 303, name: 'Tríceps Corda', sets: 3, reps: 15 }
          ]
        },
        {
          id: 4,
          title: 'Yoga para Flexibilidade',
          type: 'Flexibilidade',
          duration: 40,
          difficulty: 'Iniciante',
          completed: false,
          date: '2025-05-18',
          exercises: [
            { id: 401, name: 'Postura do Cachorro Olhando para Baixo', sets: 1, duration: '60s' },
            { id: 402, name: 'Postura da Cobra', sets: 1, duration: '45s' },
            { id: 403, name: 'Postura da Criança', sets: 1, duration: '60s' }
          ]
        }
      ];
      
      setWorkouts(dummyWorkouts);
      setLoading(false);
    }, 800);
  }, []);

  // Calcular progresso semanal
  useEffect(() => {
    if (!loading) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const weeklyWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
      });
      
      const completedCount = weeklyWorkouts.filter(workout => 
        completedWorkouts[workout.id]
      ).length;
      
      setWeeklyProgress({
        total: weeklyWorkouts.length,
        completed: completedCount
      });
    }
  }, [workouts, completedWorkouts, loading]);

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

  // Adicionar um novo treino
  const addWorkout = (newWorkout) => {
    const workoutWithId = {
      ...newWorkout,
      id: Date.now(),
      completed: false,
      exercises: newWorkout.exercises.map((exercise, index) => ({
        ...exercise,
        id: Date.now() + index + 1
      }))
    };
    
    setWorkouts(prev => [...prev, workoutWithId]);
    return workoutWithId.id;
  };

  // Editar um treino existente
  const updateWorkout = (workoutId, updatedData) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId ? { ...workout, ...updatedData } : workout
      )
    );
  };

  // Excluir um treino
  const deleteWorkout = (workoutId) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    
    // Limpar dados relacionados
    const { [workoutId]: _, ...remainingCompletedWorkouts } = completedWorkouts;
    setCompletedWorkouts(remainingCompletedWorkouts);
    
    const { [workoutId]: __, ...remainingCompletedExercises } = completedExercises;
    setCompletedExercises(remainingCompletedExercises);
    
    if (activeWorkout && activeWorkout.id === workoutId) {
      setActiveWorkout(null);
    }
  };

  const value = {
    workouts,
    loading,
    completedWorkouts,
    activeWorkout,
    weeklyProgress,
    startWorkout,
    completeWorkout,
    cancelActiveWorkout,
    isExerciseCompleted,
    toggleExerciseCompletion,
    addWorkout,
    updateWorkout,
    deleteWorkout
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
