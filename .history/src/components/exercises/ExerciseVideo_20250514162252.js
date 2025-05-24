// src/components/exercises/ExerciseVideo.js
import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

const ExerciseVideo = ({ videoUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Função para lidar com o carregamento do vídeo
  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  // Função para lidar com erros no carregamento do vídeo
  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-gray-50 dark:bg-gray-800 mb-6">
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
            <FaPlay className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              Não foi possível carregar o vídeo
            </p>
          </div>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            title={title || "Demonstração do exercício"}
            src={videoUrl}
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        )}
      </div>
      
      {title && (
        <div className="p-4 bg-white dark:bg-gray-800">
          <p className="font-medium text-lg text-gray-800 dark:text-white">
            {title}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseVideo;
