// src/components/exercises/ExerciseCard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaDumbbell } from 'react-icons/fa';
import Card from '../common/Card';

// Funções auxiliares para níveis
const getLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-50 text-green-700';
    case 'intermediate':
      return 'bg-yellow-50 text-yellow-700';
    case 'expert':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
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

// Função para obter imagens de exercício (versão simplificada)
const getExerciseImages = (exerciseId, gifUrl) => {
  // URLs de fallback padrão
  const fallbackImages = [
    `https://via.placeholder.com/400x300/6366f1/ffffff?text=Exercício+${exerciseId}`,
    'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Exercício'
  ];

  // Se há gifUrl fornecida, usa ela como primária
  if (gifUrl) {
    return [gifUrl, ...fallbackImages];
  }

  // Caso contrário, usa apenas as imagens de fallback
  return fallbackImages;
};

const ExerciseCard = ({ exercise, isFavorite = false, onToggleFavorite, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Obtém as URLs de imagem
  const imageUrls = getExerciseImages(exercise.id, exercise.gifUrl);

  // Resetar estados de imagem quando o exercise.id muda
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
    setCurrentImageIndex(0);
  }, [exercise.id, exercise.gifUrl]);

  const handleImageError = () => {
    console.warn(`Erro ao carregar imagem: ${imageUrls[currentImageIndex]} para exercício ID: ${exercise.id}`);
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setImageLoading(true);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(exercise.id);
    }
  };

  return (
    <div className="group relative h-full">
      <Card 
        className="overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col"
        elevation="high"
      >
        {/* Botão de Favorito */}
        <button
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'text-yellow-600 bg-yellow-50' 
              : 'text-gray-600 bg-white/90 hover:bg-purple-50 hover:text-purple-700'
          }`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remover dos favoritos" : "Salvar exercício"}
        >
          <FaBookmark className="text-lg" />
        </button>

        {/* Link para detalhes do exercício */}
        <Link to={`/exercise/${exercise.id}`} className="flex-grow flex flex-col">
          {/* Área da Imagem */}
          <div className="relative h-48 bg-gray-50 rounded-t-lg overflow-hidden flex-shrink-0">
            {/* Loading State */}
            {(imageLoading && !imageError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-3"></div>
                  <p className="text-sm text-gray-700 font-medium">Carregando exercício...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="text-center text-gray-800 p-4">
                  <FaDumbbell className="text-6xl mb-4 mx-auto opacity-80" />
                  <p className="text-xl font-bold mb-2">Imagem Indisponível</p>
                  <p className="text-sm opacity-90 capitalize bg-white/90 px-3 py-1 rounded-full">
                    {exercise.target || exercise.bodyPart || 'Exercício'}
                  </p>
                </div>
              </div>
            )}

            {/* Imagem Real */}
            {!imageError && (
              <img
                src={imageUrls[currentImageIndex]}
                alt={exercise.name}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            )}

            {/* Overlay no Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

            {/* Badge de Nível */}
            {exercise.level && (
              <div className="absolute top-3 right-12">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getLevelColor(exercise.level)}`}>
                  {getLevelText(exercise.level)}
                </span>
              </div>
            )}

            {/* Badge de Calorias */}
            {exercise.calories && (
              <div className="absolute top-3 left-3">
                <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                  🔥 {exercise.calories} cal
                </span>
              </div>
            )}

            {/* Informações na parte inferior */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 text-gray-800 px-3 py-2 rounded-lg">
                <p className="text-sm font-medium truncate">{exercise.name}</p>
                {exercise.duration && (
                  <p className="text-xs opacity-80">⏱️ {exercise.duration}</p>
                )}
              </div>
            </div>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-4 flex-grow flex flex-col justify-between bg-white/90">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {exercise.name}
            </h3>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {exercise.bodyPart && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                  {exercise.bodyPart}
                </span>
              )}
              {exercise.target && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                  {exercise.target}
                </span>
              )}
              {exercise.equipment && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                  {exercise.equipment}
                </span>
              )}
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default ExerciseCard;
