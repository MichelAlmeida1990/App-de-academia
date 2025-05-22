import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { format, subMonths, subWeeks, isWithinInterval, parseISO } from 'date-fns';
import LocalStorageService from '../services/LocalStorageService';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    general: {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0,
    },
    muscleGroups: [],
  });

  // Carregar treinos do localStorage ao iniciar
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const savedWorkouts = await LocalStorageService.getWorkouts();
        setWorkouts(savedWorkouts || []);
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  // Salvar treinos no localStorage sempre que forem atualizados
  useEffect(() => {
    if (!loading) {
      LocalStorageService.saveWorkouts(workouts);
    }
  }, [workouts, loading]);

  // Adicionar um novo treino
  const addWorkout = useCallback(async (workout) => {
    const newWorkout = {
      ...workout,
      id: `workout_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false, // Garantir que todos os treinos novos tenham esta propriedade
    };

    setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
    return newWorkout;
  }, []);

  // Atualizar um treino existente
  const updateWorkout = useCallback((workoutId, updatedData) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => 
        workout.id === workoutId ? { ...workout, ...updatedData } : workout
      )
    );
  }, []);

  // Excluir um treino
  const deleteWorkout = useCallback((workoutId) => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== workoutId));
  }, []);

  // Marcar um treino como concluído
  const markWorkoutAsCompleted = useCallback((workoutId) => {
    console.log(`Treino ${workoutId} marcado como concluído`);
    
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => {
        if (workout.id === workoutId) {
          // Log para depurar o estado do treino antes da atualização
          console.log('Estado do treino antes de marcar como concluído:', 
            JSON.stringify(workout, null, 2));
          
          const updatedWorkout = {
            ...workout,
            completed: true, // Usar uma única propriedade consistente
            completedAt: new Date().toISOString(),
            date: workout.date || format(new Date(), 'yyyy-MM-dd'), // Garantir que há uma data
          };
          
          // Log para depurar o estado do treino após a atualização
          console.log('Estado do treino após marcar como concluído:', 
            JSON.stringify(updatedWorkout, null, 2));
            
          return updatedWorkout;
        }
        return workout;
      })
    );
  }, []);

  // Obter treinos concluídos
  const getCompletedWorkouts = useCallback(() => {
    if (!workouts || workouts.length === 0) {
      console.log('Obtendo treinos concluídos...');
      console.log('Nenhum treino disponível, retornando array vazio');
      return [];
    }

    const completedWorkouts = workouts.filter(workout => workout.completed === true);
    
    console.log(`Total de treinos concluídos encontrados: ${completedWorkouts.length}`);
    
    // Adicionar logs para depuração
    if (completedWorkouts.length > 0) {
      completedWorkouts.forEach(workout => {
        console.log(`Treino concluído encontrado: ${workout.name} (${workout.id})`);
      });
    }
    
    return completedWorkouts;
  }, [workouts]);

  // Obter estatísticas para um período específico
  const getStatsForPeriod = useCallback((period) => {
    console.log(`Obtendo estatísticas para o período: ${period}`);
    
    const completedWorkouts = getCompletedWorkouts();
    
    if (completedWorkouts.length === 0) {
      console.log('Nenhum treino concluído disponível para estatísticas');
      return {
        workouts: [],
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0,
      };
    }

    const now = new Date();
    let startDate;

    // Determinar o intervalo de datas com base no período
    if (period === 'week') {
      startDate = subWeeks(now, 1);
    } else if (period === 'month') {
      startDate = subMonths(now, 1);
    } else if (period === 'all') {
      // Usar uma data bem antiga para incluir todos os treinos
      startDate = new Date(2000, 0, 1);
    } else {
      startDate = subMonths(now, 1); // Padrão: último mês
    }

    console.log(`Filtrando treinos do último ${period}: ${startDate.toISOString()} até ${now.toISOString()}`);

    // Filtrar treinos pelo período
    const filteredWorkouts = completedWorkouts.filter(workout => {
      const workoutDate = parseWorkoutDate(workout);
      
      if (!workoutDate) {
        return false;
      }
      
      const isInPeriod = isWithinInterval(workoutDate, { start: startDate, end: now });
      
      if (isInPeriod) {
        console.log(`Treino dentro do período: ${workout.name}, data: ${workoutDate.toISOString()}`);
      }
      
      return isInPeriod;
    });

    console.log(`Total de treinos filtrados para o período ${period}: ${filteredWorkouts.length}`);

    return {
      workouts: filteredWorkouts,
      totalWorkouts: filteredWorkouts.length,
      totalDuration: filteredWorkouts.reduce((total, workout) => total + (workout.duration || 0), 0),
      averageDuration: filteredWorkouts.length > 0 
        ? filteredWorkouts.reduce((total, workout) => total + (workout.duration || 0), 0) / filteredWorkouts.length 
        : 0,
    };
  }, [getCompletedWorkouts]);

  // Obter estatísticas de grupos musculares
  const getMuscleGroupStats = useCallback((period) => {
    console.log(`Obtendo estatísticas de grupos musculares para o período: ${period}`);
    
    const { workouts: filteredWorkouts } = getStatsForPeriod(period);
    
    if (filteredWorkouts.length === 0) {
      return [];
    }

    const muscleGroupsMap = new Map();

    filteredWorkouts.forEach(workout => {
      // Tentar extrair o grupo muscular do nome ou da propriedade específica
      let muscleGroup = workout.muscleGroup;
      
      // Se não houver propriedade específica, tentar extrair do nome
      if (!muscleGroup && workout.name) {
        const nameParts = workout.name.split('-');
        if (nameParts.length > 1) {
          muscleGroup = nameParts[1].trim();
          console.log(`Grupo muscular encontrado (via nome): ${muscleGroup}`);
        }
      }

      if (muscleGroup) {
        if (!muscleGroupsMap.has(muscleGroup)) {
          muscleGroupsMap.set(muscleGroup, { name: muscleGroup, count: 0, duration: 0 });
        }
        
        const stats = muscleGroupsMap.get(muscleGroup);
        stats.count += 1;
        stats.duration += workout.duration || 0;
      }
    });

    const muscleGroupStats = Array.from(muscleGroupsMap.values());
    console.log('Estatísticas de grupos musculares processadas:', muscleGroupStats);
    
    return muscleGroupStats;
  }, [getStatsForPeriod]);

  // Obter estatísticas gerais
  const getGeneralStats = useCallback((period) => {
    console.log(`Obtendo estatísticas gerais para o período: ${period}`);
    
    const { workouts: filteredWorkouts, totalWorkouts, totalDuration, averageDuration } = getStatsForPeriod(period);
    
    let totalExercises = 0;
    let totalSets = 0;
    let totalReps = 0;

    filteredWorkouts.forEach(workout => {
      console.log(`Treino ${workout.name}: duração ${workout.duration} minutos`);
      
      if (workout.exercises) {
        totalExercises += workout.exercises.length;
        
        workout.exercises.forEach(exercise => {
          if (exercise.sets) {
            totalSets += exercise.sets.length;
            
            exercise.sets.forEach(set => {
              totalReps += set.reps || 0;
            });
          }
        });
      }
    });

    const stats = {
      totalWorkouts,
      totalDuration,
      averageDuration,
      totalExercises,
      totalSets,
      totalReps,
    };
    
    console.log('Estatísticas gerais calculadas:', stats);
    
    return stats;
  }, [getStatsForPeriod]);

  // Atualizar estatísticas
  const updateStats = useCallback((period = 'month') => {
    const generalStats = getGeneralStats(period);
    const muscleGroupStats = getMuscleGroupStats(period);
    
    setStats({
      general: generalStats,
      muscleGroups: muscleGroupStats,
    });
  }, [getGeneralStats, getMuscleGroupStats]);

  // Função auxiliar para analisar a data de um treino
  const parseWorkoutDate = (workout) => {
    // Tentar várias propriedades possíveis para a data
    const dateString = workout.date || workout.completedAt || workout.completionDate;
    
    if (!dateString) {
      return null;
    }
    
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error(`Erro ao analisar data do treino: ${dateString}`, error);
      return null;
    }
  };

  // Valor do contexto
  const contextValue = {
    workouts,
    loading,
    stats,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    markWorkoutAsCompleted,
    getCompletedWorkouts,
    getStatsForPeriod,
    getMuscleGroupStats,
    getGeneralStats,
    updateStats,
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
