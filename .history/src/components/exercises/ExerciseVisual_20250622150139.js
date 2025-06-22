import React from 'react';
import { FaDumbbell } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { 
  getExerciseIcon, 
  getExerciseMuscleGroup, 
  getMuscleGroupColors,
  getExerciseGradient,
  getExerciseType,
  exerciseBadges
} from '../../services/exerciseVisualsService';
import { getExerciseImage } from '../../services/exerciseMediaService';

const ExerciseVisual = ({ exercise, className = "aspect-video w-full" }) => {
  const { settings } = useSettings();
  const exerciseName = exercise.name || exercise;

  // Renderizar imagens se habilitado
  if (settings.exerciseDisplayMode === 'images' && settings.showExerciseImages) {
    const imageUrl = getExerciseImage(exerciseName);
    if (imageUrl) {
      return (
        <div className={`${className} bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden`}>
          <img
            src={imageUrl}
            alt={`Demonstração do exercício ${exerciseName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Se a imagem falhar, renderiza o fallback
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                  <div class="text-center">
                    <div class="text-4xl text-gray-400 mb-2">🏋️</div>
                    <p class="text-sm text-gray-500">Imagem não disponível</p>
                  </div>
                </div>
              `;
            }}
          />
        </div>
      );
    }
  }

  // Renderizar baseado no modo selecionado
  switch (settings.exerciseDisplayMode) {
    case 'icons':
      return <IconMode exerciseName={exerciseName} className={className} />;
    
    case 'gradients':
      return <GradientMode exerciseName={exerciseName} className={className} />;
    
    case 'minimal':
      return <MinimalMode exerciseName={exerciseName} className={className} />;
    
    case 'badges':
      return <BadgeMode exerciseName={exerciseName} className={className} />;
    
    default:
      return <IconMode exerciseName={exerciseName} className={className} />;
  }
};

// Modo Ícones
const IconMode = ({ exerciseName, className }) => {
  const IconComponent = getExerciseIcon(exerciseName);
  const muscleGroup = getExerciseMuscleGroup(exerciseName);
  const colors = getMuscleGroupColors(muscleGroup);

  return (
    <div 
      className={`${className} rounded-lg flex flex-col items-center justify-center text-white`}
      style={{ backgroundColor: colors.primary }}
    >
      <IconComponent className="text-6xl mb-3 opacity-90" />
      <span className="text-sm font-medium text-center px-2 leading-tight">
        {exerciseName}
      </span>
      <span className="text-xs opacity-75 mt-1">
        {muscleGroup}
      </span>
    </div>
  );
};

// Modo Gradientes
const GradientMode = ({ exerciseName, className }) => {
  const IconComponent = getExerciseIcon(exerciseName);
  const gradient = getExerciseGradient(exerciseName);

  return (
    <div className={`${className} ${gradient} rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden`}>
      {/* Padrão de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
      
      {/* Conteúdo */}
      <div className="relative z-10 text-center">
        <IconComponent className="text-5xl mb-3 drop-shadow-lg" />
        <span className="text-sm font-semibold text-center px-2 leading-tight drop-shadow">
          {exerciseName}
        </span>
      </div>

      {/* Decoração */}
      <div className="absolute top-2 right-2 opacity-30">
        <FaDumbbell className="text-2xl" />
      </div>
    </div>
  );
};

// Modo Minimalista
const MinimalMode = ({ exerciseName, className }) => {
  const muscleGroup = getExerciseMuscleGroup(exerciseName);
  const colors = getMuscleGroupColors(muscleGroup);
  const IconComponent = getExerciseIcon(exerciseName);

  return (
    <div className={`${className} bg-white dark:bg-gray-800 border-2 rounded-lg flex flex-col items-center justify-center relative`}
         style={{ borderColor: colors.primary }}>
      
      {/* Badge do grupo muscular */}
      <div 
        className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: colors.primary }}
      >
        {muscleGroup}
      </div>

      {/* Ícone principal */}
      <IconComponent 
        className="text-4xl mb-2" 
        style={{ color: colors.primary }}
      />
      
      {/* Nome do exercício */}
      <span className="text-sm font-medium text-center px-3 text-gray-800 dark:text-gray-200 leading-tight">
        {exerciseName}
      </span>
    </div>
  );
};

// Modo Badges
const BadgeMode = ({ exerciseName, className }) => {
  const exerciseType = getExerciseType(exerciseName);
  const muscleGroup = getExerciseMuscleGroup(exerciseName);
  const badge = exerciseBadges[exerciseType] || exerciseBadges['Força'];
  const IconComponent = badge.icon;

  return (
    <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex flex-col items-center justify-center relative p-4`}>
      
      {/* Badge do tipo de exercício */}
      <div className={`${badge.color} px-3 py-1 rounded-full text-white text-xs font-bold mb-3 flex items-center`}>
        <IconComponent className="mr-1" />
        {exerciseType}
      </div>

      {/* Nome do exercício */}
      <span className="text-sm font-semibold text-center text-gray-800 dark:text-gray-200 leading-tight mb-2">
        {exerciseName}
      </span>

      {/* Grupo muscular */}
      <span className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded">
        {muscleGroup}
      </span>

      {/* Decoração de fundo */}
      <div className="absolute bottom-2 right-2 opacity-10">
        <FaDumbbell className="text-3xl text-gray-400" />
      </div>
    </div>
  );
};

export default ExerciseVisual; 