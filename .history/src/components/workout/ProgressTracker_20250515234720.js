// src/components/workout/ProgressTracker.js
import React, { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaFire, FaCalendarCheck, FaTrophy, FaChartLine } from 'react-icons/fa';

const ProgressTracker = () => {
  const { workouts, loading } = useContext(WorkoutContext);
  
  const [progress, setProgress] = useState({
    weeklyWorkouts: 0,
    weeklyGoal: 5,
    monthlyProgress: 0,
    streakDays: 0,
    totalCompleted: 0
  });

  // Calcular métricas de progresso
  useEffect(() => {
    if (!loading && workouts && workouts.length > 0) {
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      
      // Filtrar treinos completados
      const completedWorkouts = workouts.filter(workout => 
        workout.progress === 100 || workout.completedAt
      );
      
      // Treinos completados esta semana
      const weeklyWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = parseISO(workout.completedAt || workout.date);
        return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
      });
      
      // Calcular sequência de dias
      let streakDays = 0;
      if (completedWorkouts.length > 0) {
        // Ordenar por data de conclusão
        const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
          const dateA = parseISO(a.completedAt || a.date);
          const dateB = parseISO(b.completedAt || b.date);
          return dateB - dateA; // Mais recente primeiro
        });
        
        const latestWorkoutDate = parseISO(sortedWorkouts[0].completedAt || sortedWorkouts[0].date);
        
        // Se o último treino foi hoje ou ontem, calcular sequência
        const daysSinceLastWorkout = differenceInDays(today, latestWorkoutDate);
        
        if (daysSinceLastWorkout <= 1) {
          // Começar a contar a sequência
          let currentDate = latestWorkoutDate;
          let consecutiveDays = 1;
          
          // Verificar dias anteriores
          for (let i = 1; i < sortedWorkouts.length; i++) {
            const prevWorkoutDate = parseISO(sortedWorkouts[i].completedAt || sortedWorkouts[i].date);
            const daysBetween = differenceInDays(currentDate, prevWorkoutDate);
            
            if (daysBetween === 1) {
              consecutiveDays++;
              currentDate = prevWorkoutDate;
            } else if (daysBetween > 1) {
              break;
            }
          }
          
          streakDays = consecutiveDays;
        }
      }
      
      // Progresso mensal (% de dias do mês com treinos concluídos)
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const currentDay = today.getDate();
      const monthlyTarget = Math.min(currentDay, daysInMonth);
      const daysWithWorkouts = new Set(
        completedWorkouts
          .filter(workout => {
            const workoutDate = parseISO(workout.completedAt || workout.date);
            return workoutDate.getMonth() === today.getMonth() && 
                  workoutDate.getFullYear() === today.getFullYear();
          })
          .map(workout => parseISO(workout.completedAt || workout.date).getDate())
      ).size;
      
      const monthlyProgress = Math.round((daysWithWorkouts / monthlyTarget) * 100);
      
      setProgress({
        weeklyWorkouts: weeklyWorkouts.length,
        weeklyGoal: 5, // Meta semanal fixa (poderia vir das configurações do usuário)
        monthlyProgress: monthlyProgress,
        streakDays: streakDays,
        totalCompleted: completedWorkouts.length
      });
    }
  }, [workouts, loading]);

  if (loading) {
    return (
      <div className="card slide-in animate-pulse">
        <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card slide-in bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaCalendarCheck className="text-blue-500 mr-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Treinos esta semana</p>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{progress.weeklyWorkouts}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">/ {progress.weeklyGoal}</span>
          </div>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min((progress.weeklyWorkouts / progress.weeklyGoal) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaFire className="text-orange-500 mr-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Sequência atual</p>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-orange-500">{progress.streakDays}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">dias</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {progress.streakDays > 0 ? 'Continue treinando!' : 'Comece sua sequência hoje!'}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <FaChartLine className="text-green-500 mr-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Progresso mensal</p>
        </div>
        <div className="flex justify-between mb-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          <p className="text-sm font-medium">{progress.monthlyProgress}%</p>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${progress.monthlyProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
          <FaTrophy className="text-purple-500 mr-2" />
          <span className="text-sm">
            Total de treinos concluídos: <strong>{progress.totalCompleted}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
