import { GiphyFetch } from '@giphy/js-fetch-api';

// Sua chave API do GIPHY (você precisará criar uma em https://developers.giphy.com/)
const GIPHY_API_KEY = 'YOUR_GIPHY_API_KEY';
const gf = new GiphyFetch(GIPHY_API_KEY);

// Cache para armazenar GIFs já buscados
const gifCache = new Map();

export const getExerciseGif = async (exerciseName) => {
  // Verifica se já temos o GIF em cache
  if (gifCache.has(exerciseName)) {
    return gifCache.get(exerciseName);
  }

  try {
    // Busca o GIF no GIPHY
    const searchTerm = `${exerciseName} exercise workout gym`;
    const { data } = await gf.search(searchTerm, {
      limit: 1,
      rating: 'g',
      type: 'gif',
    });

    if (data && data.length > 0) {
      const gifUrl = data[0].images.fixed_height.url;
      // Armazena no cache
      gifCache.set(exerciseName, gifUrl);
      return gifUrl;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar GIF:', error);
    return null;
  }
};

// Função para pré-carregar GIFs de exercícios comuns
export const preloadCommonExerciseGifs = async (exerciseNames) => {
  const promises = exerciseNames.map(name => getExerciseGif(name));
  await Promise.all(promises);
}; 