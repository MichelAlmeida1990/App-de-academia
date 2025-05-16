// src/services/WorkoutService.js
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    increment
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
  import { firestore, storage } from '../firebase';
  
  class WorkoutService {
    // Obter todos os treinos do usuário
    async getUserWorkouts(userId) {
      try {
        const q = query(
          collection(firestore, 'workouts'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const workouts = [];
        
        querySnapshot.forEach((doc) => {
          workouts.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        });
        
        return workouts;
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        throw error;
      }
    }
  
    // Obter um treino específico
    async getWorkout(workoutId) {
      try {
        const workoutDoc = await getDoc(doc(firestore, 'workouts', workoutId));
        
        if (!workoutDoc.exists()) {
          throw new Error('Treino não encontrado');
        }
        
        return {
          id: workoutDoc.id,
          ...workoutDoc.data(),
          createdAt: workoutDoc.data().createdAt?.toDate() || new Date()
        };
      } catch (error) {
        console.error('Erro ao buscar treino:', error);
        throw error;
      }
    }
  
    // Criar um novo treino
    async createWorkout(userId, workoutData) {
      try {
        // Preparar dados do treino
        const newWorkout = {
          ...workoutData,
          userId,
          createdAt: serverTimestamp(),
          exercises: [],
          completed: false,
          lastPerformed: null
        };
        
        // Adicionar ao Firestore
        const workoutRef = await addDoc(collection(firestore, 'workouts'), newWorkout);
        
        // Atualizar estatísticas do usuário
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          'stats.totalWorkouts': increment(1),
          workouts: arrayUnion(workoutRef.id)
        });
        
        return {
          id: workoutRef.id,
          ...newWorkout
        };
      } catch (error) {
        console.error('Erro ao criar treino:', error);
        throw error;
      }
    }
  
    // Atualizar um treino existente
    async updateWorkout(workoutId, workoutData) {
      try {
        const workoutRef = doc(firestore, 'workouts', workoutId);
        await updateDoc(workoutRef, {
          ...workoutData,
          updatedAt: serverTimestamp()
        });
        
        return {
          id: workoutId,
          ...workoutData
        };
      } catch (error) {
        console.error('Erro ao atualizar treino:', error);
        throw error;
      }
    }
  
    // Excluir um treino
    async deleteWorkout(userId, workoutId) {
      try {
        // Primeiro, obter o treino para verificar se há imagens para excluir
        const workoutDoc = await getDoc(doc(firestore, 'workouts', workoutId));
        
        if (workoutDoc.exists()) {
          const workoutData = workoutDoc.data();
          
          // Excluir imagens associadas, se houver
          if (workoutData.imageUrl) {
            const imageRef = ref(storage, workoutData.imageUrl);
            await deleteObject(imageRef).catch(err => console.log('Imagem não encontrada ou já excluída'));
          }
          
          // Excluir imagens de exercícios, se houver
          if (workoutData.exercises && workoutData.exercises.length > 0) {
            for (const exercise of workoutData.exercises) {
              if (exercise.imageUrl) {
                const exerciseImageRef = ref(storage, exercise.imageUrl);
                await deleteObject(exerciseImageRef).catch(err => console.log('Imagem do exercício não encontrada ou já excluída'));
              }
            }
          }
        }
        
        // Excluir o documento do treino
        await deleteDoc(doc(firestore, 'workouts', workoutId));
        
        // Atualizar estatísticas do usuário
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          'stats.totalWorkouts': increment(-1),
          workouts: arrayRemove(workoutId)
        });
        
        return true;
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
        throw error;
      }
    }
  
    // Adicionar exercício a um treino
    async addExerciseToWorkout(workoutId, exerciseData) {
      try {
        const workoutRef = doc(firestore, 'workouts', workoutId);
        const workoutDoc = await getDoc(workoutRef);
        
        if (!workoutDoc.exists()) {
          throw new Error('Treino não encontrado');
        }
        
        // Adicionar ID único ao exercício
        const exerciseWithId = {
          ...exerciseData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        // Obter usuário associado ao treino
        const userId = workoutDoc.data().userId;
        
        // Atualizar o treino com o novo exercício
        const currentExercises = workoutDoc.data().exercises || [];
        await updateDoc(workoutRef, {
          exercises: [...currentExercises, exerciseWithId],
          updatedAt: serverTimestamp()
        });
        
        // Atualizar estatísticas do usuário
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          'stats.totalExercises': increment(1)
        });
        
        return exerciseWithId;
      } catch (error) {
        console.error('Erro ao adicionar exercício:', error);
        throw error;
      }
    }
  
    // Atualizar um exercício específico em um treino
    async updateExerciseInWorkout(workoutId, exerciseId, exerciseData) {
      try {
        const workoutRef = doc(firestore, 'workouts', workoutId);
        const workoutDoc = await getDoc(workoutRef);
        
        if (!workoutDoc.exists()) {
          throw new Error('Treino não encontrado');
        }
        
        const exercises = workoutDoc.data().exercises || [];
        const exerciseIndex = exercises.findIndex(ex => ex.id === exerciseId);
        
        if (exerciseIndex === -1) {
          throw new Error('Exercício não encontrado');
        }
        
        // Atualizar o exercício específico
        exercises[exerciseIndex] = {
          ...exercises[exerciseIndex],
          ...exerciseData,
          updatedAt: new Date().toISOString()
        };
        
        // Atualizar o documento do treino
        await updateDoc(workoutRef, {
          exercises,
          updatedAt: serverTimestamp()
        });
        
        return exercises[exerciseIndex];
      } catch (error) {
        console.error('Erro ao atualizar exercício:', error);
        throw error;
      }
    }
  
    // Remover um exercício de um treino
    async removeExerciseFromWorkout(workoutId, exerciseId) {
      try {
        const workoutRef = doc(firestore, 'workouts', workoutId);
        const workoutDoc = await getDoc(workoutRef);
        
        if (!workoutDoc.exists()) {
          throw new Error('Treino não encontrado');
        }
        
        const exercises = workoutDoc.data().exercises || [];
        const exerciseToRemove = exercises.find(ex => ex.id === exerciseId);
        
        if (!exerciseToRemove) {
          throw new Error('Exercício não encontrado');
        }
        
        // Remover imagem do exercício, se houver
        if (exerciseToRemove.imageUrl) {
          const imageRef = ref(storage, exerciseToRemove.imageUrl);
          await deleteObject(imageRef).catch(err => console.log('Imagem não encontrada ou já excluída'));
        }
        
        // Filtrar o exercício a ser removido
        const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
        
        // Obter usuário associado ao treino
        const userId = workoutDoc.data().userId;
        
        // Atualizar o documento do treino
        await updateDoc(workoutRef, {
          exercises: updatedExercises,
          updatedAt: serverTimestamp()
        });
        
        // Atualizar estatísticas do usuário
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          'stats.totalExercises': increment(-1)
        });
        
        return true;
      } catch (error) {
        console.error('Erro ao remover exercício:', error);
        throw error;
      }
    }
  
    // Registrar conclusão de treino
    async completeWorkout(workoutId, performanceData = {}) {
      try {
        const workoutRef = doc(firestore, 'workouts', workoutId);
        const workoutDoc = await getDoc(workoutRef);
        
        if (!workoutDoc.exists()) {
          throw new Error('Treino não encontrado');
        }
        
        const workoutData = workoutDoc.data();
        const userId = workoutData.userId;
        const completionDate = new Date().toISOString();
        
        // Criar histórico de treino
        const historyEntry = {
          date: completionDate,
          performance: performanceData,
          exercises: workoutData.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight
          }))
        };
        
        // Atualizar o documento do treino
        await updateDoc(workoutRef, {
          lastPerformed: serverTimestamp(),
          history: arrayUnion(historyEntry),
          updatedAt: serverTimestamp()
        });
        
        // Atualizar estatísticas do usuário
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          'stats.lastWorkout': {
            id: workoutId,
            name: workoutData.name,
            date: serverTimestamp()
          }
        });
        
        return historyEntry;
      } catch (error) {
        console.error('Erro ao completar treino:', error);
        throw error;
      }
    }
  
    // Fazer upload de imagem para um treino ou exercício
    async uploadImage(file, path) {
      try {
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error('Erro ao fazer upload de imagem:', error);
        throw error;
      }
    }
  }
  
  export default new WorkoutService();
  