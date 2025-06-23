// src/utils/cleanupToolsHistory.js
// Script para limpar histórico antigo das ferramentas sem isolamento de usuário

export const cleanupToolsHistory = () => {
  console.log('\n🧹 === LIMPEZA DE HISTÓRICO DAS FERRAMENTAS ===\n');
  
  const oldKeys = [
    'bmi-history',
    'bodyfat-history', 
    'bodyfit-history', // Bug de digitação no BodyFatCalculator
    'calorie-history'
  ];
  
  let removedCount = 0;
  
  oldKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        console.log(`🗑️ Removendo histórico antigo: "${key}" (${Array.isArray(parsedData) ? parsedData.length : 1} entradas)`);
        localStorage.removeItem(key);
        removedCount++;
      } catch (error) {
        console.warn(`⚠️ Erro ao processar chave "${key}":`, error);
        localStorage.removeItem(key); // Remove mesmo se der erro no parse
        removedCount++;
      }
    }
  });
  
  if (removedCount > 0) {
    console.log(`\n✅ Limpeza concluída! ${removedCount} chaves antigas removidas.`);
    console.log('ℹ️ Históricos agora são isolados por usuário (ex: bmi-history-userId)');
  } else {
    console.log('\n✅ Nenhum histórico antigo encontrado. Sistema já está limpo.');
  }
  
  // Verificar se há chaves suspeitas sem userId
  const suspiciousKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('history') && 
      !key.includes('fitness_') && // UserDataService usa este prefixo
      !key.includes('-') // Nossas novas chaves têm formato: tipo-history-userId
    )) {
      suspiciousKeys.push(key);
    }
  }
  
  if (suspiciousKeys.length > 0) {
    console.log('\n🔍 Chaves suspeitas encontradas:');
    suspiciousKeys.forEach(key => {
      console.log(`   - ${key}`);
    });
    console.log('   ⚠️ Considere verificar se estas chaves precisam de isolamento');
  }
  
  return {
    removedCount,
    suspiciousKeys
  };
};

// Executar automaticamente quando importado
if (typeof window !== 'undefined' && window.localStorage) {
  // Executar a limpeza
  cleanupToolsHistory();
  
  // Adicionar função global para fácil acesso
  window.cleanupToolsHistory = cleanupToolsHistory;
  console.log('🔧 cleanupToolsHistory disponível via: window.cleanupToolsHistory()');
}

export default cleanupToolsHistory; 