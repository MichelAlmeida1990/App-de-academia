// src/pages/HomePage.js
import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutCard from '../components/workout/WorkoutCard';
import { FaDumbbell, FaFire, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HomePage = () => {
  const { workouts, completedWorkouts, workoutHistory, loading } = useWorkout();
  const today = new Date();
  
  // Encontrar o treino de hoje
  const todayWorkout = workouts.find(workout => 
    workout.date === today.toISOString().split('T')[0]
  );
  
  // Calcular estatísticas básicas
  const workoutsThisWeek = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.date);
    const diffTime = Math.abs(today - workoutDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;
  
  const totalMinutes = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo ao FitnessTracker</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Treinos esta semana</p>
              <p className="text-2xl font-bold">{workoutsThisWeek}</p>
            </div>
            <FaCalendarCheck className="text-3xl opacity-80" />
          </div>
        </div>
        
        <div className="bg-green-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Minutos treinados</p>
              <p className="text-2xl font-bold">{totalMinutes}</p>
            </div>
            <FaFire className="text-3xl opacity-80" />
          </div>
        </div>
      </div>
      
      {/* Today's Workout */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Treino de Hoje</h2>
        {todayWorkout ? (
          <WorkoutCard workout={todayWorkout} isCompleted={completedWorkouts[todayWorkout.id]} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum treino programado para hoje.
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Adicionar Treino
            </button>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Atividade Recente</h2>
        {workoutHistory.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y dark:divide-gray-700">
            {workoutHistory.slice(0, 3).map(workout => (
              <div key={workout.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{workout.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(workout.date), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{workout.duration} min</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {workout.exercises.length} exercícios
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum treino concluído recentemente.
            </p>
          </div>
        )}
      </div>
      
      {/* Upcoming Workouts */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Próximos Treinos</h2>
        {workouts.filter(w => new Date(w.date) > today).length > 0 ? (
          <div className="space-y-4">
            {workouts
              .filter(w => new Date(w.date) > today)
              .slice(0, 2)
              .map(workout => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  isCompleted={completedWorkouts[workout.id]} 
                />
              ))
            }
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum treino programado para os próximos dias.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
