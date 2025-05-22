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
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B
