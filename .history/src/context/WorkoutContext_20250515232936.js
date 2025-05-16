// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const q = query(collection(firestore, 'workouts'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const workoutData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Garantir que cada exercício tenha a propriedade 'completed'
          if (data.exercises && Array.isArray(data.exercises)) {
            data.exercises = data.exercises.map(exercise => ({
              ...exercise,
              completed: exercise.completed || false
            }));
          }
          
          // Calcular o progresso se não estiver definido
          if (data.exercises && Array.isArray(data.exercises) && data.progress === undefined) {
            const completedCount = data.exercises.filter(ex => ex.completed).length;
            data.progress = data.exercises.length > 0 
              ? Math.round((completedCount / data.exercises.length) * 100) 
              : 0;
          }
          
          return {
            id: doc.id,
            ...data
          };
        });
        
        setWorkouts(workoutData);
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

      // Inicializar propriedades de progresso
      const workoutWithUser = {
        ...workout,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        progress: 0
      };
      
      // Garantir que cada exercício tenha a propriedade 'completed'
      if (workoutWithUser.exercises && Array.isArray(workoutWithUser.exercises)) {
        workoutWithUser.exercises = workoutWithUser.exercises.map(exercise => ({
          ...exercise,
          completed: false
        }));
      }
      
      const docRef = await addDoc(collection(firestore, 'workouts'), workoutWithUser);
      const newWorkout = { id: docRef.id, ...workoutWithUser };
      
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

      // Garantir que o treino pertence ao usuário atual
      if (updatedWorkout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para editar este treino");
      }

      // Recalcular o progresso antes de salvar
      if (updatedWorkout.exercises && Array.isArray(updatedWorkout.exercises)) {
        const completedCount = updatedWorkout.exercises.filter(ex => ex.completed).length;
        updatedWorkout.progress = updatedWorkout.exercises.length > 0 
          ? Math.round((completedCount / updatedWorkout.exercises.length) * 100) 
          : 0;
      }

      // Atualizar a data de conclusão se o progresso for 100%
      if (updatedWorkout.progress === 100 && !updatedWorkout.completedAt) {
        updatedWorkout.completedAt = new Date().toISOString();
      } else if (updatedWorkout.progress < 100 && updatedWorkout.completedAt) {
        // Remover a data de conclusão se o progresso não for 100%
        delete updatedWorkout.completedAt;
      }

      const workoutRef = doc(firestore, 'workouts', updatedWorkout.id);
      await updateDoc(workoutRef, updatedWorkout);
      
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        )
      );
      
      return updatedWorkout;
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

      // Verificar se o treino pertence ao usuário atual
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout || workout.userId !== currentUser.uid) {
        throw new Error("Você não tem permissão para excluir este treino");
      }

      const workoutRef = doc(firestore, 'workouts', workoutId);
      await deleteDoc(workoutRef);
      
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
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

  // Nova função para obter treinos concluídos
  const getCompletedWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    return workouts.filter(workout => workout.completedAt);
  };

  // Nova função para obter treinos em andamento
  const getInProgressWorkouts = () => {
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    return workouts.filter(workout => 
      workout.progress > 0 && workout.progress < 100
    );
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts: workouts || [], 
        loading, 
        error,
        addWorkout, 
        updateWorkout, 
        deleteWorkout,
        getWeeklyWorkouts,
        getCompletedWorkouts,
        getInProgressWorkouts
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
