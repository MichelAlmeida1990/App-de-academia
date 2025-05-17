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

  /**
   * Recupera todos os usuários armazenados
   * @returns {Array} Array de usuários ou array vazio se não existir
   */
  getUsers() {
    return this.getItem('users') || [];
  }

  /**
   * Salva a lista de usuários
   * @param {Array} users - Lista de usuários para salvar
   */
  saveUsers(users) {
    this.setItem('users', users);
  }

  /**
   * Adiciona um novo usuário
   * @param {Object} user - Dados do usuário a ser adicionado
   */
  setUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  /**
   * Armazena o usuário atual (logado)
   * @param {Object} user - Dados do usuário logado
   */
  setCurrentUser(user) {
    this.setItem('currentUser', user);
  }

  /**
   * Recupera o usuário atual (logado)
   * @returns {Object|null} Dados do usuário logado ou null
   */
  getUser() {
    return this.getItem('currentUser');
  }

  /**
   * Remove o usuário atual (logout)
   */
  logoutUser() {
    this.removeItem('currentUser');
  }

  /**
   * Busca um usuário pelo email
   * @param {string} email - Email do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }
}

export default new LocalStorageService();
