// src/pages/ProgressPage.js
import React, { useState } from 'react';
import {
  FaChartLine,
  FaCalendarCheck,
  FaTrophy,
  FaFire,
  FaClock,
  FaBullseye, // ✅ CORRIGIDO: FaTarget → FaBullseye
  FaArrowUp,
  FaArrowDown,
  FaDumbbell,
  FaHeartbeat,
  FaRunning,
  FaWeight,
  FaCalendar,
  FaMedal,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaDownload,
  FaShare
} from 'react-icons/fa';

// Dados mockados
const MOCK_PROGRESS_DATA = {
  summary: {
    totalWorkouts: 45,
    completedWorkouts: 38,
    totalExercises: 180,
    totalCalories: 12450,
    totalDuration: 2280, // em minutos
    activeDays: 28,
    currentStreak: 7,
    longestStreak: 14
  },
  weeklyStats: [
    { week: 'Sem 1', workouts: 4, calories: 1200, duration: 240 },
    { week: 'Sem 2', workouts: 5, calories: 1450, duration: 300 },
    { week: 'Sem 3', workouts: 3, calories: 980, duration: 180 },
    { week: 'Sem 4', workouts: 6, calories: 1680, duration: 360 },
    { week: 'Sem 5', workouts: 4, calories: 1320, duration: 240 },
    { week: 'Sem 6', workouts: 5, calories: 1520, duration: 300 }
  ],
  personalRecords: [
    {
      id: 1,
      exercise: 'Supino Reto',
      currentPR: '100kg',
      previousPR: '95kg',
      improvement: '+5kg',
      date: '2025-05-20',
      category: 'Força'
    },
    {
      id: 2,
      exercise: 'Agachamento',
      currentPR: '140kg',
      previousPR: '135kg',
      improvement: '+5kg',
      date: '2025-05-18',
      category: 'Força'
    },
    {
      id: 3,
      exercise: 'Levantamento Terra',
      currentPR: '160kg',
      previousPR: '155kg',
      improvement: '+5kg',
      date: '2025-05-15',
      category: 'Força'
    },
    {
      id: 4,
      exercise: 'Barra Fixa',
      currentPR: '15 reps',
      previousPR: '12 reps',
      improvement: '+3 reps',
      date: '2025-05-10',
      category: 'Resistência'
    },
    {
      id: 5,
      exercise: 'Corrida 5km',
      currentPR: '22:30',
      previousPR: '23:15',
      improvement: '-45s',
      date: '2025-05-08',
      category: 'Cardio'
    },
    {
      id: 6,
      exercise: 'Prancha',
      currentPR: '3:45',
      previousPR: '3:20',
      improvement: '+25s',
      date: '2025-05-05',
      category: 'Core'
    }
  ],
  recentWorkouts: [
    {
      id: 1,
      name: 'Treino de Peito e Tríceps',
      date: '2025-05-29',
      duration: 65,
      calories: 320,
      exercises: 5,
      completed: true,
      rating: 4
    },
    {
      id: 2,
      name: 'Treino de Costas e Bíceps',
      date: '2025-05-27',
      duration: 70,
      calories: 350,
      exercises: 6,
      completed: true,
      rating: 5
    },
    {
      id: 3,
      name: 'Treino de Pernas',
      date: '2025-05-25',
      duration: 80,
      calories: 420,
      exercises: 7,
      completed: true,
      rating: 4
    },
    {
      id: 4,
      name: 'Cardio HIIT',
      date: '2025-05-23',
      duration: 30,
      calories: 280,
      exercises: 4,
      completed: true,
      rating: 5
    },
    {
      id: 5,
      name: 'Treino de Ombros',
      date: '2025-05-21',
      duration: 55,
      calories: 250,
      exercises: 4,
      completed: false,
      rating: 0
    }
  ],
  monthlyGoals: {
    workouts: { target: 20, current: 16, percentage: 80 },
    calories: { target: 8000, current: 6400, percentage: 80 },
    duration: { target: 1200, current: 960, percentage: 80 },
    weight: { target: 75, current: 76.5, percentage: 98 }
  }
};

