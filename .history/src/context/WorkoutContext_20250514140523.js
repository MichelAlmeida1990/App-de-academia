// src/context/WorkoutContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Criando o contexto
const WorkoutContext = createContext();

// Hook personalizado para usar o contexto
export const useWorkout = () => {
  return useContext(WorkoutContext);
};

// Provedor do contexto
export const WorkoutProvider = ({ children, navigate: externalNavigate }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Dados de treinos organizados por divisões
  const workoutTemplates = {
    peitoTriceps: {
      title: "Peito e Tríceps",
      exercises: [
        { name: "Supino Reto", sets: 4, reps: "10-12", rest: 60 },
        { name: "Supino Inclinado", sets: 3, reps: "10-12", rest: 60 },
        { name: "Crucifixo", sets: 3, reps: "12-15", rest: 45 },
        { name: "Tríceps Corda", sets: 4, reps: "12-15", rest: 45 },
        { name: "Tríceps Francês", sets: 3, reps: "10-12", rest: 60 },
        { name: "Mergulho no Banco", sets: 3, reps: "Até falha", rest: 60 }
      ],
      duration: 60
    },
    bicepsOmbro: {
      title: "Bíceps e Ombro",
      exercises: [
        { name: "Rosca Direta", sets: 4, reps: "10-12", rest: 60 },
        { name: "Rosca Alternada", sets: 3, reps: "10-12", rest: 60 },
        { name: "Rosca Martelo", sets: 3, reps: "12-15", rest: 45 },
        { name: "Desenvolvimento", sets: 4, reps: "10-12", rest: 60 },
        { name: "Elevação Lateral", sets: 3, reps: "12-15", rest: 45 },
        { name: "Elevação Frontal", sets: 3, reps: "12-15", rest: 45 }
      ],
      duration: 60
    },
    pernaCostas: {
      title: "Perna e Costas",
      exercises: [
        { name: "Agachamento", sets: 4, reps: "10-12", rest: 90 },
        { name: "Leg Press", sets: 4, reps: "12-15", rest: 90 },
        { name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: 60 },
        { name: "Puxada Frontal", sets: 4, reps: "10-12", rest: 60 },
        { name: "Remada Curvada", sets: 4, reps: "10-12", rest: 60 },
        { name: "Pulldown", sets: 3, reps: "12-15", rest: 60 }
      ],
      duration: 70
    },
    abdomenCardio: {
      title: "Abdômen e Cardio",
      exercises: [
        { name: "Prancha", sets: 3, reps: "30-60s", rest: 45 },
        { name: "Crunch", sets: 3, reps: "15-20", rest: 45 },
        { name: "Elevação de Pernas", sets: 3, reps: "12-15", rest: 45 },
        { name: "Corrida (esteira)", sets: 1, reps: "20 min", rest: 0 },
        { name: "Bicicleta", sets: 1, reps: "10 min", rest: 0 }
      ],
      duration: 45
    }
  };

  useEffect(() => {
    // Simulando carregamento de dados
    const fetchWorkouts = async () => {
      try {
        // Aqui você substituiria por uma chamada API real
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gerar treinos para a semana atual
        const today = new Date();
        const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, etc.
        
        const mockWorkouts = [];
        const workoutTypes = Object.values(workoutTemplates);
        
        // Gerar treinos para os próximos 7 dias
        for (let i = 0; i < 7; i++) {
          // Pular domingo (dia 0) e sábado (dia 6)
          if ((currentDay + i) % 7 === 0 || (currentDay + i) % 7 === 6) continue;
          
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          
          // Escolher um tipo de treino baseado no dia da semana
          const workoutIndex = ((currentDay + i) % 7) % workoutTypes.length;
          const workoutTemplate = workoutTypes[workoutIndex];
          
          mockWorkouts.push({
            id: `workout-${dateString}`,
            title: workoutTemplate.title,
            date: dateString,
            duration: workoutTemplate.duration,
            exercises: workoutTemplate.exercises.map(ex => ex.name),
            template: workoutTemplate
          });
        }
        
        setWorkouts(mockWorkouts);
        
        // Inicializar completedWorkouts e workoutHistory
        const initialCompleted = {};
        mockWorkouts.forEach(workout => {
          initialCompleted[workout.id] = false;
        });
        setCompletedWorkouts(initialCompleted);
        
        // Simular histórico de treinos
        const mockHistory = [
          {
            id: 'hist-1',
            title: "Peito e Tríceps",
            date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duration: 65,
            exercises: workoutTemplates.peitoTriceps.exercises.map(ex => ex.name)
          },
          {
            id: 'hist-2',
            title: "Perna e Costas",
            date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duration: 75,
            exercises: workoutTemplates.pernaCostas.exercises.map(ex => ex.name)
          }
        ];
        setWorkoutHistory(mockHistory);
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
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      // Adicionar ao histórico
      const historyEntry = {
        ...workout,
        id: `hist-${Date.now()}`,
        completedAt: new Date().toISOString()
      };
      setWorkoutHistory(prev => [historyEntry, ...prev]);
      
      // Marcar como completo
      setCompletedWorkouts(prev => ({
        ...prev,
        [workoutId]: true
      }));
      
      // Limpar treino ativo
      setActiveWorkout(null);
      
      // Navegar de volta para a página principal
      if (externalNavigate) {
        externalNavigate('/');
      }
    }
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

  // Função para iniciar um treino
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setActiveWorkout({
        ...workout,
        startTime: new Date(),
        currentExerciseIndex: 0,
        exerciseProgress: workout.template.exercises.map(() => ({
          completed: false,
          sets: []
        }))
      });
      
      // Usamos o navigate fornecido externamente ou uma função noop
      if (externalNavigate) {
        externalNavigate('/active-workout');
      } else {
        console.warn('Navigation function not provided to WorkoutProvider');
      }
    }
  };

  // Função para sair do treino sem completar
  const exitWorkout = () => {
    setActiveWorkout(null);
    
    // Navegar de volta para a página principal
    if (externalNavigate) {
      externalNavigate('/');
    }
  };

  // Função para escolher um treino para um dia específico
  const selectWorkoutForDay = (date, workoutType) => {
    const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const template = workoutTemplates[workoutType];
    
    if (!template) return null;
    
    // Verificar se já existe um treino para este dia
    const existingIndex = workouts.findIndex(w => w.date === dateString);
    
    const newWorkout = {
      id: `workout-${dateString}`,
      title: template.title,
      date: dateString,
      duration: template.duration,
      exercises: template.exercises.map(ex => ex.name),
      template: template
    };
    
    if (existingIndex >= 0) {
      // Substituir o treino existente
      setWorkouts(prev => [
        ...prev.slice(0, existingIndex),
        newWorkout,
        ...prev.slice(existingIndex + 1)
      ]);
    } else {
      // Adicionar novo treino
      setWorkouts(prev => [...prev, newWorkout]);
    }
    
    // Atualizar completedWorkouts
    setCompletedWorkouts(prev => ({
      ...prev,
      [newWorkout.id]: false
    }));
    
    return newWorkout;
  };

  // Função para obter os tipos de treino disponíveis
  const getWorkoutTypes = () => {
    return Object.keys(workoutTemplates).map(key => ({
      id: key,
      title: workoutTemplates[key].title
    }));
  };

  // Função para obter estatísticas de treino
  const getWorkoutStats = () => {
    const totalWorkouts = workoutHistory.length;
    const totalExercises = workoutHistory.reduce((sum, workout) => 
      sum + (workout.exercises ? workout.exercises.length : 0), 0);
    const totalDuration = workoutHistory.reduce((sum, workout) => 
      sum + (workout.duration || 0), 0);
    
    // Calcular treinos por tipo
    const workoutsByType = {};
    workoutHistory.forEach(workout => {
      if (!workoutsByType[workout.title]) {
        workoutsByType[workout.title] = 0;
      }
      workoutsByType[workout.title]++;
    });
    
    return {
      totalWorkouts,
      totalExercises,
      totalDuration,
      workoutsByType
    };
  };

  const value = {
    workouts,
    loading,
    completedWorkouts,
    activeWorkout,
    workoutTemplates,
    workoutHistory,
    completeWorkout,
    addWorkout,
    startWorkout,
    exitWorkout,
    selectWorkoutForDay,
    getWorkoutTypes,
    getWorkoutStats,
    setActiveWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
