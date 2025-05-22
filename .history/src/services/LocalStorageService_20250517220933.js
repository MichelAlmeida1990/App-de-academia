class LocalStorageService {
  // MÉTODOS DE USUÁRIOS
  
  // Obter todos os usuários
  getUsers() {
    try {
      const storedUsers = localStorage.getItem('users');
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  }

  // Salvar o usuário atual
  setCurrentUser(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Erro ao salvar usuário atual:", error);
      throw error;
    }
  }

  // Obter o usuário atual
  getUser() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      return null;
    }
  }

  // Remover o usuário atual (logout)
  logoutUser() {
    try {
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }
  
  // MÉTODOS DE TREINOS
  
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
      
      // Garantir que o ID seja uma string para consistência
      const newWorkout = {
        ...workout,
        id: String(workout.id || Date.now()) // Converter para string
      };
      
      console.log("Adicionando treino com ID:", newWorkout.id);
      
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
      
      // Converter IDs para string para comparação consistente
      const workoutIdStr = String(updatedWorkout.id);
      
      const updatedWorkouts = workouts.map(workout => 
        String(workout.id) === workoutIdStr ? {
          ...updatedWorkout,
          id: workoutIdStr // Garantir que o ID permaneça como string
        } : workout
      );
      
      localStorage.setItem(`workouts_${updatedWorkout.userId}`, JSON.stringify(updatedWorkouts));
      
      return {
        ...updatedWorkout,
        id: workoutIdStr // Retornar com ID como string
      };
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      throw error;
    }
  }

  // Excluir um treino - CORRIGIDO
  deleteWorkout(workoutId) {
    try {
      // Converter para string para garantir comparação consistente
      const workoutIdStr = String(workoutId);
      console.log("Tentando excluir treino com ID:", workoutIdStr);
      
      // Primeiro, precisamos encontrar o treino para saber o userId
      let userId = null;
      let allWorkouts = [];
      
      // Buscar em todos os itens do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('workouts_')) {
          const tempUserId = key.replace('workouts_', '');
          const userWorkouts = this.getWorkouts(tempUserId);
          
          console.log(`Verificando treinos do usuário ${tempUserId}:`, userWorkouts);
          
          // Usar comparação de strings para encontrar o treino
          const workout = userWorkouts.find(w => String(w.id) === workoutIdStr);
          if (workout) {
            console.log("Treino encontrado:", workout);
            userId = tempUserId;
            allWorkouts = userWorkouts;
            break;
          }
        }
      }
      
      if (!userId) {
        console.error("Nenhum treino encontrado com ID:", workoutIdStr);
        throw new Error("Treino não encontrado");
      }
      
      // Filtrar o treino a ser removido usando comparação de strings
      const updatedWorkouts = allWorkouts.filter(workout => String(workout.id) !== workoutIdStr);
      
      // Verificar se algum treino foi removido
      if (updatedWorkouts.length === allWorkouts.length) {
        console.error("Nenhum treino foi removido. IDs não correspondem.");
        throw new Error("Treino não encontrado");
      }
      
      console.log("Treinos após remoção:", updatedWorkouts);
      
      // Salvar os treinos atualizados
      localStorage.setItem(`workouts_${userId}`, JSON.stringify(updatedWorkouts));
      
      // Remover também os dados de progresso
      localStorage.removeItem(`workout_progress_${userId}_${workoutIdStr}`);
      
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
      // Converter para string para garantir consistência
      const workoutIdStr = String(workoutId);
      
      const progressData = localStorage.getItem(`workout_progress_${userId}_${workoutIdStr}`);
      return progressData ? JSON.parse(progressData) : null;
    } catch (error) {
      console.error("Erro ao buscar progresso do treino:", error);
      return null;
    }
  }

  // Salvar progresso de um treino
  saveWorkoutProgress(userId, workoutId, progressData) {
    try {
      // Converter para string para garantir consistência
      const workoutIdStr = String(workoutId);
      
      localStorage.setItem(`workout_progress_${userId}_${workoutIdStr}`, JSON.stringify(progressData));
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
        if (key && key.startsWith(`workout_progress_${userId}_`)) {
          localStorage.removeItem(key);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
      throw error;
    }
  }
  
  // Método auxiliar para depuração - listar todos os itens do localStorage
  debugStorage() {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          items[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          items[key] = localStorage.getItem(key);
        }
      }
    }
    console.log("Conteúdo do localStorage:", items);
    return items;
  }
}

// Exportar uma instância única do serviço
export default new LocalStorageService();
