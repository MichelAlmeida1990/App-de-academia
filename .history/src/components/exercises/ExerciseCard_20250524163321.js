// src/components/exercises/ExerciseCard.js
import React, { useState } from 'react';

const ExerciseCard = ({ exercise, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return level;
    }
  };

  const getTargetIcon = (target) => {
    const icons = {
      'quadríceps': '🦵',
      'peitoral': '💪',
      'abdominais': '🔥',
      'core': '⚡',
      'cardiovascular': '❤️',
      'oblíquos': '🌪️',
      'glúteos': '🍑',
      'deltoides': '💪',
      'lombar': '🔙',
      'tríceps': '💪'
    };
    return icons[target] || '💪';
  };

  const getBodyPartIcon = (bodyPart) => {
    const icons = {
      'pernas': '🦵',
      'peito': '💪',
      'abdômen': '🔥',
      'corpo todo': '🏃',
      'glúteos': '🍑',
      'ombros': '💪',
      'costas': '🔙',
      'braços': '💪'
    };
    return icons[bodyPart] || '💪';
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
      onClick={() => onClick(exercise)}
    >
      {/* Imagem do exercício */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-600 dark:to-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-2">{getTargetIcon(exercise.target)}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {exercise.name}
              </p>
            </div>
          </div>
        ) : (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}

        {/* Badge de nível */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(exercise.level)}`}>
            {getLevelText(exercise.level)}
          </span>
        </div>

        {/* Badge de calorias */}
        <div className="absolute top-2 left-2">
          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full text-xs font-medium">
            🔥 {exercise.calories} cal
          </span>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2">
          {exercise.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-300 capitalize flex items-center">
            <span className="mr-1">{getTargetIcon(exercise.target)}</span>
            {exercise.target}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize flex items-center">
            <span className="mr-1">{getBodyPartIcon(exercise.bodyPart)}</span>
            {exercise.bodyPart}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
            <span className="mr-1">⏱️</span>
            {exercise.duration}
          </span>
          <span className="text-gray-500 dark:text-gray-400 flex items-center">
            <span className="mr-1">🏋️</span>
            {exercise.equipment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
