// src/services/LocalStorageService.js
import { v4 as uuidv4 } from 'uuid'; // Precisaremos adicionar esta dependência para gerar IDs

class LocalStorageService {
  // Autenticação
  getUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  setUser(user) {
    try {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }

  // Registro de usuário
  registerUser(email, password, name) {
    try {
      // Verificar se o usuário já existe
      const users = this.getUsers();
      if (users.find(u => u.email === email)) {
        throw new Error('Este email já está em uso');
      }

      // Criar novo usuário
      const newUser = {
        uid: uuidv4(),
        email,
        password, // Em produção, nunca armazene senhas em texto puro
        name,
        createdAt: new Date().toISOString()
      };

      // Adicionar à lista de usuários
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Retornar usuário sem a senha
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  // Login
  loginUser(email, password) {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      // Retornar usuário sem a senha
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  // Logout
  logoutUser() {
    try {
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  }

  // Obter todos os usuários
  getUsers() {
    try {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  }

  // Treinos
  getWorkouts(userId) {
    try {
      const workouts = localStorage.getItem('workouts');
      const allWorkouts = workouts ? JSON.parse(workouts) : [];
      
      // Filtrar por userId se fornecido
      return userId 
        ? allWorkouts.filter(workout => workout.userId === userId)
        : allWorkouts;
    } catch (error) {
      console.error('Erro ao obter treinos:', error);
      return [];
    }
  }

  getWorkoutById(id) {
    try {
      const workouts = this.getWorkouts();
      return workouts.find(workout => workout.id === id) || null;
    } catch (error) {
      console.error('Erro ao obter treino por ID:', error);
      return null;
    }
  }

  addWorkout(workout) {
    try {
      const workouts = this.getWorkouts();
      
      // Adicionar ID e outras propriedades necessárias
      const newWorkout = {
        ...workout,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        progress: 0
      };
      
      // Garantir que cada exercício tenha a propriedade 'completed'
      if (newWorkout.exercises && Array.isArray(newWorkout.exercises)) {
        newWorkout.exercises = newWorkout.exercises.map(exercise => ({
          ...exercise,
          completed: false
        }));
      }
      
      workouts.push(newWorkout);
      localStorage.setItem('workouts', JSON.stringify(workouts));
      
      return newWorkout;
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
      throw error;
    }
  }

  updateWorkout(updatedWorkout) {
    try {
      const workouts = this.getWorkouts();
      
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
      
      const index = workouts.findIndex(workout => workout.id === updatedWorkout.id);
      
      if (index === -1) {
        throw new Error('Treino não encontrado');
      }
      
      workouts[index] = updatedWorkout;
      localStorage.setItem('workouts', JSON.stringify(workouts));
      
      return updatedWorkout;
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw error;
    }
  }

  deleteWorkout(id) {
    try {
      const workouts = this.getWorkouts();
      const filteredWorkouts = workouts.filter(workout => workout.id !== id);
      
      if (filteredWorkouts.length === workouts.length) {
        throw new Error('Treino não encontrado');
      }
      
      localStorage.setItem('workouts', JSON.stringify(filteredWorkouts));
      return true;
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw error;
    }
  }
}

export default new LocalStorageService();
