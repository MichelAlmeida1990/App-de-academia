import { auth } from '../firebase';

const USER_PROFILE_KEY = 'fitness_user_profile_';
const BMI_HISTORY_KEY = 'fitness_bmi_history_';
const BODYFAT_HISTORY_KEY = 'fitness_bodyfat_history_';
const CALORIE_HISTORY_KEY = 'fitness_calorie_history_';
const ONERM_HISTORY_KEY = 'fitness_onerm_history_';

class UserDataService {
  // Obter ID do usuário atual
  getCurrentUserId() {
    const user = auth.currentUser;
    if (user) {
      return user.uid;
    }
    // Fallback para usuário demo se não estiver autenticado
    return 'demo_user';
  }

  // === PERFIL DO USUÁRIO ===
  
  getUserProfile() {
    const userId = this.getCurrentUserId();
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY + userId);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      return {};
    }
  }

  saveUserProfile(profileData) {
    const userId = this.getCurrentUserId();
    try {
      const existingData = this.getUserProfile();
      const updatedData = {
        ...existingData,
        ...profileData,
        userId,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(USER_PROFILE_KEY + userId, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      console.error('Erro ao salvar perfil do usuário:', error);
      throw error;
    }
  }

  // === IMC ===
  
  saveBMIData(bmiData) {
    const profileData = {
      height: bmiData.height,
      weight: bmiData.weight,
      bmi: bmiData.bmi,
      category: bmiData.category,
      lastBMIUpdate: new Date().toISOString()
    };
    
    // Salvar no perfil
    this.saveUserProfile(profileData);
    
    // Salvar no histórico
    this.saveBMIHistory(bmiData);
    
    return profileData;
  }

  saveBMIHistory(bmiData) {
    const userId = this.getCurrentUserId();
    try {
      const existing = localStorage.getItem(BMI_HISTORY_KEY + userId);
      const history = existing ? JSON.parse(existing) : [];
      
      const newEntry = {
        ...bmiData,
        date: new Date().toISOString(),
        userId
      };
      
      const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Manter últimos 10
      localStorage.setItem(BMI_HISTORY_KEY + userId, JSON.stringify(updatedHistory));
      
      return updatedHistory;
    } catch (error) {
      console.error('Erro ao salvar histórico de IMC:', error);
      return [];
    }
  }

  getBMIHistory() {
    const userId = this.getCurrentUserId();
    try {
      const data = localStorage.getItem(BMI_HISTORY_KEY + userId);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico de IMC:', error);
      return [];
    }
  }

  // === GORDURA CORPORAL ===
  
  saveBodyFatData(bodyFatData) {
    const profileData = {
      bodyFat: bodyFatData.bodyFat,
      bodyFatCategory: bodyFatData.category,
      bodyFatMethod: bodyFatData.method,
      leanMass: bodyFatData.leanMass,
      fatMass: bodyFatData.fatMass,
      lastBodyFatUpdate: new Date().toISOString()
    };
    
    // Salvar no perfil
    this.saveUserProfile(profileData);
    
    // Salvar no histórico
    this.saveBodyFatHistory(bodyFatData);
    
    return profileData;
  }

  saveBodyFatHistory(bodyFatData) {
    const userId = this.getCurrentUserId();
    try {
      const existing = localStorage.getItem(BODYFAT_HISTORY_KEY + userId);
      const history = existing ? JSON.parse(existing) : [];
      
      const newEntry = {
        ...bodyFatData,
        date: new Date().toISOString(),
        userId
      };
      
      const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Manter últimos 10
      localStorage.setItem(BODYFAT_HISTORY_KEY + userId, JSON.stringify(updatedHistory));
      
      return updatedHistory;
    } catch (error) {
      console.error('Erro ao salvar histórico de gordura corporal:', error);
      return [];
    }
  }

  getBodyFatHistory() {
    const userId = this.getCurrentUserId();
    try {
      const data = localStorage.getItem(BODYFAT_HISTORY_KEY + userId);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico de gordura corporal:', error);
      return [];
    }
  }

  // === CALORIAS ===
  
  saveCalorieData(calorieData) {
    const profileData = {
      bmr: calorieData.bmr,
      tdee: calorieData.tdee,
      targetCalories: calorieData.targetCalories,
      calorieGoal: calorieData.goal,
      macros: calorieData.macros,
      lastCalorieUpdate: new Date().toISOString()
    };
    
    // Salvar no perfil
    this.saveUserProfile(profileData);
    
    // Salvar no histórico
    this.saveCalorieHistory(calorieData);
    
    return profileData;
  }

  saveCalorieHistory(calorieData) {
    const userId = this.getCurrentUserId();
    try {
      const existing = localStorage.getItem(CALORIE_HISTORY_KEY + userId);
      const history = existing ? JSON.parse(existing) : [];
      
      const newEntry = {
        ...calorieData,
        date: new Date().toISOString(),
        userId
      };
      
      const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Manter últimos 10
      localStorage.setItem(CALORIE_HISTORY_KEY + userId, JSON.stringify(updatedHistory));
      
      return updatedHistory;
    } catch (error) {
      console.error('Erro ao salvar histórico de calorias:', error);
      return [];
    }
  }

  getCalorieHistory() {
    const userId = this.getCurrentUserId();
    try {
      const data = localStorage.getItem(CALORIE_HISTORY_KEY + userId);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico de calorias:', error);
      return [];
    }
  }

  // === 1RM ===
  
  saveOneRMData(oneRMData) {
    // Para 1RM, salvamos apenas no histórico pois pode ter múltiplos exercícios
    const profileData = {
      lastOneRMUpdate: new Date().toISOString()
    };
    
    // Salvar timestamp no perfil
    this.saveUserProfile(profileData);
    
    // Salvar no histórico
    this.saveOneRMHistory(oneRMData);
    
    return profileData;
  }

  saveOneRMHistory(oneRMData) {
    const userId = this.getCurrentUserId();
    try {
      const existing = localStorage.getItem(ONERM_HISTORY_KEY + userId);
      const history = existing ? JSON.parse(existing) : [];
      
      const newEntry = {
        ...oneRMData,
        date: new Date().toISOString(),
        userId
      };
      
      const updatedHistory = [newEntry, ...history.slice(0, 19)]; // Manter últimos 20
      localStorage.setItem(ONERM_HISTORY_KEY + userId, JSON.stringify(updatedHistory));
      
      return updatedHistory;
    } catch (error) {
      console.error('Erro ao salvar histórico de 1RM:', error);
      return [];
    }
  }

  getOneRMHistory() {
    const userId = this.getCurrentUserId();
    try {
      const data = localStorage.getItem(ONERM_HISTORY_KEY + userId);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico de 1RM:', error);
      return [];
    }
  }

  // === MÉTODOS UTILITÁRIOS ===
  
  // Limpar todos os dados do usuário atual
  clearUserData() {
    const userId = this.getCurrentUserId();
    localStorage.removeItem(USER_PROFILE_KEY + userId);
    localStorage.removeItem(BMI_HISTORY_KEY + userId);
    localStorage.removeItem(BODYFAT_HISTORY_KEY + userId);
    localStorage.removeItem(CALORIE_HISTORY_KEY + userId);
    localStorage.removeItem(ONERM_HISTORY_KEY + userId);
  }

  // Migrar dados antigos (se necessário)
  migrateOldData() {
    try {
      const oldProfileData = localStorage.getItem('user-profile');
      if (oldProfileData) {
        const parsedData = JSON.parse(oldProfileData);
        this.saveUserProfile(parsedData);
        localStorage.removeItem('user-profile'); // Remove dados antigos
        console.log('Dados migrados com sucesso para o novo sistema');
      }
    } catch (error) {
      console.error('Erro ao migrar dados antigos:', error);
    }
  }

  // Exportar todos os dados do usuário
  exportUserData() {
    const userId = this.getCurrentUserId();
    const currentUser = auth.currentUser;
    
    return {
      user: {
        uid: userId,
        email: currentUser?.email,
        displayName: currentUser?.displayName
      },
      profile: this.getUserProfile(),
      history: {
        bmi: this.getBMIHistory(),
        bodyFat: this.getBodyFatHistory(),
        calories: this.getCalorieHistory(),
        oneRM: this.getOneRMHistory()
      },
      exportDate: new Date().toISOString()
    };
  }
}

// Exportar instância singleton
const userDataService = new UserDataService();
export default userDataService; 