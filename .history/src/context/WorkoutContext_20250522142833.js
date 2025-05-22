import React, { createContext, useState, useEffect, useContext } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import { useAuth } from './AuthContext';

export const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) {
        setWorkouts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const workoutData = LocalStorageService.getWorkouts(currentUser.uid);
        setWorkouts(workoutData);
        
        // Carregar dados de treinos concluídos
        const completedData = LocalStorageService.getCompletedWorkouts(currentUser.uid);
        setCompletedWorkouts(completedData || {});
        
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        setError("Falha ao carregar treinos. Por favor, tente novamente mais tarde.");
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser]);

  const addWorkout = async (workout) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Gerar um ID único usando string para evitar problemas de tipo
      const workoutId = `workout_${Date.now()}`;
      
      // Inicializar propriedades de progresso
      const workoutWithUser = {
        ...workout,
        userId: currentUser.uid,
        id: workoutId, // Usar o ID gerado como string
        createdAt: new Date().toISOString(),
        progress: 0,
        exercises: workout.exercises.map((exercise, index) => ({
          ...exercise,
          id: index // Adicionar ID para cada exercício
        }))
      };
      
      // Salvar no localStorage
      const newWorkout = LocalStorageService.addWorkout(workoutWithUser);
      
      // Atualizar o estado
      setWorkouts(prev => [...prev, newWorkout]);
      
      // Retornar o objeto com o ID correto
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

      // Garantir que o treino pertence ao usuário atual
      if (updatedWorkout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para editar este treino");
      }

      const updated = LocalStorageService.updateWorkout(updatedWorkout);
      
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === updatedWorkout.id ? updated : workout
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

      // Converter IDs para string para garantir comparação correta
      const workoutIdStr = String(workoutId);
      
      // Buscar o treino usando comparação de strings
      const workout = workouts.find(w => String(w.id) === workoutIdStr);
      
      // Verificar se o treino existe e pertence ao usuário
      if (!workout) {
        throw new Error("Treino não encontrado");
      }
      
      // Verificar permissão apenas se o treino tiver um userId definido
      if (workout.userId && workout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para excluir este treino");
      }

      // Excluir o treino
      LocalStorageService.deleteWorkout(workoutIdStr);
      
      // Atualizar o estado usando comparação de strings
      setWorkouts(prev => prev.filter(w => String(w.id) !== workoutIdStr));
      
      // Limpar dados de progresso e conclusão relacionados ao treino
      const updatedCompletedWorkouts = { ...completedWorkouts };
      delete updatedCompletedWorkouts[workoutIdStr];
      setCompletedWorkouts(updatedCompletedWorkouts);
      
      // Salvar os dados atualizados de treinos concluídos
      if (currentUser) {
        LocalStorageService.saveCompletedWorkouts(currentUser.uid, updatedCompletedWorkouts);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  };

  const getWorkoutById = (id) => {
    // Converter para string para garantir comparação correta
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

  // Função para criar treinos de exemplo específicos para o mês atual
  const createDemoWorkouts = () => {
    // Obter o mês e ano atual para garantir que os treinos de exemplo sejam do período correto
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    console.log(`Criando treinos de demonstração para ${currentMonth + 1}/${currentYear}`);
    
    const demoWorkouts = [];
    
    // Adicionar um treino para o dia 19 (conforme visto no gráfico)
    const day19Date = new Date(currentYear, currentMonth, 19);
    demoWorkouts.push({
      id: `demo_day19`,
      name: `Treino D - Ombros e Abdômen`,
      category: 'Ombros e Abdômen',
      date: day19Date.toISOString(),
      completedAt: day19Date.toISOString(),
      duration: 55, // Duração conforme mostrada nas estatísticas
      exercises: [
        { id: 0, name: 'Desenvolvimento com halteres', sets: 3, reps: 12 },
        { id: 1, name: 'Elevação lateral', sets: 3, reps: 15 },
        { id: 2, name: 'Abdominal crunch', sets: 4, reps: 20 },
        { id: 3, name: 'Prancha', sets: 3, reps: 30 }
      ],
      completed: true
    });
    
    // Adicionar um treino para o dia 22 (conforme visto no gráfico)
    const day22Date = new Date(currentYear, currentMonth, 22);
    demoWorkouts.push({
      id: `demo_day22`,
      name: `Treino A - Peito e Tríceps`,
      category: 'Peito e Tríceps',
      date: day22Date.toISOString(),
      completedAt: day22Date.toISOString(),
      duration: 55, // Duração conforme mostrada nas estatísticas
      exercises: [
        { id: 0, name: 'Supino reto', sets: 3, reps: 10 },
        { id: 1, name: 'Crucifixo', sets: 3, reps: 12 },
        { id: 2, name: 'Tríceps corda', sets: 3, reps: 15 },
        { id: 3, name: 'Tríceps francês', sets: 3, reps: 12 }
      ],
      completed: true
    });
    
    console.log(`Treinos de demonstração criados:`, demoWorkouts);
    return demoWorkouts;
  };

  // Função corrigida para obter treinos concluídos
  const getCompletedWorkouts = () => {
    console.log("Obtendo treinos concluídos...");
    
    // Se não houver treinos ou não for um array, retornar array vazio
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      console.log("Nenhum treino disponível, retornando array vazio");
      return []; // Modificado: retornar array vazio em vez de dados de exemplo
    }
    
    // Verificar se completedWorkouts é um objeto válido
    if (!completedWorkouts || typeof completedWorkouts !== 'object') {
      console.warn("completedWorkouts não é um objeto válido:", completedWorkouts);
      return []; // Modificado: retornar array vazio em vez de dados de exemplo
    }
    
    // Filtrar treinos concluídos
    const completed = workouts.filter(workout => {
      const isCompleted = workout && workout.id && completedWorkouts[String(workout.id)] === true;
      if (isCompleted) {
        console.log(`Treino concluído encontrado: ${workout.name} (${workout.id})`);
      }
      return isCompleted;
    });
    
    console.log(`Total de treinos concluídos encontrados: ${completed.length}`);
    return completed; // Modificado: retornar apenas os treinos concluídos reais
  };

  // Função para obter treinos em andamento
  const getInProgressWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    return workouts.filter(workout => 
      workout.progress > 0 && workout.progress < 100
    );
  };

  // Função corrigida para obter treinos filtrados por período
  const getWorkoutStatsByPeriod = (period) => {
    console.log(`Obtendo estatísticas para o período: ${period}`);
    
    // Obter treinos concluídos
    const completedWorkoutsList = getCompletedWorkouts();
    
    if (!completedWorkoutsList || !Array.isArray(completedWorkoutsList) || completedWorkoutsList.length === 0) {
      console.log("Nenhum treino concluído disponível para estatísticas");
      return []; // Modificado: retornar array vazio em vez de dados de exemplo
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
      startDate = new Date(0); // Se não for week, month ou year, retorna todos
      console.log("Retornando todos os treinos (sem filtro de período)");
    }
    
    // Filtrar por período
    const filteredWorkouts = completedWorkoutsList.filter(workout => {
      if (!workout || (!workout.completedAt && !workout.date)) {
        console.log(`Treino sem data encontrado, ignorando:`, workout);
        return false;
      }
      
      // Verificar se o treino tem data de conclusão ou data normal
      const workoutDate = new Date(workout.completedAt || workout.date);
      const isInPeriod = workoutDate >= startDate && workoutDate <= today;
      
      if (isInPeriod) {
        console.log(`Treino dentro do período: ${workout.name}, data: ${workoutDate.toISOString()}`);
      } else {
        console.log(`Treino fora do período: ${workout.name}, data: ${workoutDate.toISOString()}`);
      }
      
      return isInPeriod;
    });
    
    console.log(`Total de treinos filtrados para o período ${period}: ${filteredWorkouts.length}`);
    return filteredWorkouts; // Modificado: retornar apenas os treinos reais filtrados
  };

  // Função corrigida para obter dados de grupos musculares treinados
  const getMuscleGroupStats = (period) => {
    console.log(`Obtendo estatísticas de grupos musculares para o período: ${period}`);
    
    // Obter treinos filtrados pelo período
    const filteredWorkouts = getWorkoutStatsByPeriod(period);
    
    // Se não houver treinos, retornar array vazio
    if (!filteredWorkouts || filteredWorkouts.length === 0) {
      return []; // Modificado: retornar array vazio em vez de usar dados de exemplo
    }
    
    // Contagem de grupos musculares
    const muscleGroups = {};
    
    // Contar ocorrências de cada grupo muscular
    filteredWorkouts.forEach(workout => {
      if (workout.category) {
        // Se tiver categoria definida, usar ela
        muscleGroups[workout.category] = (muscleGroups[workout.category] || 0) + 1;
        console.log(`Grupo muscular encontrado (via categoria): ${workout.category}`);
      } else if (workout.name) {
        // Se não tiver categoria, tentar extrair do nome do treino
        // Verificar se o nome segue o padrão "Treino X - Grupo Muscular"
        const match = workout.name.match(/Treino [A-Z] - (.+)/);
        
        if (match && match[1]) {
          const groupName = match[1].trim();
          muscleGroups[groupName] = (muscleGroups[groupName] || 0) + 1;
          console.log(`Grupo muscular encontrado (via nome): ${groupName}`);
        } else {
          // Se não seguir o padrão, categorizar como "Outros"
          muscleGroups['Outros'] = (muscleGroups['Outros'] || 0) + 1;
          console.log(`Grupo muscular não identificado, categorizado como "Outros": ${workout.name}`);
        }
      } else {
        // Se não tiver nome nem categoria, categorizar como "Outros"
        muscleGroups['Outros'] = (muscleGroups['Outros'] || 0) + 1;
        console.log(`Treino sem nome nem categoria, categorizado como "Outros"`);
      }
    });
    
    // Converter para o formato esperado pelo componente de visualização
    const result = Object.entries(muscleGroups).map(([name, value]) => ({ name, value }));
    console.log(`Estatísticas de grupos musculares processadas:`, result);
    
    return result;
  };

  // Função corrigida para obter estatísticas gerais
  const getGeneralStats = (period) => {
    console.log(`Obtendo estatísticas gerais para o período: ${period}`);
    
    // Obter treinos filtrados pelo período
    const filteredWorkouts = getWorkoutStatsByPeriod(period);
    
    // Se não houver treinos, retornar estatísticas vazias
    if (!filteredWorkouts || filteredWorkouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        averageMinutes: 0
      };
    }
    
    // Calcular estatísticas
    const totalWorkouts = filteredWorkouts.length;
    
    const totalMinutes = filteredWorkouts.reduce((total, workout) => {
      // Se tiver duração, usar ela
      if (workout.duration) {
        const duration = parseInt(workout.duration);
        console.log(`Treino ${workout.name}: duração ${duration} minutos`);
        return total + duration;
      }
      // Se não tiver duração, estimar baseado no número de exercícios (5 min por exercício)
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

  // Função para marcar um treino como concluído/não concluído
  const toggleWorkoutCompletion = (workoutId, completed) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Converter para string para garantir consistência
      const workoutIdStr = String(workoutId);
      const newCompletedWorkouts = { ...completedWorkouts };
      
      if (completed) {
        newCompletedWorkouts[workoutIdStr] = true;
        console.log(`Treino ${workoutIdStr} marcado como concluído`);
      } else {
        delete newCompletedWorkouts[workoutIdStr];
        console.log(`Treino ${workoutIdStr} marcado como não concluído`);
      }
      
      // Atualizar o estado
      setCompletedWorkouts(newCompletedWorkouts);
      
      // Salvar no localStorage
      LocalStorageService.saveCompletedWorkouts(currentUser.uid, newCompletedWorkouts);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status de conclusão:', error);
      throw error;
    }
  };

  // Função para marcar um exercício como concluído/não concluído
  const toggleExerciseCompletion = (workoutId, exerciseIndex, completed) => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Converter para string para garantir consistência
      const workoutIdStr = String(workoutId);
      
      // Obter o progresso atual do treino
      const workoutProgress = LocalStorageService.getWorkoutProgress(currentUser.uid, workoutIdStr) || {
        exercises: {},
        overallProgress: 0,
        lastUpdated: null
      };
      
      // Atualizar o status do exercício
      const updatedExercises = { ...workoutProgress.exercises };
      updatedExercises[exerciseIndex] = completed;
      
      // Calcular o progresso geral
      const workout = workouts.find(w => String(w.id) === workoutIdStr);
      let overallProgress = 0;
      
      if (workout && workout.exercises && workout.exercises.length > 0) {
        const totalExercises = workout.exercises.length;
        const completedExercises = Object.values(updatedExercises).filter(Boolean).length;
        overallProgress = Math.round((completedExercises / totalExercises) * 100);
      }
      
      // Criar objeto de progresso atualizado
      const updatedProgress = {
        exercises: updatedExercises,
        overallProgress,
        lastUpdated: new Date().toISOString()
      };
      
      // Salvar no localStorage
      LocalStorageService.saveWorkoutProgress(currentUser.uid, workoutIdStr, updatedProgress);
      
      return updatedProgress;
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      throw error;
    }
  };

  // Função para verificar se um exercício está concluído
  const isExerciseCompleted = (workoutId, exerciseIndex) => {
    try {
      if (!currentUser) return false;
      
      // Converter para string para garantir consistência
      const workoutIdStr = String(workoutId);
      
      const workoutProgress = LocalStorageService.getWorkoutProgress(currentUser.uid, workoutIdStr);
      return workoutProgress && workoutProgress.exercises && workoutProgress.exercises[exerciseIndex] === true;
    } catch (error) {
      console.error('Erro ao verificar status do exercício:', error);
      return false;
    }
  };

  // Função para obter o progresso de um treino
  const getWorkoutProgress = (workoutId) => {
    try {
      if (!currentUser) return null;
      
      // Converter para string para garantir consistência
      const workoutIdStr = String(workoutId);
      
      return LocalStorageService.getWorkoutProgress(currentUser.uid, workoutIdStr) || {
        exercises: {},
        overallProgress: 0,
        lastUpdated: null
      };
    } catch (error) {
      console.error('Erro ao obter progresso do treino:', error);
      return null;
    }
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        loading, 
        error,
        completedWorkouts,
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
        getGeneralStats
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
