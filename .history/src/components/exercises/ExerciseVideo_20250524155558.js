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
      {isLoading && (
        