// Componente de Card de Estatística
const StatCard = ({ icon, title, value, subtitle, trend, color = 'purple' }) => {
  const colorClasses = {
    purple: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    green: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    orange: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
    red: 'text-red-500 bg-red-100 dark:bg-red-900/30'
  };

  const trendColor = trend?.type === 'up' ? 'text-green-500' : trend?.type === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center ${trendColor}`}>
            {trend.type === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            <span className="text-sm font-medium">{trend.value}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
      )}
    </div>
  );
};

// Componente de Card de Record Pessoal
const PRCard = ({ record }) => {
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'força': return <FaDumbbell className="text-red-500" />;
      case 'resistência': return <FaHeartbeat className="text-green-500" />;
      case 'cardio': return <FaRunning className="text-orange-500" />;
      case 'core': return <FaBullseye className="text-purple-500" />;
      default: return <FaMedal className="text-yellow-500" />;
    }
  };

  const isImprovement = record.improvement.includes('+') || record.improvement.includes('-');
  const improvementColor = record.improvement.includes('+') ? 'text-green-500' : 
                           record.improvement.includes('-') && record.category === 'Cardio' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getCategoryIcon(record.category)}
          <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {record.category}
          </span>
        </div>
        <FaTrophy className="text-yellow-500" />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{record.exercise}</h3>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-purple-600">{record.currentPR}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Record Atual</p>
        </div>
        <div className={`flex items-center ${improvementColor}`}>
          {isImprovement && (record.improvement.includes('+') ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />)}
          <span className="font-bold">{record.improvement}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Anterior: {record.previousPR}</span>
        <span>{new Date(record.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// Componente de Card de Treino Recente
const WorkoutHistoryCard = ({ workout }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">{workout.name}</h4>
        <div className="flex items-center">
          {workout.completed ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaClock className="mr-2 text-purple-500" />
          <span>{workout.duration}min</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaFire className="mr-2 text-orange-500" />
          <span>{workout.calories} cal</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaDumbbell className="mr-2 text-purple-500" />
          <span>{workout.exercises} exercícios</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaCalendar className="mr-2 text-purple-500" />
          <span>{formatDate(workout.date)}</span>
        </div>
      </div>
      
      {workout.completed && workout.rating > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Avaliação:</span>
          <div className="flex space-x-1">
            {renderStars(workout.rating)}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Meta
const GoalCard = ({ title, icon, target, current, percentage, unit }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-purple-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
            {icon}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{current} {unit}</span>
          <span>{target} {unit}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {percentage >= 100 ? 'Meta atingida! 🎉' : 
         percentage >= 80 ? 'Quase lá!' : 
         'Continue assim!'}
      </p>
    </div>
  );
};

// Componente Principal
const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState('resumo');
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');

  const { summary, weeklyStats, personalRecords, recentWorkouts, monthlyGoals } = MOCK_PROGRESS_DATA;

  const tabs = [
    { id: 'resumo', label: 'Resumo', icon: <FaChartLine /> },
    { id: 'historico', label: 'Histórico', icon: <FaCalendarCheck /> },
    { id: 'recordes', label: 'Recordes', icon: <FaTrophy /> },
    { id: 'metas', label: 'Metas', icon: <FaBullseye /> } // ✅ CORRIGIDO
  ];

  const completionRate = Math.round((summary.completedWorkouts / summary.totalWorkouts) * 100);
  const avgCaloriesPerWorkout = Math.round(summary.totalCalories / summary.completedWorkouts);
  const avgDurationPerWorkout = Math.round(summary.totalDuration / summary.completedWorkouts);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Progresso
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe sua evolução e conquistas
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FaDownload className="mr-2 text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">Exportar</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <FaShare className="mr-2" />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'resumo' && (
          <div className="space-y-8">
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<FaCheckCircle className="text-2xl" />}
                title="Treinos Completados"
                value={summary.completedWorkouts}
                subtitle={`de ${summary.totalWorkouts} programados`}
                trend={{ type: 'up', value: '+12%' }}
                color="green"
              />
              <StatCard
                icon={<FaFire className="text-2xl" />}
                title="Calorias Queimadas"
                value={summary.totalCalories.toLocaleString()}
                subtitle={`${avgCaloriesPerWorkout} por treino`}
                trend={{ type: 'up', value: '+8%' }}
                color="orange"
              />
              <StatCard
                icon={<FaClock className="text-2xl" />}
                title="Tempo Total"
                value={`${Math.floor(summary.totalDuration / 60)}h ${summary.totalDuration % 60}m`}
                subtitle={`${avgDurationPerWorkout}min por treino`}
                trend={{ type: 'up', value: '+5%' }}
                color="blue"
              />
              <StatCard
                icon={<FaBullseye className="text-2xl" />} {/* ✅ CORRIGIDO */}
                title="Taxa de Conclusão"
                value={`${completionRate}%`}
                subtitle="dos treinos programados"
                trend={{ type: 'up', value: '+3%' }}
                color="purple"
              />
            </div>

            {/* Sequência e Atividade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<FaCalendarCheck className="text-2xl" />}
                title="Sequência Atual"
                value={`${summary.currentStreak} dias`}
                subtitle={`Recorde: ${summary.longestStreak} dias`}
                color="green"
              />
              <StatCard
                icon={<FaCalendar className="text-2xl" />}
                title="Dias Ativos"
                value={summary.activeDays}
                subtitle="nos últimos 30 dias"
                color="purple"
              />
              <StatCard
                icon={<FaDumbbell className="text-2xl" />}
                title="Total de Exercícios"
                value={summary.totalExercises}
                subtitle={`${Math.round(summary.totalExercises / summary.completedWorkouts)} por treino`}
                color="blue"
              />
            </div>

            {/* Gráfico de Progresso Semanal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Progresso Semanal</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                    Treinos
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Calorias
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                {weeklyStats.map((week, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 overflow-hidden">
                      <div
                        className="bg-purple-500 transition-all duration-500"
                        style={{ height: `${(week.workouts / 6) * 100}px` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{week.workouts}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{week.week}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex space-x-3">
                  {['semanal', 'mensal', 'trimestral'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaFilter className="mr-2 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Filtros</span>
                </button>
              </div>
            </div>

            {/* Lista de Treinos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentWorkouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
            </div>

            {/* Paginação */}
            <div className="flex justify-center items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FaChevronLeft className="mr-2" />
                Anterior
              </button>
              <span className="text-gray-600 dark:text-gray-400">Página 1 de 5</span>
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Próxima
                <FaChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'recordes' && (
          <div className="space-y-6">
            {/* Header dos Recordes */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <FaTrophy className="text-3xl mr-4" />
                <div>
                  <h2 className="text-2xl font-bold">Recordes Pessoais</h2>
                  <p className="text-purple-100">Suas conquistas e melhorias</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{personalRecords.length}</div>
                  <div className="text-purple-100">Total de Recordes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-purple-100">Este Mês</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">+15%</div>
                  <div className="text-purple-100">Melhoria Média</div>
                </div>
              </div>
            </div>

            {/* Grid de Recordes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalRecords.map((record) => (
                <PRCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metas' && (
          <div className="space-y-6">
            {/* Header das Metas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaBullseye className="text-3xl text-purple-500 mr-4" /> {/* ✅ CORRIGIDO */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Metas do Mês</h2>
                    <p className="text-gray-600 dark:text-gray-400">Maio 2025</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Editar Metas
                </button>
              </div>
            </div>

            {/* Grid de Metas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GoalCard
                title="Treinos Realizados"
                icon={<FaDumbbell className="text-purple-500" />}
                
