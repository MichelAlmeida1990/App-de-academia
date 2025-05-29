// src/components/progress/ProgressTracker.js
import React, { useState, useEffect, useMemo } from 'react';
import { FaFire, FaCalendarCheck, FaTrophy, FaChartLine, FaArrowUp, FaArrowDown, FaEquals, FaCalendarAlt, FaDumbbell, FaInfoCircle } from 'react-icons/fa';
import Card from '../common/Card';

// Componente de Gráfico Simples (sem dependências externas)
const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.count));
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h4>
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full bg-gray-700 rounded-t-md overflow-hidden">
              <div
                className={`bg-gradient-to-t from-purple-600 to-purple-400 transition-all duration-1000 ease-out ${
                  item.isToday ? 'shadow-lg shadow-purple-500/30' : ''
                }`}
                style={{
                  height: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%`,
                  minHeight: item.count > 0 ? '8px' : '2px'
                }}
              />
              {item.count > 0 && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
                  {item.count}
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-xs font-medium ${item.isToday ? 'text-purple-400' : 'text-gray-400'}`}>
                {item.day}
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Gráfico de Pizza Simples
const SimplePieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  if (total === 0) {
    return (
      <div className="text-center py-8">
        <FaInfoCircle className="text-gray-500 text-2xl mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Nenhum dado disponível</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h4>
      <div className="flex flex-col space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{item.value}</div>
                <div className="text-xs text-gray-400">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente de Métrica
const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color, gradient }) => {
  const renderTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <FaArrowUp className="text-green-400 text-sm" />;
      case 'down':
        return <FaArrowDown className="text-red-400 text-sm" />;
      default:
        return <FaEquals className="text-gray-400 text-sm" />;
    }
  };

  return (
    <Card className={`${gradient} border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${color} rounded-xl`}>
            <Icon className="text-xl text-white" />
          </div>
          {trend && (
            <div className="flex items-center">
              {renderTrendIcon()}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {subtitle && <span className="text-gray-400 text-sm">{subtitle}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Componente de Barra de Progresso
const ProgressBar = ({ percentage, color = 'purple' }) => {
  const colorClasses = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-1000 ease-out rounded-full`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

// Componente principal
const ProgressTracker = () => {
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

  // Simular carregamento de dados
  useEffect(() => {
    const loadProgressData = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar dados mockados
      const today = new Date();
      const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      // Atividade semanal mockada
      const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - index));
        const isToday = index === 6;
        
        return {
          day: weekDays[date.getDay()],
          date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
          count: Math.floor(Math.random() * 3),
          isToday
        };
      });

      // Distribuição por grupo muscular mockada
      const bodyPartDistribution = [
        { name: 'Peito', value: 8 },
        { name: 'Costas', value: 6 },
        { name: 'Pernas', value: 10 },
        { name: 'Ombros', value: 4 },
        { name: 'Braços', value: 7 }
      ];

      setProgress({
        weeklyWorkouts: 4,
        weeklyGoal: 5,
        monthlyProgress: 75,
        streakDays: 5,
        totalCompleted: 35,
        weeklyTrend: 'up',
        completionRate: 88,
        bodyPartDistribution,
        weeklyActivity
      });
      
      setLoading(false);
    };

    loadProgressData();
  }, []);

  const weeklyPercentage = useMemo(() => 
    (progress.weeklyWorkouts / progress.weeklyGoal) * 100, 
    [progress.weeklyWorkouts, progress.weeklyGoal]
  );

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="p-6 space-y-6">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-700 rounded-xl"></div>
            <div className="h-32 bg-gray-700 rounded-xl"></div>
          </div>
          <div className="h-40 bg-gray-700 rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Seu Progresso</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'charts'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Gráficos
            </button>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                icon={FaCalendarCheck}
                title="Treinos esta semana"
                value={progress.weeklyWorkouts}
                subtitle={`/ ${progress.weeklyGoal}`}
                trend={progress.weeklyTrend}
                color="bg-purple-600"
                gradient="bg-gradient-to-br from-purple-900/50 to-purple-800/30"
              />
              
              <MetricCard
                icon={FaFire}
                title="Sequência atual"
                value={progress.streakDays}
                subtitle="dias consecutivos"
                color="bg-orange-600"
                gradient="bg-gradient-to-br from-orange-900/50 to-orange-800/30"
              />
            </div>

            {/* Progresso semanal */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Meta Semanal</h4>
                  <span className="text-purple-400 font-medium">{weeklyPercentage.toFixed(0)}%</span>
                </div>
                <ProgressBar percentage={weeklyPercentage} color="purple" />
                <p className="text-sm text-gray-400 mt-2">
                  {progress.weeklyWorkouts >= progress.weeklyGoal 
                    ? '🎉 Meta atingida! Parabéns!' 
                    : `Faltam ${progress.weeklyGoal - progress.weeklyWorkouts} treinos para atingir sua meta`
                  }
                </p>
              </div>
            </Card>

            {/* Progresso mensal */}
            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Progresso Mensal</h4>
                  <span className="text-green-400 font-medium">{progress.monthlyProgress}%</span>
                </div>
                <ProgressBar percentage={progress.monthlyProgress} color="green" />
                <p className="text-sm text-gray-400 mt-2">
                  Você está indo muito bem este mês!
                </p>
              </div>
            </Card>

            {/* Métricas adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                icon={FaChartLine}
                title="Taxa de conclusão"
                value={`${progress.completionRate}%`}
                subtitle="dos treinos planejados"
                color="bg-blue-600"
                gradient="bg-gradient-to-br from-blue-900/50 to-blue-800/30"
              />
              
              <MetricCard
                icon={FaTrophy}
                title="Total concluído"
                value={progress.totalCompleted}
                subtitle="treinos"
                color="bg-yellow-600"
                gradient="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border border-gray-700">
                <div className="p-6">
                  <SimpleBarChart 
                    data={progress.weeklyActivity} 
                    title="Atividade Semanal"
                  />
                </div>
              </Card>
              
              <Card className="bg-gray-800/50 border border-gray-700">
                <div className="p-6">
                  <SimplePieChart 
                    data={progress.bodyPartDistribution} 
                    title="Grupos Musculares"
                  />
                </div>
              </Card>
            </div>

            {/* Resumo da semana */}
            <Card className="bg-gray-800/50 border border-gray-700">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Resumo da Semana</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{progress.weeklyWorkouts}</div>
                    <div className="text-sm text-gray-400">Treinos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{progress.completionRate}%</div>
                    <div className="text-sm text-gray-400">Conclusão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{progress.streakDays}</div>
                    <div className="text-sm text-gray-400">Sequência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{progress.totalCompleted}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer com total */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-2">
            <FaTrophy className="text-yellow-500" />
            <p className="text-sm text-gray-400">
              Total de treinos concluídos: <span className="font-semibold text-white">{progress.totalCompleted}</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressTracker;
