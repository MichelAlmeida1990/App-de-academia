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

  // Fallback para exercícios específicos quando GIF não carrega
  const getExerciseFallback = (exerciseName) => {
    const fallbacks = {
      'Agachamento Livre': {
        icon: '🏋️‍♀️',
        gradient: 'from-blue-400 to-blue-600',
        description: 'Agachamento'
      },
      'Flexão de Braço': {
        icon: '💪',
        gradient: 'from-red-400 to-red-600',
        description: 'Flexão'
      },
      'Abdominal Tradicional': {
        icon: '🔥',
        gradient: 'from-orange-400 to-orange-600',
        description: 'Abdominal'
      },
      'Prancha': {
        icon: '⚡',
        gradient: 'from-yellow-400 to-yellow-600',
        description: 'Prancha'
      },
      'Burpee': {
        icon: '🏃‍♂️',
        gradient: 'from-purple-400 to-purple-600',
        description: 'Burpee'
      },
      'Mountain Climber': {
        icon: '🏔️',
        gradient: 'from-green-400 to-green-600',
        description: 'Escalador'
      },
      'Jumping Jacks': {
        icon: '🤸‍♀️',
        gradient: 'from-pink-400 to-pink-600',
        description: 'Polichinelo'
      },
      'Afundo': {
        icon: '🦵',
        gradient: 'from-indigo-400 to-indigo-600',
        description: 'Afundo'
      },
      'High Knees': {
        icon: '🏃‍♀️',
        gradient: 'from-teal-400 to-teal-600',
        description: 'Joelhos Alto'
      },
      'Wall Sit': {
        icon: '🧱',
        gradient: 'from-gray-400 to-gray-600',
        description: 'Parede'
      }
    };

    return fallbacks[exerciseName] || {
      icon: getTargetIcon(exercise.target),
      gradient: 'from-blue-400 to-blue-600',
      description: exerciseName
    };
  };

  const fallback = getExerciseFallback(exercise.name);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700 group"
      onClick={() => onClick(exercise)}
    >
      {/* Imagem do exercício */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        {/* Loading Spinner */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Carregando...</p>
            </div>
          </div>
        )}
        
        {/* Fallback quando GIF não carrega */}
        {imageError ? (
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${fallback.gradient} group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-center text-white">
              <div className="text-6xl mb-3 animate-pulse">{fallback.icon}</div>
              <p className="text-lg font-bold mb-1">{fallback.description}</p>
              <p className="text-sm opacity-90 capitalize">{exercise.target}</p>
            </div>
          </div>
        ) : (
          /* GIF do exercício */
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        {/* Overlay com hover effect */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

        {/* Badge de nível */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getLevelColor(exercise.level)}`}>
            {getLevelText(exercise.level)}
          </span>
        </div>

        {/* Badge de calorias */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🔥 {exercise.calories} cal
          </span>
        </div>

        {/* Badge de duração */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
            ⏱️ {exercise.duration.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {exercise.name}
        </h3>
        
        {/* Informações principais */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-lg">{getTargetIcon(exercise.target)}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize font-medium">
              {exercise.target}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg">{getBodyPartIcon(exercise.bodyPart)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {exercise.bodyPart}
            </span>
          </div>
        </div>

        {/* Músculos secundários */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Músculos secundários:</p>
            <div className="flex flex-wrap gap-1">
              {exercise.secondaryMuscles.slice(0, 3).map((muscle, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                >
                  {muscle}
                </span>
              ))}
              {exercise.secondaryMuscles.length > 3 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{exercise.secondaryMuscles.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Informações do exercício */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
            <span className="mr-1">🏋️</span>
            {exercise.equipment}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <span className="mr-1">📊</span>
            {exercise.duration}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
