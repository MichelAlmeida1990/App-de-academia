// src/hooks/useWorkout.js
import { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  
  // Funções auxiliares adicionais que podem ser úteis nos componentes
  
  // Verificar se um peso é um recorde pessoal para um exercício específico
  const isPersonalRecord = (exerciseName, weight) => {
    const currentRecord = context.personalRecords[exerciseName] || 0;
    return weight >= currentRecord;
  };
  
  // Obter o recorde pessoal para um exercício específico
  const getPersonalRecord = (exerciseName) => {
    return context.personalRecords[exerciseName] || 0;
  };
  
  // Obter todas as conquistas desbloqueadas
  const getUnlockedAchievements = () => {
    return Object.entries(context.achievements)
      .filter(([_, unlocked]) => unlocked)
      .map(([key]) => key);
  };
  
  // Verificar se uma conquista específica foi desbloqueada
  const isAchievementUnlocked = (achievementKey) => {
    return context.achievements[achievementKey] || false;
  };
  
  // Obter progresso de treino para um período específico
  const getWorkoutProgressForPeriod = (days = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return context.workouts
      .filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startDate && workoutDate <= endDate && workout.completed;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  // Obter estatísticas resumidas
  const getWorkoutStats = () => {
    const totalWorkouts = context.workouts.length;
    const completedWorkouts = context.workouts.filter(w => w.completed).length;
    const totalMinutes = context.getTotalTrainingMinutes();
    const currentStreak = context.calculateCurrentStreak();
    const recordCount = Object.keys(context.personalRecords).length;
    
    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
      totalMinutes,
      currentStreak,
      recordCount
    };
  };
  
  // Retornar o contexto original e as funções auxiliares adicionais
  return {
    ...context,
    isPersonalRecord,
    getPersonalRecord,
    getUnlockedAchievements,
    isAchievementUnlocked,
    getWorkoutProgressForPeriod,
    getWorkoutStats
  };
};
