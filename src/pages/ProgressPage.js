import React, { useState, useEffect } from 'react';
import {
  FaChartLine,
  FaHistory,
  FaTrophy,
  FaBullseye,
  FaDumbbell,
  FaFire,
  FaClock,
  FaWeight,
  FaCalendarAlt,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressPage = () => {
  const { 
    workouts, 
    getCompletedWorkouts, 
    getWorkoutStatsByPeriod, 
    getGeneralStats 
  } = useWorkout();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPeriod, setFilterPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalCalories: 0,
    totalTime: 0,
    currentStreak: 0,
    activeDays: 0
  });
  const [completionRate, setCompletionRate] = useState(0);
  const itemsPerPage = 5;

  // Carregar dados reais
  useEffect(() => {
    if (workouts) {
      const completed = getCompletedWorkouts();
      const generalStats = getGeneralStats('month');
      
      // Calcular sequência atual
      const calculateStreak = () => {
        const completedDates = completed
          .filter(w => w.completedAt)
          .map(w => new Date(w.completedAt).toDateString())
          .sort()
          .reverse();
        
        if (completedDates.length === 0) return 0;
        
        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (completedDates[0] === today || completedDates[0] === yesterday) {
          streak = 1;
          for (let i = 1; i < completedDates.length; i++) {
            const currentDate = new Date(completedDates[i-1]);
            const previousDate = new Date(completedDates[i]);
            const dayDiff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
            
            if (dayDiff === 1) {
              streak++;
            } else {
              break;
            }
          }
        }
        return streak;
      };

      // Calcular dias ativos no mês
      const calculateActiveDays = () => {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        return completed.filter(w => {
          if (!w.completedAt) return false;
          const workoutDate = new Date(w.completedAt);
          return workoutDate.getMonth() === thisMonth && workoutDate.getFullYear() === thisYear;
        }).length;
      };

      // Calcular calorias estimadas
      const estimatedCalories = completed.reduce((total, workout) => {
        // Estimativa: ~10 calorias por minuto de treino
        const duration = workout.duration || (workout.exercises?.length * 5) || 30;
        return total + (duration * 10);
      }, 0);

      setStats({
        totalWorkouts: workouts.length,
        completedWorkouts: completed.length,
        totalCalories: estimatedCalories,
        totalTime: generalStats.totalMinutes,
        currentStreak: calculateStreak(),
        activeDays: calculateActiveDays()
      });

      setCompletionRate(workouts.length > 0 ? Math.round((completed.length / workouts.length) * 100) : 0);
    }
  }, [workouts, getCompletedWorkouts, getGeneralStats]);

  // Gerar dados do gráfico baseados nos treinos reais
  const generateChartData = () => {
    if (!workouts) return { labels: [], datasets: [] };
    
    const completed = getCompletedWorkouts();
    const last7Days = [];
    const workoutCounts = [];
    const calorieEstimates = [];
    
    // Criar array dos últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    last7Days.forEach(day => {
      const dayString = day.toDateString();
      const workoutsOnDay = completed.filter(w => {
        if (!w.completedAt) return false;
        return new Date(w.completedAt).toDateString() === dayString;
      });
      
      workoutCounts.push(workoutsOnDay.length);
      
      // Estimar calorias do dia (10 cal/min de treino)
      const dayCalories = workoutsOnDay.reduce((total, workout) => {
        const duration = workout.duration || (workout.exercises?.length * 5) || 30;
        return total + (duration * 10);
      }, 0);
      
      calorieEstimates.push(dayCalories / 100); // Dividir por 100 para escala do gráfico
    });
    
    return {
      labels: last7Days.map(day => dayNames[day.getDay()]),
      datasets: [
        {
          label: 'Treinos Realizados',
          data: workoutCounts,
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Calorias (centenas)',
          data: calorieEstimates,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };

  const chartData = generateChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progresso da Semana',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Obter histórico real de treinos
  const getWorkoutHistory = () => {
    if (!workouts) return [];
    
    return getCompletedWorkouts()
      .map(workout => ({
        id: workout.id,
        date: workout.completedAt ? new Date(workout.completedAt).toISOString().split('T')[0] : workout.date,
        name: workout.name,
        duration: workout.duration || (workout.exercises?.length * 5) || 30,
        calories: (workout.duration || (workout.exercises?.length * 5) || 30) * 10, // Estimativa
        exercises: workout.exercises?.length || 0,
        rating: workout.rating || 4, // Rating padrão
        notes: workout.notes || 'Treino concluído com sucesso!'
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Mais recentes primeiro
      .slice(0, 10); // Limitar a 10 treinos
  };

  const workoutHistory = getWorkoutHistory();

  // Recordes pessoais
  const personalRecords = [
    {
      category: 'Supino Reto',
      current: '85kg',
      previous: '80kg',
      improvement: '+5kg',
      date: '15/01/2024',
      trend: 'up'
    },
    {
      category: 'Agachamento',
      current: '120kg',
      previous: '115kg',
      improvement: '+5kg',
      date: '11/01/2024',
      trend: 'up'
    },
    {
      category: 'Levantamento Terra',
      current: '140kg',
      previous: '140kg',
      improvement: '0kg',
      date: '08/01/2024',
      trend: 'equal'
    },
    {
      category: 'Desenvolvimento',
      current: '45kg',
      previous: '47kg',
      improvement: '-2kg',
      date: '09/01/2024',
      trend: 'down'
    },
    {
      category: 'Rosca Direta',
      current: '35kg',
      previous: '32kg',
      improvement: '+3kg',
      date: '13/01/2024',
      trend: 'up'
    },
    {
      category: 'Maior Sequência',
      current: '7 dias',
      previous: '5 dias',
      improvement: '+2 dias',
      date: '15/01/2024',
      trend: 'up'
    }
  ];

  // Metas mensais
  const monthlyGoals = {
    workouts: {
      target: 20,
      current: 12,
      percentage: 60
    },
    calories: {
      target: 8000,
      current: 4800,
      percentage: 60
    },
    duration: {
      target: 1200, // em minutos
      current: 720,
      percentage: 60
    },
    weight: {
      target: 75, // meta de peso
      current: 77.5,
      percentage: 67 // baseado na proximidade da meta
    }
  };

  // Filtrar histórico por período
  const getFilteredHistory = () => {
    const now = new Date();
    const filtered = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      const diffTime = Math.abs(now - workoutDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filterPeriod) {
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        case 'quarter':
          return diffDays <= 90;
        default:
          return true;
      }
    });

    return filtered;
  };

  const filteredHistory = getFilteredHistory();
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentItems = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Componente para cards de estatísticas
  const StatCard = ({ icon, title, value, subtitle, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`p-2 rounded-lg ${
            trend === 'up' ? 'bg-green-100 text-green-600' :
            trend === 'down' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {trend === 'up' ? <FaArrowUp /> : 
             trend === 'down' ? <FaArrowDown /> : 
             <FaEquals />}
          </div>
        )}
      </div>
    </div>
  );

  // Componente para cards de recordes
  const RecordCard = ({ record }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{record.category}</h3>
        <div className={`p-2 rounded-lg ${
          record.trend === 'up' ? 'bg-green-100 text-green-600' :
          record.trend === 'down' ? 'bg-red-100 text-red-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {record.trend === 'up' ? <FaArrowUp /> : 
           record.trend === 'down' ? <FaArrowDown /> : 
           <FaEquals />}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Atual:</span>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{record.current}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Anterior:</span>
          <span className="text-gray-500 dark:text-gray-500">{record.previous}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Melhoria:</span>
          <span className={`font-semibold ${
            record.trend === 'up' ? 'text-green-600' :
            record.trend === 'down' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {record.improvement}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {record.date}
        </div>
      </div>
    </div>
  );

  // Componente para cards de metas
  const GoalCard = ({ title, icon, target, current, percentage, unit }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
          {percentage}%
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{current} {unit}</span>
          <span>{target} {unit}</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {target - current > 0 ? `${target - current} ${unit} restantes` : 'Meta atingida! 🎉'}
          </span>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Resumo', icon: <FaChartLine /> },
    { id: 'history', label: 'Histórico', icon: <FaHistory /> },
    { id: 'records', label: 'Recordes', icon: <FaTrophy /> },
    { id: 'goals', label: 'Metas', icon: <FaBullseye /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Progresso
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe sua evolução e conquiste suas metas
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<FaDumbbell className="text-2xl text-purple-500" />}
                title="Total de Treinos"
                value={stats.totalWorkouts}
                subtitle="este mês"
              />
              <StatCard
                icon={<FaFire className="text-2xl text-orange-500" />}
                title="Calorias Queimadas"
                value={`${stats.totalCalories.toLocaleString()}`}
                subtitle="este mês"
              />
              <StatCard
                icon={<FaClock className="text-2xl text-blue-500" />}
                title="Tempo Total"
                value={`${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m`}
                subtitle="este mês"
              />
              <StatCard
                icon={<FaBullseye className="text-2xl" />}
                title="Taxa de Conclusão"
                value={`${completionRate}%`}
                subtitle="dos treinos programados"
              />
            </div>

            {/* Sequência e Dias Ativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <FaFire className="text-2xl" />
                  <h3 className="text-xl font-bold">Sequência Atual</h3>
                </div>
                <p className="text-3xl font-bold mb-2">{stats.currentStreak} dias</p>
                <p className="text-purple-100">Continue assim! Você está no caminho certo.</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <FaCalendarAlt className="text-2xl" />
                  <h3 className="text-xl font-bold">Dias Ativos</h3>
                </div>
                <p className="text-3xl font-bold mb-2">{stats.activeDays} dias</p>
                <p className="text-blue-100">neste mês você foi ativo</p>
              </div>
            </div>

            {/* Gráfico de Progresso */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Progresso Semanal</h3>
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Histórico de Treinos</h3>
                <div className="flex space-x-2">
                  {[
                    { value: 'week', label: 'Última Semana' },
                    { value: 'month', label: 'Último Mês' },
                    { value: 'quarter', label: 'Últimos 3 Meses' }
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() => {
                        setFilterPeriod(period.value);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterPeriod === period.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de Treinos */}
            <div className="space-y-4">
              {currentItems.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {workout.name}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-sm ${
                                i < workout.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {new Date(workout.date).toLocaleDateString('pt-BR')}
                      </p>
                      {workout.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{workout.notes}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <FaClock />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <FaFire />
                        <span>{workout.calories} cal</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <FaDumbbell />
                        <span>{workout.exercises} exercícios</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FaChevronLeft />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-purple-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            {/* Header dos Recordes */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <FaTrophy className="text-3xl" />
                <div>
                  <h3 className="text-2xl font-bold">Seus Recordes Pessoais</h3>
                  <p className="text-yellow-100">Continue superando seus limites!</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {personalRecords.filter(r => r.trend === 'up').length}
                  </p>
                  <p className="text-yellow-100 text-sm">Melhorias</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {personalRecords.filter(r => r.trend === 'equal').length}
                  </p>
                  <p className="text-yellow-100 text-sm">Mantidos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {personalRecords.filter(r => r.trend === 'down').length}
                  </p>
                  <p className="text-yellow-100 text-sm">Em Recuperação</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{personalRecords.length}</p>
                  <p className="text-yellow-100 text-sm">Total</p>
                </div>
              </div>
            </div>

            {/* Grid de Recordes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalRecords.map((record, index) => (
                <RecordCard key={index} record={record} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-8">
            {/* Header das Metas */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <FaBullseye className="text-3xl" />
                <div>
                  <h3 className="text-2xl font-bold">Metas do Mês</h3>
                  <p className="text-purple-100">Acompanhe seu progresso mensal</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Object.values(monthlyGoals).filter(g => g.percentage >= 100).length}
                  </p>
                  <p className="text-purple-100 text-sm">Concluídas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Object.values(monthlyGoals).filter(g => g.percentage >= 50 && g.percentage < 100).length}
                  </p>
                  <p className="text-purple-100 text-sm">Em Progresso</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Object.values(monthlyGoals).filter(g => g.percentage < 50).length}
                  </p>
                  <p className="text-purple-100 text-sm">Iniciando</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Math.round(Object.values(monthlyGoals).reduce((acc, g) => acc + g.percentage, 0) / Object.values(monthlyGoals).length)}%</p>
                                    <p className="text-purple-100 text-sm">Média Geral</p>
                </div>
              </div>
            </div>

            {/* Grid de Metas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GoalCard
                title="Treinos Realizados"
                icon={<FaDumbbell className="text-purple-500" />}
                target={monthlyGoals.workouts.target}
                current={monthlyGoals.workouts.current}
                percentage={monthlyGoals.workouts.percentage}
                unit="treinos"
              />
              <GoalCard
                title="Calorias Queimadas"
                icon={<FaFire className="text-orange-500" />}
                target={monthlyGoals.calories.target}
                current={monthlyGoals.calories.current}
                percentage={monthlyGoals.calories.percentage}
                unit="cal"
              />
              <GoalCard
                title="Tempo de Treino"
                icon={<FaClock className="text-blue-500" />}
                target={monthlyGoals.duration.target}
                current={monthlyGoals.duration.current}
                percentage={monthlyGoals.duration.percentage}
                unit="min"
              />
              <GoalCard
                title="Meta de Peso"
                icon={<FaWeight className="text-green-500" />}
                target={monthlyGoals.weight.target}
                current={monthlyGoals.weight.current}
                percentage={monthlyGoals.weight.percentage}
                unit="kg"
              />
            </div>

            {/* Progresso Detalhado */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Progresso Detalhado</h3>
              <div className="space-y-6">
                {Object.entries(monthlyGoals).map(([key, goal]) => {
                  const titles = {
                    workouts: 'Treinos Realizados',
                    calories: 'Calorias Queimadas',
                    duration: 'Tempo de Treino',
                    weight: 'Meta de Peso'
                  };
                  
                  const units = {
                    workouts: 'treinos',
                    calories: 'calorias',
                    duration: 'minutos',
                    weight: 'kg'
                  };

                  const remaining = goal.target - goal.current;
                  const daysLeft = 31 - new Date().getDate();
                  const dailyTarget = key === 'weight' ? 0 : Math.ceil(remaining / daysLeft);

                  return (
                    <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{titles[key]}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {goal.current} / {goal.target} {units[key]}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{goal.percentage}% concluído</span>
                        {key !== 'weight' && (
                          <span>
                            {remaining > 0 ? `${remaining} ${units[key]} restantes` : 'Meta atingida! 🎉'}
                          </span>
                        )}
                      </div>
                      {key !== 'weight' && remaining > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Meta diária sugerida: {dailyTarget} {units[key]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dicas e Motivação */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <FaStar className="text-2xl mr-3" />
                <h3 className="text-xl font-bold">Dicas para Atingir suas Metas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🎯 Consistência é a chave</h4>
                  <p className="text-sm text-green-100">
                    Mantenha uma rotina regular de treinos, mesmo que sejam mais curtos.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📈 Acompanhe o progresso</h4>
                  <p className="text-sm text-green-100">
                    Registre seus treinos e celebre as pequenas vitórias.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💪 Varie os exercícios</h4>
                  <p className="text-sm text-green-100">
                    Experimente novos exercícios para manter a motivação alta.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🏆 Defina metas realistas</h4>
                  <p className="text-sm text-green-100">
                    Estabeleça objetivos alcançáveis e aumente gradualmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;

