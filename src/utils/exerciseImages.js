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
  // 1. Tentar usar a `gifUrl` fornecida se for uma URL válida (http/https).
  // 2. Se a `gifUrl` não for válida, você pode expandir esta função para:
  //    a) Buscar imagens de uma API de imagens (ex: Cloudinary, Imgur, etc.)
  //    b) Ter um mapeamento local de IDs de exercícios para GIFs mais confiáveis (ex: { 'ex123': '/images/exercises/ex123.gif' })
  // 3. Como último recurso, usar um serviço de placeholder genérico para que a UI não quebre.

  let primaryImage = null;

  // Prioridade 1: Usar a gifUrl fornecida se for uma URL HTTP(S) válida.
  // É importante verificar se a URL é completa e acessível.
  if (gifUrl && typeof gifUrl === 'string' && (gifUrl.startsWith('http://') || gifUrl.startsWith('https://'))) {
    primaryImage = gifUrl;
  }
  // Se você tiver imagens locais e quiser usá-las como primeira opção:
  // Exemplo de mapeamento local (descomente e preencha se aplicável):
  // const localImageMap = {
  //   'exercicio1': '/assets/gifs/exercicio1.gif',
  //   'exercicio2': 'https://outra-fonte.com/exercicio2.gif', // Pode ser misto
  //   // ... adicione mais mapeamentos
  // };
  // else if (localImageMap[exerciseId]) {
  //   primaryImage = localImageMap[exerciseId];
  // }


  // Fallback genérico para quando nenhuma imagem específica é encontrada ou válida.
  // Use um placeholder de um serviço conhecido (como o Lorem Picsum, Placehold.it, via.placeholder.com)
  // ou um ativo local que você garanta que existe no seu projeto.
  const fallbackImage = `https://via.placeholder.com/400x300?text=Exercicio+${exerciseId}+Indisponivel`;
  // Ou, se você tiver um ativo local, como:
  // const fallbackImage = '/images/placeholder_exercise.png';

  // Log para depuração:
  // Estes logs são seus melhores amigos para entender o que está acontecendo com as URLs.
  console.log(`[getExerciseImage] Para ID: ${exerciseId}`);
  console.log(`[getExerciseImage] gifUrl recebida: ${gifUrl}`);
  console.log(`[getExerciseImage] URL Primária definida: ${primaryImage || 'Nenhuma válida encontrada, usando fallback'}`);
  console.log(`[getExerciseImage] URL Fallback definida: ${fallbackImage}`);

  return {
    primary: primaryImage, // Pode ser null se a gifUrl não for válida ou se não houver outra fonte.
    fallback: fallbackImage,
  };
};
