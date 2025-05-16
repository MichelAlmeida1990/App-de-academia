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
    const totalMinutes = context.getTotalTrainingMinutes ? context.getTotalTrainingMinutes() : 0;
    const currentStreak = context.calculateCurrentStreak ? context.calculateCurrentStreak() : 0;
    const recordCount = Object.keys(context.personalRecords || {}).length;
    
    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
      totalMinutes,
      currentStreak,
      recordCount
    };
  };
  
  // Calcular o volume total levantado em um treino específico
  const calculateWorkoutVolume = (workoutId) => {
    const workout = context.workouts.find(w => w.id === workoutId);
    if (!workout) return 0;
    
    let totalVolume = 0;
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          totalVolume += (set.weight * set.reps);
        }
      });
    });
    
    return totalVolume;
  };
  
  // Obter os exercícios mais frequentes
  const getMostFrequentExercises = (limit = 5) => {
    const exerciseCounts = {};
    
    context.workouts.forEach(workout => {
      if (workout.completed) {
        workout.exercises.forEach(exercise => {
          exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
        });
      }
    });
    
    return Object.entries(exerciseCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  };
  
  // Verificar se há treinos programados para hoje
  const getScheduledWorkoutsForToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return context.workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === today.getTime() && !workout.completed;
    });
  };
  
  // Calcular a frequência de treino por dia da semana
  const getWorkoutFrequencyByDay = () => {
    const dayCount = [0, 0, 0, 0, 0, 0, 0]; // [Dom, Seg, Ter, Qua, Qui, Sex, Sáb]
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    context.workouts.forEach(workout => {
      if (workout.completed) {
        const day = new Date(workout.date).getDay();
        dayCount[day]++;
      }
    });
    
    return dayCount.map((count, index) => ({
      day: dayNames[index],
      count
    }));
  };
  
  // Retornar o contexto original e as funções auxiliares adicionais
  return {
    ...context,
    isPersonalRecord,
    getPersonalRecord,
    getUnlockedAchievements,
    isAchievementUnlocked,
    getWorkoutProgressForPeriod,
    getWorkoutStats,
    calculateWorkoutVolume,
    getMostFrequentExercises,
    getScheduledWorkoutsForToday,
    getWorkoutFrequencyByDay
  };
};
