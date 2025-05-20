// src/components/workout/ProgressTracker.js (Aprimorado)
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useWorkout } from '../../hooks/useWorkout';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, differenceInDays, eachDayOfInterval, subDays, addDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaFire, FaCalendarCheck, FaTrophy, FaChartLine, FaArrowUp, FaArrowDown, FaEquals, FaCalendarAlt, FaChartBar, FaChartPie, FaChartArea, FaFilter, FaDownload, FaShare } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ComposedChart, Scatter, ScatterChart, ZAxis, Brush, ReferenceLine
} from 'recharts';

// Categorias de exemplo para treinos
const WORKOUT_CATEGORIES = [
  'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Cardio', 'Outros'
];

// Períodos de tempo disponíveis
const TIME_PERIODS = [
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'quarter', label: 'Trimestre' },
  { id: 'year', label: 'Ano' },
  { id: 'all', label: 'Todo histórico' }
];

// Métricas disponíveis para visualização
const METRICS = [
  { id: 'frequency', label: 'Frequência', color: '#3b82f6' },
  { id: 'volume', label: 'Volume', color: '#10b981' },
  { id: 'intensity', label: 'Intensidade', color: '#f97316' },
  { id: 'duration', label: 'Duração', color: '#8b5cf6' },
  { id: 'progress', label: 'Progresso', color: '#ec4899' }
];

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

// Novos componentes de gráficos avançados
const MemoizedAreaChart = React.memo(({ data, chartStyles, metric }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={METRICS.find(m => m.id === metric)?.color || "#3b82f6"} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={METRICS.find(m => m.id === metric)?.color || "#3b82f6"} stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.cartesianGrid.stroke} />
      <XAxis dataKey="date" tick={{ fill: chartStyles.tick.fill }} />
      <YAxis tick={{ fill: chartStyles.tick.fill }} />
      <Tooltip contentStyle={chartStyles.tooltip} />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke={METRICS.find(m => m.id === metric)?.color || "#3b82f6"} 
        fillOpacity={1} 
        fill="url(#colorMetric)" 
        name={METRICS.find(m => m.id === metric)?.label || "Valor"}
      />
      <Brush dataKey="date" height={30} stroke={chartStyles.cartesianGrid.stroke} />
    </AreaChart>
  </ResponsiveContainer>
));

const MemoizedRadarChart = React.memo(({ data, chartStyles }) => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid stroke={chartStyles.cartesianGrid.stroke} />
      <PolarAngleAxis dataKey="category" tick={{ fill: chartStyles.tick.fill }} />
      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: chartStyles.tick.fill }} />
      <Radar 
        name="Atual" 
        dataKey="current" 
        stroke="#3b82f6" 
        fill="#3b82f6" 
        fillOpacity={0.6} 
      />
      <Radar 
        name="Anterior" 
        dataKey="previous" 
        stroke="#10b981" 
        fill="#10b981" 
        fillOpacity={0.3} 
      />
      <Legend formatter={(value) => <span style={{ color: chartStyles.tick.fill }}>{value}</span>} />
      <Tooltip contentStyle={chartStyles.tooltip} />
    </RadarChart>
  </ResponsiveContainer>
));

const MemoizedComposedChart = React.memo(({ data, chartStyles }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.cartesianGrid.stroke} />
      <XAxis dataKey="date" tick={{ fill: chartStyles.tick.fill }} />
      <YAxis yAxisId="left" orientation="left" tick={{ fill: chartStyles.tick.fill }} />
      <YAxis yAxisId="right" orientation="right" tick={{ fill: chartStyles.tick.fill }} />
      <Tooltip contentStyle={chartStyles.tooltip} />
      <Legend formatter={(value) => <span style={{ color: chartStyles.tick.fill }}>{value}</span>} />
      <Bar yAxisId="left" dataKey="frequency" name="Frequência" fill="#3b82f6" />
      <Line yAxisId="right" type="monotone" dataKey="progress" name="Progresso" stroke="#ec4899" strokeWidth={2} />
      <Area yAxisId="right" type="monotone" dataKey="volume" name="Volume" fill="#10b981" fillOpacity={0.3} stroke="#10b981" />
    </ComposedChart>
  </ResponsiveContainer>
));

