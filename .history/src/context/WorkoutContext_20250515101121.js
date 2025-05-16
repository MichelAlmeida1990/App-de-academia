// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Alterado de db para firestore
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const q = query(collection(firestore, 'workouts'), where('userId', '==', currentUser.uid)); // Alterado de db para firestore
        const querySnapshot = await getDocs(q);
        
        const workoutData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setWorkouts(workoutData);
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser]);

  const addWorkout = async (workout) => {
    try {
      const workoutWithUser = {
        ...workout,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(firestore, 'workouts'), workoutWithUser); // Alterado de db para firestore
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
      const workoutRef = doc(firestore, 'workouts', updatedWorkout.id); // Alterado de db para firestore
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
      const workoutRef = doc(firestore, 'workouts', workoutId); // Alterado de db para firestore
      await deleteDoc(workoutRef);
      
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  };

  // Adicionar a função getWeeklyWorkouts ao contexto
  const getWeeklyWorkouts = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo && workoutDate <= today;
    });
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        loading, 
        addWorkout, 
        updateWorkout, 
        deleteWorkout,
        getWeeklyWorkouts // Exportar a função
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
