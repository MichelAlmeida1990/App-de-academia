import React, { useState, useContext, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { WorkoutContext } from '../context/WorkoutContext';
import { ThemeContext } from '../context/ThemeContext';
import ProgressTracker from '../components/workout/ProgressTracker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatsPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { 
    getMuscleGroupStats,
    getGeneralStats
  } = useContext(WorkoutContext);
  
  const [timeFrame, setTimeFrame] = useState('month');
  const [activeTab, setActiveTab] = useState('resumo');
  
  // Estados para armazenar dados processados
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [generalStats, setGeneralStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    averageMinutes: 0
  });
  
  // Processar dados quando o componente montar ou quando timeFrame mudar
  useEffect(() => {
    console.log("Processando dados de treinos...");
    
    // Processar estatísticas gerais
    const stats = getGeneralStats(timeFrame);
    setGeneralStats(stats);
    
    // Processar dados de grupos musculares
    const muscleGroups = getMuscleGroupStats(timeFrame);
    setMuscleGroupData(muscleGroups || []);
  }, [timeFrame, getGeneralStats, getMuscleGroupStats]);
  
  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#82CA9D', '#A4DE6C'];
  
  // Função para renderizar rótulos no gráfico de pizza
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill={darkMode ? "#E5E7EB" : "#4B5563"}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {name} ({(percent * 100).toFixed(0)}%)
      </text>
    ) : null;
  };

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-6">Estatísticas de Treino</h1>
      
      {/* Seletor de período */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">Período:</label>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeFrame('week')}
            className={`px-4 py-2 rounded-lg ${timeFrame === 'week' 
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
              : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setTimeFrame('month')}
            className={`px-4 py-2 rounded-lg ${timeFrame === 'month' 
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
              : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
          >
            Mês
          </button>
          <button 
            onClick={() => setTimeFrame('year')}
            className={`px-4 py-2 rounded-lg ${timeFrame === 'year' 
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
              : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
          >
            Ano
          </button>
        </div>
      </div>
      
      {/* Tabs de navegação - Removida a aba "Atividade" */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('resumo')}
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'resumo'
                  ? (darkMode ? 'text-blue-500 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-600')
                  : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600')
              }`}
            >
              Resumo
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('musculos')}
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'musculos'
                  ? (darkMode ? 'text-blue-500 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-600')
                  : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600')
              }`}
            >
              Grupos Musculares
            </button>
          </li>
        </ul>
      </div>
      
      {/* Conteúdo da aba Resumo */}
      {activeTab === 'resumo' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <h3 className="text-lg font-semibold mb-2">Total de Treinos</h3>
              <p className="text-3xl font-bold">{generalStats.totalWorkouts}</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <h3 className="text-lg font-semibold mb-2">Tempo Total</h3>
              <p className="text-3xl font-bold">{generalStats.totalMinutes} min</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <h3 className="text-lg font-semibold mb-2">Média por Treino</h3>
              <p className="text-3xl font-bold">{generalStats.averageMinutes} min</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h3 className="text-lg font-semibold mb-4">Progresso Recente</h3>
            <ProgressTracker />
          </div>
        </div>
      )}
      
      {/* Conteúdo da aba Grupos Musculares */}
      {activeTab === 'musculos' && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h3 className="text-lg font-semibold mb-4">Distribuição por Grupo Muscular</h3>
          
          {muscleGroupData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
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
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                    }}
                    formatter={(value, name, props) => {
                      return [`${value} treino${value !== 1 ? 's' : ''}`, props.payload.name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8">Nenhum dado disponível para o período selecionado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsPage;
