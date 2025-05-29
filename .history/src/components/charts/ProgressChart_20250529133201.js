// src/components/charts/ProgressChart.js
import React, { useState, useMemo } from 'react';
import { FaChartLine, FaWeight, FaFire, FaDumbbell, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';
import Card from '../common/Card';

// Componente de gráfico de linha simples
const SimpleLineChart = ({ data, title, color = 'purple', unit = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FaChartLine className="text-4xl mb-2 mx-auto" />
          <p>Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const colorClasses = {
    purple: 'stroke-purple-400 fill-purple-400/20',
    green: 'stroke-green-400 fill-green-400/20',
    blue: 'stroke-blue-400 fill-blue-400/20',
    orange: 'stroke-orange-400 fill-orange-400/20',
    red: 'stroke-red-400 fill-red-400/20'
  };

  // Criar pontos do gráfico
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return { x, y, value: item.value, label: item.label };
  });

  // Criar path do SVG
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Criar área preenchida
  const areaPath = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      
      <div className="relative h-64 bg-gray-800/50 rounded-lg p-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Área preenchida */}
          <path
            d={areaPath}
            className={`${colorClasses[color]} opacity-30`}
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Linha */}
          <path
            d={pathData}
            className={`${colorClasses[color]} opacity-80`}
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Pontos */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                className={`${colorClasses[color]} opacity-100`}
                strokeWidth="2"
              />
              
              {/* Tooltip hover */}
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                className="fill-transparent hover:fill-white/10 cursor-pointer"
                title={`${point.label}: ${point.value}${unit}`}
              />
            </g>
          ))}
        </svg>
        
        {/* Labels do eixo X */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-400">
              {item.label}
            </span>
          ))}
        </div>
        
        {/* Labels do eixo Y */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-4 pl-2">
          <span className="text-xs text-gray-400">{maxValue}{unit}</span>
          <span className="text-xs text-gray-400">{minValue}{unit}</span>
        </div>
      </div>
    </div>
  );
};

// Componente de métrica com tendência
const MetricTrend = ({ title, value, unit, trend, icon: Icon, color }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <FaArrowUp className="text-green-400" />;
      case 'down':
        return <FaArrowDown className="text-red-400" />;
      default:
        return <FaEquals className="text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="hover:scale-105 transition-transform duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`text-2xl ${color}`} />
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
      </div>
    </Card>
  );
};

