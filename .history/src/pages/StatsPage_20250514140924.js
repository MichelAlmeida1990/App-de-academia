// src/pages/StatsPage.js
import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FaDumbbell, FaClock, FaCalendarCheck, FaFire } from 'react-icons/fa';

const StatsPage = () => {
  const { getWorkoutStats, workoutHistory, loading } = useWorkout();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const stats = getWorkoutStats();
  
  // Criar dados para o gráfico de treinos por tipo
  const workoutTypeData = Object.entries(stats.workoutsByType).map(([type, count]) => ({
    type,
    count
  }));
  
  // Ordenar por contagem (maior para menor)
  workoutTypeData.sort((a, b) => b.count - a.count);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Estatísticas</h1>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Treinos</p>
              <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full">
              <FaCalendarCheck />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Exercícios</p>
              <p className="text-2xl font-bold">{stats.totalExercises}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full">
              <FaDumbbell />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Minutos Treinados</p>
              <p className="text-2xl font-bold">{stats.totalDuration}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-full">
              <FaClock />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calorias Estimadas</p>
              <p className="text-2xl font-bold">{stats.totalDuration * 8}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full">
              <FaFire />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráfico de Treinos por Tipo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Treinos por Tipo</h2>
        
        {workoutTypeData.length > 0 ? (
          <div className="space-y-3">
            {workoutTypeData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.type}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(item.count / stats.totalWorkouts) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Nenhum dado disponível
          </p>
        )}
      </div>
      
      {/* Histórico de Treinos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Histórico de Treinos</h2>
        </div>
        
        {workoutHistory.length > 0 ? (
          <div className="divide-y dark:divide-gray-700">
            {workoutHistory.map((workout, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{workout.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(workout.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{workout.duration} min</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {workout.exercises.length} exercícios
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum treino concluído ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
