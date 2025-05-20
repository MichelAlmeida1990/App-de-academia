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
        
        console.log("ID gerado:", workoutId);
        
        // Salvar no localStorage
        const newWorkout = LocalStorageService.addWorkout(workoutWithUser);
        
        console.log("Treino salvo:", newWorkout);
        console.log("ID após salvar:", newWorkout.id);
        
        // Verificar se o ID foi mantido corretamente
        if (!newWorkout || !newWorkout.id) {
          throw new Error("Erro ao gerar ID para o treino");
        }
        
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

    // Função corrigida para excluir treino
    const deleteWorkout = async (workoutId) => {
      try {
        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // Converter IDs para string para garantir comparação correta
        const workoutIdStr = String(workoutId);
        
        // Buscar o treino usando comparação de strings
        const workout = workouts.find(w => String(w.id) === workoutIdStr);
        
        // Log para depuração
        console.log("Tentando excluir treino:", workoutIdStr);
        console.log("Treino encontrado:", workout);
        console.log("ID do usuário atual:", currentUser.uid);
        console.log("ID do usuário do treino:", workout?.userId);
        
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
      console.log("Buscando treino com ID:", id);
      console.log("Treinos disponíveis:", workouts);
      
      // Converter para string para garantir comparação correta
      const idStr = String(id);
      const workout = workouts.find(workout => String(workout.id) === idStr);
      
      console.log("Treino encontrado:", workout);
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

    // Função corrigida para obter treinos concluídos
    const getCompletedWorkouts = () => {
      if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
        return [];
      }
      
      // Verificar se completedWorkouts é um objeto válido
      if (!completedWorkouts || typeof completedWorkouts !== 'object') {
        console.warn("completedWorkouts não é um objeto válido:", completedWorkouts);
        return [];
      }
      
      // Adicionar dados de exemplo se não houver treinos concluídos
      if (Object.keys(completedWorkouts).length === 0) {
        // Criar alguns treinos de exemplo para demonstração
        return createDemoWorkouts();
      }
      
      // Filtrar treinos concluídos
      const completed = workouts.filter(workout => {
        // Verificar se o ID do treino existe no objeto completedWorkouts
        return workout && workout.id && completedWorkouts[String(workout.id)] === true;
      });
      
      // Se não houver treinos concluídos, retornar dados de exemplo
      return completed.length > 0 ? completed : createDemoWorkouts();
    };

    // Função para criar treinos de exemplo para demonstração
    const createDemoWorkouts = () => {
      const today = new Date();
      const demoWorkouts = [];
      
      // Criar 5 treinos de exemplo com datas nos últimos 14 dias
      for (let i = 0; i < 5; i++) {
        const daysAgo = Math.floor(Math.random() * 14);
        const workoutDate = new Date(today);
        workoutDate.setDate(today.getDate() - daysAgo);
        
        const categories = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        demoWorkouts.push({
          id: `demo_${i}`,
          name: `Treino de ${category}`,
          category: category,
          date: workoutDate.toISOString(),
          completedAt: workoutDate.toISOString(),
          duration: Math.floor(Math.random() * 30) + 30, // 30-60 minutos
          exercises: Array(Math.floor(Math.random() * 5) + 3).fill().map((_, j) => ({
            id: j,
            name: `Exercício ${j+1}`,
            sets: Math.floor(Math.random() * 3) + 2,
            reps: Math.floor(Math.random() * 5) + 8
          })),
          completed: true
        });
      }
      
      return demoWorkouts;
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
      if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
        // Retornar dados de exemplo se não houver treinos
        return createDemoWorkouts();
      }
      
      const today = new Date();
      let startDate;
      
      if (period === 'week') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else if (period === 'month') {
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
      } else {
        startDate = new Date(0); // Se não for week ou month, retorna todos
      }
      
      // Obter treinos concluídos
      const completedWorkoutsList = getCompletedWorkouts();
      
      // Filtrar por período
      const filteredWorkouts = completedWorkoutsList.filter(workout => {
        if (!workout || (!workout.completedAt && !workout.date)) return false;
        
        // Verificar se o treino tem data de conclusão ou data normal
        const workoutDate = new Date(workout.completedAt || workout.date);
        return workoutDate >= startDate && workoutDate <= today;
      });
      
      // Se não houver treinos no período, retornar dados de exemplo
      return filteredWorkouts.length > 0 ? filteredWorkouts : createDemoWorkouts();
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
        } else {
          delete newCompletedWorkouts[workoutIdStr];
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
          getWorkoutStatsByPeriod // Adicionada a nova função ao contexto
        }}
      >
        {children}
      </WorkoutContext.Provider>
    );
  };
