// src/utils/emergencyCleanup.js
// Script de limpeza emergencial para resolver o problema de isolamento de dados

export const EmergencyCleanup = {
  // Executar limpeza imediata
  runNow: () => {
    console.log('\n🚨 === LIMPEZA EMERGENCIAL DE DADOS ===\n');
    
    let totalCleaned = 0;
    let usersAffected = 0;
    
    // Listar todas as chaves de treinos
    const workoutKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        workoutKeys.push(key);
      }
    }
    
    console.log(`📋 Processando ${workoutKeys.length} usuários...`);
    
    workoutKeys.forEach(key => {
      const userId = key.replace('fitness_tracker_workouts_', '');
      let workouts = [];
      
      try {
        workouts = JSON.parse(localStorage.getItem(key) || '[]');
      } catch (error) {
        console.error(`❌ Erro ao parsear dados do usuário ${userId}:`, error);
        return;
      }
      
      const originalCount = workouts.length;
      
      // Filtrar apenas treinos que pertencem ao usuário correto
      const cleanWorkouts = workouts.filter(workout => {
        // Manter apenas treinos que têm userId correto
        return workout.userId === userId;
      });
      
      const removedCount = originalCount - cleanWorkouts.length;
      
      if (removedCount > 0) {
        // Salvar dados limpos
        localStorage.setItem(key, JSON.stringify(cleanWorkouts));
        console.log(`🧹 Usuário ${userId}: removidos ${removedCount} treinos órfãos (${cleanWorkouts.length} mantidos)`);
        totalCleaned += removedCount;
        usersAffected++;
      } else {
        console.log(`✅ Usuário ${userId}: sem problemas (${cleanWorkouts.length} treinos)`);
      }
    });
    
    console.log(`\n📊 === RESULTADOS ===`);
    console.log(`👥 Total de usuários processados: ${workoutKeys.length}`);
    console.log(`🛠️ Usuários com dados corrigidos: ${usersAffected}`);
    console.log(`🗑️ Total de treinos órfãos removidos: ${totalCleaned}`);
    
    if (totalCleaned > 0) {
      console.log(`\n✅ Limpeza concluída! O problema de isolamento foi resolvido.`);
      console.log(`ℹ️ Recarregue a página para ver os resultados.`);
    } else {
      console.log(`\n✅ Nenhum problema encontrado. Dados já estão corretos.`);
    }
    
    return {
      usersProcessed: workoutKeys.length,
      usersAffected,
      totalCleaned
    };
  }
};

// Executar automaticamente quando este módulo for importado
if (typeof window !== 'undefined' && window.localStorage) {
  // Adicionar função global para fácil acesso via console
  window.emergencyCleanup = EmergencyCleanup.runNow;
  console.log('🔧 EmergencyCleanup disponível via: window.emergencyCleanup()');
}

export default EmergencyCleanup; 