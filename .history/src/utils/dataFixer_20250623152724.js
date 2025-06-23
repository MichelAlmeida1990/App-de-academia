import LocalStorageService from '../services/LocalStorageService';

export const DataFixer = {
  // Detectar e remover treinos sem userId (vazamento de dados)
  cleanupOrphanedWorkouts: () => {
    console.log('\n🧹 === LIMPEZA DE TREINOS ÓRFÃOS ===\n');
    
    let totalRemoved = 0;
    let totalCleaned = 0;
    
    // Listar todas as chaves de treinos
    const workoutKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        workoutKeys.push(key);
      }
    }
    
    console.log(`📋 Encontradas ${workoutKeys.length} chaves de treinos para verificar`);
    
    workoutKeys.forEach(key => {
      const userId = key.replace('fitness_tracker_workouts_', '');
      const workouts = JSON.parse(localStorage.getItem(key) || '[]');
      
      console.log(`\n🔍 Verificando usuário: ${userId} (${workouts.length} treinos)`);
      
      const cleanWorkouts = [];
      const orphanedWorkouts = [];
      
      workouts.forEach(workout => {
        // Verificar se o treino tem userId e se corresponde ao usuário correto
        if (!workout.userId) {
          orphanedWorkouts.push(workout);
          console.log(`  ❌ Treino órfão sem userId: ${workout.id} - ${workout.name}`);
        } else if (workout.userId !== userId) {
          orphanedWorkouts.push(workout);
          console.log(`  ❌ Treino com userId incorreto: ${workout.id} - ${workout.name} (userId: ${workout.userId})`);
        } else {
          cleanWorkouts.push(workout);
        }
      });
      
      if (orphanedWorkouts.length > 0) {
        console.log(`  🧹 Removendo ${orphanedWorkouts.length} treinos órfãos`);
        LocalStorageService.saveWorkouts(userId, cleanWorkouts);
        totalRemoved += orphanedWorkouts.length;
        totalCleaned++;
      } else {
        console.log(`  ✅ Todos os treinos estão corretos`);
      }
    });
    
    console.log(`\n📊 === RESUMO DA LIMPEZA ===`);
    console.log(`✅ Usuários processados: ${workoutKeys.length}`);
    console.log(`🧹 Usuários com dados limpos: ${totalCleaned}`);
    console.log(`❌ Total de treinos órfãos removidos: ${totalRemoved}`);
    
    return {
      usersProcessed: workoutKeys.length,
      usersCleaned: totalCleaned,
      orphanedRemoved: totalRemoved
    };
  },

  // Verificar se existem treinos duplicados entre usuários
  findDuplicateWorkouts: () => {
    console.log('\n🔍 === DETECÇÃO DE TREINOS DUPLICADOS ===\n');
    
    const allWorkouts = {};
    const duplicates = [];
    
    // Coletar todos os treinos
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        const userId = key.replace('fitness_tracker_workouts_', '');
        const workouts = JSON.parse(localStorage.getItem(key) || '[]');
        
        workouts.forEach(workout => {
          if (allWorkouts[workout.id]) {
            duplicates.push({
              id: workout.id,
              name: workout.name,
              users: [allWorkouts[workout.id].userId, userId]
            });
          } else {
            allWorkouts[workout.id] = { ...workout, userId };
          }
        });
      }
    }
    
    if (duplicates.length > 0) {
      console.log(`❌ ${duplicates.length} treinos duplicados encontrados:`);
      duplicates.forEach(dup => {
        console.log(`  - ID: ${dup.id}, Nome: ${dup.name}, Usuários: ${dup.users.join(', ')}`);
      });
    } else {
      console.log('✅ Nenhum treino duplicado encontrado');
    }
    
    return duplicates;
  },

  // Execução completa de limpeza e verificação
  runFullCleanup: () => {
    console.log('\n🚀 === EXECUÇÃO COMPLETA DE LIMPEZA ===\n');
    
    const cleanupResult = DataFixer.cleanupOrphanedWorkouts();
    const duplicates = DataFixer.findDuplicateWorkouts();
    
    const report = {
      cleanup: cleanupResult,
      duplicates: duplicates.length,
      timestamp: new Date().toISOString()
    };
    
    console.log('\n📋 === RELATÓRIO FINAL ===');
    console.log(JSON.stringify(report, null, 2));
    
    // Salvar relatório
    localStorage.setItem('fitness_data_cleanup_report', JSON.stringify(report));
    
    return report;
  },

  // Criar backup antes de limpezas
  createBackup: () => {
    console.log('\n💾 === CRIANDO BACKUP ===\n');
    
    const backup = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_')) {
        backup[key] = localStorage.getItem(key);
      }
    }
    
    const backupKey = `fitness_backup_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(backup));
    
    console.log(`✅ Backup criado: ${backupKey}`);
    console.log(`📦 ${Object.keys(backup).length} chaves salvas no backup`);
    
    return backupKey;
  },

  // Restaurar backup
  restoreBackup: (backupKey) => {
    console.log(`\n🔄 === RESTAURANDO BACKUP: ${backupKey} ===\n`);
    
    const backupData = localStorage.getItem(backupKey);
    if (!backupData) {
      console.error('❌ Backup não encontrado');
      return false;
    }
    
    try {
      const backup = JSON.parse(backupData);
      
      // Limpar dados atuais
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('fitness_tracker_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Restaurar backup
      Object.entries(backup).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      
      console.log(`✅ Backup restaurado com sucesso`);
      console.log(`📦 ${Object.keys(backup).length} chaves restauradas`);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      return false;
    }
  }
};

export default DataFixer; 