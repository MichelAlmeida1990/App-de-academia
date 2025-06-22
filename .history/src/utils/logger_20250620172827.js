/**
 * Utilitário de logging que só exibe logs em desenvolvimento
 * Melhora a segurança e performance em produção
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (message, ...args) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  },

  error: (message, ...args) => {
    if (isDevelopment) {
      console.error(message, ...args);
    }
  },

  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },

  info: (message, ...args) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },

  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  },

  // Para logs críticos que devem aparecer sempre (ex: erros de autenticação)
  critical: (message, ...args) => {
    console.error(message, ...args);
  },

  // Para logs de depuração específicos
  debugGroup: (groupName, callback) => {
    if (isDevelopment) {
      console.group(groupName);
      callback();
      console.groupEnd();
    }
  },

  // Timer para medir performance (só em desenvolvimento)
  time: (label) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  timeEnd: (label) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

export default logger; 