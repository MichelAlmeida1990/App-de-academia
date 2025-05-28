// src/utils/exerciseImages.js

/**
 * Retorna URLs de imagem para um exercício, incluindo um fallback.
 * Você pode expandir esta função para buscar imagens de uma API,
 * ou ter um mapeamento local de IDs de exercícios para GIFs.
 *
 * @param {string} exerciseId O ID único do exercício.
 * @param {string} gifUrl Uma URL de GIF padrão, se disponível.
 * @returns {{primary: string, fallback: string}} Um objeto contendo a URL primária e de fallback.
 */
export const getExerciseImage = (exerciseId, gifUrl) => {
  // Exemplo básico:
  // Você pode ter uma lógica mais sofisticada aqui,
  // como um objeto de mapeamento { 'exercise_id': 'url_da_imagem.gif' }
  // ou usar uma API para buscar a imagem.

  // Por enquanto, vamos usar a gifUrl fornecida como primária
  // e um fallback genérico se a gifUrl não for válida.
  const primaryImage = gifUrl || `https://via.placeholder.com/400x300?text=Exercise+${exerciseId}`;
  
  // URL de imagem de fallback ou um placeholder genérico
  const fallbackImage = 'https://via.placeholder.com/400x300?text=Image+Unavailable';

  return {
    primary: primaryImage,
    fallback: fallbackImage,
  };
};