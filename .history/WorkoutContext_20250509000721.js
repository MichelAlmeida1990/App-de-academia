import React, { createContext, useState, useContext, useEffect } from 'react';

// Criando o contexto
const WorkoutContext = createContext();

// Hook personalizado para usar o contexto
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    console.error("useWorkout deve ser usado dentro de um WorkoutProvider");
    return {
      workouts: [],
      completedWorkouts: {},
      completeWorkout: () => {},
      resetProgress: () => {}
    };
  }
  return context;
};

// Dados iniciais de treinos
const initialWorkouts = [
  {
    id: '1',
    name: 'Treino de Força',
    description: 'Treino focado em ganho de força muscular',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    exercises: [
      {
        name: 'Agachamento',
        description: 'Trabalha quadríceps, glúteos e posterior de coxa',
        sets: 4,
        reps: 8,
        rest: 90,
        image: 'https://images.unsplash.com/photo-1566241142888-11afcb1ae0ab'
      },
      {
        name: 'Supino',
        description: 'Trabalha peitoral, ombros e tríceps',
        sets: 4,
        reps: 10,
        rest: 60,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
      }
    ]
  },
  {
    id: '2',
    name: 'Treino HIIT',
    description: 'Treino de alta intensidade para queima calórica',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd',
    exercises: [
      {
        name: 'Burpees',
        description: 'Exercício completo para todo o corpo',
        sets: 3,
        reps: '45 segundos',
        rest: 15,
        image: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0'
      },
      {
        name: 'Mountain Climbers',
        description: 'Trabalha core e resistência cardiovascular',
        sets: 3,
        reps: '45 segundos',
        rest: 15,
        image: 'https://images.unsplash.com/photo-1598971639058-a09736f5d8ce'
      }
    ]
  },
  {
    id: '3',
    name: 'Treino de Mobilidade',
    description: 'Focado em flexibilidade e recuperação muscular',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3',
    exercises: [
      {
        name: 'Alongamento de Isquiotibiais',
        description: 'Melhora a flexibilidade da parte posterior da coxa',
        sets: 3,
        reps: '30 segundos cada lado',
        rest: 10,
        image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30'
      },
      {
        name: 'Mobilidade de Quadril',
        description: 'Aumenta a amplitude de movimento do quadril',
        sets: 2,
        reps: '45 segundos cada lado',
        rest: 10,
        image: 'https://images.unsplash.com/photo-1581122584612-713f8d169348'
      }
    ]
  }
];

// Componente Provider
export const WorkoutProvider = ({ children }) => {
  // Estado para armazenar os treinos
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : initialWorkouts;
  });

  // Estado para armazenar os treinos concluídos
  const [completedWorkouts, setCompletedWorkouts] = useState(() => {
    const saved = localStorage.getItem('completedWorkouts');
    return saved ? JSON.parse(saved) : {};
  });

  // Salvar workouts no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Salvar completedWorkouts no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);

  // Função para marcar/desmarcar um treino como concluído
  const completeWorkout = (workoutId) => {
    setCompletedWorkouts(prev => {
      const updated = { ...prev };
      if (updated[workoutId]) {
        delete updated[workoutId];
      } else {
        updated[workoutId] = new Date().toISOString();
      }
      return updated;
    });
  };

  // Função para resetar o progresso
  const resetProgress = () => {
    setCompletedWorkouts({});
  };

  // Valores a serem disponibilizados pelo contexto
  const value = {
    workouts,
    setWorkouts,
    completedWorkouts,
    completeWorkout,
    resetProgress
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
