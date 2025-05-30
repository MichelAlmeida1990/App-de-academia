import { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export const useWorkout = (workoutId) => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  
  const { workouts, updateWorkout, deleteWorkout, refreshWorkouts: contextRefreshWorkouts } = context;
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personalRecords, setPersonalRecords] = useState({});

  // Função para atualizar os dados do treino atual
  const refreshWorkout = async () => {
    if (!workoutId) return;
    
    try {
      setLoading(true);
      // Se o contexto tiver uma função refreshWorkouts, use-a primeiro
      if (contextRefreshWorkouts) {
        await contextRefreshWorkouts();
      }
      
      // Encontrar o treino pelo ID no contexto atualizado
      const foundWorkout = workouts.find(w => w.id === workoutId);
      
      if (foundWorkout) {
        setWorkout(foundWorkout);
      } else {
        setError('Treino não encontrado');
      }
    } catch (err) {
      console.error('Erro ao atualizar treino:', err);
      setError('Falha ao atualizar o treino');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true; 

    if (!workoutId) {
      if (isMounted) {
        setLoading(false); 
      }
      return; 
    }

    const fetchWorkoutById = async () => {
      if (isMounted) setLoading(true);
      try {
        const foundWorkout = workouts.find(w => w.id === workoutId);
        if (isMounted) { 
          if (foundWorkout) {
            setWorkout(foundWorkout);
            setError(null); 
          } else {
            setError('Treino não encontrado'); 
          }
        }
      } catch (err) {
        console.error(`Erro ao buscar treino com ID ${workoutId}:`, err);
        if (isMounted) {
          setError(`Falha ao carregar o treino ${workoutId}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWorkoutById();

    return () => {
      isMounted = false; 
    };
  }, [workoutId, workouts]);

  const saveWorkout = async (updatedWorkout) => {
    try {
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      return false;
    }
  };

  const removeWorkout = async () => {
    try {
      if (!workout) return false;
      await deleteWorkout(workout.id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      return false;
    }
  };

  // Função para marcar um exercício como concluído
  const markExerciseCompleted = async (exerciseIndex, completed = true) => {
    if (!workout) return false;
    
    try {
      const updatedWorkout = { ...workout };
      updatedWorkout.exercises[exerciseIndex].completed = completed;
      
      // Atualizar a data de conclusão se todos os exercícios estiverem concluídos
      const allCompleted = updatedWorkout.exercises.every(ex => ex.completed);
      if (allCompleted) {
        updatedWorkout.completedAt = new Date().toISOString();
        updatedWorkout.completed = true;
      } else {
        // Se algum exercício não estiver concluído, remover a data de conclusão
        delete updatedWorkout.completedAt;
        updatedWorkout.completed = false;
      }
      
      // Calcular o progresso geral (porcentagem de exercícios concluídos)
      const completedCount = updatedWorkout.exercises.filter(ex => ex.completed).length;
      updatedWorkout.progress = Math.round((completedCount / updatedWorkout.exercises.length) * 100);
      
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao marcar exercício como concluído:', error);
      return false;
    }
  };

  // Função para marcar um treino como concluído manualmente
  const completeWorkout = async (duration = null) => {
    if (!workout) return false;
    
    try {
      const updatedWorkout = { ...workout };
      
      // Marcar todos os exercícios como concluídos
      updatedWorkout.exercises = updatedWorkout.exercises.map(ex => ({
        ...ex,
        completed: true
      }));
      
      // Atualizar informações de conclusão
      updatedWorkout.completedAt = new Date().toISOString();
      updatedWorkout.completed = true;
      updatedWorkout.progress = 100;
      
      // Adicionar duração se fornecida
      if (duration) {
        updatedWorkout.duration = duration;
      } else if (!updatedWorkout.duration && updatedWorkout.exercises) {
        // Estimar duração baseada no número de exercícios (5 min por exercício)
        updatedWorkout.duration = updatedWorkout.exercises.length * 5;
      }
      
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao concluir treino:', error);
      return false;
    }
  };

  // Função para resetar o progresso de um treino
  const resetWorkoutProgress = async () => {
    if (!workout) return false;
    
    try {
      const updatedWorkout = { ...workout };
      updatedWorkout.exercises = updatedWorkout.exercises.map(ex => ({
        ...ex,
        completed: false
      }));
      
      // Remover data de conclusão e zerar progresso
      delete updatedWorkout.completedAt;
      updatedWorkout.completed = false;
      updatedWorkout.progress = 0;
      
      await updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      return true;
    } catch (error) {
      console.error('Erro ao resetar progresso do treino:', error);
      return false;
    }
  };

  // Função para obter todos os treinos concluídos, opcionalmente filtrados por data
  const getCompletedWorkouts = (date = null) => {
    // Garantir que estamos trabalhando com a lista completa de treinos do contexto
    const completedWorkouts = workouts.filter(w => w.completed || w.completedAt);
    
    if (!date) {
      return completedWorkouts;
    }
    
    // Se uma data for fornecida, filtrar por essa data específica
    return completedWorkouts.filter(workout => {
      if (!workout.completedAt) return false;
      
      const workoutDate = new Date(workout.completedAt);
      const targetDate = new Date(date);
      
      return workoutDate.getFullYear() === targetDate.getFullYear() &&
             workoutDate.getMonth() === targetDate.getMonth() &&
             workoutDate.getDate() === targetDate.getDate();
    });
  };

  // Função para obter estatísticas por período
  const getWorkoutStatsByPeriod = (period = 'week') => {
    const now = new Date();
    let startDate;
    
    if (period === 'week') {
      // Últimos 7 dias
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      // Últimos 30 dias
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    } else {
      // Padrão: últimos 7 dias
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }
    
    // Filtrar treinos concluídos dentro do período
    return workouts.filter(workout => {
      // Usar a data de conclusão se disponível, caso contrário usar a data de criação
      const workoutDate = new Date(workout.completedAt || workout.date);
      // Incluir apenas treinos concluídos
      return (workout.completed || workout.completedAt) && 
             workoutDate >= startDate && 
             workoutDate <= now;
    });
  };

  // Função para obter o progresso do treino atual
  const getWorkoutProgress = () => {
    if (!workout || !workout.exercises || workout.exercises.length === 0) {
      return 0;
    }
    
    const completedCount = workout.exercises.filter(ex => ex.completed).length;
    return Math.round((completedCount / workout.exercises.length) * 100);
  };

  const getAllExercises = () => {
    if (!workouts || workouts.length === 0) {
      return [];
    }
    const allExercisesSet = new Set();
    workouts.forEach(workout => {
      if (workout.exercises && workout.exercises.length > 0) {
        workout.exercises.forEach(exercise => {
          // Assumindo que o nome do exercício é o que está sendo usado como valor/chave
          // Se o objeto 'exercise' for uma string, adicione diretamente
          // Se for um objeto com uma propriedade 'name', use exercise.name
          if (typeof exercise === 'string') {
            allExercisesSet.add(exercise);
          } else if (exercise && typeof exercise.name === 'string') {
            allExercisesSet.add(exercise.name);
          }
        });
      }
    });
    return Array.from(allExercisesSet);
  };

  // Função para obter o histórico de progresso de um exercício específico
  const getExerciseProgressHistory = (exerciseName) => {
    const history = [];
    if (!workouts || typeof exerciseName !== 'string' || exerciseName.trim() === '') {
      return history; 
    }

    workouts.forEach(w => {
      if (w.completed && w.exercises) { 
        w.exercises.forEach(ex => {
          let currentExerciseName = '';
          let currentWeight = null;

          if (typeof ex === 'string') {
            // Tratar se o exercício for apenas uma string (sem peso)
            // currentExerciseName = ex; 
          } else if (ex && typeof ex.name === 'string') {
            currentExerciseName = ex.name;
            currentWeight = ex.weight; 
          }

          if (currentExerciseName === exerciseName && typeof currentWeight === 'number' && w.completedAt) {
            history.push({
              date: w.completedAt, 
              weight: currentWeight 
            });
          }
        });
      }
    });
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Calcular/Atualizar recordes pessoais quando os treinos mudam
  useEffect(() => {
    const calculatedRecords = {};
    if (workouts) {
      workouts.forEach(w => {
        if (w.completed && w.exercises) {
          w.exercises.forEach(ex => {
            let exName = '';
            let exWeight = 0;

            if (typeof ex === 'string') {
              // exName = ex; // Se o exercício for string, pode não ter peso associado para recorde
            } else if (ex && typeof ex.name === 'string' && typeof ex.weight === 'number') {
              exName = ex.name;
              exWeight = ex.weight;
            }
            
            if (exName && exWeight > (calculatedRecords[exName] || 0)) {
              calculatedRecords[exName] = exWeight;
            }
          });
        }
      });
    }
    setPersonalRecords(calculatedRecords);
  }, [workouts]);

  const getWorkoutStats = () => {
    const totalWorkouts = workouts ? workouts.length : 0;
    const completedWorkouts = workouts ? workouts.filter(w => w.completed || w.completedAt).length : 0;
    return {
      totalWorkouts,
      completedWorkouts,
    };
  };

  const calculateCurrentStreak = () => {
    if (!workouts || workouts.length === 0) return 0;

    const completedDates = workouts
      .filter(w => w.completed && w.completedAt)
      .map(w => new Date(w.completedAt).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);

    if (completedDates.length === 0) return 0;

    const uniqueDates = [...new Set(completedDates)];
    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0,0,0,0);
    
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0;
    }
    
    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const currentDay = new Date(uniqueDates[i]);
      const previousDayInArray = new Date(uniqueDates[i+1]);
      
      const expectedPreviousDay = new Date(currentDay);
      expectedPreviousDay.setDate(currentDay.getDate() - 1);

      if (previousDayInArray.getTime() === expectedPreviousDay.getTime()) {
        streak++;
      } else {
        break; 
      }
    }
    return streak;
  };

  const getUnlockedAchievements = () => {
    const unlocked = [];
    const stats = getWorkoutStats();
    const recordsCount = personalRecords ? Object.keys(personalRecords).length : 0;
    const currentStreak = calculateCurrentStreak();

    // Conquistas de Treino
    if (stats.completedWorkouts >= 1) unlocked.push('firstWorkout');
    if (stats.completedWorkouts >= 10) unlocked.push('tenWorkouts');
    if (stats.completedWorkouts >= 25) unlocked.push('twentyFiveWorkouts');
    if (stats.completedWorkouts >= 50) unlocked.push('fiftyWorkouts');
    if (stats.completedWorkouts >= 100) unlocked.push('hundredWorkouts');

    // Conquistas de Recorde Pessoal
    if (recordsCount >= 1) unlocked.push('firstRecord');
    if (recordsCount >= 5) unlocked.push('fiveRecords');
    if (recordsCount >= 10) unlocked.push('tenRecords');
    
    // Conquistas de Sequência de Dias
    if (currentStreak >= 3) unlocked.push('threeConsecutiveDays');
    if (currentStreak >= 7) unlocked.push('sevenConsecutiveDays');
    if (currentStreak >= 14) unlocked.push('fourteenConsecutiveDays');
    if (currentStreak >= 30) unlocked.push('thirtyConsecutiveDays');

    return unlocked;
  };

  return {
    workout,
    workouts,
    loading,
    error,
    saveWorkout,
    removeWorkout,
    markExerciseCompleted,
    completeWorkout,
    resetWorkoutProgress,
    getCompletedWorkouts,
    getWorkoutStatsByPeriod,
    getWorkoutProgress,
    refreshWorkout,
    getAllExercises,
    personalRecords,             // Exportar personalRecords
    getExerciseProgressHistory,  // Exportar getExerciseProgressHistory
    getWorkoutStats,             // Exportar getWorkoutStats
    calculateCurrentStreak,      // Exportar calculateCurrentStreak
    getUnlockedAchievements,     // Exportar getUnlockedAchievements
  };
};
