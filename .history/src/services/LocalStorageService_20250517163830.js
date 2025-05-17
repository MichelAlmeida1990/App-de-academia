/**
 * Serviço para gerenciar operações de armazenamento local
 */
class LocalStorageService {
  /**
   * Salva um item no localStorage
   * @param {string} key - Chave para armazenar o item
   * @param {any} value - Valor a ser armazenado
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  /**
   * Recupera um item do localStorage
   * @param {string} key - Chave do item a ser recuperado
   * @returns {any} O valor armazenado ou null se não existir
   */
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return null;
    }
  }

  /**
   * Remove um item do localStorage
   * @param {string} key - Chave do item a ser removido
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }

  /**
   * Limpa todos os itens do localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar o localStorage:', error);
    }
  }
}

export default new LocalStorageService();
