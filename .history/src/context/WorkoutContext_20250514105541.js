// src/context/WorkoutContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Criando o contexto
const WorkoutContext = createContext();

// Hook personalizado para usar o contexto
export const useWorkout = () => {
  return useContext(WorkoutContext);
};

// Provedor do contexto
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados
    const fetchWorkouts = async () => {
      try {
        // Aqui você substituiria por uma chamada API real
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados de exemplo
        const mockWorkouts = [
          {
            id: '1',
            title: 'Treino de Pernas',
            date: new Date().toISOString().split('T')[0],
            duration: 45,
            exercises: ['Agachamento', 'Leg Press', 'Cadeira Extensora']
          },
          {
            id: '2',
            title: 'Treino de Peito',
            date: (() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              return tomorrow.toISOString().split('T')[0];
            })(),
            duration: 40,
            exercises: ['Supino Reto', 'Crucifixo', 'Crossover']
          }
        ];
        
        setWorkouts(mockWorkouts);
        setCompletedWorkouts({ '1': false, '2': false });
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Função para marcar um treino como completo
  const completeWorkout = (workoutId) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [workoutId]: true
    }));
  };

  // Função para adicionar um novo treino
  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString()
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    setCompletedWorkouts(prev => ({
      ...prev,
      [newWorkout.id]: false
    }));
    
    return newWorkout;
  };

  const value = {
    workouts,
    loading,
    completedWorkouts,
    completeWorkout,
    addWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Não exporte default, apenas as exportações nomeadas
