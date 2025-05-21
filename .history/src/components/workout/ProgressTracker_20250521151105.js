// src/components/workout/ProgressTracker.js
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useWorkout } from '../../hooks/useWorkout';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, differenceInDays, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaFire, FaCalendarCheck, FaTrophy, FaChartLine, FaArrowUp, FaArrowDown, FaEquals, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// Categorias de exemplo para treinos
const WORKOUT_CATEGORIES = [
  'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Cardio', 'Outros'
];

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// Função auxiliar para tratamento consistente de datas
const parseWorkoutDate = (dateString) => {
  try {
    return new Date(dateString);
  } catch (e) {
    console.error("Data inválida:", dateString);
    return null;
  }
};

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
  const { workouts, loading } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [progress, setProgress] = useState({
    weeklyWorkouts: 0,
    weeklyGoal: 5,
    monthlyProgress: 0,
    streakDays: 0,
    totalCompleted: 0,
    weeklyTrend: 'stable',
    completionRate: 0,
    bodyPartDistribution: [],
    weeklyActivity: []
  });

  // Memoize a função getCompletedWorkouts para evitar re-renderizações
  const getCompletedWorkouts = useCallback(() => {
    if (!workouts || workouts.length === 0) return [];
    return workouts.filter(workout => workout.completed);
  }, [workouts]);

  // Memoize a data atual para garantir consistência
  const today = useMemo(() => new Date(), []);

  // Função para gerar dados de exemplo quando não há dados suficientes
  const generateDemoData = useCallback((realWorkouts) => {
    const hasRealData = realWorkouts && realWorkouts.length > 0;
    
    // Dados de atividade semanal (últimos 7 dias)
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today
    });
    
    let weeklyActivity = [];
    
    if (hasRealData) {
      // Obter todos os treinos concluídos de uma vez
      const allCompletedWorkouts = realWorkouts;
      
      weeklyActivity = last7Days.map(day => {
        // Filtrar os treinos para este dia específico
        const dayWorkouts = allCompletedWorkouts.filter(workout => {
          if (!workout.completedAt && !workout.date) return false;
          
          const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
          if (!workoutDate) return false;
          
          return workoutDate.getFullYear() === day.getFullYear() &&
                workoutDate.getMonth() === day.getMonth() &&
                workoutDate.getDate() === day.getDate();
        });
        
        return {
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: dayWorkouts.length,
          isToday: day.getDate() === today.getDate() && 
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
        };
      });
    } else {
      // Dados simulados - usando valores determinísticos em vez de aleatórios
      weeklyActivity = last7Days.map((day, index) => {
        const isToday = day.getDate() === today.getDate() && 
                         day.getMonth() === today.getMonth() &&
                         day.getFullYear() === today.getFullYear();
                         
        // Usar valor determinístico baseado no índice e no dia para evitar mudanças aleatórias
        const deterministicCount = isToday ? 1 : ((index + day.getDate()) % 2);
        
        return {
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: deterministicCount,
          isToday: isToday
        };
      });
    }
    
    // Distribuição por grupo muscular
    let bodyPartDistribution = [];
    
    if (hasRealData) {
      const bodyPartCounts = {};
      realWorkouts.forEach(workout => {
        const category = workout.category || 'Outros';
        bodyPartCounts[category] = (bodyPartCounts[category] || 0) + 1;
      });
      
      bodyPartDistribution = Object.entries(bodyPartCounts).map(([name, value]) => ({
        name,
        value
      }));
    } else {
      // Dados simulados - usando valores determinísticos
      bodyPartDistribution = WORKOUT_CATEGORIES.map((category, index) => ({
        name: category,
        // Valor determinístico baseado no índice
        value: Math.max(1, (index % 5) + 1)
      })).filter(item => item.value > 0);
    }
    
    // Calcular valores determinísticos para evitar mudanças aleatórias
    const weeklyWorkouts = hasRealData 
      ? weeklyActivity.reduce((sum, day) => sum + day.count, 0) 
      : 3;
    
    const streakDays = hasRealData 
      ? (weeklyActivity.find(d => d.isToday)?.count > 0 ? 2 : 0) 
      : 2;
    
    const totalCompleted = hasRealData 
      ? realWorkouts.length 
      : 12;
    
    const weeklyTrend = hasRealData 
      ? ['up', 'stable', 'down'][Math.floor(totalCompleted % 3)] 
      : 'up';
    
    const completionRate = hasRealData 
      ? Math.round((realWorkouts.length / (realWorkouts.length + 4)) * 100) 
      : 75;
    
    const monthlyProgress = hasRealData 
      ? Math.min(100, Math.round((weeklyWorkouts / 20) * 100)) 
      : 65;
    
    return {
      weeklyWorkouts,
      weeklyGoal: 5,
      monthlyProgress,
      streakDays,
      totalCompleted,
      weeklyTrend,
      completionRate,
      bodyPartDistribution,
      weeklyActivity
    };
  }, [today]);

  // Calcular métricas de progresso
  useEffect(() => {
    if (loading) return;
    
    try {
      const completedWorkouts = getCompletedWorkouts();
      const hasData = completedWorkouts && completedWorkouts.length > 0;
      
      // Se não houver dados suficientes, usar dados de demonstração
      if (!hasData) {
        setProgress(generateDemoData([]));
        return;
      }
      
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      const lastWeekStart = subDays(weekStart, 7);
      const lastWeekEnd = subDays(weekStart, 1);
      
      // Treinos completados esta semana
      const weeklyWorkouts = completedWorkouts.filter(workout => {
        try {
          if (!workout.completedAt && !workout.date) return false;
          
          const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
          if (!workoutDate) return false;
          
          return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
        } catch (error) {
          console.error("Erro ao processar data do treino:", error);
          return false;
        }
      });
      
      // Treinos completados semana passada
      const lastWeekWorkouts = completedWorkouts.filter(workout => {
        try {
          if (!workout.completedAt && !workout.date) return false;
          
          const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
          if (!workoutDate) return false;
          
          return isWithinInterval(workoutDate, { start: lastWeekStart, end: lastWeekEnd });
        } catch (error) {
          console.error("Erro ao processar data do treino:", error);
          return false;
        }
      });
      
      // Determinar tendência semanal
      let weeklyTrend = 'stable';
      if (weeklyWorkouts.length > lastWeekWorkouts.length) {
        weeklyTrend = 'up';
      } else if (weeklyWorkouts.length < lastWeekWorkouts.length) {
        weeklyTrend = 'down';
      }
      
      // Calcular sequência de dias
      let streakDays = 0;
      if (completedWorkouts.length > 0) {
        // Ordenar por data de conclusão
        const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
          try {
            if (!a.completedAt && !a.date) return 1;
            if (!b.completedAt && !b.date) return -1;
            
            const dateA = parseWorkoutDate(a.completedAt || a.date);
            const dateB = parseWorkoutDate(b.completedAt || b.date);
            
            if (!dateA) return 1;
            if (!dateB) return -1;
            
            return dateB - dateA; // Mais recente primeiro
          } catch (error) {
            console.error("Erro ao ordenar treinos:", error);
            return 0;
          }
        });
        
        if (sortedWorkouts[0]) {
          const latestWorkoutDate = parseWorkoutDate(sortedWorkouts[0].completedAt || sortedWorkouts[0].date);
          
          if (latestWorkoutDate) {
            // Se o último treino foi hoje ou ontem, calcular sequência
            const daysSinceLastWorkout = differenceInDays(today, latestWorkoutDate);
            
            if (daysSinceLastWorkout <= 1) {
              // Começar a contar a sequência
              let currentDate = latestWorkoutDate;
              let consecutiveDays = 1;
              
              // Verificar dias anteriores
              for (let i = 1; i < sortedWorkouts.length; i++) {
                if (!sortedWorkouts[i].completedAt && !sortedWorkouts[i].date) continue;
                
                const prevWorkoutDate = parseWorkoutDate(sortedWorkouts[i].completedAt || sortedWorkouts[i].date);
                if (!prevWorkoutDate) continue;
                
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
        }
      }
      
      // Progresso mensal (% de dias do mês com treinos concluídos)
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const currentDay = today.getDate();
      const monthlyTarget = Math.min(currentDay, daysInMonth);
      
      // Conjunto de dias únicos do mês atual com treinos
      const daysWithWorkouts = new Set();
      
      completedWorkouts.forEach(workout => {
        try {
          if (!workout.completedAt && !workout.date) return;
          
          const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
          if (!workoutDate) return;
          
          if (workoutDate.getMonth() === today.getMonth() && 
              workoutDate.getFullYear() === today.getFullYear()) {
            daysWithWorkouts.add(workoutDate.getDate());
          }
        } catch (error) {
          console.error("Erro ao processar data para progresso mensal:", error);
        }
      });
      
      const monthlyProgress = Math.round((daysWithWorkouts.size / monthlyTarget) * 100);
      
      // Taxa de conclusão (% de treinos planejados que foram concluídos)
      const allScheduledWorkouts = workouts.filter(workout => {
        try {
          if (!workout.date) return false;
          
          const workoutDate = parseWorkoutDate(workout.date);
          if (!workoutDate) return false;
          
          return workoutDate <= today;
        } catch (error) {
          console.error("Erro ao processar data para taxa de conclusão:", error);
          return false;
        }
      });
      
      const completionRate = allScheduledWorkouts.length > 0
        ? Math.round((completedWorkouts.length / allScheduledWorkouts.length) * 100)
        : 0;
      
      // Distribuição por grupo muscular
      const bodyPartCounts = {};
      completedWorkouts.forEach(workout => {
        const category = workout.category || 'Outros';
        bodyPartCounts[category] = (bodyPartCounts[category] || 0) + 1;
      });
      
      const bodyPartDistribution = Object.entries(bodyPartCounts).map(([name, value]) => ({
        name,
        value
      }));
      
      // Atividade semanal (últimos 7 dias)
      const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today
      });
      
      const weeklyActivity = last7Days.map(day => {
        // Filtrar os treinos para este dia específico
        const dayWorkouts = completedWorkouts.filter(workout => {
          try {
            if (!workout.completedAt && !workout.date) return false;
            
            const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
            if (!workoutDate) return false;
            
            return workoutDate.getFullYear() === day.getFullYear() &&
                  workoutDate.getMonth() === day.getMonth() &&
                  workoutDate.getDate() === day.getDate();
          } catch (error) {
            console.error("Erro ao processar data para atividade semanal:", error);
            return false;
          }
        });
        
        return {
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: dayWorkouts.length,
          isToday: day.getDate() === today.getDate() && 
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
        };
      });
      
      // Criar um novo array com os valores atualizados em vez de modificar diretamente
      const updatedWeeklyActivity = weeklyActivity.map(day => 
        day.isToday && day.count === 0 && !hasData 
          ? {...day, count: 1} 
          : day
      );
      
      setProgress({
        weeklyWorkouts: weeklyWorkouts.length,
        weeklyGoal: 5, // Meta semanal fixa (poderia vir das configurações do usuário)
        monthlyProgress: monthlyProgress,
        streakDays: streakDays,
        totalCompleted: completedWorkouts.length,
        weeklyTrend: weeklyTrend,
        completionRate: completionRate,
        bodyPartDistribution: bodyPartDistribution,
        weeklyActivity: updatedWeeklyActivity
      });
    } catch (error) {
      console.error("Erro ao calcular progresso:", error);
      // Em caso de erro, usar dados de demonstração
      setProgress(generateDemoData([]));
    }
  }, [workouts, loading, generateDemoData, getCompletedWorkouts, today]);

  const renderTrendIcon = () => {
    if (progress.weeklyTrend === 'up') {
      return <FaArrowUp className="text-green-500" />;
    } else if (progress.weeklyTrend === 'down') {
      return <FaArrowDown className="text-red-500" />;
    }
    return <FaEquals className="text-gray-500" />;
  };

  // Memoize os dados dos gráficos para evitar re-renderizações desnecessárias
  const memoizedWeeklyActivity = useMemo(() => progress.weeklyActivity, [progress.weeklyActivity]);
  const memoizedBodyPartDistribution = useMemo(() => progress.bodyPartDistribution, [progress.bodyPartDistribution]);
  const memoizedProgressTrend = useMemo(() => [
    { name: '4 Semanas', value: Math.max(0, progress.totalCompleted - 12) },
    { name: '3 Semanas', value: Math.max(0, progress.totalCompleted - 8) },
    { name: '2 Semanas', value: Math.max(0, progress.totalCompleted - 5) },
    { name: '1 Semana', value: Math.max(0, progress.totalCompleted - 3) },
    { name: 'Atual', value: progress.totalCompleted }
  ], [progress.totalCompleted]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
    <div className="flex space-x-2">
      <button 
        onClick={() => setActiveTab('overview')}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          activeTab === 'overview' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        Visão Geral
      </button>
      <button 
        onClick={() => setActiveTab('charts')}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          activeTab === 'charts' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        Gráficos
      </button>
    </div>
  </div>
  
  <AnimatePresence mode="wait">
    {activeTab === 'overview' ? (
      <motion.div
        key="overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg mr-3">
                <FaCalendarCheck className="text-blue-500 dark:text-blue-400 text-xl" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Treinos esta semana</p>
              <div className="ml-auto flex items-center text-sm">
                {renderTrendIcon()}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{progress.weeklyWorkouts}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">/ {progress.weeklyGoal}</span>
            </div>
            <div className="mt-3 bg-white/60 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((progress.weeklyWorkouts / progress.weeklyGoal) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-blue-500 h-2.5 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 p-5 rounded-xl border border-orange-200 dark:border-orange-800"
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg mr-3">
                <FaFire className="text-orange-500 dark:text-orange-400 text-xl" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sequência atual</p>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-orange-500 dark:text-orange-400">{progress.streakDays}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">dias consecutivos</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {progress.streakDays > 0 ? 'Continue treinando!' : 'Comece sua sequência hoje!'}
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-xl border border-green-200 dark:border-green-800 mb-6"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg mr-3">
              <FaChartLine className="text-green-500 dark:text-green-400 text-xl" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progresso mensal</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{progress.monthlyProgress}%</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress.monthlyProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-green-500 h-3 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg mr-3">
                <FaTrophy className="text-purple-500 dark:text-purple-400 text-xl" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total concluído</p>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{progress.totalCompleted}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">treinos</span>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800"
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg mr-3">
                <FaCalendarAlt className="text-indigo-500 dark:text-indigo-400 text-xl" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Taxa de conclusão</p>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{progress.completionRate}%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">dos treinos planejados</span>
            </div>
          </motion.div>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3 min-w-max">
            {progress.weeklyActivity.map((day, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col items-center p-3 rounded-lg min-w-[70px] ${
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
    ) : (
      <motion.div
        key="charts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Atividade Semanal</h4>
          <div className="h-64">
            <MemoizedBarChart data={memoizedWeeklyActivity} chartStyles={chartStyles} />
          </div>
        </div>
        
        {memoizedBodyPartDistribution.length > 0 && (
          <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Distribuição por Grupo Muscular</h4>
            <div className="h-64">
              <MemoizedPieChart data={memoizedBodyPartDistribution} chartStyles={chartStyles} />
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Tendência de Progresso</h4>
          <div className="h-64">
            <MemoizedLineChart data={memoizedProgressTrend} chartStyles={chartStyles} />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
</motion.div>

