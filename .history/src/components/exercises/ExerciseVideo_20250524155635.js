// src/components/ExerciseVideo.js
import React, { useState, useEffect, useRef } from 'react';
import './ExerciseVideo.css';

const ExerciseVideo = ({ exercise, autoplay = false, showControls = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const currentRef = imgRef.current;
    
    if (currentRef) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      observerRef.current.observe(currentRef);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // URLs de fallback para diferentes cenários
  const getFallbackUrls = () => {
    const exerciseName = exercise.name.toLowerCase().replace(/\s+/g, '-');
    return [
      exercise.gifUrl, // URL principal da API
      `https://v2.exercisedb.io/image/${exercise.id}`, // Fallback da ExerciseDB
      `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseName}/0.jpg`, // Fallback alternativo
      '/images/exercise-placeholder.gif', // Placeholder local
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4ZXJjw61jaW88L3RleHQ+PC9zdmc+' // SVG placeholder
    ];
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const retryLoad = () => {
    setHasError(false);
    setIsLoading(true);
  };

  if (!exercise) {
    return (
      <div className="exercise-video-container">
        <div className="exercise-video-placeholder">
          <p>Exercício não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-video-container" ref={imgRef}>
      {/* Loading Placeholder */}
            {/* Loading Placeholder */}
      {isLoading && (
        <div className="exercise-video-loading">
          <div className="loading-spinner"></div>
          <p>Carregando exercício...</p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="exercise-video-error">
          <div className="error-icon">⚠️</div>
          <p>Erro ao carregar o GIF do exercício</p>
          <button onClick={retryLoad} className="retry-button">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Main GIF/Image */}
      {isVisible && (
        <img
          src={getFallbackUrls()[0]}
          alt={`Demonstração do exercício ${exercise.name}`}
          className={`exercise-gif ${isLoading ? 'loading' : ''}`}
          onLoad={handleLoad}
          onError={(e) => {
            const fallbacks = getFallbackUrls();
            const currentSrc = e.target.src;
            const currentIndex = fallbacks.indexOf(currentSrc);
            
            if (currentIndex < fallbacks.length - 1) {
              e.target.src = fallbacks[currentIndex + 1];
            } else {
              handleError();
            }
          }}
          loading="lazy"
        />
      )}

      {/* Exercise Info Overlay */}
      {showControls && !isLoading && !hasError && (
        <div className="exercise-video-overlay">
          <div className="exercise-info">
            <h3>{exercise.name}</h3>
            <div className="exercise-details">
              <span className="body-part">{exercise.bodyPart}</span>
              <span className="target">{exercise.target}</span>
              <span className="equipment">{exercise.equipment}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quality Badge */}
      {!hasError && (
        <div className="quality-badge">HD</div>
      )}
    </div>
  );
};

export default ExerciseVideo;

        
