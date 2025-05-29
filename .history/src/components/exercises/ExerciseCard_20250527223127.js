// src/components/exercises/ExerciseCard.js
import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { getExerciseImage } from '../../utils/exerciseImages';
import { Link } from 'react-router-dom';
import { FaBookmark } from 'react-icons/fa';

// Funções auxiliares (certifique-se de que estão definidas no seu arquivo ou passadas via props)
// Exemplo (você pode ter elas em outro lugar, como um utils ou props):
const getLevelColor = (level) => {
  switch (level?.toLowerCase()) { // Usar optional chaining e toLowerCase para robustez
    case 'beginner':
      return 'bg-green-500 text-white';
    case 'intermediate':
      return 'bg-yellow-500 text-white';
    case 'expert':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getLevelText = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'Iniciante';
    case 'intermediate':
      return 'Intermediário';
    case 'expert':
      return 'Avançado';
    default:
      return 'Nível';
  }
};


const ExerciseCard = ({ exercise, isFavorite, onToggleFavorite, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Obtém as URLs de imagem usando a função utilitária
  const images = getExerciseImage(exercise.id, exercise.gifUrl);
  // Filtra para remover URLs nulas ou vazias, garantindo a ordem de tentativa
  const imageUrls = [images.primary, images.fallback].filter(Boolean);

  // Resetar estados de imagem quando o exercise.id muda
  // Isso é importante se o mesmo componente ExerciseCard for reutilizado com dados diferentes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
    setCurrentImageIndex(0);
  }, [exercise.id, exercise.gifUrl]); // Dependências para re-executar quando o exercício muda

  const handleImageError = () => {
    console.warn(`Erro ao carregar imagem: ${imageUrls[currentImageIndex]} para exercício ID: ${exercise.id}`);
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1); // Tenta a próxima URL disponível
      setImageLoading(true); // Reinicia o estado de loading para a nova tentativa
    } else {
      setImageError(true); // Todas as URLs falharam, exibe o fallback final
      setImageLoading(false); // Parar de carregar
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false); // Imagem carregada com sucesso
    setImageError(false); // Garante que o estado de erro seja falso se uma imagem for carregada com sucesso
  };

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 relative h-full flex flex-col"
      // Removido onClick da div para evitar conflito com o Link
    >
      <button
        className={`absolute top-2 right-2 z-10 p-1 rounded-full ${isFavorite ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' : 'text-gray-400 bg-gray-100 dark:bg-gray-700'}`}
        onClick={(e) => {
          e.preventDefault(); // Previne o clique de propagar para o Link
          e.stopPropagation(); // Previne o clique de propagar para o Link
          onToggleFavorite(exercise.id);
        }}
        aria-label={isFavorite ? "Remover dos favoritos" : "Salvar exercício"}
      >
        <FaBookmark className="text-lg" />
      </button>

      {/* O Link agora encapsula todo o conteúdo clicável do card, incluindo a imagem e o texto */}
      <Link to={`/exercise/${exercise.id}`} className="flex-grow flex flex-col">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden flex-shrink-0">
          {/* Exibe o spinner de carregamento ou o fallback */}
          {(imageLoading && !imageError) ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Carregando exercício...</p>
              </div>
            </div>
          ) : imageError ? (
            <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 transition-transform duration-300`}>
              <div className="text-center text-white p-4">
                <div className="text-6xl mb-4 animate-bounce">📸</div> {/* Ícone para "Imagem Indisponível" */}
                <p className="text-xl font-bold mb-2">Imagem Indisponível</p>
                <p className="text-sm opacity-90 capitalize bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {exercise.target}
                </p>
              </div>
            </div>
          ) : (
            // A imagem real. O estilo `opacity-0` quando carregando e `opacity-100` quando carregada
            // garante uma transição suave. `object-cover` para preencher o container.
            <img
              src={imageUrls[currentImageIndex]}
              alt={exercise.name}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy" // Boa prática para otimização de performance
            />
          )}

          {/* Overlays e informações */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getLevelColor(exercise.level)}`}>
              {getLevelText(exercise.level)}
            </span>
          </div>

          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              🔥 {exercise.calories} cal
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
              <p className="text-sm font-medium truncate">{exercise.name}</p>
              <p className="text-xs opacity-80">⏱️ {exercise.duration}</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 dark:text-white">
            {exercise.name}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              {exercise.bodyPart}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {exercise.target}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {exercise.equipment}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExerciseCard;
