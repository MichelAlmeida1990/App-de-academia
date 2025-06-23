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

  // Verificar isolamento de dados
  checkDataIsolation: () => {
    console.log('\n🔍 === ANÁLISE DE ISOLAMENTO DE DADOS ===\n');
    
    const allWorkoutKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        allWorkoutKeys.push(key);
      }
    }
    
    const analysis = {};
    
    allWorkoutKeys.forEach(key => {
      const userId = key.replace('fitness_tracker_workouts_', '');
      const workouts = JSON.parse(localStorage.getItem(key) || '[]');
      
      analysis[userId] = {
        totalWorkouts: workouts.length,
        workoutIds: workouts.map(w => w.id),
        userIds: [...new Set(workouts.map(w => w.userId))],
        hasIncorrectUserIds: workouts.some(w => w.userId !== userId),
        incorrectWorkouts: workouts.filter(w => w.userId !== userId)
      };
    });
    
    console.log('📊 Análise completa:', analysis);
    
    // Verificar problemas de isolamento
    const issues = [];
    Object.entries(analysis).forEach(([userId, data]) => {
      if (data.hasIncorrectUserIds) {
        issues.push({
          userId,
          problem: 'Treinos com userId incorreto',
          incorrectWorkouts: data.incorrectWorkouts
        });
      }
      
      if (data.userIds.length > 1) {
        issues.push({
          userId,
          problem: 'Múltiplos userIds no mesmo storage',
          userIds: data.userIds
        });
      }
    });
    
    if (issues.length > 0) {
      console.error('\n❌ PROBLEMAS DE ISOLAMENTO ENCONTRADOS:');
      issues.forEach(issue => {
        console.error(`- Usuário ${issue.userId}: ${issue.problem}`, issue);
      });
    } else {
      console.log('\n✅ Nenhum problema de isolamento encontrado');
    }
    
    return { analysis, issues };
  },

  // Verificar treinos duplicados
  checkDuplicateWorkouts: () => {
    console.log('\n🔍 === VERIFICAÇÃO DE TREINOS DUPLICADOS ===\n');
    
    const allWorkouts = [];
    const duplicates = [];
    
    // Coletar todos os treinos
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        const userId = key.replace('fitness_tracker_workouts_', '');
        const workouts = JSON.parse(localStorage.getItem(key) || '[]');
        
        workouts.forEach(workout => {
          allWorkouts.push({
            ...workout,
            storageUserId: userId
          });
        });
      }
    }
    
    // Verificar duplicatas por ID
    const workoutIds = {};
    allWorkouts.forEach(workout => {
      if (workoutIds[workout.id]) {
        duplicates.push({
          id: workout.id,
          original: workoutIds[workout.id],
          duplicate: workout
        });
      } else {
        workoutIds[workout.id] = workout;
      }
    });
    
    if (duplicates.length > 0) {
      console.error(`❌ ${duplicates.length} treinos duplicados encontrados:`, duplicates);
    } else {
      console.log('✅ Nenhum treino duplicado encontrado');
    }
    
    return { allWorkouts, duplicates };
  },

  // Corrigir problemas de isolamento
  fixDataIsolation: () => {
    console.log('\n🔧 === CORREÇÃO DE ISOLAMENTO DE DADOS ===\n');
    
    const { issues } = AuthDebugUtils.checkDataIsolation();
    
    if (issues.length === 0) {
      console.log('✅ Nenhum problema para corrigir');
      return;
    }
    
    issues.forEach(issue => {
      if (issue.problem === 'Treinos com userId incorreto') {
        console.log(`🔧 Corrigindo treinos para usuário ${issue.userId}`);
        
        // Remover treinos com userId incorreto
        const correctWorkouts = LocalStorageService.getWorkouts(issue.userId)
          .filter(w => w.userId === issue.userId);
        
        LocalStorageService.saveWorkouts(issue.userId, correctWorkouts);
        console.log(`✅ ${correctWorkouts.length} treinos mantidos para usuário ${issue.userId}`);
      }
    });
    
    console.log('\n✅ Correção concluída');
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

  // Exportar relatório completo
  generateReport: () => {
    console.log('\n📋 === RELATÓRIO COMPLETO DE DEBUG ===\n');
    
    const users = AuthDebugUtils.listAllUsersWithWorkouts();
    const isolation = AuthDebugUtils.checkDataIsolation();
    const duplicates = AuthDebugUtils.checkDuplicateWorkouts();
    
    const report = {
      timestamp: new Date().toISOString(),
      users,
      isolation,
      duplicates,
      totalWorkouts: Object.values(users).reduce((a, b) => a + b, 0)
    };
    
    console.log('📋 Relatório completo:', report);
    
    // Salvar relatório no localStorage para análise
    localStorage.setItem('fitness_debug_report', JSON.stringify(report));
    console.log('💾 Relatório salvo em localStorage como "fitness_debug_report"');
    
    return report;
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