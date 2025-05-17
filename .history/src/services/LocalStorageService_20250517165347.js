class LocalStorageService {
  // Obter todos os treinos de um usuário
  getWorkouts(userId) {
    try {
      const storedWorkouts = localStorage.getItem(`workouts_${userId}`);
      return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
      return [];
    }
  }

  // Adicionar um novo treino
  addWorkout(workout) {
    try {
      // Garantir que temos um array de treinos
      const workouts = this.getWorkouts(workout.userId) || [];
      
      // Adicionar o novo treino
      const newWorkout = {
        ...workout,
        id: workout.id || Date.now() // Usar o ID fornecido ou gerar um novo
      };
      
      workouts.push(newWorkout);
      
      // Salvar no localStorage
      localStorage.setItem(`workouts_${workout.userId}`, JSON.stringify(workouts));
      
      return newWorkout;
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
      throw error;
    }
  }

  // Atualizar um treino existente
  updateWorkout(updatedWorkout) {
    try {
      const workouts = this.getWorkouts(updatedWorkout.userId);
      
      const updatedWorkouts = workouts.map(workout => 
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );
      
      localStorage.setItem(`workouts_${updatedWorkout.userId}`, JSON.stringify(updatedWorkouts));
      
      return updatedWorkout;
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      throw error;
    }
  }

  // Excluir um treino
  deleteWorkout(workoutId) {
    try {
      // Primeiro, precisamos encontrar o treino para saber o userId
      let userId = null;
      let allWorkouts = [];
      
      // Buscar em todos os itens do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('workouts_')) {
          const tempUserId = key.replace('workouts_', '');
          const userWorkouts = this.getWorkouts(tempUserId);
          
          const workout = userWorkouts.find(w => w.id === workoutId);
          if (workout) {
            userId = tempUserId;
            allWorkouts = userWorkouts;
            break;
          }
        }
      }
      
      if (!userId) {
        throw new Error("Treino não encontrado");
      }
      
      // Filtrar o treino a ser removido
      const updatedWorkouts = allWorkouts.filter(workout => workout.id !== workoutId);
      
      // Salvar os treinos atualizados
      localStorage.setItem(`workouts_${userId}`, JSON.stringify(updatedWorkouts));
      
      // Remover também os dados de progresso
      localStorage.removeItem(`workout_progress_${userId}_${workoutId}`);
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir treino:", error);
      throw error;
    }
  }

  // Obter informações de treinos concluídos
  getCompletedWorkouts(userId) {
    try {
      const completedData = localStorage.getItem(`completed_workouts_${userId}`);
      return completedData ? JSON.parse(completedData) : {};
    } catch (error) {
      console.error("Erro ao buscar treinos concluídos:", error);
      return {};
    }
  }

  // Salvar informações de treinos concluídos
  saveCompletedWorkouts(userId, completedWorkouts) {
    try {
      localStorage.setItem(`completed_workouts_${userId}`, JSON.stringify(completedWorkouts));
      return true;
    } catch (error) {
      console.error("Erro ao salvar treinos concluídos:", error);
      throw error;
    }
  }

  // Obter progresso de um treino específico
  getWorkoutProgress(userId, workoutId) {
    try {
      const progressData = localStorage.getItem(`workout_progress_${userId}_${workoutId}`);
      return progressData ? JSON.parse(progressData) : null;
    } catch (error) {
      console.error("Erro ao buscar progresso do treino:", error);
      return null;
    }
  }

  // Salvar progresso de um treino
  saveWorkoutProgress(userId, workoutId, progressData) {
    try {
      localStorage.setItem(`workout_progress_${userId}_${workoutId}`, JSON.stringify(progressData));
      return true;
    } catch (error) {
      console.error("Erro ao salvar progresso do treino:", error);
      throw error;
    }
  }

  // Limpar todos os dados de um usuário
  clearUserData(userId) {
    try {
      // Remover treinos
      localStorage.removeItem(`workouts_${userId}`);
      
      // Remover dados de conclusão
      localStorage.removeItem(`completed_workouts_${userId}`);
      
      // Remover todos os progressos de treino
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`workout_progress_${userId}_`)) {
          localStorage.removeItem(key);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
      throw error;
    }
  }
}

// Exportar uma instância única do serviço
export default new LocalStorageService();
