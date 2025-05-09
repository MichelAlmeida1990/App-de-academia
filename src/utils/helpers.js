/**
 * Formata uma data para o formato local (DD/MM/YYYY)
 * @param {Date|string} date - Data para formatar
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('pt-BR');
  };
  
  /**
   * Formata um horário para o formato local (HH:MM)
   * @param {Date|string} date - Data para formatar
   * @returns {string} Horário formatado
   */
  export const formatTime = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  /**
   * Calcula a média de um array de números
   * @param {number[]} values - Array de valores
   * @returns {number} Média dos valores
   */
  export const calculateAverage = (values) => {
    if (!values || values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };
  
  /**
   * Calcula o progresso geral de um treino
   * @param {Object} exerciseProgress - Objeto com o progresso de cada exercício
   * @returns {number} Porcentagem de progresso (0-100)
   */
  export const calculateWorkoutProgress = (exerciseProgress) => {
    if (!exerciseProgress || Object.keys(exerciseProgress).length === 0) return 0;
    
    const values = Object.values(exerciseProgress);
    return calculateAverage(values);
  };
  
  /**
   * Gera um ID único
   * @returns {string} ID único
   */
  export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  /**
   * Trunca um texto se for maior que o tamanho especificado
   * @param {string} text - Texto para truncar
   * @param {number} maxLength - Tamanho máximo
   * @returns {string} Texto truncado
   */
  export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Calcula calorias queimadas com base no peso, duração e intensidade
   * @param {number} weightKg - Peso em kg
   * @param {number} durationMinutes - Duração em minutos
   * @param {string} intensity - Intensidade (low, medium, high)
   * @returns {number} Calorias estimadas
   */
  export const calculateCaloriesBurned = (weightKg, durationMinutes, intensity) => {
    // Valores MET (Metabolic Equivalent of Task) aproximados
    const metValues = {
      low: 3,      // Caminhada leve, alongamento
      medium: 5,   // Ciclismo moderado, musculação geral
      high: 8      // Corrida, HIIT, musculação intensa
    };
    
    const met = metValues[intensity] || metValues.medium;
    
    // Fórmula: Calorias = MET × peso em kg × duração em horas
    return Math.round(met * weightKg * (durationMinutes / 60));
  };
  