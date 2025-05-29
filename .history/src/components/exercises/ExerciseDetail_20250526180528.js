// src/components/exercises/ExerciseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaShare, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { useExercise } from '../../context/ExerciseContext';
import ExerciseVideo from './ExerciseVideo';
import ExerciseInstructions from './ExerciseInstructions';

const ExerciseHeader = ({ exercise, isSaved, onSave, onShare }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 dark:text-blue-400 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-1" /> Voltar
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
          {exercise.name}
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={onSave}
            className={`flex items-center px-3 py-1 rounded-md ${
              isSaved
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <FaBookmark className="mr-1" />
            {isSaved ? 'Salvo' : 'Salvar'}
          </button>

          <button
            onClick={onShare}
            className="flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <FaShare className="mr-1" />
            Compartilhar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
          {exercise.bodyPart}
        </span>
        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          {exercise.target}
        </span>
        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          {exercise.equipment}
        </span>
      </div>
    </div>
  );
};

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exercises, loading, error } = useExercise();
  const [exercise, setExercise] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (exercises && exercises.length > 0) {
      const foundExercise = exercises.find(ex => ex.id === id);
      if (foundExercise) {
        setExercise(foundExercise);
      } else {
        console.log('Exercise not found with id:', id);
      }
    }
  }, [id, exercises]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Aqui você pode implementar a lógica para salvar o exercício
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: exercise.name,
        text: `Confira este exercício: ${exercise.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando exercício...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Erro ao carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Exercício não encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">O exercício que você está procurando não foi encontrado.</p>
          <button
            onClick={() => navigate('/exercises')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ver todos os exercícios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ExerciseHeader
          exercise={exercise}
          isSaved={isSaved}
          onSave={handleSave}
          onShare={handleShare}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ExerciseVideo
              gifUrl={exercise.gifUrl}
              title={exercise.name}
            />
          </div>

          <div>
            <ExerciseInstructions
              instructions={exercise.instructions || [
                "Posicione-se corretamente conforme mostrado no vídeo.",
                "Mantenha a forma adequada durante todo o movimento.",
                "Respire de forma controlada durante o exercício.",
                "Execute o movimento completo com controle."
              ]}
              tips={exercise.tips}
              level={exercise.level}
            />
          </div>
        </div>

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Músculos Secundários
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.secondaryMuscles.map((muscle, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;
