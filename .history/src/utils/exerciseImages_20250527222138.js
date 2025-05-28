// src/utils/exerciseImages.js

/**
 * Retorna URLs de imagem para um exercício, incluindo um fallback.
 * Esta função deve ser o ponto central para definir como as imagens dos exercícios são obtidas.
 *
 * @param {string} exerciseId O ID único do exercício.
 * @param {string} gifUrl Uma URL de GIF padrão, se disponível (geralmente vindo da sua API de exercícios).
 * @returns {{primary: string | null, fallback: string}} Um objeto contendo a URL primária (ou null se não houver) e de fallback.
 */
export const getExerciseImage = (exerciseId, gifUrl) => {
  // --- Estratégia de priorização de imagens ---
  // 1. Tentar usar a `gifUrl` fornecida se for uma URL válida.
  // 2. Se a `gifUrl` não for válida, você pode tentar um mapeamento local
  //    de IDs de exercícios para URLs de imagens mais confiáveis (se você tiver).
  //    Ex: const localImageMap = { 'ex123': '/images/exercises/ex123.gif', ... };
  //    const localImage = localImageMap[exerciseId];
  // 3. Como último recurso, usar um serviço de placeholder genérico.

  let primaryImage = null;

  // Prioridade 1: Usar a gifUrl se for válida
  if (gifUrl && typeof gifUrl === 'string' && gifUrl.startsWith('http')) {
    primaryImage = gifUrl;
  }

  // Prioridade 2 (Exemplo, se você tivesse um mapeamento local ou outra fonte)
  // else if (localImageMap[exerciseId]) {
  //   primaryImage = localImageMap[exerciseId];
  // }

  // Fallback genérico para quando nenhuma imagem específica é encontrada ou válida
  // É útil ter um placeholder que funcione sempre, para que a UI não quebre.
  // Use um placeholder de um serviço conhecido (como o Lorem Picsum ou Placehold.it)
  // ou um ativo local que você garanta que existe.
  const fallbackImage = `https://via.placeholder.com/400x300?text=Exercicio+${exerciseId}+Indisponivel`;
  // Ou, se você tiver um ativo local, como:
  // const fallbackImage = '/images/placeholder_exercise.png';

  console.log(`[getExerciseImage] Para ID: ${exerciseId}`);
  console.log(`[getExerciseImage] gifUrl recebida: ${gifUrl}`);
  console.log(`[getExerciseImage] URL Primária definida: ${primaryImage || 'Nenhuma válida'}`);
  console.log(`[getExerciseImage] URL Fallback definida: ${fallbackImage}`);

  return {
    primary: primaryImage, // Pode ser null se gifUrl não for válida
    fallback: fallbackImage,
  };
};