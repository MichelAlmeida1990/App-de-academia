// src/utils/clearAllData.js
// Utilitário para limpar completamente todos os dados salvos

/**
 * Remove TODOS os dados do localStorage relacionados ao app
 * Use apenas para deploy limpo ou reset completo
 */
export const clearAllAppData = () => {
  const keysToRemove = [];
  
  // Percorrer todas as chaves do localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    // Identificar chaves relacionadas ao app fitness
    if (key && (
      key.startsWith('fitness_') ||
      key.startsWith('workout') ||
      key.startsWith('bmi-history') ||
      key.startsWith('bodyfat-history') ||
      key.startsWith('calorie-history') ||
      key.startsWith('onerm-history') ||
      key === 'savedExercises' ||
      key === 'recentlyViewedExercises' ||
      key === 'appSettings' ||
      key === 'themeSettings' ||
      key === 'user-profile' ||
      key === 'completed-workouts' ||
      key === 'completed-exercises' ||
      key === 'workout-progress'
    )) {
      keysToRemove.push(key);
    }
  }
  
  // Remover todas as chaves identificadas
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removido: ${key}`);
  });
  
  console.log(`✅ Limpeza completa realizada. ${keysToRemove.length} itens removidos.`);
  return keysToRemove.length;
};

/**
 * Remove apenas dados de demonstração e treinos pré-carregados
 */
export const clearDemoData = () => {
  const demoKeysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && (
      key.includes('demo') ||
      key.includes('user_demo') ||
      key.startsWith('fitness_tracker_workouts_') ||
      key.startsWith('fitness_tracker_users')
    )) {
      demoKeysToRemove.push(key);
    }
  }
  
  demoKeysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🎯 Demo removido: ${key}`);
  });
  
  console.log(`✅ Dados demo removidos. ${demoKeysToRemove.length} itens.`);
  return demoKeysToRemove.length;
};

/**
 * Lista todos os dados atualmente salvos (para debug)
 */
export const listAllAppData = () => {
  const appData = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('fitness_') ||
      key.startsWith('workout') ||
      key.includes('history') ||
      key === 'savedExercises' ||
      key === 'recentlyViewedExercises' ||
      key === 'appSettings' ||
      key === 'themeSettings'
    )) {
      try {
        const value = localStorage.getItem(key);
        appData[key] = JSON.parse(value);
      } catch {
        appData[key] = localStorage.getItem(key);
      }
    }
  }
  
  console.log('📊 Dados atuais do app:', appData);
  return appData;
};

/**
 * Executa limpeza automática no carregamento da página
 * (apenas em production para deploy limpo)
 */
export const autoCleanForProduction = () => {
  // Verifica se está em produção (deploy)
  const isProduction = process.env.NODE_ENV === 'production' || 
                      window.location.hostname !== 'localhost';
  
  if (isProduction) {
    console.log('🚀 Detectado ambiente de produção - executando limpeza automática');
    clearAllAppData();
    
    // Opcional: recarregar a página para garantir estado limpo
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}; 