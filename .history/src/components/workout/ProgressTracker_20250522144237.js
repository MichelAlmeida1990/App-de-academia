import React, { useState, useMemo, useCallback } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, Typography, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWorkout } from '../contexts/WorkoutContext';
import ProgressChart from './ProgressChart';
import NoDataMessage from './NoDataMessage';

const ProgressTracker = () => {
  const theme = useTheme();
  const { workouts } = useWorkout();
  const [selectedTab, setSelectedTab] = useState(0);

  console.log("Processando dados de progresso...");

  // Função para obter treinos completados
  const getCompletedWorkouts = useCallback(() => {
    if (!workouts || workouts.length === 0) {
      console.log("Nenhum treino disponível no contexto");
      return [];
    }
    
    console.log("Total de treinos no contexto:", workouts.length);
    
    // Filtrar apenas treinos marcados como completados
    const completedWorkouts = workouts.filter(workout => {
      const isCompleted = workout.completed === true;
      
      // Verificar se o treino tem uma data válida
      const hasDate = !!workout.date || !!workout.completedAt || !!workout.completionDate;
      
      // Log para depuração
      if (isCompleted) {
        console.log(`Treino completado: ${workout.name || workout.id}, data: ${workout.date || workout.completedAt}`);
      }
      
      return isCompleted && hasDate;
    });
    
    console.log("Treinos completados:", completedWorkouts.length);
    return completedWorkouts;
  }, [workouts]);

  // Processar dados para o gráfico
  const processWorkoutData = useCallback(() => {
    const completedWorkouts = getCompletedWorkouts();
    console.log("Treinos completados processados:", completedWorkouts.length);
    
    if (completedWorkouts.length === 0) {
      console.log("Nenhum treino completado encontrado, inicializando com zeros");
      return {
        labels: [],
        datasets: [],
        totalCompleted: 0,
        totalDuration: 0,
        weeklyAverage: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }

    // Ordenar treinos por data
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
      const dateA = parseWorkoutDate(a);
      const dateB = parseWorkoutDate(b);
      return dateA - dateB;
    });

    // Agrupar treinos por semana
    const workoutsByWeek = {};
    sortedWorkouts.forEach(workout => {
      const date = parseWorkoutDate(workout);
      if (!date) return;

      const weekStart = format(startOfWeek(date, { locale: ptBR }), 'yyyy-MM-dd');
      if (!workoutsByWeek[weekStart]) {
        workoutsByWeek[weekStart] = {
          count: 0,
          duration: 0,
          dates: new Set()
        };
      }
      
      workoutsByWeek[weekStart].count += 1;
      workoutsByWeek[weekStart].duration += workout.duration || 0;
      workoutsByWeek[weekStart].dates.add(format(date, 'yyyy-MM-dd'));
    });

    // Preparar dados para o gráfico
    const labels = Object.keys(workoutsByWeek).map(weekStart => {
      const start = format(parseISO(weekStart), 'dd/MM');
      const end = format(endOfWeek(parseISO(weekStart), { locale: ptBR }), 'dd/MM');
      return `${start} - ${end}`;
    });

    const datasets = [
      {
        label: 'Treinos por Semana',
        data: Object.values(workoutsByWeek).map(week => week.count),
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
      {
        label: 'Duração Total (min)',
        data: Object.values(workoutsByWeek).map(week => week.duration),
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
      }
    ];

    // Calcular estatísticas adicionais
    const totalCompleted = sortedWorkouts.length;
    const totalDuration = sortedWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    
    // Calcular média semanal
    const weeks = Object.keys(workoutsByWeek).length;
    const weeklyAverage = weeks > 0 ? (totalCompleted / weeks).toFixed(1) : 0;
    
    // Calcular sequências (streaks)
    const { currentStreak, longestStreak } = calculateStreaks(sortedWorkouts);

    return {
      labels,
      datasets,
      totalCompleted,
      totalDuration,
      weeklyAverage,
      currentStreak,
      longestStreak
    };
  }, [getCompletedWorkouts, theme.palette.primary.main, theme.palette.secondary.main]);

  // Calcular sequências de treinos
  const calculateStreaks = (sortedWorkouts) => {
    if (sortedWorkouts.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const workoutDates = sortedWorkouts.map(workout => {
      const date = parseWorkoutDate(workout);
      return date ? format(date, 'yyyy-MM-dd') : null;
    }).filter(Boolean);

    // Remover datas duplicadas
    const uniqueDates = [...new Set(workoutDates)].sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calcular a sequência atual
    const today = format(new Date(), 'yyyy-MM-dd');
    let lastDate = today;
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = uniqueDates[i];
      const diff = differenceInDays(parseISO(lastDate), parseISO(date));
      
      if (diff <= 1) {
        tempStreak++;
        lastDate = date;
      } else {
        break;
      }
    }
    
    currentStreak = tempStreak;
    
    // Calcular a sequência mais longa
    tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = differenceInDays(parseISO(uniqueDates[i]), parseISO(uniqueDates[i-1]));
      
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { currentStreak, longestStreak };
  };

  // Função auxiliar para analisar a data de um treino
  const parseWorkoutDate = (workout) => {
    const dateString = workout.date || workout.completedAt || workout.completionDate;
    if (!dateString) return null;
    
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error('Erro ao analisar data do treino:', error);
      return null;
    }
  };

  // Processar dados
  const progress = useMemo(() => processWorkoutData(), [processWorkoutData]);

  // Verificar se há dados disponíveis
  const hasNoData = useMemo(() => {
    const noWorkouts = !workouts || workouts.length === 0;
    
    // Se não houver treinos, não há dados
    if (noWorkouts) return true;
    
    // Verificar se há treinos completados
    const hasCompletedWorkouts = workouts.some(workout => workout.completed === true);
    
    return !hasCompletedWorkouts;
  }, [workouts]);

  // Manipulador de mudança de aba
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Renderizar conteúdo com base na aba selecionada
  const renderTabContent = () => {
    if (hasNoData) {
      return <NoDataMessage message="Nenhum treino concluído encontrado. Complete seus treinos para ver seu progresso aqui." />;
    }

    switch (selectedTab) {
      case 0: // Visão Geral
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <ProgressChart 
                labels={progress.labels} 
                datasets={progress.datasets} 
                height={200}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <StatCard 
                title="Total de Treinos" 
                value={progress.totalCompleted} 
                color={theme.palette.primary.main}
              />
              <StatCard 
                title="Duração Total" 
                value={`${progress.totalDuration} min`} 
                color={theme.palette.secondary.main}
              />
              <StatCard 
                title="Média Semanal" 
                value={progress.weeklyAverage} 
                color={theme.palette.info.main}
              />
              <StatCard 
                title="Sequência Atual" 
                value={progress.currentStreak} 
                color={theme.palette.success.main}
              />
              <StatCard 
                title="Maior Sequência" 
                value={progress.longestStreak} 
                color={theme.palette.warning.main}
              />
            </Box>
          </Box>
        );
      case 1: // Histórico
        return (
          <Box>
            {/* Implementar visualização de histórico detalhado aqui */}
            <Typography variant="body1">
              Histórico detalhado de treinos será implementado em breve.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  // Componente para exibir estatísticas em cards
  const StatCard = ({ title, value, color }) => (
    <Card sx={{ minWidth: 140, flex: '1 0 auto' }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ color }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (!workouts) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Progresso Recente
        </Typography>
        
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Visão Geral" />
          <Tab label="Histórico" />
        </Tabs>
        
        {renderTabContent()}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
