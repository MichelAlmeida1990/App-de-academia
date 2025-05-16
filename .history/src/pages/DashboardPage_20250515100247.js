// src/pages/DashboardPage.js
import React, { useContext, useState, useEffect } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { Link } from 'react-router-dom';
import { FiActivity, FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi';

const DashboardPage = () => {
  // Modificação aqui - não tente desestruturar getWeeklyWorkouts
  const { workouts } = useContext(WorkoutContext);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalExercises: 0,
    streak: 0
  });

  // Implementar a função getWeeklyWorkouts localmente
  const getWeeklyWorkouts = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo && workoutDate <= today;
    });
  };

  useEffect(() => {
    // Usar a função local em vez de depender do contexto
    const weekly = getWeeklyWorkouts();
    setWeeklyWorkouts(weekly);
    
    // Calcular estatísticas
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalExercises = workouts.reduce((sum, workout) => sum + (workout.exercises?.length || 0), 0);
    
    // Calcular streak (dias consecutivos)
    const streak = calculateStreak(workouts);
    
    setStats({
      totalWorkouts,
      totalDuration,
      totalExercises,
      streak
    });
  }, [workouts]);

  // Função para calcular streak
  const calculateStreak = (workouts) => {
    if (!workouts.length) return 0;
    
    // Ordenar treinos por data (mais recente primeiro)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // Verificar se o treino mais recente foi hoje
    const mostRecentWorkoutDate = new Date(sortedWorkouts[0].date);
    mostRecentWorkoutDate.setHours(0, 0, 0, 0);
    
    if (mostRecentWorkoutDate.getTime() !== today.getTime() && 
        mostRecentWorkoutDate.getTime() !== new Date(today.getTime() - 86400000).getTime()) {
      return 0; // Não há streak se o último treino não foi hoje ou ontem
    }
    
    // Mapear datas de treino para verificar streak
    const workoutDates = sortedWorkouts.map(workout => {
      const date = new Date(workout.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });
    
    const uniqueDates = [...new Set(workoutDates)];
    
    // Contar dias consecutivos
    for (let i = 0; i <= 60; i++) { // Verificar até 60 dias atrás
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      if (uniqueDates.includes(checkDate.getTime())) {
        streak++;
      } else if (streak > 0) {
        break; // Parar quando encontrar um dia sem treino
      }
    }
    
    return streak;
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <FiActivity className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de Treinos</p>
            <p className="text-xl font-bold">{stats.totalWorkouts}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
            <FiClock className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Horas Treinadas</p>
            <p className="text-xl font-bold">{Math.round(stats.totalDuration / 60)}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
            <FiTrendingUp className="text-purple-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Exercícios</p>
            <p className="text-xl font-bold">{stats.totalExercises}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
            <FiCalendar className="text-orange-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dias Consecutivos</p>
            <p className="text-xl font-bold">{stats.streak}</p>
          </div>
        </div>
      </div>
      
      {/* Treinos recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Treinos Recentes</h2>
        
        {weeklyWorkouts.length > 0 ? (
          <div className="space-y-4">
            {weeklyWorkouts.map((workout) => (
              <Link 
                key={workout.id} 
                to={`/workout/${workout.id}`}
                className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{workout.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(workout.date)} • {workout.duration} min • {workout.exercises?.length || 0} exercícios
                    </p>
                  </div>
                  <div className="bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    {workout.type}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Você não tem treinos registrados na última semana.</p>
            <Link 
              to="/workout/new" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            >
              Criar Novo Treino
            </Link>
          </div>
        )}
      </div>
      
      {/* Próximos treinos agendados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Próximos Treinos</h2>
        
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Você não tem treinos agendados.</p>
          <Link 
            to="/schedule" 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Agendar Treino
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