// Componente principal
const ProgressChart = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('weight');

  // Dados mockados para demonstração
  const mockData = useMemo(() => ({
    weight: {
      week: [
        { label: 'Seg', value: 75.2 },
        { label: 'Ter', value: 75.0 },
        { label: 'Qua', value: 74.8 },
        { label: 'Qui', value: 74.9 },
        { label: 'Sex', value: 74.7 },
        { label: 'Sáb', value: 74.5 },
        { label: 'Dom', value: 74.3 }
      ],
      month: [
        { label: 'Sem 1', value: 75.5 },
        { label: 'Sem 2', value: 75.0 },
        { label: 'Sem 3', value: 74.5 },
        { label: 'Sem 4', value: 74.0 }
      ],
      year: [
        { label: 'Jan', value: 78.0 },
        { label: 'Fev', value: 77.2 },
        { label: 'Mar', value: 76.5 },
        { label: 'Abr', value: 75.8 },
        { label: 'Mai', value: 75.2 },
        { label: 'Jun', value: 74.5 }
      ]
    },
    volume: {
      week: [
        { label: 'Seg', value: 2500 },
        { label: 'Ter', value: 0 },
        { label: 'Qua', value: 3200 },
        { label: 'Qui', value: 0 },
        { label: 'Sex', value: 2800 },
        { label: 'Sáb', value: 3500 },
        { label: 'Dom', value: 0 }
      ],
      month: [
        { label: 'Sem 1', value: 12000 },
        { label: 'Sem 2', value: 14500 },
        { label: 'Sem 3', value: 13200 },
        { label: 'Sem 4', value: 15800 }
      ],
      year: [
        { label: 'Jan', value: 45000 },
        { label: 'Fev', value: 52000 },
        { label: 'Mar', value: 48000 },
        { label: 'Abr', value: 55000 },
        { label: 'Mai', value: 58000 },
        { label: 'Jun', value: 62000 }
      ]
    },
    calories: {
      week: [
        { label: 'Seg', value: 320 },
        { label: 'Ter', value: 0 },
        { label: 'Qua', value: 285 },
        { label: 'Qui', value: 0 },
        { label: 'Sex', value: 340 },
        { label: 'Sáb', value: 380 },
        { label: 'Dom', value: 0 }
      ],
      month: [
        { label: 'Sem 1', value: 1200 },
        { label: 'Sem 2', value: 1450 },
        { label: 'Sem 3', value: 1320 },
        { label: 'Sem 4', value: 1580 }
      ],
      year: [
        { label: 'Jan', value: 4500 },
        { label: 'Fev', value: 5200 },
        { label: 'Mar', value: 4800 },
        { label: 'Abr', value: 5500 },
        { label: 'Mai', value: 5800 },
        { label: 'Jun', value: 6200 }
      ]
    }
  }), []);

  // Usar dados mockados se não houver dados fornecidos
  const chartData = data || mockData;

  // Métricas atuais
  const currentMetrics = useMemo(() => {
    const weightData = chartData.weight?.[selectedPeriod] || [];
    const volumeData = chartData.volume?.[selectedPeriod] || [];
    const caloriesData = chartData.calories?.[selectedPeriod] || [];

    const getCurrentValue = (data) => data.length > 0 ? data[data.length - 1].value : 0;
    const getPreviousValue = (data) => data.length > 1 ? data[data.length - 2].value : 0;
    const getTrend = (current, previous) => {
      if (current > previous) return 'up';
      if (current < previous) return 'down';
      return 'stable';
    };

    const currentWeight = getCurrentValue(weightData);
    const previousWeight = getPreviousValue(weightData);
    const currentVolume = getCurrentValue(volumeData);
    const previousVolume = getPreviousValue(volumeData);
    const currentCalories = getCurrentValue(caloriesData);
    const previousCalories = getPreviousValue(caloriesData);

    return {
      weight: {
        value: currentWeight,
        trend: getTrend(currentWeight, previousWeight)
      },
      volume: {
        value: currentVolume,
        trend: getTrend(currentVolume, previousVolume)
      },
      calories: {
        value: currentCalories,
        trend: getTrend(currentCalories, previousCalories)
      }
    };
  }, [chartData, selectedPeriod]);

  const getMetricConfig = (metric) => {
    const configs = {
      weight: {
        title: 'Evolução do Peso',
        unit: 'kg',
        color: 'purple'
      },
      volume: {
        title: 'Volume de Treino',
        unit: 'kg',
        color: 'blue'
      },
      calories: {
        title: 'Calorias Queimadas',
        unit: 'kcal',
        color: 'orange'
      }
    };
    return configs[metric] || configs.weight;
  };

  const currentConfig = getMetricConfig(selectedMetric);
  const currentData = chartData[selectedMetric]?.[selectedPeriod] || [];

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">Gráfico de Progresso</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Seletor de métrica */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="weight">Peso</option>
                <option value="volume">Volume</option>
                <option value="calories">Calorias</option>
              </select>
              
              {/* Seletor de período */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                {[
                  { key: 'week', label: 'Semana' },
                  { key: 'month', label: 'Mês' },
                  { key: 'year', label: 'Ano' }
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedPeriod === period.key
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricTrend
          title="Peso Atual"
          value={currentMetrics.weight.value}
          unit="kg"
          trend={currentMetrics.weight.trend}
          icon={FaWeight}
          color="text-purple-400"
        />
        
        <MetricTrend
          title="Volume Total"
          value={currentMetrics.volume.value.toLocaleString()}
          unit="kg"
          trend={currentMetrics.volume.trend}
          icon={FaDumbbell}
          color="text-blue-400"
        />
        
        <MetricTrend
          title="Calorias"
          value={currentMetrics.calories.value}
          unit="kcal"
          trend={currentMetrics.calories.trend}
          icon={FaFire}
          color="text-orange-400"
        />
      </div>

      {/* Gráfico principal */}
      <Card>
        <div className="p-6">
          <SimpleLineChart
            data={currentData}
            title={currentConfig.title}
            color={currentConfig.color}
            unit={currentConfig.unit}
          />
        </div>
      </Card>

      {/* Estatísticas adicionais */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas do Período</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {currentData.length}
              </div>
              <div className="text-sm text-gray-400">Registros</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {currentData.length > 0 ? Math.max(...currentData.map(d => d.value)).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-400">Máximo</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {currentData.length > 0 ? Math.min(...currentData.map(d => d.value)).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-400">Mínimo</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {currentData.length > 0 ? (currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-400">Média</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressChart;
