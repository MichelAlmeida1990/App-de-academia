// src/services/LocalStorageService.js
const WORKOUTS_KEY = 'fitness_tracker_workouts_';
const COMPLETED_WORKOUTS_KEY = 'fitness_tracker_completed_workouts_'; // Pode ser removido se não for mais usado separadamente
const WORKOUT_PROGRESS_KEY = 'fitness_tracker_workout_progress_'; // Pode ser removido/simplificado se o progresso for no objeto workout

// NOVAS CHAVES PARA GERENCIAMENTO DE USUÁRIOS
const USERS_KEY = 'fitness_tracker_users'; 
const CURRENT_USER_KEY = 'fitness_tracker_current_user'; // Para persistir o usuário logado

const LocalStorageService = {
    // Funções de gerenciamento de treinos
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
    deleteWorkout: (workoutId, userId) => { 
        let workouts = LocalStorageService.getWorkouts(userId);
        workouts = workouts.filter(w => w.id !== workoutId);
        LocalStorageService.saveWorkouts(userId, workouts);
    },

    // **NOVA FUNÇÃO PARA SALVAR TREINOS DE DEMONSTRAÇÃO INICIALMENTE**
    saveInitialDemoWorkouts: (userId, demoWorkouts) => {
        const existingWorkouts = LocalStorageService.getWorkouts(userId);
        if (existingWorkouts.length === 0) { // Só salva se não houver treinos existentes
            localStorage.setItem(WORKOUTS_KEY + userId, JSON.stringify(demoWorkouts));
            console.log(`Treinos de demonstração salvos para o novo usuário ${userId}`);
        } else {
            console.log(`Treinos já existem para o usuário ${userId}. Não salvando treinos de demonstração.`);
        }
    },

    // Funções de gerenciamento de treinos concluídos (manter por enquanto se houver dependências)
    getCompletedWorkouts: (userId) => {
        const data = localStorage.getItem(COMPLETED_WORKOUTS_KEY + userId);
        return data ? JSON.parse(data) : {};
    },
    saveCompletedWorkouts: (userId, completedWorkouts) => {
        localStorage.setItem(COMPLETED_WORKOUTS_KEY + userId, JSON.stringify(completedWorkouts));
    },

    // Funções de progresso individual do exercício (manter por enquanto se houver dependências)
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
    clearWorkoutProgress: (userId, workoutId) => {
        const data = localStorage.getItem(WORKOUT_PROGRESS_KEY + userId);
        const allProgress = data ? JSON.parse(data) : {};
        delete allProgress[workoutId];
        localStorage.setItem(WORKOUT_PROGRESS_KEY + userId, JSON.stringify(allProgress));
    },
    clearAllWorkoutProgress: (userId) => {
        localStorage.removeItem(WORKOUT_PROGRESS_KEY + userId);
    },

    // === NOVAS FUNÇÕES PARA GERENCIAR USUÁRIOS E AUTENTICAÇÃO ===

    // Obtém todos os usuários registrados
    getUsers: () => {
        try {
            const users = localStorage.getItem(USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error("Erro ao obter usuários do localStorage:", error);
            return [];
        }
    },

    // Adiciona um novo usuário (para registro)
    addUser: (user) => {
        try {
            const users = LocalStorageService.getUsers();
            // Verifica se o usuário já existe pelo email
            const userExists = users.some(u => u.email === user.email);
            if (userExists) {
                throw new Error("Usuário com este email já existe.");
            }
            const newUser = { ...user, uid: `user_${Date.now()}` }; // Adiciona um UID simples
            const updatedUsers = [...users, newUser];
            localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            return newUser;
        } catch (error) {
            console.error("Erro ao adicionar usuário ao localStorage:", error);
            throw error;
        }
    },

    // Encontra um usuário por email e senha (para login)
    findUser: (email, password) => {
        const users = LocalStorageService.getUsers();
        return users.find(user => user.email === email && user.password === password);
    },

    // Persiste o usuário logado atualmente
    saveCurrentUser: (user) => {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    },

    // Obtém o usuário logado atualmente
    getCurrentUser: () => {
        try {
            const user = localStorage.getItem(CURRENT_USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Erro ao obter usuário atual do localStorage:", error);
            return null;
        }
    },

    // Remove o usuário logado (para logout)
    clearCurrentUser: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};

export default LocalStorageService;