const MemoizedScatterChart = React.memo(({ data, chartStyles }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ScatterChart
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.cartesianGrid.stroke} />
      <XAxis 
        type="number" 
        dataKey="intensity" 
        name="Intensidade" 
        tick={{ fill: chartStyles.tick.fill }}
        domain={['dataMin - 1', 'dataMax + 1']}
      />
      <YAxis 
        type="number" 
        dataKey="volume" 
        name="Volume" 
        tick={{ fill: chartStyles.tick.fill }}
        domain={['dataMin - 10', 'dataMax + 10']}
      />
      <ZAxis 
        type="number" 
        dataKey="duration" 
        range={[50, 400]} 
        name="Duração"
      />
      <Tooltip 
        contentStyle={chartStyles.tooltip}
        cursor={{ strokeDasharray: '3 3' }}
        formatter={(value, name) => {
          return [`${value} ${name === 'Intensidade' ? 'pontos' : name === 'Volume' ? 'kg' : 'min'}`, name];
        }}
      />
      <Legend formatter={(value) => <span style={{ color: chartStyles.tick.fill }}>{value}</span>} />
      <Scatter 
        name="Treinos" 
        data={data} 
        fill="#8884d8"
        shape="circle"
      />
    </ScatterChart>
  </ResponsiveContainer>
));

