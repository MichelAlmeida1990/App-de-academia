// src/context/ExerciseContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import exercisesData from '../data/exercisesData';

// Cria o contexto
const ExerciseContext = createContext();

// Provider component
export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Carregar exercícios ao iniciar
  useEffect(() => {
    const loadExercises = async () => {
      try {
        // Em uma aplicação real, isso poderia ser uma chamada de API
        // Por enquanto, usamos os dados estáticos
        setExercises(exercisesData);
        
        // Carregar favoritos do localStorage
        const savedFavorites = localStorage.getItem('favoriteExercises');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        
        // Carregar exercícios visualizados recentemente
        const savedRecent = localStorage.getItem('recentlyViewedExercises');
        if (savedRecent) {
          setRecentlyViewed(JSON.parse(savedRecent));
        }
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadExercises();
  }, []);
  
  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('favoriteExercises', JSON.stringify(favorites));
  }, [favorites]);
  
  // Salvar exercícios visualizados recentemente
  useEffect(() => {
    localStorage.setItem('recentlyViewedExercises', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  
  // Obter um exercício pelo ID
  const getExerciseById = (id) => {
    return exercises.find(exercise => exercise.id === id) || null;
  };
  
  // Obter exercícios por categoria
  const getExercisesByCategory = (category) => {
    return exercises.filter(exercise => exercise.category === category);
  };
  
  // Obter exercícios por músculo
  const getExercisesByMuscle = (muscle) => {
    return exercises.filter(exercise => 
      exercise.primaryMuscles.includes(muscle) || 
      exercise.secondaryMuscles.includes(muscle)
    );
  };
  
  // Adicionar aos favoritos
  const toggleFavorite = (exerciseId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(exerciseId)) {
        return prevFavorites.filter(id => id !== exerciseId);
      } else {
        return [...prevFavorites, exerciseId];
      }
    });
  };
  
  // Verificar se um exercício é favorito
  const isFavorite = (exerciseId) => {
    return favorites.includes(exerciseId);
  };
  
  // Adicionar à lista de visualizados recentemente
  const addToRecentlyViewed = (exerciseId) => {
    setRecentlyViewed(prevRecent => {
      // Remover se já existir na lista
      const filtered = prevRecent.filter(id => id !== exerciseId);
      // Adicionar ao início e limitar a 10 itens
      return [exerciseId, ...filtered].slice(0, 10);
    });
  };
  
  // Obter exercícios visualizados recentemente
  const getRecentlyViewedExercises = () => {
    return recentlyViewed
      .map(id => getExerciseById(id))
      .filter(exercise => exercise !== null);
  };
  
  // Obter exercícios favoritos
  const getFavoriteExercises = () => {
    return favorites
      .map(id => getExerciseById(id))
      .filter(exercise => exercise !== null);
  };
  
  // Obter exercícios similares
  const getSimilarExercises = (exerciseId, limit = 4) => {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return [];
    
    // Encontrar exercícios que trabalham músculos similares ou são da mesma categoria
    return exercises
      .filter(e => 
        e.id !== exerciseId && (
          e.category === exercise.category ||
          e.primaryMuscles.some(muscle => 
            exercise.primaryMuscles.includes(muscle) || 
            exercise.secondaryMuscles.includes(muscle)
          )
        )
      )
      .slice(0, limit);
  };
  
  // Pesquisar exercícios
  const searchExercises = (query) => {
    if (!query || query.trim() === '') return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.category.toLowerCase().includes(searchTerm) ||
      exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm)) ||
      exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm))
    );
  };
  
  // Valor do contexto
  const value = {
    exercises,
    loading,
    getExerciseById,
    getExercisesByCategory,
    getExercisesByMuscle,
    toggleFavorite,
    isFavorite,
    addToRecentlyViewed,
    getRecentlyViewedExercises,
    getFavoriteExercises,
    getSimilarExercises,
    searchExercises
  };
  
  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise deve ser usado dentro de um ExerciseProvider');
  }
  return context;
};

export default ExerciseContext;
