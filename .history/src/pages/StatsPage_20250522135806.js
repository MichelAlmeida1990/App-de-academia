// src/pages/StatsPage.js - Versão corrigida para processar corretamente os treinos salvos
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
    completedWorkouts,
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
  
  // Processar dados quando o componente montar ou quando workouts/completedWorkouts mudar
  useEffect(() => {
    console.log("Processando dados de treinos...");
    console.log("Treinos disponíveis:", workouts?.length || 0);
    console.log("Treinos completados:", completedWorkouts?.length || 0);
    
    // Processar estatísticas gerais
    const stats = getGeneralStats(timeFrame);
    setGeneralStats(stats);
    
    // Processar dados de grupos musculares
    const muscleGroups = getMuscleGroupStats(timeFrame);
    setMuscleGroupData(muscleGroups || []);
    
    // Processar dados mensais
    processMonthlyData();
  }, [timeFrame, workouts, completedWorkouts]);
  
  // Função para processar dados mensais
  const processMonthlyData = () => {
    // Obter todos os treinos concluídos
    const allCompletedWorkouts = getCompletedWorkouts() || [];
    
    console.log("Total de treinos concluídos:", allCompletedWorkouts.length);
    
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
    const daysInMonth = getDaysInMonth(currentDate);
    
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
    allCompletedWorkouts.forEach(workout => {
      try {
        // Verificar se o treino tem data
        const workoutDate = workout.completedAt 
          ? new Date(workout.completedAt) 
          : workout.date 
            ? new Date(workout.date) 
            : null;
        
        // Se não tiver data, pular
        if (!workoutDate || !isValid(workoutDate)) {
          console.log("Treino sem data válida:", workout);
          return;
        }
        
        // Verificar se o treino é do mês atual
        if (workoutDate.getFullYear() === currentYear && workoutDate.getMonth() === currentMonth) {
          const day = workoutDate.getDate();
          
          // Verificar se o dia está dentro do intervalo válido
          if (day >= 1 && day <= daysInMonth) {
            monthData[day - 1].workouts += 1;
            
            // Adicionar duração (com valor padrão se não existir)
            const duration = workout.duration || workout.estimatedTime || 30;
            monthData[day - 1].minutes += parseInt(duration);
            
            processedCount++;
            console.log(`Treino processado: dia ${day}, duração ${duration}min`);
          }
        }
      } catch (error) {
        console.error("Erro ao processar treino:", error, workout);
      }
    });
    
    // Atualizar contador de treinos processados
    setDebugInfo(prev => ({...prev, processedWorkouts: processedCount}));
    
    // Verificar se algum treino foi processado
    const hasWorkouts = monthData.some(data => data.workouts > 0);
    
    if (!hasWorkouts) {
      console.log("Nenhum treino encontrado para o mês atual. Verificando dados brutos...");
      
      // Log detalhado de todos os treinos para depuração
      allCompletedWorkouts.forEach((workout, index) => {
        const date = workout.completedAt || workout.date;
        console.log(`Treino #${index}:`, {
          id: workout.id,
          name: workout.name,
          date: date,
          parsedDate: date ? new Date(date) : 'N/A',
          duration: workout.duration || workout.estimatedTime
        });
      });
    }
    
    setMonthlyData(monthData);
  };
  
  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  // Formatar dia da semana abreviado
  const formatDayLabel = (date) => {
    return format(new Date(date), 'd', { locale: ptBR });
  };
  
  // Formatar tooltip para mostrar dia e data completa
  const formatTooltipDate = (date) => {
    return format(new Date(date), "d 'de' MMMM", { locale: ptBR });
  };
  
  // Dia atual
  const currentDay = currentDate.getDate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estatísticas de Treino</h1>
      
      {/* Informações de debug */}
      <div className="text-xs text-gray-500 italic">
        <p>Data atual: {format(currentDate, "dd/MM/yyyy")}</p>
        <p>Total de treinos: {debugInfo.totalWorkouts}, Processados para {debugInfo.currentMonth}: {debugInfo.processedWorkouts}</p>
      </div>
      
      <div className="flex mb-6 space-x-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('resumo')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'resumo' 
              ? 'bg-blue-500 text-white' 
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Resumo
        </button>
        <button 
          onClick={() => setActiveTab('progresso')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'progresso' 
              ? 'bg-blue-500 text-white' 
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Progresso Detalhado
        </button>
      </div>
      
      {activeTab === 'resumo' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm text-gray-500">Total de Treinos</p>
              <p className="text-3xl font-bold">{generalStats.totalWorkouts}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm text-gray-500">Minutos Treinados</p>
              <p className="text-3xl font-bold">{generalStats.totalMinutes}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm text-gray-500">Média por Treino</p>
              <p className="text-3xl font-bold">{generalStats.averageMinutes} min</p>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">
              Treinos de {format(currentDate, 'MMMM/yyyy', { locale: ptBR })}
            </h2>
            
            <div className="h-64">
              {monthlyData.length > 0 ? (
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
                      interval={2} // Mostrar apenas alguns dias para não sobrecarregar o eixo X
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
                      allowDecimals={false}
                      domain={[0, dataMax => Math.max(1, dataMax)]} // Garante que o eixo Y vai até pelo menos 1
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
                      minPointSize={5} // Garante que mesmo valores pequenos tenham uma altura mínima visível
                    >
                      {/* Destacar o dia atual com uma cor diferente */}
                      {monthlyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.day === currentDay ? '#10B981' : '#3B82F6'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Nenhum treino registrado neste mês.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Grupos Musculares Treinados</h2>
            
            <div className="h-64">
              {muscleGroupData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={muscleGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {muscleGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} treino${value !== 1 ? 's' : ''}`, name]}
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#000000',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Nenhum dado disponível para exibir.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ProgressTracker />
        </div>
      )}
      
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setTimeFrame('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            timeFrame === 'week' 
              ? 'bg-blue-500 text-white' 
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => setTimeFrame('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            timeFrame === 'month' 
              ? 'bg-blue-500 text-white' 
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Mês
        </button>
        <button
          onClick={() => setTimeFrame('year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            timeFrame === 'year' 
              ? 'bg-blue-500 text-white' 
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Ano
        </button>
      </div>
      
      {/* Botão para reprocessar dados */}
      <div className="flex justify-center">
        <button
          onClick={processMonthlyData}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          Reprocessar dados
        </button>
      </div>
    </div>
  );
};

export default StatsPage;
