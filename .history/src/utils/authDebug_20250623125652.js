import LocalStorageService from '../services/LocalStorageService';

export const AuthDebugUtils = {
  // Limpar todos os dados de treinos para teste
  clearAllWorkouts: () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    });
    
    console.log(`✅ Limpeza concluída: ${keys.length} chaves removidas`);
  },

  // Verificar treinos por usuário
  checkWorkoutsByUser: (userId) => {
    const workouts = LocalStorageService.getWorkouts(userId);
    console.log(`🔍 Treinos para usuário ${userId}:`, workouts);
    return workouts;
  },

  // Listar todos os usuários com treinos
  listAllUsersWithWorkouts: () => {
    const users = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        const userId = key.replace('fitness_tracker_workouts_', '');
        const workouts = JSON.parse(localStorage.getItem(key) || '[]');
        users[userId] = workouts.length;
      }
    }
    
    console.log('👥 Usuários com treinos:', users);
    return users;
  },

  // Simular usuário novo
  simulateNewUser: (userId = `test_user_${Date.now()}`) => {
    console.log(`🧪 Simulando usuário novo: ${userId}`);
    
    // Verificar se já tem treinos
    const existingWorkouts = LocalStorageService.getWorkouts(userId);
    console.log(`- Treinos existentes: ${existingWorkouts.length}`);
    
    // Simular criação de treinos demo
    if (existingWorkouts.length === 0) {
      console.log('✅ Deveria criar treinos demo');
      return true;
    } else {
      console.log('❌ NÃO deveria criar treinos demo');
      return false;
    }
  },

  // Verificar configuração do Firebase Auth
  checkFirebaseAuth: () => {
    console.log('🔥 Verificando configuração Firebase:');
    console.log('- API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Configurado' : '❌ Não configurado');
    console.log('- Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Configurado' : '❌ Não configurado');
    console.log('- Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Configurado' : '❌ Não configurado');
  },

  // Testar Google Auth (retorna instruções se não configurado)
  testGoogleAuth: () => {
    console.log('🔍 Testando Google Auth...');
    
    // Verificar se as configurações estão OK
    const hasConfig = process.env.REACT_APP_FIREBASE_API_KEY && 
                     process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
    
    if (!hasConfig) {
      console.error('❌ Configuração Firebase incompleta');
      return false;
    }
    
    console.log('✅ Configuração Firebase OK');
    console.log('ℹ️ Para testar Google Auth:');
    console.log('1. Configure no Firebase Console (veja firebase-setup-instructions.md)');
    console.log('2. Clique no botão "Continuar com Google"');
    console.log('3. Verifique os logs no console');
    
    return true;
  },

  // Exportar dados para análise
  exportDebugData: () => {
    const data = {
      timestamp: new Date().toISOString(),
      allUsers: AuthDebugUtils.listAllUsersWithWorkouts(),
      localStorageKeys: [],
      workoutKeys: []
    };
    
    // Coletar todas as chaves do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data.localStorageKeys.push(key);
      
      if (key && key.includes('fitness_tracker_workouts_')) {
        data.workoutKeys.push({
          key,
          userId: key.replace('fitness_tracker_workouts_', ''),
          workoutCount: JSON.parse(localStorage.getItem(key) || '[]').length
        });
      }
    }
    
    console.log('📊 Debug Data Export:', data);
    return data;
  }
};

// Expor funções globalmente para uso no console do navegador
if (typeof window !== 'undefined') {
  window.AuthDebug = AuthDebugUtils;
  console.log('🛠️ Debug utils disponíveis em window.AuthDebug');
  console.log('Exemplo: AuthDebug.clearAllWorkouts()');
}

export default AuthDebugUtils; 