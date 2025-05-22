// src/pages/StatsPage.js
import React, { useState, useContext, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { WorkoutContext } from '../context/WorkoutContext';
import { ThemeContext } from '../context/ThemeContext';
import ProgressTracker from '../components/workout/ProgressTracker';
import { format, getDaysInMonth, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatsPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { 
    workouts,
    getCompletedWorkouts,
    getMuscleGroupStats,
    getGeneralStats
  } = useContext(WorkoutContext);
  
  const [timeFrame, setTimeFrame] = useState('month');
  const [activeTab, setActiveTab] = useState('resumo');
  
  // Estados para armazenar dados processados
  const [monthlyData, setMonthlyData] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [generalStats, setGeneralStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    averageMinutes: 0
  });
  
  // Estado para debug
  const [debugInfo, setDebugInfo] = useState({
    totalWorkouts: 0,
    processedWorkouts: 0,
    currentMonth: '',
    currentYear: 0
  });
  
  // Usar a data atual do sistema para processamento
  const currentDate = new Date();
  
  // Processar dados quando o componente montar ou quando workouts/timeFrame mudar
  useEffect(() => {
    console.log("Processando dados de treinos...");
    
    // Processar estatísticas gerais
    const stats = getGeneralStats(timeFrame);
    setGeneralStats(stats);
    
    // Processar dados de grupos musculares
    const muscleGroups = getMuscleGroupStats(timeFrame);
    setMuscleGroupData(muscleGroups || []);
    
    // Processar dados mensais
    processMonthlyData();
  }, [timeFrame, workouts]);
  
  // Função para processar dados mensais
  const processMonthlyData = () => {
    // Obter todos os treinos concluídos
    const allCompletedWorkouts = getCompletedWorkouts() || [];
    
    console.log("Total de treinos concluídos:", allCompletedWorkouts.length);
    console.log("Treinos concluídos:", allCompletedWorkouts);
    
    // Ano e mês atual
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    // Informações para debug
    setDebugInfo({
      totalWorkouts: allCompletedWorkouts.length,
      processedWorkouts: 0,
      currentMonth: format(currentDate, 'MMMM', { locale: ptBR }),
      currentYear: currentYear
    });
    
    // Obter o número de dias no mês atual
    const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth, 1));
    
    // Inicializar dados mensais
    const monthData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { 
        day: day, 
        date: new Date(currentYear, currentMonth, day),
        workouts: 0,
        minutes: 0
      };
    });
    
    // Contador de treinos processados
    let processedCount = 0;
    
    // Processar cada treino
    allCompletedWorkouts.forEach((workout, index) => {
      try {
        console.log(`Processando treino #${index}:`, workout);
        
        // Verificar se o treino tem data
        let workoutDate = null;
        
        if (workout.completedAt) {
          workoutDate = new Date(workout.completedAt);
          console.log(`  - Usando data de conclusão: ${workoutDate}`);
        } else if (workout.date) {
          workoutDate = new Date(workout.date);
          console.log(`  - Usando data do treino: ${workoutDate}`);
        }
        
        // Se não tiver data válida, pular
        if (!workoutDate || !isValid(workoutDate)) {
          console.log(`  - Treino sem data válida, ignorando`);
          return;
        }
        
        // Verificar se o treino é do mês atual
        const workoutYear = workoutDate.getFullYear();
        const workoutMonth = workoutDate.getMonth();
        
        console.log(`  - Ano/Mês do treino: ${workoutMonth + 1}/${workoutYear}`);
        console.log(`  - Ano/Mês atual: ${currentMonth + 1}/${currentYear}`);
        
        if (workoutYear === currentYear && workoutMonth === currentMonth) {
          const day = workoutDate.getDate();
          
          // Verificar se o dia está dentro do intervalo válido
          if (day >= 1 && day <= daysInMonth) {
            console.log(`  - PROCESSADO: Treino para o dia ${day}`);
            
            monthData[day - 1].workouts += 1;
            
            // Adicionar duração (com valor padrão se não existir)
            const duration = parseInt(workout.duration || workout.estimatedTime || 30);
            monthData[day - 1].minutes += duration;
            
            processedCount++;
          } else {
            console.log(`  - IGNORADO: Dia inválido: ${day}`);
          }
        } else {
          console.log(`  - IGNORADO: Treino não é do mês atual`);
        }
      } catch (error) {
        console.error(`Erro ao processar treino #${index}:`, error);
      }
    });
    
    // Atualizar contador de treinos processados
    setDebugInfo(prev => ({...prev, processedWorkouts: processedCount}));
    
    console.log(`Total de treinos processados para o gráfico: ${processedCount}`);
    console.log("Dados mensais processados:", monthData);
    
    setMonthlyData(monthData);
  };
  
    // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#82CA9D', '#A4DE6C'];
  
  // Função para formatar rótulos de dia no eixo X
  const formatDayLabel = (date) => {
    if (!date || !isValid(date)) return '';
    return format(date, 'd', { locale: ptBR });
  };
  
  // Função para formatar datas no tooltip
  const formatTooltipDate = (date) => {
    if (!date || !isValid(date)) return '';
    return format(date, 'dd/MM/yyyy (EEEE)', { locale: ptBR });
  };
  
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
      
      {/* Tabs de navegação */}
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
              onClick={() => setActiveTab('atividade')}
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'atividade'
                  ? (darkMode ? 'text-blue-500 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-600')
                  : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600')
              }`}
            >
              Atividade
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
          
          {/* Informações de debug - pode ser removido na versão final */}
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white shadow text-gray-500'}`}>
            <h3 className="text-sm font-semibold mb-2">Informações de Processamento</h3>
            <p className="text-xs">Total de treinos: {debugInfo.totalWorkouts}, Processados para {debugInfo.currentMonth}: {debugInfo.processedWorkouts}</p>
          </div>
        </div>
      )}
      
      {/* Conteúdo da aba Atividade */}
      {activeTab === 'atividade' && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h3 className="text-lg font-semibold mb-4">Treinos por Dia ({format(currentDate, 'MMMM yyyy', { locale: ptBR })})</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDayLabel}
                  tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
                  interval={2}
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
                  allowDecimals={false}
                  domain={[0, dataMax => Math.max(1, dataMax)]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#FFFFFF' : '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'workouts') {
                      return [`${value} treino${value !== 1 ? 's' : ''}`, 'Quantidade'];
                    }
                    return [`${value} min`, 'Duração'];
                  }}
                  labelFormatter={(date) => formatTooltipDate(date)}
                />
                <Bar 
                  dataKey="workouts" 
                  name="Treinos"
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                >
                  {/* Destacar o dia atual com uma cor diferente */}
                  {monthlyData.map((entry, index) => {
                    const isCurrentDay = entry.day === currentDate.getDate();
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isCurrentDay ? '#10B981' : '#3B82F6'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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

