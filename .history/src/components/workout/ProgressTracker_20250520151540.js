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

  const handleDaySelect = (day) => {
    setSelectedDay(day.date);
  };

  const getTotalWorkouts = () => {
    // Retorna o total de treinos concluídos no período selecionado
    if (selectedPeriod === 'week') {
      return weeklyData.reduce((sum, day) => sum + day.count, 0);
    }
    return 0;
  };

  const getAverageWorkoutsPerDay = () => {
    const total = getTotalWorkouts();
    if (selectedPeriod === 'week') {
      return (total / 7).toFixed(1);
    }
    return 0;
  };

  const getMostActiveDay = () => {
    if (weeklyData.length === 0) return null;
    
    const mostActive = weeklyData.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
    
    return mostActive.count > 0 ? mostActive : null;
  };

  const mostActiveDay = getMostActiveDay();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Progresso de Treino</Text>
        
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'week' && { color: colors.white }
            ]}>Semana</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && { color: colors.white }
            ]}>Mês</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Treinos Concluídos</Text>
        
        <BarChart
          data={getChartData()}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero={true}
          showBarTops={true}
          withInnerLines={false}
          style={styles.chart}
        />
        
        <View style={styles.daySelector}>
          {weeklyData.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                isSameDay(day.date, selectedDay) && { backgroundColor: colors.primaryLight }
              ]}
              onPress={() => handleDaySelect(day)}
            >
              <Text style={[
                styles.dayButtonText,
                isSameDay(day.date, selectedDay) && { color: colors.primary, fontWeight: 'bold' }
              ]}>
                {format(day.date, 'EEE', { locale: ptBR })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>Estatísticas</Text>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="calendar-check" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{getTotalWorkouts()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total de Treinos</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{getAverageWorkoutsPerDay()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Média Diária</Text>
          </View>
        </View>
        
        {mostActiveDay && mostActiveDay.count > 0 && (
          <View style={styles.bestDayContainer}>
            <MaterialCommunityIcons name="trophy" size={24} color={colors.accent} />
            <Text style={[styles.bestDayText, { color: colors.text }]}>
              Dia mais ativo: {mostActiveDay.day} ({mostActiveDay.count} treinos)
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  periodButtonText: {
    fontWeight: '500',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dayButtonText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  bestDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bestDayText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProgressTracker;