const ProgressTracker = () => {
  const { workouts, loading, getCompletedWorkouts } = useWorkout();
  const { darkMode, shouldAnimate, accentColor } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [advancedTab, setAdvancedTab] = useState('frequency');
  const [timePeriod, setTimePeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('frequency');
  const [chartType, setChartType] = useState('line');
  const [showFilters, setShowFilters] = useState(false);
  
  const [progress, setProgress] = useState({
    weeklyWorkouts: 0,
    weeklyGoal: 5,
    monthlyProgress: 0,
    streakDays: 0,
    totalCompleted: 0,
    weeklyTrend: 'stable',
    completionRate: 0,
    bodyPartDistribution: [],
    weeklyActivity: [],
    advancedMetrics: {
      frequency: [],
      volume: [],
      intensity: [],
      duration: [],
      progress: []
    },
    comparisonData: [],
    scatterData: []
  });

  // Função para gerar dados de exemplo quando não há dados suficientes
  const generateDemoData = useCallback((realWorkouts) => {
    const today = new Date();
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
          if (!workout.completedAt) return false;
          
          const workoutDate = new Date(workout.completedAt);
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
      // Dados simulados
      weeklyActivity = last7Days.map(day => {
        return {
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: Math.floor(Math.random() * 2), // 0 ou 1 treino por dia
          isToday: day.getDate() === today.getDate() && 
                   day.getMonth() === today.getMonth() &&
                   day.getFullYear() === today.getFullYear()
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
      // Dados simulados
      bodyPartDistribution = WORKOUT_CATEGORIES.map(category => ({
        name: category,
        value: Math.floor(Math.random() * 5) + (category === 'Outros' ? 0 : 1) // 1-5 treinos por categoria
      })).filter(item => item.value > 0);
    }

    // Gerar dados avançados simulados para os gráficos
    const last30Days = eachDayOfInterval({
      start: subDays(today, 29),
      end: today
    });

    // Dados para o gráfico de área
    const frequencyData = last30Days.map(day => {
      const randomValue = Math.floor(Math.random() * 3);
      return {
        date: format(day, 'dd/MM'),
        value: randomValue,
        fullDate: day
      };
    });

    // Dados para o gráfico de volume
    const volumeData = last30Days.map(day => {
      // Simular um padrão de aumento gradual com algumas flutuações
      const dayIndex = differenceInDays(day, subDays(today, 29));
      const trendValue = 100 + (dayIndex * 2); // Tendência de aumento
      const randomVariation = Math.floor(Math.random() * 30) - 15; // Variação aleatória
      return {
        date: format(day, 'dd/MM'),
        value: Math.max(0, trendValue + randomVariation),
        fullDate: day
      };
    });

    // Dados para o gráfico de intensidade
    const intensityData = last30Days.map(day => {
      // Simular um padrão de aumento gradual com algumas flutuações
      const dayIndex = differenceInDays(day, subDays(today, 29));
      const baseValue = 5 + (dayIndex * 0.1); // Tendência de aumento leve
      const randomVariation = (Math.random() * 2) - 1; // Variação aleatória
      return {
        date: format(day, 'dd/MM'),
        value: Math.max(1, Math.min(10, baseValue + randomVariation)).toFixed(1),
        fullDate: day
      };
    });

    // Dados para o gráfico de duração
    const durationData = last30Days.map(day => {
      // Simular duração variável de treinos
      const baseValue = 45; // Duração média de 45 minutos
      const randomVariation = Math.floor(Math.random() * 30) - 10; // Variação aleatória
      return {
        date: format(day, 'dd/MM'),
        value: Math.max(15, baseValue + randomVariation),
        fullDate: day
      };
    });

    // Dados para o gráfico de progresso
    const progressData = last30Days.map(day => {
      // Simular progresso com tendência de aumento
      const dayIndex = differenceInDays(day, subDays(today, 29));
      const baseValue = 100 + (dayIndex * 1.5); // Tendência de aumento
      const randomVariation = Math.floor(Math.random() * 20) - 10; // Variação aleatória
      return {
        date: format(day, 'dd/MM'),
        value: Math.max(80, baseValue + randomVariation),
        fullDate: day
      };
    });

    // Dados para o gráfico de radar (comparação)
    const comparisonData = [
      { category: 'Força', current: 8, previous: 6 },
      { category: 'Resistência', current: 7, previous: 5 },
      { category: 'Velocidade', current: 5, previous: 4 },
      { category: 'Flexibilidade', current: 6, previous: 5 },
      { category: 'Equilíbrio', current: 7, previous: 6 },
      { category: 'Coordenação', current: 8, previous: 7 }
    ];

    // Dados para o gráfico de dispersão (scatter)
    const scatterData = [];
    for (let i = 0; i < 15; i++) {
      scatterData.push({
        intensity: Math.floor(Math.random() * 8) + 3, // Intensidade entre 3-10
        volume: Math.floor(Math.random() * 100) + 50, // Volume entre 50-150
        duration: Math.floor(Math.random() * 60) + 30, // Duração entre 30-90 minutos
        name: `Treino ${i + 1}`
      });
    }

    // Dados para o gráfico composto
    const composedData = last30Days.filter((_, index) => index % 3 === 0).map(day => {
      return {
        date: format(day, 'dd/MM'),
        frequency: Math.floor(Math.random() * 3),
        volume: Math.floor(Math.random() * 100) + 50,
        progress: Math.floor(Math.random() * 20) + 80
      };
    });
    
    return {
      weeklyWorkouts: hasRealData ? weeklyActivity.reduce((sum, day) => sum + day.count, 0) : 3,
      weeklyGoal: 5,
      monthlyProgress: hasRealData ? Math.min(100, Math.round((weeklyActivity.reduce((sum, day) => sum + day.count, 0) / 20) * 100)) : 65,
      streakDays: hasRealData ? (weeklyActivity[6].count > 0 ? Math.floor(Math.random() * 5) + 1 : 0) : 2,
      totalCompleted: hasRealData ? realWorkouts.length : 12,
      weeklyTrend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)],
      completionRate: hasRealData ? Math.round((realWorkouts.length / (realWorkouts.length + Math.floor(Math.random() * 5))) * 100) : 75,
      bodyPartDistribution,
      weeklyActivity,
      advancedMetrics: {
        frequency: frequencyData,
        volume: volumeData,
        intensity: intensityData,
        duration: durationData,
        progress: progressData
      },
      comparisonData,
      scatterData,
      composedData
    };
  }, []);

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
      
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      const lastWeekStart = subDays(weekStart, 7);
      const lastWeekEnd = subDays(weekStart, 1);
      
      // Treinos completados esta semana
      const weeklyWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = parseISO(workout.completedAt || workout.date);
        return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
      });
      
      // Treinos completados semana passada
      const lastWeekWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = parseISO(workout.completedAt || workout.date);
        return isWithinInterval(workoutDate, { start: lastWeekStart, end: lastWeekEnd });
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
      
      // Taxa de conclusão (% de treinos planejados que foram concluídos)
      const allScheduledWorkouts = workouts.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return workoutDate <= today;
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
      
      // CORREÇÃO: Obter todos os treinos concluídos de uma vez
      const allCompletedWorkouts = completedWorkouts;
      
      const weeklyActivity = last7Days.map(day => {
        // Filtrar os treinos para este dia específico
        const dayWorkouts = allCompletedWorkouts.filter(workout => {
          if (!workout.completedAt) return false;
          
          const workoutDate = new Date(workout.completedAt);
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

      // Gerar dados avançados para os gráficos
      // Como não temos dados reais suficientes, usamos o gerador de dados de demonstração
      // mas mantemos os dados básicos que calculamos acima
      const demoData = generateDemoData(completedWorkouts);
      
      setProgress({
        weeklyWorkouts: weeklyWorkouts.length,
        weeklyGoal: 5, // Meta semanal fixa (poderia vir das configurações do usuário)
        monthlyProgress: monthlyProgress,
        streakDays: streakDays,
        totalCompleted: completedWorkouts.length,
        weeklyTrend: weeklyTrend,
        completionRate: completionRate,
        bodyPartDistribution: bodyPartDistribution,
        weeklyActivity: weeklyActivity,
        // Usar dados avançados do gerador de demonstração
        advancedMetrics: demoData.advancedMetrics,
        comparisonData: demoData.comparisonData,
        scatterData: demoData.scatterData,
        composedData: demoData.composedData
      });
    } catch (error) {
      console.error("Erro ao calcular progresso:", error);
      // Em caso de erro, usar dados de demonstração
      setProgress(generateDemoData([]));
    }
  }, [workouts, loading, generateDemoData, getCompletedWorkouts]);

  const renderTrendIcon = () => {
    if (progress.weeklyTrend === 'up') {
      return <FaArrowUp className="text-green-500" />;
    } else if (progress.weeklyTrend === 'down') {
      return <FaArrowDown className="text-re
