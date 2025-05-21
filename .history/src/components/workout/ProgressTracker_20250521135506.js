// src/components/workout/ProgressTracker.js - Versão simplificada
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, parseISO, isAfter, isBefore, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FaChartLine, 
  FaDumbbell, 
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useWorkout } from '../../hooks/useWorkout';
import { ThemeContext } from '../../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const ProgressTracker = () => {
  const { workouts, loading, getCompletedWorkouts } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  const [period, setPeriod] = useState('week');
  
  // Estados para os diferentes gráficos
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [progressTrend, setProgressTrend] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  useEffect(() => {
    if (loading) return;
    
    try {
      // Obter treinos concluídos
      const completedWorkouts = getCompletedWorkouts() || [];
      
      // Processar dados para atividade semanal
      processWeeklyActivity(completedWorkouts);
      
      // Processar dados para grupos musculares
      processMuscleGroupData(completedWorkouts);
      
      // Processar dados para tendência de progresso
      processProgressTrend(completedWorkouts);
      
      // Obter treinos recentes
      processRecentWorkouts(completedWorkouts);
    } catch (error) {
      console.error("Erro ao calcular progresso:", error);
    }
  }, [workouts, loading, period, getCompletedWorkouts]);

  // Processar dados para atividade semanal
  const processWeeklyActivity = (completedWorkouts) => {
    // Criar array para os dias da semana
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weeklyData = days.map(day => ({ name: day, count: 0 }));
    
    // Filtrar treinos da última semana
    const today = new Date();
    const oneWeekAgo = subDays(today, 6);
    
    completedWorkouts.forEach(workout => {
      const workoutDate = parseISO(workout.completedAt || workout.date);
      
      if (isAfter(workoutDate, oneWeekAgo) && !isAfter(workoutDate, today)) {
        const dayIndex = workoutDate.getDay();
        weeklyData[dayIndex].count += 1;
      }
    });
    
    setWeeklyActivity(weeklyData);
  };

  // Processar dados para grupos musculares
  const processMuscleGroupData = (completedWorkouts) => {
    const muscleGroups = {};
    
    // Filtrar treinos com base no período selecionado
    const filteredWorkouts = filterWorkoutsByPeriod(completedWorkouts, period);
    
    filteredWorkouts.forEach(workout => {
      // Determinar o grupo muscular principal
      let muscleGroup = workout.category || 'Outros';
      
      // Se não houver categoria, tentar extrair do nome do treino
      if (muscleGroup === 'Outros' && workout.name) {
        const name = workout.name.toLowerCase();
        if (name.includes('peito')) muscleGroup = 'Peito';
        else if (name.includes('costa')) muscleGroup = 'Costas';
        else if (name.includes('perna')) muscleGroup = 'Pernas';
        else if (name.includes('ombro')) muscleGroup = 'Ombros';
        else if (name.includes('braço') || name.includes('bicep') || name.includes('tricep')) muscleGroup = 'Braços';
        else if (name.includes('abdom')) muscleGroup = 'Abdômen';
      }
      
      muscleGroups[muscleGroup] = (muscleGroups[muscleGroup] || 0) + 1;
    });
    
    // Converter para o formato esperado pelo gráfico
    const chartData = Object.entries(muscleGroups).map(([name, value]) => ({ name, value }));
    setMuscleGroupData(chartData);
  };

  // Processar dados para tendência de progresso
  const processProgressTrend = (completedWorkouts) => {
    // Criar dados para os últimos 7 dias
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'dd/MM');
      
      // Contar treinos neste dia
      const count = completedWorkouts.filter(workout => {
        const workoutDate = parseISO(workout.completedAt || workout.date);
        return workoutDate.getDate() === date.getDate() && 
               workoutDate.getMonth() === date.getMonth() &&
               workoutDate.getFullYear() === date.getFullYear();
      }).length;
      
      data.push({
        date: dateStr,
        treinos: count
      });
    }
    
    setProgressTrend(data);
  };

  // Processar treinos recentes
  const processRecentWorkouts = (completedWorkouts) => {
    // Ordenar por data de conclusão (mais recentes primeiro)
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
      const dateA = parseISO(a.completedAt || a.date);
      const dateB = parseISO(b.completedAt || b.date);
      return dateB - dateA;
    });
    
    // Pegar os 7 mais recentes
    setRecentWorkouts(sortedWorkouts.slice(0, 7));
  };

  // Filtrar treinos com base no período
  const filterWorkoutsByPeriod = (workouts, period) => {
    const today = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = subDays(today, 30);
        break;
      case 'year':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 7);
    }
    
    return workouts.filter(workout => {
      const workoutDate = parseISO(workout.completedAt || workout.date);
      return isAfter(workoutDate, startDate) && !isAfter(workoutDate, today);
    });
  };

  if (loading) {
    return (
      <div className="card p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaChartLine className="text-blue-500 mr-2" />
          <h3 className="text-xl font-semibold">Seu Progresso</h3>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 rounded-md text-sm ${
              period === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Semana
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              period === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Mês
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-3 py-1 rounded-md text-sm ${
              period === 'year' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Ano
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Atividade Semanal */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="font-medium mb-4">Atividade Semanal</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#FFFFFF' : '#000000',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Distribuição por Grupo Muscular */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="font-medium mb-4">Distribuição por Grupo Muscular</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#FFFFFF' : '#000000',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência de Progresso */}
      <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h4 className="font-medium mb-4">Tendência de Progresso</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
              />
              <YAxis 
                tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  color: darkMode ? '#FFFFFF' : '#000000',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="treinos" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Treinos Recentes */}
      <div className="mt-6">
        <h4 className="font-medium mb-4">Últimos 7 dias</h4>
        {recentWorkouts.length > 0 ? (
          <div className="space-y-3">
            {recentWorkouts.map((workout, index) => (
              <div 
                key={index}
                className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <FaDumbbell className="text-blue-500" />
                  </div>
                  <div>
                    <h5 className="font-medium">{workout.name || 'Treino sem nome'}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(parseISO(workout.completedAt || workout.date), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                  Concluído
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FaCalendarAlt className="mx-auto text-gray-400 text-4xl mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Nenhum treino concluído nos últimos 7 dias</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
