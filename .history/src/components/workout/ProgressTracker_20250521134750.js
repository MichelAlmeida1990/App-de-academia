// src/components/workout/ProgressTracker.js
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useWorkout } from '../../hooks/useWorkout';
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaChartLine, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// Componentes memoizados para os gráficos
const MemoizedBarChart = React.memo(({ data, chartStyles }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.cartesianGrid.stroke} />
      <XAxis dataKey="day" tick={{ fill: chartStyles.tick.fill }} />
      <YAxis allowDecimals={false} tick={{ fill: chartStyles.tick.fill }} />
      <Tooltip contentStyle={chartStyles.tooltip} />
      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Treinos" />
    </BarChart>
  </ResponsiveContainer>
));

const MemoizedPieChart = React.memo(({ data, chartStyles }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={chartStyles.tooltip}
        formatter={(value, name) => [`${value} treinos`, name]}
      />
      <Legend 
        formatter={(value) => <span style={{ color: chartStyles.tick.fill }}>{value}</span>}
      />
    </PieChart>
  </ResponsiveContainer>
));

const MemoizedLineChart = React.memo(({ data, chartStyles }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.cartesianGrid.stroke} />
      <XAxis dataKey="name" tick={{ fill: chartStyles.tick.fill }} />
      <YAxis allowDecimals={false} tick={{ fill: chartStyles.tick.fill }} />
      <Tooltip contentStyle={chartStyles.tooltip} />
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke="#3b82f6" 
        strokeWidth={2}
        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
        activeDot={{ r: 6, fill: "#3b82f6", stroke: chartStyles.tooltip.backgroundColor, strokeWidth: 2 }}
        name="Total de Treinos"
      />
    </LineChart>
  </ResponsiveContainer>
));

const ProgressTracker = () => {
  const { workouts, loading, getCompletedWorkouts } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  
  const [progress, setProgress] = useState({
    totalCompleted: 0,
    bodyPartDistribution: [],
    weeklyActivity: []
  });

  // Calcular métricas de progresso
  useEffect(() => {
    if (loading) return;
    
    try {
      const completedWorkouts = getCompletedWorkouts();
      
      if (!completedWorkouts || completedWorkouts.length === 0) {
        setProgress({
          totalCompleted: 0,
          bodyPartDistribution: [],
          weeklyActivity: []
        });
        return;
      }
      
      const today = new Date();
      
      // Distribuição por grupo muscular
      const bodyPartCounts = {};
      completedWorkouts.forEach(workout => {
        const category = workout.category || 'Outros';
        bodyPartCounts[category] = (bodyPartCounts[category] || 0) + 1;
      });
      
      const bodyPartDistribution = Object.entries(bodyPartCounts)
        .map(([name, value]) => ({
          name,
          value
        }))
        .sort((a, b) => b.value - a.value); // Ordenar por quantidade (maior primeiro)
      
      // Atividade semanal (últimos 7 dias)
      const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today
      });
      
      const weeklyActivity = last7Days.map(day => {
        // Filtrar os treinos para este dia específico
        const dayWorkouts = completedWorkouts.filter(workout => {
          if (!workout.completedAt) return false;
          
          // Converter para string no formato YYYY-MM-DD para comparação
          const workoutDateStr = format(new Date(workout.completedAt), 'yyyy-MM-dd');
          const dayStr = format(day, 'yyyy-MM-dd');
          
          return workoutDateStr === dayStr;
        });
        
        return {
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: dayWorkouts.length,
          isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        };
      });
      
      setProgress({
        totalCompleted: completedWorkouts.length,
        bodyPartDistribution: bodyPartDistribution,
        weeklyActivity: weeklyActivity
      });
    } catch (error) {
      console.error("Erro ao calcular progresso:", error);
      setProgress({
        totalCompleted: 0,
        bodyPartDistribution: [],
        weeklyActivity: []
      });
    }
  }, [workouts, loading, getCompletedWorkouts]);

  // Memoize os dados dos gráficos para evitar re-renderizações desnecessárias
  const memoizedWeeklyActivity = useMemo(() => progress.weeklyActivity, [progress.weeklyActivity]);
  const memoizedBodyPartDistribution = useMemo(() => progress.bodyPartDistribution, [progress.bodyPartDistribution]);
  const memoizedProgressTrend = useMemo(() => {
    // Criar dados de tendência baseados no total de treinos
    return [
      { name: '4 Semanas', value: Math.max(0, progress.totalCompleted - 12) },
      { name: '3 Semanas', value: Math.max(0, progress.totalCompleted - 8) },
      { name: '2 Semanas', value: Math.max(0, progress.totalCompleted - 5) },
      { name: '1 Semana', value: Math.max(0, progress.totalCompleted - 3) },
      { name: 'Atual', value: progress.totalCompleted }
    ];
  }, [progress.totalCompleted]);

  // Memoize os estilos baseados no tema
  const chartStyles = useMemo(() => ({
    cartesianGrid: {
      stroke: darkMode ? "#374151" : "#e5e7eb"
    },
    tooltip: {
      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
      borderColor: darkMode ? "#374151" : "#e5e7eb",
      color: darkMode ? "#f9fafb" : "#111827"
    },
    tick: {
      fill: darkMode ? "#9ca3af" : "#4b5563"
    }
  }), [darkMode]);

  if (loading) {
    return (
      <div className="card slide-in animate-pulse p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold dark:text-white">Seu Progresso</h3>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg mr-3">
              <FaTrophy className="text-purple-500 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total concluído</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{progress.totalCompleted} treinos</p>
            </div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key="charts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-500 dark:text-blue-400 mr-2" />
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Atividade Semanal</h4>
              </div>
              <div className="h-64">
                <MemoizedBarChart data={memoizedWeeklyActivity} chartStyles={chartStyles} />
              </div>
            </div>
            
            {memoizedBodyPartDistribution.length > 0 && (
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaChartLine className="text-green-500 dark:text-green-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Distribuição por Grupo Muscular</h4>
                </div>
                <div className="h-64">
                  <MemoizedPieChart data={memoizedBodyPartDistribution} chartStyles={chartStyles} />
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <FaChartLine className="text-indigo-500 dark:text-indigo-400 mr-2" />
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Tendência de Progresso</h4>
              </div>
              <div className="h-64">
                <MemoizedLineChart data={memoizedProgressTrend} chartStyles={chartStyles} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-orange-500 dark:text-orange-400 mr-2" />
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Últimos 7 Dias</h4>
              </div>
              <div className="flex justify-between space-x-2">
                {progress.weeklyActivity.map((day, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex flex-col items-center p-3 rounded-lg flex-1 ${
                      day.isToday 
                        ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                        : 'bg-gray-100 dark:bg-gray-800/50'
                    }`}
                  >
                    <p className={`text-xs font-medium ${
                      day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {day.day}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 my-1">{day.date}</p>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day.count > 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {day.count}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;
