// src/utils/offlineCache.js
const CACHE_PREFIX = 'fitness_app_';

/**
 * Salva dados no cache local
 * @param {string} key - Chave para identificar os dados
 * @param {any} data - Dados a serem armazenados
 */
export const saveToCache = (key, data) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar no cache:', error);
  }
};

/**
 * Recupera dados do cache local
 * @param {string} key - Chave para identificar os dados
 * @returns {any|null} - Dados armazenados ou null se não encontrados
 */
export const getFromCache = (key) => {
  try {
    const data = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao recuperar do cache:', error);
    return null;
  }
};

/**
 * Remove dados do cache local
 * @param {string} [key] - Chave específica a ser removida. Se não fornecida, limpa todo o cache do aplicativo
 */
export const clearCache = (key) => {
  try {
    if (key) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } else {
      // Limpar todo o cache do aplicativo
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

/**
 * Verifica se há dados em cache para uma determinada chave
 * @param {string} key - Chave para verificar
 * @returns {boolean} - True se existirem dados em cache, False caso contrário
 */
export const hasCache = (key) => {
  try {
    return localStorage.getItem(`${CACHE_PREFIX}${key}`) !== null;
  } catch (error) {
    console.error('Erro ao verificar cache:', error);
    return false;
  }
};

/**
 * Atualiza parcialmente os dados em cache
 * @param {string} key - Chave para identificar os dados
 * @param {object} newData - Novos dados para mesclar com os existentes
 */
export const updateCache = (key, newData) => {
  try {
    const existingData = getFromCache(key);
    if (existingData) {
      saveToCache(key, {
        ...existingData,
        ...newData
      });
    } else {
      saveToCache(key, newData);
    }
  } catch (error) {
    console.error('Erro ao atualizar cache:', error);
  }
};
