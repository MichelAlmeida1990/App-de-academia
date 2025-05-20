import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useWorkout } from '../hooks/useWorkout';
import { useTheme } from '../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const ProgressTracker = () => {
  const { getCompletedWorkouts } = useWorkout();
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    generateWeeklyData();
  }, [selectedPeriod]);

  const generateWeeklyData = () => {
    // Gerar dados para os últimos 7 dias
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      // Usar a função getCompletedWorkouts com a data específica
      const completedWorkoutsForDay = getCompletedWorkouts(date);
      
      return {
        date: date,
        day: format(date, 'EEEE', { locale: ptBR }),
        formattedDate: format(date, 'dd/MM'),
        count: completedWorkoutsForDay.length // Número de treinos concluídos neste dia
      };
    });
    
    setWeeklyData(last7Days);
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(${colors.primary.replace('rgb(', '').replace(')', '')}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${colors.text.replace('rgb(', '').replace(')', '')}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    useShadowColorFromDataset: false,
  };

  const getChartData = () => {
    return {
      labels: weeklyData.map(day => day.formattedDate),
      datasets: [
        {
          data: weeklyData.map(day => day.count),
          colors: weeklyData.map((day, index) => 
            isSameDay(day.date, selectedDay) 
              ? (opacity = 1) => `rgba(${colors.accent.replace('rgb(', '').replace(')', '')}, ${opacity})`
              : (opacity = 1) => `rgba(${colors.primary.replace('rgb(', '').replace(')', '')}, ${opacity})`
          )
        }
      ]
    };
  };
