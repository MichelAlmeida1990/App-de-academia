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
  
  // Memoize os dados avançados
  const memoizedAdvancedData = useMemo(() => {
    if (!progress.advancedMetrics) return {};
    return {
      frequency: progress.advancedMetrics.frequency || [],
      volume: progress.advancedMetrics.volume || [],
      intensity: progress.advancedMetrics.intensity || [],
      duration: progress.advancedMetrics.duration || [],
      progress: progress.advancedMetrics.progress || []
    };
  }, [progress.advancedMetrics]);

  const memoizedComparisonData = useMemo(() => progress.comparisonData || [], [progress.comparisonData]);
  const memoizedScatterData = useMemo(() => progress.scatterData || [], [progress.scatterData]);
  const memoizedComposedData = useMemo(() => progress.composedData || [], [progress.composedData]);

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

  // Função para exportar dados
  const handleExportData = () => {
    try {
      const dataToExport = {
        summary: {
          weeklyWorkouts: progress.weeklyWorkouts,
          weeklyGoal: progress.weeklyGoal,
          monthlyProgress: progress.monthlyProgress,
          streakDays: progress.streakDays,
          totalCompleted: progress.totalCompleted,
          completionRate: progress.completionRate
        },
        weeklyActivity: progress.weeklyActivity,
        bodyPartDistribution: progress.bodyPartDistribution,
        advancedMetrics: progress.advancedMetrics
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `workout-progress-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      // Feedback ao usuário
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Ocorreu um erro ao exportar os dados.');
    }
  };

  // Função para compartilhar progresso
  const handleShareProgress = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Meu Progresso de Treino',
          text: `Concluí ${progress.totalCompleted} treinos com taxa de conclusão de ${progress.completionRate}%!`,
          url: window.location.href,
        });
      } else {
        // Fallback para navegadores que não suportam Web Share API
        const shareText = `Concluí ${progress.totalCompleted} treinos com taxa de conclusão de ${progress.completionRate}%!`;
        navigator.clipboard.writeText(shareText);
        alert('Texto copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Não foi possível compartilhar o progresso.');
    }
  };

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
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'advanced' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Avançado
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
          ) : activeTab === 'charts' ? (
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
          ) : (
            <motion.div
              key="advanced"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Cabeçalho com filtros e controles */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
                <div className="flex flex-wrap gap-2">
                  {/* Seletor de período */}
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                  >
                    {TIME_PERIODS.map(period => (
                      <option key={period.id} value={period.id}>{period.label}</option>
                    ))}
                  </select>
                  
                  {/* Botão de filtros */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center gap-1"
                  >
                    <FaFilter className="text-gray-500 dark:text-gray-400" />
                    <span>Filtros</span>
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {/* Botões de exportar e compartilhar */}
                  <button
                    onClick={handleExportData}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center gap-1"
                  >
                    <FaDownload className="text-gray-500 dark:text-gray-400" />
                    <span>Exportar</span>
                  </button>
                  
                  <button
                    onClick={handleShareProgress}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white flex items-center gap-1"
                  >
                    <FaShare className="text-white" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
              
              {/* Painel de filtros (condicional) */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Filtros</h4>
                    <div className="flex flex-wrap gap-3">
                      {/* Filtros para métricas */}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Métricas</p>
                        <div className="flex flex-wrap gap-2">
                          {METRICS.map(metric => (
                            <button
                              key={metric.id}
                              onClick={() => setSelectedMetric(metric.id)}
                              className={`px-2 py-1 text-xs rounded-full ${
                                selectedMetric === metric.id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {metric.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Filtros para tipos de gráfico */}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tipo de Gráfico</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setChartType('line')}
                            className={`px-2 py-1 text-xs rounded-full ${
                              chartType === 'line'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Linha
                          </button>
                          <button
                            onClick={() => setChartType('bar')}
                            className={`px-2 py-1 text-xs rounded-full ${
                              chartType === 'bar'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Barras
                          </button>
                          <button
                            onClick={() => setChartType('area')}
                            className={`px-2 py-1 text-xs rounded-full ${
                              chartType === 'area'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Área
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Abas para diferentes visualizações avançadas */}
              <div className="flex overflow-x-auto pb-2 mb-2 gap-2">
                <button
                  onClick={() => setAdvancedTab('frequency')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${
                    advancedTab === 'frequency'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Frequência
                </button>
                <button
                  onClick={() => setAdvancedTab('metrics')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${
                    advancedTab === 'metrics'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Métricas
                </button>
                <button
                  onClick={() => setAdvancedTab('comparison')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${
                    advancedTab === 'comparison'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Comparação
                </button>
                <button
                  onClick={() => setAdvancedTab('correlation')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${
                    advancedTab === 'correlation'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Correlação
                </button>
                <button
                  onClick={() => setAdvancedTab('combined')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap ${
                    advancedTab === 'combined'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Combinado
                </button>
              </div>
              
              {/* Conteúdo das abas avançadas */}
              <AnimatePresence mode="wait">
                {advancedTab === 'frequency' && (
                  <motion.div
                    key="frequency"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Frequência de Treinos</h4>
                      <div className="h-80">
                        <MemoizedAreaChart 
                          data={memoizedAdvancedData.frequency} 
                          chartStyles={chartStyles}

