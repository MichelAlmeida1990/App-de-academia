import React, { createContext, useState, useEffect, useContext } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import { useAuth } from './AuthContext';

export const WorkoutContext = createContext();

// EXPORTAR O useWorkout AQUI PARA QUE COMPONENTES POSSAM IMPORTÁ-LO DIRETAMENTE
export const useWorkout = () => useContext(WorkoutContext); 

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Função para buscar treinos do usuário atual
  const refreshWorkouts = async () => {
    if (!currentUser) {
      setWorkouts([]);
      return [];
    }

    try {
      setLoading(true);
      const workoutData = LocalStorageService.getWorkouts(currentUser.uid);
      setWorkouts(workoutData);
      setError(null);
      return workoutData;
    } catch (error) {
      console.error('Erro ao atualizar treinos:', error);
      setError("Falha ao atualizar treinos. Por favor, tente novamente mais tarde.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWorkouts();
  }, [currentUser]);

  const addWorkout = async (workout) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const workoutId = `workout_${Date.now()}`;
      
      const workoutWithUser = {
        ...workout,
        userId: currentUser.uid,
        id: workoutId,
        createdAt: new Date().toISOString(),
        progress: 0,
        completed: false, // Novo treino começa como não concluído
        exercises: workout.exercises.map((exercise, index) => ({
          ...exercise,
          id: index, // Adicionar ID para cada exercício
          completed: false, // Exercício individual também começa como não concluído
        }))
      };
      
      const newWorkout = LocalStorageService.addWorkout(workoutWithUser);
      
      setWorkouts(prev => [...prev, newWorkout]);
      
      return newWorkout;
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
      throw error;
    }
  };

  const updateWorkout = async (updatedWorkout) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Garantir que o treino tenha um ID
      if (!updatedWorkout.id) {
        throw new Error("Treino sem ID");
      }

      // Atualizar o treino no localStorage
      const updated = LocalStorageService.updateWorkout(updatedWorkout);
      
      // Atualizar o estado local
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === updatedWorkout.id ? {
            ...workout,
            ...updatedWorkout,
            exercises: updatedWorkout.exercises.map(exercise => ({
              ...exercise,
              sets: Array.isArray(exercise.sets) ? exercise.sets : 
                Array(exercise.sets).fill(null).map(() => ({
                  reps: exercise.reps,
                  weight: 0,
                  rest: exercise.rest,
                  completed: false
                }))
            }))
          } : workout
        )
      );
      
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw error;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const workoutIdStr = String(workoutId);
      
      const workout = workouts.find(w => String(w.id) === workoutIdStr);
      
      if (!workout) {
        throw new Error("Treino não encontrado");
      }
      
      if (workout.userId && workout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para excluir este treino");
      }

      // Passar o userId para o LocalStorageService.deleteWorkout
      LocalStorageService.deleteWorkout(workoutIdStr, currentUser.uid); 
      
      setWorkouts(prev => prev.filter(w => String(w.id) !== workoutIdStr));
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  };

  const getWorkoutById = (id) => {
    const idStr = String(id);
    const workout = workouts.find(workout => String(workout.id) === idStr);
    
    return workout || null;
  };

  const getWeeklyWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workouts.filter(workout => {
      if (!workout || !workout.date) return false;
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo && workoutDate <= today;
    });
  };

  const createDemoWorkouts = () => {
    // ❌ FUNÇÃO OBSOLETA - REMOVIDA PARA EVITAR VAZAMENTO DE DADOS
    // Esta função estava criando treinos sem userId, causando vazamento entre usuários
    console.warn('⚠️ createDemoWorkouts() foi removida - use AuthContext.createAndSaveDemoWorkouts() com userId');
    return [];
    
    console.log(`Treinos de demonstração criados:`, demoWorkouts);
    return demoWorkouts;
  };

  const getCompletedWorkouts = () => {
    console.log("Obtendo treinos concluídos...");
    
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      console.log("Nenhum treino disponível, retornando array vazio");
      return [];
    }
    
    const completed = workouts.filter(workout => workout.completed === true);
    
    console.log(`Total de treinos concluídos encontrados: ${completed.length}`);
    return completed;
  };

  const getInProgressWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    return workouts.filter(workout => 
      workout.progress > 0 && workout.progress < 100 && workout.completed === false
    );
  };

  const getWorkoutStatsByPeriod = (period) => {
    console.log(`Obtendo estatísticas para o período: ${period}`);
    
    const completedWorkoutsList = getCompletedWorkouts();
    
    if (!completedWorkoutsList || !Array.isArray(completedWorkoutsList) || completedWorkoutsList.length === 0) {
      console.log("Nenhum treino concluído disponível para estatísticas");
      return [];
    }
    
    const today = new Date();
    let startDate;
    
    if (period === 'week') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      console.log(`Filtrando treinos da última semana: ${startDate.toISOString()} até ${today.toISOString()}`);
    } else if (period === 'month') {
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      console.log(`Filtrando treinos do último mês: ${startDate.toISOString()} até ${today.toISOString()}`);
    } else if (period === 'year') {
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      console.log(`Filtrando treinos do último ano: ${startDate.toISOString()} até ${today.toISOString()}`);
    } else {
      startDate = new Date(0);
      console.log("Retornando todos os treinos (sem filtro de período)");
    }
    
    const filteredWorkouts = completedWorkoutsList.filter(workout => {
      if (!workout || !workout.completedAt) {
        console.log(`Treino sem data de conclusão encontrado, ignorando:`, workout);
        return false;
      }
      
      const workoutDate = new Date(workout.completedAt);
      const isInPeriod = workoutDate >= startDate && workoutDate <= today;
      
      if (isInPeriod) {
        console.log(`Treino dentro do período: ${workout.name}, data: ${workoutDate.toISOString()}`);
      } else {
        console.log(`Treino fora do período: ${workout.name}, data: ${workoutDate.toISOString()}`);
      }
      
      return isInPeriod;
    });
    
    console.log(`Total de treinos filtrados para o período ${period}: ${filteredWorkouts.length}`);
    return filteredWorkouts;
  };

  const getMuscleGroupStats = (period) => {
    console.log(`Obtendo estatísticas de grupos musculares para o período: ${period}`);
    
    const filteredWorkouts = getWorkoutStatsByPeriod(period);
    
    if (!filteredWorkouts || filteredWorkouts.length === 0) {
      return [];
    }
    
    const muscleGroups = {};
    
    filteredWorkouts.forEach(workout => {
      if (workout.category) {
        muscleGroups[workout.category] = (muscleGroups[workout.category] || 0) + 1;
        console.log(`Grupo muscular encontrado (via categoria): ${workout.category}`);
      } else if (workout.name) {
        const match = workout.name.match(/Treino [A-Z] - (.+)/);
        
        if (match && match[1]) {
          const groupName = match[1].trim();
          muscleGroups[groupName] = (muscleGroups[groupName] || 0) + 1;
          console.log(`Grupo muscular encontrado (via nome): ${groupName}`);
        } else {
          muscleGroups['Outros'] = (muscleGroups['Outros'] || 0) + 1;
          console.log(`Grupo muscular não identificado, categorizado como "Outros": ${workout.name}`);
        }
      } else {
        muscleGroups['Outros'] = (muscleGroups['Outros'] || 0) + 1;
        console.log(`Treino sem nome nem categoria, categorizado como "Outros"`);
      }
    });
    
    const result = Object.entries(muscleGroups).map(([name, value]) => ({ name, value }));
    console.log(`Estatísticas de grupos musculares processadas:`, result);
    
    return result;
  };

  const getGeneralStats = (period) => {
    console.log(`Obtendo estatísticas gerais para o período: ${period}`);
    
    const filteredWorkouts = getWorkoutStatsByPeriod(period);
    
    if (!filteredWorkouts || filteredWorkouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        averageMinutes: 0
      };
    }
    
    const totalWorkouts = filteredWorkouts.length;
    
    const totalMinutes = filteredWorkouts.reduce((total, workout) => {
      if (workout.duration) {
        const duration = parseInt(workout.duration);
        console.log(`Treino ${workout.name}: duração ${duration} minutos`);
        return total + duration;
      }
      else if (workout.exercises && workout.exercises.length) {
        const estimatedDuration = workout.exercises.length * 5;
        console.log(`Treino ${workout.name}: duração estimada ${estimatedDuration} minutos (baseado em ${workout.exercises.length} exercícios)`);
        return total + estimatedDuration;
      }
      console.log(`Treino ${workout.name}: sem duração definida`);
      return total;
    }, 0);
    
    const averageMinutes = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
    
    const stats = {
      totalWorkouts,
      totalMinutes,
      averageMinutes
    };
    
    console.log(`Estatísticas gerais calculadas:`, stats);
    
    return stats;
  };

  const toggleWorkoutCompletion = async (workoutId, completed) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const workoutIdStr = String(workoutId);
      
      const workoutToUpdate = workouts.find(w => String(w.id) === workoutIdStr);

      if (!workoutToUpdate) {
        throw new Error("Treino não encontrado para atualização.");
      }

      const updatedWorkout = { ...workoutToUpdate };
      updatedWorkout.completed = completed;
      updatedWorkout.completedAt = completed ? new Date().toISOString() : null;
      
      if (completed) {
        updatedWorkout.exercises = updatedWorkout.exercises.map(ex => ({ ...ex, completed: true }));
        updatedWorkout.progress = 100;
      } else {
        updatedWorkout.exercises = updatedWorkout.exercises.map(ex => ({ ...ex, completed: false }));
        updatedWorkout.progress = 0;
      }

      await updateWorkout(updatedWorkout);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status de conclusão do treino:', error);
      throw error;
    }
  };

  const toggleExerciseCompletion = async (workoutId, exerciseIndex, completed) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const workoutIdStr = String(workoutId);
      const workoutToUpdate = workouts.find(w => String(w.id) === workoutIdStr);

      if (!workoutToUpdate) {
        throw new Error("Treino não encontrado para atualização do exercício.");
      }

      const updatedWorkout = { ...workoutToUpdate };
      if (!updatedWorkout.exercises || !updatedWorkout.exercises[exerciseIndex]) {
        throw new Error("Exercício não encontrado no treino.");
      }

      updatedWorkout.exercises[exerciseIndex].completed = completed;

      const totalExercises = updatedWorkout.exercises.length;
      const completedExercisesCount = updatedWorkout.exercises.filter(ex => ex.completed).length;
      updatedWorkout.progress = Math.round((completedExercisesCount / totalExercises) * 100);

      if (updatedWorkout.progress === 100) {
        updatedWorkout.completed = true;
        updatedWorkout.completedAt = new Date().toISOString();
      } else {
        updatedWorkout.completed = false;
        updatedWorkout.completedAt = null;
      }

      await updateWorkout(updatedWorkout);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do exercício:', error);
      throw error;
    }
  };

  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    const workout = workouts.find(w => String(w.id) === String(workoutId));
    if (workout && workout.exercises && workout.exercises[exerciseIndex]) {
      return workout.exercises[exerciseIndex].completed === true;
    }
    return false;
  };

  const getWorkoutProgress = (workoutId) => {
    const workout = workouts.find(w => String(w.id) === String(workoutId));
    return workout ? workout.progress : 0;
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        loading, 
        error,
        addWorkout, 
        updateWorkout, 
        deleteWorkout,
        getWorkoutById,
        getWeeklyWorkouts,
        getCompletedWorkouts,
        getInProgressWorkouts,
        toggleWorkoutCompletion,
        toggleExerciseCompletion,
        isExerciseCompleted,
        getWorkoutProgress,
        getWorkoutStatsByPeriod,
        getMuscleGroupStats,
        getGeneralStats,
        refreshWorkouts, // Nova função adicionada
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
