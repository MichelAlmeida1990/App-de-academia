// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Alterado para usar o hook useAuth
import WorkoutService from '../services/WorkoutService';
import { toast } from 'react-toastify';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth(); // Usando o hook useAuth
  const navigate = useNavigate();

  // Carregar treinos do usuário quando o componente montar ou o usuário mudar
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) {
        setWorkouts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userWorkouts = await WorkoutService.getUserWorkouts(currentUser.uid);
        setWorkouts(userWorkouts);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar treinos:", err);
        setError("Não foi possível carregar seus treinos. Por favor, tente novamente.");
        toast.error("Erro ao carregar treinos");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser]);

  // O restante do código permanece o mesmo...
  
  // Adicionar novo treino
  const addWorkout = async (workoutData) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para adicionar um treino");
      return null;
    }
    
    try {
      setLoading(true);
      const newWorkout = await WorkoutService.createWorkout(currentUser.uid, workoutData);
      setWorkouts(prevWorkouts => [newWorkout, ...prevWorkouts]);
      toast.success("Treino adicionado com sucesso!");
      return newWorkout;
    } catch (err) {
      console.error("Erro ao adicionar treino:", err);
      toast.error("Erro ao adicionar treino");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar treino existente
  const updateWorkout = async (workoutId, workoutData) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para atualizar um treino");
      return false;
    }
    
    try {
      setLoading(true);
      const updatedWorkout = await WorkoutService.updateWorkout(workoutId, workoutData);
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === workoutId ? { ...workout, ...updatedWorkout } : workout
        )
      );
      toast.success("Treino atualizado com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao atualizar treino:", err);
      toast.error("Erro ao atualizar treino");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remover treino
  const removeWorkout = async (workoutId) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para remover um treino");
      return false;
    }
    
    try {
      setLoading(true);
      await WorkoutService.deleteWorkout(currentUser.uid, workoutId);
      setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== workoutId));
      toast.success("Treino removido com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao remover treino:", err);
      toast.error("Erro ao remover treino");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Iniciar treino
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setCurrentWorkout(workout);
      navigate(`/workout/${workoutId}`);
    } else {
      toast.error("Treino não encontrado");
    }
  };

  // Completar treino
  const completeWorkout = async (workoutId, performanceData) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para completar um treino");
      return false;
    }
    
    try {
      setLoading(true);
      const historyEntry = await WorkoutService.completeWorkout(workoutId, performanceData);
      
      // Atualizar o treino na lista local
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === workoutId 
            ? { 
                ...workout, 
                lastPerformed: new Date(), 
                history: [...(workout.history || []), historyEntry] 
              } 
            : workout
        )
      );
      
      setCurrentWorkout(null);
      toast.success("Treino concluído com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao completar treino:", err);
      toast.error("Erro ao registrar conclusão do treino");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Adicionar exercício ao treino
  const addExercise = async (workoutId, exerciseData) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para adicionar um exercício");
      return null;
    }
    
    try {
      setLoading(true);
      const newExercise = await WorkoutService.addExerciseToWorkout(workoutId, exerciseData);
      
      // Atualizar o treino na lista local
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => {
          if (workout.id === workoutId) {
            const exercises = [...(workout.exercises || []), newExercise];
            return { ...workout, exercises };
          }
          return workout;
        })
      );
      
      // Se estamos no treino atual, atualize-o também
      if (currentWorkout && currentWorkout.id === workoutId) {
        setCurrentWorkout(prev => ({
          ...prev,
          exercises: [...(prev.exercises || []), newExercise]
        }));
      }
      
      toast.success("Exercício adicionado com sucesso!");
      return newExercise;
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
      toast.error("Erro ao adicionar exercício");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar exercício
  const updateExercise = async (workoutId, exerciseId, exerciseData) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para atualizar um exercício");
      return false;
    }
    
    try {
      setLoading(true);
      const updatedExercise = await WorkoutService.updateExerciseInWorkout(workoutId, exerciseId, exerciseData);
      
      // Atualizar o treino na lista local
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => {
          if (workout.id === workoutId) {
            const exercises = (workout.exercises || []).map(ex => 
              ex.id === exerciseId ? { ...ex, ...updatedExercise } : ex
            );
            return { ...workout, exercises };
          }
          return workout;
        })
      );
      
      // Se estamos no treino atual, atualize-o também
      if (currentWorkout && currentWorkout.id === workoutId) {
        setCurrentWorkout(prev => ({
          ...prev,
          exercises: (prev.exercises || []).map(ex => 
            ex.id === exerciseId ? { ...ex, ...updatedExercise } : ex
          )
        }));
      }
      
      toast.success("Exercício atualizado com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao atualizar exercício:", err);
      toast.error("Erro ao atualizar exercício");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remover exercício
  const removeExercise = async (workoutId, exerciseId) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para remover um exercício");
      return false;
    }
    
    try {
      setLoading(true);
      await WorkoutService.removeExerciseFromWorkout(workoutId, exerciseId);
      
      // Atualizar o treino na lista local
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => {
          if (workout.id === workoutId) {
            const exercises = (workout.exercises || []).filter(ex => ex.id !== exerciseId);
            return { ...workout, exercises };
          }
          return workout;
        })
      );
      
      // Se estamos no treino atual, atualize-o também
      if (currentWorkout && currentWorkout.id === workoutId) {
        setCurrentWorkout(prev => ({
          ...prev,
          exercises: (prev.exercises || []).filter(ex => ex.id !== exerciseId)
        }));
      }
      
      toast.success("Exercício removido com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao remover exercício:", err);
      toast.error("Erro ao remover exercício");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obter treinos da semana atual
  const getWeeklyWorkouts = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
    endOfWeek.setHours(23, 59, 59, 999);
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.createdAt);
      return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
    });
  };

  // Calcular total de minutos treinados
  const getTotalTrainingMinutes = () => {
    return workouts.reduce((total, workout) => {
      // Se o treino tiver um histórico, some a duração de cada sessão
      if (workout.history && workout.history.length > 0) {
        const workoutMinutes = workout.history.reduce((sum, session) => {
          return sum + (session.performance?.duration || 0);
        }, 0);
        return total + workoutMinutes;
      }
      return total;
    }, 0);
  };

  // Fazer upload de imagem
  const uploadImage = async (file, path) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para fazer upload de imagens");
      return null;
    }
    
    try {
      setLoading(true);
      const imageUrl = await WorkoutService.uploadImage(file, path);
      return imageUrl;
    } catch (err) {
      console.error("Erro ao fazer upload de imagem:", err);
      toast.error("Erro ao fazer upload de imagem");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        currentWorkout,
        loading,
        error,
        addWorkout,
        updateWorkout,
        removeWorkout,
        startWorkout,
        completeWorkout,
        addExercise,
        updateExercise,
        removeExercise,
        getWeeklyWorkouts,
        getTotalTrainingMinutes,
        uploadImage
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
