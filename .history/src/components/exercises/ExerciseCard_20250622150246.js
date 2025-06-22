// src/components/exercises/ExerciseCard.js
import React, { useState } from 'react';
import { FaDumbbell, FaHeart, FaInfoCircle } from 'react-icons/fa';
import { getExerciseImage, getExerciseThumbnail } from '../../services/exerciseMediaService';
import { useSettings } from '../../context/SettingsContext';
import ExerciseVisual from './ExerciseVisual';

const ExerciseCard = ({ exercise, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useSettings();
  const imageUrl = settings.showExerciseImages ? getExerciseImage(exercise.name) : null;
  const thumbnailUrl = settings.showExerciseImages ? getExerciseThumbnail(exercise.name) : null;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container da Imagem */}
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {imageUrl ? (
          <img
            src={isHovered ? imageUrl : thumbnailUrl}
            alt={`Demonstração do exercício ${exercise.name}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaDumbbell className="text-4xl text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-purple-500 hover:text-purple-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Implementar função de favoritar
          }}
        >
          <FaHeart className="text-lg" />
        </button>

        {/* Overlay com informações */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm font-medium">
            {exercise.name}
          </p>
        </div>
      </div>

      {/* Informações do Exercício */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {exercise.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
            {exercise.group}
          </span>
        </div>

        <button
          onClick={() => onSelect(exercise)}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FaInfoCircle />
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
