// src/components/ExerciseVideo.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ExerciseVideo.css';

const ExerciseVideo = ({ exercise, showControls = true, autoPlay = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // URLs de fallback para GIFs
  const getFallbackUrls = useCallback(() => {
    if (!exercise) return [];
    
    return [
      exercise.gifUrl,
      `https://fitnessprogramer.com/wp-content/uploads/2021/02/${exercise.name.replace(/\s+/g, '-')}.gif`,
      `https://www.jefit.com/images/exercises/${exercise.id}.gif`,
      'https://via.placeholder.com/400x300/667eea/ffffff?text=Exercício+Não+Disponível'
    ].filter(Boolean);
  }, [exercise]);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Reset states quando exercise mudar
  useEffect(() => {
    if (exercise) {
      setIsLoading(true);
      setHasError(false);
      setRetryCount(0);
      setImageLoaded(false);
      setIsVisible(autoPlay);
    }
  }, [exercise, autoPlay]);

  // Handlers
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setImageLoaded(true);
    console.log(`✅ GIF carregado: ${exercise?.name}`);
  }, [exercise?.name]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setImageLoaded(false);
    console.warn(`❌ Erro ao carregar GIF: ${exercise?.name}`);
  }, [exercise?.name]);

  const retryLoad = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
      setIsVisible(true);
      console.log(`🔄 Tentativa ${retryCount + 1} de recarregar: ${exercise?.name}`);
    }
  }, [retryCount, exercise?.name]);

  // Cleanup
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  if (!exercise) {
    return (
      <div className="exercise-video-container" ref={imgRef}>
        <div className="exercise-video-placeholder">
          <div className="placeholder-icon">🏋️‍♂️</div>
          <p>Nenhum exercício selecionado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-video-container" ref={imgRef}>
      {/* Loading Placeholder */}
      {isLoading && (
        <div className="exercise-video-loading">
          <div className="loading-spinner"></div>
          <p>Carregando {exercise.name}...</p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="exercise-video-error">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Algo deu errado</h3>
          <p>Não foi possível carregar o GIF do exercício</p>
          <div className="error-details">
            <span>Exercício: {exercise.name}</span>
            <span>Tentativas: {retryCount}/3</span>
          </div>
          {retryCount < 3 && (
            <button onClick={retryLoad} className="retry-button">
              <span>🔄</span> Tentar novamente
            </button>
          )}
        </div>
      )}

      {/* Main GIF/Image */}
      {isVisible && !hasError && (
        <div className="exercise-gif-container">
          <img
            src={getFallbackUrls()[Math.min(retryCount, getFallbackUrls().length - 1)]}
            alt={`Demonstração do exercício ${exercise.name}`}
            className={`exercise-gif ${isLoading ? 'loading' : ''} ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleLoad}
            onError={(e) => {
              const fallbacks = getFallbackUrls();
              const currentSrc = e.target.src;
              const currentIndex = fallbacks.indexOf(currentSrc);
              
              if (currentIndex < fallbacks.length - 1) {
                e.target.src = fallbacks[currentIndex + 1];
                console.log(`🔄 Tentando fallback ${currentIndex + 1}: ${exercise.name}`);
              } else {
                handleError();
              }
            }}
            loading="lazy"
          />
          
          {/* Overlay de loading na imagem */}
          {isLoading && (
            <div className="image-loading-overlay">
              <div className="pulse-animation"></div>
            </div>
          )}
        </div>
      )}

      {/* Exercise Info Overlay */}
      {showControls && !isLoading && !hasError && imageLoaded && (
        <div className="exercise-video-overlay">
          <div className="exercise-info">
            <h3>{exercise.name}</h3>
            <div className="exercise-details">
              <span className="body-part">
                <i className="icon">🎯</i>
                {exercise.bodyPart}
              </span>
              <span className="target">
                <i className="icon">💪</i>
                {exercise.target}
              </span>
              <span className="equipment">
                <i className="icon">🏋️</i>
                {exercise.equipment}
              </span>
            </div>
            {exercise.level && (
              <div className="exercise-level">
                <span className={`level-badge ${exercise.level}`}>
                  {exercise.level === 'beginner' && '⭐'}
                  {exercise.level === 'intermediate' && '⭐⭐'}
                  {exercise.level === 'advanced' && '⭐⭐⭐'}
                  {exercise.level}
                </span>
              </div>
            )}
            {exercise.duration && (
              <div className="exercise-duration">
                <i className="icon">⏱️</i>
                {exercise.duration}
              </div>
            )}
            {exercise.calories && (
              <div className="exercise-calories">
                <i className="icon">🔥</i>
                {exercise.calories} cal
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quality Badge */}
      {!hasError && imageLoaded && (
        <div className="quality-badge">
          <span>HD</span>
        </div>
      )}

      {/* Loading Progress Indicator */}
      {isLoading && (
        <div className="loading-progress-indicator">
          <div className="progress-dots">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className="dot dot-3"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseVideo;
