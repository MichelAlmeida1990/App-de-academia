// src/components/exercises/ExerciseCard.js (versão corrigida)
import React, { useState } => 'react';
import { getExerciseImage } from '../../utils/exerciseImages'; // Certifique-se que este caminho está correto

const ExerciseCard = ({ exercise, isFavorite, onToggleFavorite }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Definir o objeto fallback aqui, pois ele não estava definido
  const fallback = {
    icon: '📸', // Ícone de fallback (pode ser um emoji ou SVG)
    description: 'Imagem indisponível',
    gradient: 'from-red-500 to-orange-500' // Gradiente para o fundo do fallback
  };

  // Certifique-se que getExerciseImage retorna um objeto com primary e fallback
  const images = getExerciseImage(exercise.id, exercise.gifUrl);
  const imageUrls = [images.primary, images.fallback].filter(Boolean);

  const handleImageError = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setImageLoading(true); // Tenta carregar a próxima imagem
    } else {
      setImageError(true); // Todas as URLs falharam
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Função auxiliar para nível de dificuldade (se não estiver em outro lugar)
  const getLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'expert': return 'Avançado';
      default: return 'Desconhecido';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 relative h-full flex flex-col" // Adicionado h-full e flex-col
      onClick={() => onClick(exercise)} // Assumindo que onClick é passado como prop
    >
      <button
        className={`absolute top-2 right-2 z-10 p-1 rounded-full ${isFavorite ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' : 'text-gray-400 bg-gray-100 dark:bg-gray-700'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(exercise.id);
        }}
        aria-label={isFavorite ? "Remover dos favoritos" : "Salvar exercício"}
      >
        <FaBookmark className="text-lg" />
      </button>
      
      <Link to={`/exercise/${exercise.id}`} className="block flex-grow flex flex-col"> {/* flex-grow para Link */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden flex-shrink-0"> {/* flex-shrink-0 para manter altura fixa */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Carregando exercício...</p>
              </div>
            </div>
          )}
          
          {imageError ? (
            <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${fallback.gradient} transition-transform duration-300`}>
              <div className="text-center text-white p-4">
                <div className="text-6xl mb-4 animate-bounce">{fallback.icon}</div>
                <p className="text-xl font-bold mb-2">{fallback.description}</p>
                <p className="text-sm opacity-90 capitalize bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {exercise.target}
                </p>
              </div>
            </div>
          ) : (
            <img
              src={imageUrls[currentImageIndex]}
              alt={exercise.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          )}

          {/* Overlay gradiente no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

          {/* Badges melhorados */}
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

        <div className="p-4 flex-grow flex flex-col justify-between"> {/* flex-grow para o conteúdo do texto */}
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
