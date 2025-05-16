// src/pages/StatsPage.js
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useWorkout } from '../hooks/useWorkout';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const StatsPage = () => {
  const { workouts = [] } = useWorkout(); // Adicionando valor padrão de array vazio
  const { darkMode } = useContext(ThemeContext);
  const [timeFrame, setTimeFrame] = useState('week');
  
  // Verificamos se workouts existe antes de chamar filter
  const completedWorkouts = workouts ? workouts.filter(w => w.completed) : [];
  
  // Dados para o gráfico de frequência
  const getFrequencyData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = days.map(day => ({ name: day, workouts: 0 }));
    
    completedWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const dayIndex = date.getDay();
      data[dayIndex].workouts += 1;
    });
    
    return data;
  };
  
  // Dados para o gráfico de grupos musculares
  const getMuscleGroupData = () => {
    const muscleGroups = {};
    
    completedWorkouts.forEach(workout => {
      // Extrair o grupo muscular do nome do treino
      const groups = workout.name.split('+').map(g => g.trim());
      
      groups.forEach(group => {
        muscleGroups[group] = (muscleGroups[group] || 0) + 1;
      });
    });
    
    return Object.entries(muscleGroups).map(([name, value]) => ({ name, value }));
  };
  
  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  // Estatísticas gerais
  const getTotalWorkouts = () => completedWorkouts.length;
  
  const getTotalMinutes = () => {
    return completedWorkouts.reduce((total, workout) => {
      return total + (workout.duration || 0); // Usando || 0 para garantir que seja um número
    }, 0);
  };
  
  const getAverageWorkoutTime = () => {
    const totalWorkouts = getTotalWorkouts();
    return totalWorkouts > 0 ? Math.round(getTotalMinutes() / totalWorkouts) : 0;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estatísticas de Treino</h1>
      
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
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Frequência de Treinos</h2>
        
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
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getFrequencyData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
              />
              <YAxis 
                tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  color: darkMode ? '#FFFFFF' : '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Bar dataKey="workouts" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Grupos Musculares Treinados</h2>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getMuscleGroupData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getMuscleGroupData().map((entry, index) => (
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
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
