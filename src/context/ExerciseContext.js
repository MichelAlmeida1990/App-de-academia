// src/context/ExerciseContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchExercises } from '../utils/fetchData';
import exerciseData from '../data/exercisesData'; // Dados locais de backup

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [savedExercises, setSavedExercises] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar exercícios da API ou usar dados locais
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        // Tentar carregar da API primeiro
        const apiExercises = await fetchExercises();
        
        if (apiExercises && apiExercises.length > 0) {
          setExercises(apiExercises);
        } else {
          // Se falhar, usar dados locais
          setExercises(exerciseData);
        }
        
        // Carregar exercícios salvos do localStorage
        const savedFromStorage = localStorage.getItem('savedExercises');
        if (savedFromStorage) {
          setSavedExercises(JSON.parse(savedFromStorage));
        }
        
        // Carregar exercícios visualizados recentemente
        const recentFromStorage = localStorage.getItem('recentlyViewedExercises');
        if (recentFromStorage) {
          setRecentlyViewed(JSON.parse(recentFromStorage));
        }
        
      } catch (err) {
        console.error('Erro ao carregar exercícios:', err);
        setError('Falha ao carregar os exercícios. Usando dados locais.');
        setExercises(exerciseData);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);

  // Salvar exercícios favoritos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('savedExercises', JSON.stringify(savedExercises));
  }, [savedExercises]);

  // Salvar exercícios visualizados recentemente no localStorage
  useEffect(() => {
    localStorage.setItem('recentlyViewedExercises', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Alternar exercício como favorito
  const toggleSavedExercise = (id) => {
    setSavedExercises(prev => {
      if (prev.includes(id)) {
        return prev.filter(exerciseId => exerciseId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Adicionar exercício aos visualizados recentemente
  const addRecentlyViewed = (id) => {
    setRecentlyViewed(prev => {
      // Remover se já existir
      const filtered = prev.filter(exerciseId => exerciseId !== id);
      // Adicionar ao início e limitar a 10 itens
      return [id, ...filtered].slice(0, 10);
    });
  };

  // Buscar exercícios por termo de busca
  const searchExercises = (searchTerm) => {
    if (!searchTerm.trim()) return exercises;
    
    const term = searchTerm.toLowerCase();
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(term) ||
      exercise.bodyPart.toLowerCase().includes(term) ||
      exercise.target.toLowerCase().includes(term) ||
      exercise.equipment.toLowerCase().includes(term)
    );
  };

  // Verificar se um exercício está salvo
  const isSaved = (id) => {
    return savedExercises.includes(id);
  };

  // Obter exercícios salvos
  const getSavedExercises = () => {
    return exercises.filter(exercise => savedExercises.includes(exercise.id));
  };

  // Obter exercícios visualizados recentemente
  const getRecentlyViewed = () => {
    return recentlyViewed
      .map(id => exercises.find(exercise => exercise.id === id))
      .filter(Boolean); // Remover undefined (caso o exercício não exista mais)
  };

  // Obter exercícios por categoria
  const getExercisesByCategory = (category) => {
    return exercises.filter(exercise => exercise.bodyPart === category);
  };

  // Obter exercícios por músculo alvo
  const getExercisesByTarget = (target) => {
    return exercises.filter(exercise => exercise.target === target);
  };

  // Obter exercícios por equipamento
  const getExercisesByEquipment = (equipment) => {
    return exercises.filter(exercise => exercise.equipment === equipment);
  };

  return (
    <ExerciseContext.Provider
      value={{
        exercises,
        savedExercises,
        recentlyViewed,
        isLoading,
        error,
        toggleSavedExercise,
        addRecentlyViewed,
        searchExercises,
        isSaved,
        getSavedExercises,
        getRecentlyViewed,
        getExercisesByCategory,
        getExercisesByTarget,
        getExercisesByEquipment
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useExercise = () => useContext(ExerciseContext);
