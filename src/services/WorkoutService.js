// src/services/WorkoutService.js
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDoc,
    serverTimestamp 
  } from 'firebase/firestore';
  import { firestore } from '../firebase';
  
  class WorkoutService {
    constructor() {
      this.collection = 'workouts';
    }
  
    async getUserWorkouts(userId) {
      try {
        const workoutsRef = collection(firestore, this.collection);
        const q = query(workoutsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        
        // Se estiver offline, retornar dados em cache se disponíveis
        if (error.code === 'failed-precondition' || error.code === 'unavailable') {
          console.log('Usando dados em cache devido ao estado offline');
          // Aqui retornamos um array vazio, mas idealmente você teria
          // uma lógica de cache local (IndexedDB, localStorage, etc.)
          return [];
        }
        
        throw error;
      }
    }
  
    async getWorkout(workoutId) {
      try {
        const docRef = doc(firestore, this.collection, workoutId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          };
        } else {
          throw new Error('Treino não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar treino:', error);
        
        if (error.code === 'failed-precondition' || error.code === 'unavailable') {
          console.log('Offline: não foi possível buscar o treino');
          return null;
        }
        
        throw error;
      }
    }
  
    async createWorkout(workoutData) {
      try {
        const workoutsRef = collection(firestore, this.collection);
        const newWorkout = {
          ...workoutData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(workoutsRef, newWorkout);
        return {
          id: docRef.id,
          ...newWorkout
        };
      } catch (error) {
        console.error('Erro ao criar treino:', error);
        throw error;
      }
    }
  
    async updateWorkout(workoutId, workoutData) {
      try {
        const workoutRef = doc(firestore, this.collection, workoutId);
        const updatedData = {
          ...workoutData,
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(workoutRef, updatedData);
        return {
          id: workoutId,
          ...updatedData
        };
      } catch (error) {
        console.error('Erro ao atualizar treino:', error);
        throw error;
      }
    }
  
    async deleteWorkout(workoutId) {
      try {
        const workoutRef = doc(firestore, this.collection, workoutId);
        await deleteDoc(workoutRef);
        return true;
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
        throw error;
      }
    }
  }
  
  export default new WorkoutService();
  