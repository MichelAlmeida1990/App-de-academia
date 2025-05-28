// src/services/LocalStorageService.js
const WORKOUTS_KEY = 'fitness_tracker_workouts_';
const COMPLETED_WORKOUTS_KEY = 'fitness_tracker_completed_workouts_'; // Pode ser removido se não for mais usado separadamente
const WORKOUT_PROGRESS_KEY = 'fitness_tracker_workout_progress_'; // Pode ser removido/simplificado se o progresso for no objeto workout

const LocalStorageService = {
  getWorkouts: (userId) => {
    const data = localStorage.getItem(WORKOUTS_KEY + userId);
    return data ? JSON.parse(data) : [];
  },
  saveWorkouts: (userId, workouts) => {
    localStorage.setItem(WORKOUTS_KEY + userId, JSON.stringify(workouts));
  },
  addWorkout: (workout) => {
    const workouts = LocalStorageService.getWorkouts(workout.userId);
    workouts.push(workout);
    LocalStorageService.saveWorkouts(workout.userId, workouts);
    return workout;
  },
  updateWorkout: (updatedWorkout) => {
    const workouts = LocalStorageService.getWorkouts(updatedWorkout.userId);
    const index = workouts.findIndex(w => w.id === updatedWorkout.id);
    if (index > -1) {
      workouts[index] = updatedWorkout;
      LocalStorageService.saveWorkouts(updatedWorkout.userId, workouts);
      return updatedWorkout;
    }
    return null;
  },
  // Corrigido para aceitar userId
  deleteWorkout: (workoutId, userId) => { 
    let workouts = LocalStorageService.getWorkouts(userId);
    workouts = workouts.filter(w => w.id !== workoutId);
    LocalStorageService.saveWorkouts(userId, workouts);
    // Opcional: Limpar progresso individual do treino se ainda estiver usando WORKOUT_PROGRESS_KEY
    // LocalStorageService.clearWorkoutProgress(userId, workoutId); 
  },

  // As funções getCompletedWorkouts e saveCompletedWorkouts podem ser removidas
  // se o status 'completed' for gerenciado diretamente no objeto workout.
  // Se ainda houver dependências em algum lugar, mantenha-as por enquanto.
  getCompletedWorkouts: (userId) => {
    const data = localStorage.getItem(COMPLETED_WORKOUTS_KEY + userId);
    return data ? JSON.parse(data) : {};
  },
  saveCompletedWorkouts: (userId, completedWorkouts) => {
    localStorage.setItem(COMPLETED_WORKOUTS_KEY + userId, JSON.stringify(completedWorkouts));
  },

  // As funções de progresso individual do exercício também podem ser simplificadas
  // se o progresso for gerenciado diretamente no objeto workout.
  getWorkoutProgress: (userId, workoutId) => {
    const data = localStorage.getItem(WORKOUT_PROGRESS_KEY + userId);
    const allProgress = data ? JSON.parse(data) : {};
    return allProgress[workoutId] || null;
  },
  saveWorkoutProgress: (userId, workoutId, progressData) => {
    const data = localStorage.getItem(WORKOUT_PROGRESS_KEY + userId);
    const allProgress = data ? JSON.parse(data) : {};
    allProgress[workoutId] = progressData;
    localStorage.setItem(WORKOUT_PROGRESS_KEY + userId, JSON.stringify(allProgress));
  },
  clearWorkoutProgress: (userId, workoutId) => { // Adicionado para limpar progresso de um treino específico
    const data = localStorage.getItem(WORKOUT_PROGRESS_KEY + userId);
    const allProgress = data ? JSON.parse(data) : {};
    delete allProgress[workoutId];
    localStorage.setItem(WORKOUT_PROGRESS_KEY + userId, JSON.stringify(allProgress));
  },
  clearAllWorkoutProgress: (userId) => {
    localStorage.removeItem(WORKOUT_PROGRESS_KEY + userId);
  }
};

export default LocalStorageService;