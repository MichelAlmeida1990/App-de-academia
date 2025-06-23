import { useCallback } from 'react';
import { clearAllAppData, clearDemoData, listAllAppData } from '../utils/clearAllData';

/**
 * Hook personalizado para gerenciar limpeza de dados
 * Útil durante desenvolvimento e testes
 */
export const useClearData = () => {
  // Limpar todos os dados do app
  const clearAll = useCallback(() => {
    const cleared = clearAllAppData();
    console.log(`✅ ${cleared} itens removidos do localStorage`);
    return cleared;
  }, []);

  // Limpar apenas dados demo
  const clearDemo = useCallback(() => {
    const cleared = clearDemoData();
    console.log(`🎯 ${cleared} itens demo removidos`);
    return cleared;
  }, []);

  // Listar dados atuais
  const listData = useCallback(() => {
    return listAllAppData();
  }, []);

  // Limpar e recarregar página
  const clearAndReload = useCallback(() => {
    clearAllAppData();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  // Função de debug - mostra dados no console
  const debugLocalStorage = useCallback(() => {
    console.group('🔍 Debug localStorage');
    console.log('Total de itens:', localStorage.length);
    
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        allData[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        allData[key] = localStorage.getItem(key);
      }
    }
    
    console.table(allData);
    console.groupEnd();
    return allData;
  }, []);

  return {
    clearAll,
    clearDemo,
    listData,
    clearAndReload,
    debugLocalStorage
  };
};

export default useClearData; 