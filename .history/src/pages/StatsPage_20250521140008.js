// src/pages/StatsPage.js - Versão com frequência de treinos ajustada
import React, { useState, useContext, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { WorkoutContext } from '../context/WorkoutContext';
import { ThemeContext } from '../context/ThemeContext';
import ProgressTracker from '../components/workout/ProgressTracker';
import { format, parseISO, isAfter, isBefore, subDays, startOfWeek, endOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatsPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { 
    workouts,
    getCompletedWorkouts,
    getWorkoutStatsByPeriod
  } = useContext(WorkoutContext);
  
  const [timeFrame, setTimeFrame] = useState('week');
  const [activeTab, setActiveTab] = useState('resumo');
  
  // Estados para armazenar dados processados
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  
  // Processar dados quando workouts ou timeFrame mudam
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      // Obter treinos concluídos
      const completed = getCompletedWorkouts();
      setCompletedWorkouts(completed);
      
      // Obter treinos filtrados por período
      const filtered = getWorkoutStatsByPeriod(timeFrame);
      setFilteredWorkouts(filtered);
      
      // Log para debug
      console.log("Workouts totais:", workouts.length);
      console.log("Workouts concluídos:", completed.length);
      console.log("Workouts filtrados por período:", filtered.length);
      
      // Processar dados para os gráficos
      processChartData(filtered);
    }
  }, [workouts, timeFrame, getCompletedWorkouts, getWorkoutStatsByPeriod]);
  
  // Função para processar dados dos gráficos
  const processChartData = (filteredWorkouts) => {
    // Processar dados para o gráfico de frequência
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Inicializar com dados zerados
    const frequencyData = days.map(day => ({ name: day, workouts: 0 }));
    
    // Filtrar apenas treinos concluídos
    const completedWorkouts = filteredWorkouts.filter(workout => 
      workout.completed || workout.completedAt
    );
    
    console.log("Treinos concluídos para frequência:", completedWorkouts.length);
    
    // Contar treinos por dia da semana
    completedWorkouts.forEach(workout => {
      try {
        // Usar a data de conclusão se disponível, caso contrário usar a data normal
        const dateStr = workout.completedAt || workout.date;
        
        // Verificar se a data é válida
        if (!dateStr) {
          console.warn("Treino sem data:", workout);
          return;
        }
        
        // Converter para objeto Date
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
        
        if (isNaN(date.getTime())) {
          console.warn("Data inválida:", dateStr);
          return;
        }
        
        // Obter o dia da semana (0 = domingo, 6 = sábado)
        const dayIndex = date.getDay();
        
        // Incrementar contador
        frequencyData[dayIndex].workouts += 1;
        
        console.log(`Treino em ${format(date, 'EEEE', { locale: ptBR })}, contagem atualizada para ${frequencyData[dayIndex].workouts}`);
      } catch (error) {
        console.error("Erro ao processar data do treino:", error, workout);
      }
    });
    
    setFrequencyData(frequencyData);
    
    // Processar dados para o gráfico de grupos musculares
    const muscleGroups = {};
    
    filteredWorkouts.forEach(workout => {
      // Primeiro tentar usar a categoria do treino
      const category = workout.category || workout.type || 'Outros';
      muscleGroups[category] = (muscleGroups[category] || 0) + 1;
      
      // Se não houver categoria, tentar extrair do nome do treino
      if (!workout.category && workout.name) {
        const groups = workout.name.split('+').map(g => g.trim());
        
        groups.forEach(group => {
          if (group && group !== 'Treino') {
            muscleGroups[group] = (muscleGroups[group] || 0) + 1;
          }
        });
      }
    });
    
    const muscleGroupChartData = Object.entries(muscleGroups)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0); // Remover grupos com valor zero
    
    setMuscleGroupData(muscleGroupChartData);
  };
  
  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  // Estatísticas gerais
  const getTotalWorkouts = () => {
    return completedWorkouts.length;
  };
  
  const getTotalMinutes = () => {
    return completedWorkouts.reduce((total, workout) => {
      if (workout.duration) {
        return total + parseInt(workout.duration);
      }
      else if (workout.exercises && workout.exercises.length) {
        return total + (workout.exercises.length * 5);
      }
      return total;
    }, 0);
  };
  
  const getAverageWorkoutTime = () => {
    const totalWorkouts = getTotalWorkouts();
    const totalMinutes = getTotalMinutes();
    
    return totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
  };
  
  // Renderizar mensagem de carregamento se os dados ainda não estiverem prontos
  if (!workouts) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando estatísticas...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estatísticas de Treino</h1>
      
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
          {/* Debug info - remover após teste */}
          <div className="p-2 mb-4 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <p>Total de treinos: {workouts?.length || 0}</p>
            <p>Treinos concluídos: {completedWorkouts?.length || 0}</p>
            <p>Treinos no período: {filteredWorkouts?.length || 0}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm text-gray-500">Total de Treinos</p>
              <p className="text-3xl font-bold">{getTotalWorkouts()}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm text-gray-500">Minutos Treinados</p>
              <p className="text-3xl font-bold">{Math.round(getTotalMinutes())}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-sm text-gray-500">Média por Treino</p>
              <p className="text-3xl font-bold">{getAverageWorkoutTime()} min</p>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setTimeFrame('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  timeFrame === 'week'
                    ? 'bg-blue-500 text-white'
                    : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('month')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  timeFrame === 'month'
                    ? 'bg-blue-500 text-white'
                    : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Mês
              </button>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Frequência de Treinos</h2>
            
            <div className="h-64">
              {frequencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={frequencyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
                      allowDecimals={false}
                      domain={[0, 'dataMax + 1']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        color: darkMode ? '#FFFFFF' : '#000000',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                      }}
                      formatter={(value) => [`${value} treino${value !== 1 ? 's' : ''}`, 'Quantidade']}
                    />
                    <Bar dataKey="workouts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Nenhum treino concluído no período selecionado</p>
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
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
                      formatter={(value, name, props) => [`${value} treino${value !== 1 ? 's' : ''}`, props.payload.name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Nenhum grupo muscular treinado no período selecionado</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <ProgressTracker />
        </div>
      )}
    </div>
  );
};

export default StatsPage;
