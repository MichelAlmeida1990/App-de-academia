import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, eachDayOfInterval, subDays, startOfWeek, endOfWeek, isWithinInterval, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaChartBar, FaCalendarAlt, FaFire, FaTrophy, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { WorkoutContext } from '../contexts/WorkoutContext';
import { ThemeContext } from '../contexts/ThemeContext';
import MemoizedBarChart from './charts/BarChart';
import MemoizedPieChart from './charts/PieChart';
import MemoizedLineChart from './charts/LineChart';
import CircularProgressBar from './CircularProgressBar';
import LoadingSpinner from './LoadingSpinner';

const ProgressTracker = () => {
  const { darkMode } = useContext(ThemeContext);
  const { 
    workouts, 
    getCompletedWorkouts, 
    getMuscleGroupStats, 
    getWorkoutStatsByPeriod 
  } = useContext(WorkoutContext);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
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

  // Função corrigida para obter a data atual correta
  const getToday = useCallback(() => {
    // Obter a data e hora atual do sistema
    const now = new Date();
    
    // Imprimir a data bruta para diagnóstico
    console.log(`Data bruta do sistema: ${now.toString()}`);
    console.log(`Data formatada: ${format(now, 'dd/MM/yyyy HH:mm:ss')}`);
    
    // Criar uma nova data apenas com ano, mês e dia (sem horas)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    console.log(`Data ajustada para início do dia: ${format(today, 'dd/MM/yyyy')}`);
    
    return today;
  }, []);

  // Obter a data atual
  const today = getToday();

  // Função para verificar se uma data é hoje
  const isToday = useCallback((date) => {
    const currentDay = getToday();
    return date.getDate() === currentDay.getDate() && 
           date.getMonth() === currentDay.getMonth() &&
           date.getFullYear() === currentDay.getFullYear();
  }, [getToday]);

  // Função para converter datas de string para objetos Date
  const parseWorkoutDate = useCallback((dateString) => {
    if (!dateString) return null;
    
    try {
      // Tentar como ISO string primeiro
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
      
      // Tentar como formato específico se falhar
      return parseISO(dateString);
    } catch (error) {
      console.error("Erro ao analisar data:", dateString, error);
      return null;
    }
  }, []);

  // Calcular métricas de progresso
  useEffect(() => {
    setLoading(true);
    
    try {
      console.log("Processando dados de progresso...");
      
      // Usar a função do contexto para obter treinos completados
      const completedWorkouts = getCompletedWorkouts();
      console.log(`Treinos completados processados: ${completedWorkouts.length}`);
      
      // Se não houver dados, inicializar com zeros
      if (!completedWorkouts || completedWorkouts.length === 0) {
        console.log("Nenhum treino completado encontrado, inicializando com zeros");
        
        // Valores iniciais zerados
        const initialValues = {
          weeklyWorkouts: 0,
          weeklyGoal: 5,
          monthlyProgress: 0,
          streakDays: 0,
          totalCompleted: 0,
          weeklyTrend: 'stable',
          completionRate: 0,
          bodyPartDistribution: [],
          weeklyActivity: []
        };
        
        // Gerar dados de atividade semanal vazios
        const last7Days = eachDayOfInterval({
          start: subDays(today, 6),
          end: today
        });
        
        initialValues.weeklyActivity = last7Days.map((day) => {
          // Verificar explicitamente se este dia é hoje
          const dayIsToday = day.getDate() === today.getDate() && 
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear();
                            
          console.log(`Dia ${format(day, 'dd/MM/yyyy')} é hoje? ${dayIsToday}`);
          
          return {
            date: format(day, 'dd/MM'),
            day: format(day, 'EEE', { locale: ptBR }),
            count: 0,
            isToday: dayIsToday
          };
        });
        
        setProgress(initialValues);
        setLoading(false);
        return;
      }
      
      // Calcular estatísticas com base nos treinos reais
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      const lastWeekStart = subDays(weekStart, 7);
      const lastWeekEnd = subDays(weekStart, 1);
      
      // Obter treinos da semana atual usando a função do contexto
      const weeklyWorkouts = getWorkoutStatsByPeriod('week');
      
      // Treinos completados semana passada (implementação manual, pois o contexto não tem função específica)
      const lastWeekWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
        return workoutDate && isWithinInterval(workoutDate, { start: lastWeekStart, end: lastWeekEnd });
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
        // Ordenar por data de conclusão (mais recente primeiro)
        const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
          const dateA = parseWorkoutDate(a.completedAt || a.date);
          const dateB = parseWorkoutDate(b.completedAt || b.date);
          
          if (!dateA || !dateB) return 0;
          return dateB.getTime() - dateA.getTime();
        });
        
        // Verificar se o treino mais recente foi hoje ou ontem
        if (sortedWorkouts[0]) {
          const latestWorkoutDate = parseWorkoutDate(sortedWorkouts[0].completedAt || sortedWorkouts[0].date);
          
          if (latestWorkoutDate) {
            const daysSinceLastWorkout = differenceInDays(today, latestWorkoutDate);
            
            if (daysSinceLastWorkout <= 1) {
              // Contar dias consecutivos
              let currentDate = latestWorkoutDate;
              let consecutiveDays = 1;
              
              // Agrupar treinos por dia
              const workoutsByDay = {};
              
              sortedWorkouts.forEach(workout => {
                const date = parseWorkoutDate(workout.completedAt || workout.date);
                if (!date) return;
                
                const dateKey = format(date, 'yyyy-MM-dd');
                workoutsByDay[dateKey] = true;
              });
              
              // Verificar dias consecutivos
              for (let i = 1; i <= 30; i++) {
                const prevDate = subDays(latestWorkoutDate, i);
                const dateKey = format(prevDate, 'yyyy-MM-dd');
                
                if (workoutsByDay[dateKey]) {
                  consecutiveDays++;
                } else {
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
        const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
        
        if (workoutDate && 
            workoutDate.getMonth() === today.getMonth() && 
            workoutDate.getFullYear() === today.getFullYear()) {
          daysWithWorkouts.add(workoutDate.getDate());
        }
      });
      
      const monthlyProgress = Math.round((daysWithWorkouts.size / monthlyTarget) * 100);
      
      // Taxa de conclusão (% de treinos planejados que foram concluídos)
      const allScheduledWorkouts = workouts.filter(workout => {
        const workoutDate = parseWorkoutDate(workout.date);
        return workoutDate && workoutDate <= today;
      });
      
      const completionRate = allScheduledWorkouts.length > 0
        ? Math.round((completedWorkouts.length / allScheduledWorkouts.length) * 100)
        : 0;
      
      // Usar a função do contexto para obter distribuição por grupo muscular
      const bodyPartDistribution = getMuscleGroupStats('all');
      
      // Atividade semanal (últimos 7 dias)
      const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today
      });
      
      const weeklyActivity = last7Days.map(day => {
        // Contar treinos para este dia
        const dayWorkouts = completedWorkouts.filter(workout => {
          const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
          
          if (!workoutDate) return false;
          
          return workoutDate.getDate() === day.getDate() &&
                 workoutDate.getMonth() === day.getMonth() &&
                 workoutDate.getFullYear() === day.getFullYear();
        });
        
        // Verificar explicitamente se este dia é hoje
        const dayIsToday = day.getDate() === today.getDate() && 
                          day.getMonth() === today.getMonth() &&
                          day.getFullYear() === today.getFullYear();
        
        console.log(`Dia ${format(day, 'dd/MM/yyyy')} é hoje? ${dayIsToday}`);
        
        return {
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: dayWorkouts.length,
          isToday: dayIsToday
        };
      });
      
      // Atualizar o estado com os dados calculados
      setProgress({
        weeklyWorkouts: weeklyWorkouts.length,
        weeklyGoal: 5,
        monthlyProgress,
        streakDays,
        totalCompleted: completedWorkouts.length,
        weeklyTrend,
        completionRate,
        bodyPartDistribution,
        weeklyActivity
      });
      
    } catch (error) {
      console.error("Erro ao processar dados de progresso:", error);
      
      // Em caso de erro, inicializar com zeros
      setProgress({
        weeklyWorkouts: 0,
        weeklyGoal: 5,
        monthlyProgress: 0,
        streakDays: 0,
        totalCompleted: 0,
        weeklyTrend: 'stable',
        completionRate: 0,
        bodyPartDistribution: [],
        weeklyActivity: eachDayOfInterval({
          start: subDays(today, 6),
          end: today
        }).map((day) => ({
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: 0,
          isToday: day.getDate() === today.getDate() && 
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
        }))
      });
    } finally {
      setLoading(false);
    }
  }, [workouts, getCompletedWorkouts, getMuscleGroupStats, getWorkoutStatsByPeriod, parseWorkoutDate, today]);

  // Dados memoizados para os gráficos
  const memoizedWeeklyActivity = useMemo(() => {
    return progress.weeklyActivity.map(day => ({
      name: day.day,
      value: day.count
    }));
  }, [progress.weeklyActivity]);

  const memoizedBodyPartDistribution = useMemo(() => {
    return progress.bodyPartDistribution.map(item => ({
      name: item.name,
      value: item.count
    }));
  }, [progress.bodyPartDistribution]);

  const memoizedProgressTrend = useMemo(() => {
    // Dados de exemplo para o gráfico de tendência
    // Na implementação real, isso seria calculado com base nos dados reais
    return [
      { name: 'Semana 1', value: 3 },
      { name: 'Semana 2', value: 4 },
      { name: 'Semana 3', value: 2 },
      { name: 'Semana 4', value: 5 }
    ];
  }, []);

  // Estilos para os gráficos baseados no tema
  const chartStyles = useMemo(() => ({
    textColor: darkMode ? '#e5e7eb' : '#374151',
    gridColor: darkMode ? '#4b5563' : '#e5e7eb',
    tooltipBg: darkMode ? '#1f2937' : '#ffffff',
    colors: [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ]
  }), [darkMode]);

  // Renderizar o componente de carregamento se os dados estiverem sendo carregados
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
    >
      <h3 className="text-xl font-bold mb-4 dark:text-white">Progresso do Treino</h3>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <FaCalendarAlt className="mr-2" />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'charts'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <FaChartBar className="mr-2" />
          Gráficos
        </button>
      </div>
      
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Treinos Semanais</h4>
                      <p className="text-2xl font-bold mt-1 dark:text-white">{progress.weeklyWorkouts}/{progress.weeklyGoal}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      progress.weeklyTrend === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
                      progress.weeklyTrend === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {progress.weeklyTrend === 'up' ? (
                        <FaArrowUp className="text-green-600 dark:text-green-400" />
                      ) : progress.weeklyTrend === 'down' ? (
                        <FaArrowDown className="text-red-600 dark:text-red-400" />
                      ) : (
                        <FaMinus className="text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (progress.weeklyWorkouts / progress.weeklyGoal) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {progress.weeklyTrend === 'up' ? 'Melhor que semana passada' :
                     progress.weeklyTrend === 'down' ? 'Pior que semana passada' :
                     'Mesmo que semana passada'}
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Progresso Mensal</h4>
                      <p className="text-2xl font-bold mt-1 dark:text-white">{progress.monthlyProgress}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <CircularProgressBar 
                      percentage={progress.monthlyProgress} 
                      size={60} 
                      strokeWidth={5} 
                      circleColor={darkMode ? "#1e40af" : "#3b82f6"}
                      textColor={darkMode ? "#e5e7eb" : "#374151"}
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sequência</h4>
                      <p className="text-2xl font-bold mt-1 dark:text-white">{progress.streakDays} dias</p>
                    </div>
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <FaFire className="text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {progress.streakDays > 0 
                      ? `Mantenha o ritmo! ${progress.streakDays} ${progress.streakDays === 1 ? 'dia' : 'dias'} seguidos.` 
                      : 'Comece sua sequência hoje!'}
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Conclusão</h4>
                      <p className="text-2xl font-bold mt-1 dark:text-white">{progress.completionRate}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <FaTrophy className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-4">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${progress.completionRate}%` }}
                    ></div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h4 className="text-lg font-semibold mb-3 dark:text-white">Atividade Semanal</h4>
                <div className="flex justify-between mt-4">
                  {progress.weeklyActivity.map((day, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col items-center"
                    >
                      <p className={`text-xs font-medium uppercase ${
                        day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>{day.day}</p>
                      <p className="text-sm font-medium mt-1">{day.date}</p>
                      <div className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center ${
                        day.count > 0 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {day.count}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="charts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-lg font-semibold mb-3 dark:text-white">Atividade Semanal</h4>
                  <div className="h-64">
                    <MemoizedBarChart data={memoizedWeeklyActivity} chartStyles={chartStyles} />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-lg font-semibold mb-3 dark:text-white">Grupos Musculares</h4>
                  <div className="h-64">
                    {memoizedBodyPartDistribution.length > 0 ? (
                      <MemoizedPieChart data={memoizedBodyPartDistribution} chartStyles={chartStyles} />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          Nenhum dado disponível
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h4 className="text-lg font-semibold mb-3 dark:text-white">Tendência de Progresso</h4>
                <div className="h-64">
                  <MemoizedLineChart data={memoizedProgressTrend} chartStyles={chartStyles} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <FaTrophy className="text-yellow-500" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total de treinos concluídos: <span className="font-semibold">{progress.totalCompleted}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;
