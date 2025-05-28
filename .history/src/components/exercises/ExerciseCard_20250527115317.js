// src/components/exercises/ExerciseCard.js (versão final)
import React, { useState } from 'react';
import { getExerciseImage } from '../../utils/exerciseImages';

const ExerciseCard = ({ exercise, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = getExerciseImage(exercise.id, exercise.gifUrl);
  const imageUrls = [images.primary, images.fallback].filter(Boolean);

  const handleImageError = () => {
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
  };

  // ... resto das funções permanecem iguais ...

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700 group"
      onClick={() => onClick(exercise)}
    >
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Carregando exercício...</p>
            </div>
          </div>
        )}
        
        {imageError ? (
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${fallback.gradient} group-hover:scale-110 transition-transform duration-300`}>
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

      {/* Resto do conteúdo permanece igual... */}
    </div>
  );
};

export default ExerciseCard;
