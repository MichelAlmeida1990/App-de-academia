// src/context/WorkoutContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import workoutData from '../data/workouts';
import workoutTemplatesData from '../data/workoutTemplates';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children, navigate }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTemplates] = useState(workoutTemplatesData);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      // Simular carregamento de dados
      setTimeout(() => {
        setWorkouts(workoutData);
        
        // Simular alguns treinos já completos
        const completed = {};
        workoutData.slice(0, 3).forEach(workout => {
          completed[workout.id] = true;
        });
        setCompletedWorkouts(completed);
        
        // Simular histórico de treinos
        const history = workoutData.slice(0, 3).map(workout => ({
          ...workout,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration: Math.floor(Math.random() * 30) + 30
        }));
        setWorkoutHistory(history);
        
        setLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);

  // Iniciar um treino
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setActiveWorkout({
        ...workout,
        currentExerciseIndex: 0,
        exerciseProgress: workout.exercises.map(() => ({ completed: false, sets: [] }))
      });
      navigate('/active-workout');
    }
  };

  // Sair de um treino
  const exitWorkout = () => {
    setActiveWorkout(null);
    navigate('/');
  };

  // Completar um treino
  const completeWorkout = (workoutId, duration, exerciseResults) => {
    // Marcar como completo
    setCompletedWorkouts(prev => ({
      ...prev,
      [workoutId]: true
    }));
    
    // Adicionar ao histórico
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      const historyEntry = {
        ...workout,
        date: new Date().toISOString().split('T')[0],
        duration,
        results: exerciseResults
      };
      setWorkoutHistory(prev => [historyEntry, ...prev]);
    }
    
    // Limpar treino ativo
    setActiveWorkout(null);
    navigate('/');
  };

  // Adicionar um novo treino
  const addWorkout = (workout) => {
    setWorkouts(prev => [...prev, workout]);
  };

  // Selecionar um tipo de treino para um dia específico
  const selectWorkoutForDay = (date, templateId) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (template) {
      const formattedDate = date.toISOString().split('T')[0];
      const newWorkout = {
        id: `workout-${Date.now()}`,
        title: template.title,
        description: template.description,
        date: formattedDate,
        type: template.type,
        exercises: template.exercises
      };
      addWorkout(newWorkout);
    }
  };

  // Obter tipos de treinos disponíveis
  const getWorkoutTypes = () => {
    return workoutTemplates.map(template => ({
      id: template.id,
      title: template.title,
      type: template.type
    }));
  };

  // Obter estatísticas de treinos
  const getWorkoutStats = () => {
    const totalWorkouts = workoutHistory.length;
    const totalExercises = workoutHistory.reduce((sum, workout) => 
      sum + workout.exercises.length, 0);
    const totalDuration = workoutHistory.reduce((sum, workout) => 
      sum + workout.duration, 0);
    
    // Calcular treinos por tipo
    const workoutsByType = {};
    workoutHistory.forEach(workout => {
      if (!workoutsByType[workout.type]) {
        workoutsByType[workout.type] = 0;
      }
      workoutsByType[workout.type]++;
    });
    
    return {
      totalWorkouts,
      totalExercises,
      totalDuration,
      workoutsByType
    };
  };

  // Função para calcular o progresso geral
  const getOverallProgress = () => {
    if (!workouts.length) return { percentage: 0, completed: 0, total: 0 };
    
    const totalWorkouts = workouts.length;
    const completedCount = Object.values(completedWorkouts).filter(Boolean).length;
    
    return {
      percentage: Math.round((completedCount / totalWorkouts) * 100),
      completed: completedCount,
      total: totalWorkouts
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
    getOverallProgress,
    setActiveWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
