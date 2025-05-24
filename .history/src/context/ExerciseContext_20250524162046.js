// src/context/ExerciseContext.js
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { fetchExercises } from '../utils/fetchData';
import exerciseData from '../data/exercisesData';

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
      setError(null);
      
      try {
        // Tentar carregar da API primeiro
        const apiExercises = await fetchExercises();
        
        if (apiExercises && apiExercises.length > 0) {
          setExercises(apiExercises);
          console.log('✅ Exercícios carregados da API:', apiExercises.length);
        } else {
          // Se falhar, usar dados locais
          setExercises(exerciseData);
          console.log('📁 Usando dados locais:', exerciseData.length);
        }
        
      } catch (err) {
        console.error('❌ Erro ao carregar exercícios:', err);
        setError('Falha ao carregar os exercícios. Usando dados locais.');
        setExercises(exerciseData);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    try {
      // Carregar exercícios salvos
      const savedFromStorage = localStorage.getItem('savedExercises');
      if (savedFromStorage) {
        const parsed = JSON.parse(savedFromStorage);
        setSavedExercises(Array.isArray(parsed) ? parsed : []);
      }
      
      // Carregar exercícios visualizados recentemente
      const recentFromStorage = localStorage.getItem('recentlyViewedExercises');
      if (recentFromStorage) {
        const parsed = JSON.parse(recentFromStorage);
        setRecentlyViewed(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dados do localStorage:', err);
      // Reset em caso de dados corrompidos
      localStorage.removeItem('savedExercises');
      localStorage.removeItem('recentlyViewedExercises');
    }
  }, []);

  // Salvar exercícios favoritos no localStorage quando mudar
  useEffect(() => {
    if (savedExercises.length >= 0) { // Permite array vazio
      try {
        localStorage.setItem('savedExercises', JSON.stringify(savedExercises));
      } catch (err) {
        console.error('❌ Erro ao salvar favoritos:', err);
      }
    }
  }, [savedExercises]);

  // Salvar exercícios visualizados recentemente no localStorage
  useEffect(() => {
    if (recentlyViewed.length >= 0) { // Permite array vazio
      try {
        localStorage.setItem('recentlyViewedExercises', JSON.stringify(recentlyViewed));
      } catch (err) {
        console.error('❌ Erro ao salvar histórico:', err);
      }
    }
  }, [recentlyViewed]);

  // Alternar exercício como favorito (otimizado com useCallback)
  const toggleSavedExercise = useCallback((id) => {
    setSavedExercises(prev => {
      if (prev.includes(id)) {
        return prev.filter(exerciseId => exerciseId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // Adicionar exercício aos visualizados recentemente (otimizado)
  const addRecentlyViewed = useCallback((id) => {
    setRecentlyViewed(prev => {
      // Remover se já existir
      const filtered = prev.filter(exerciseId => exerciseId !== id);
      // Adicionar ao início e limitar a 10 itens
      return [id, ...filtered].slice(0, 10);
    });
  }, []);

  // Buscar exercícios por termo de busca (otimizado com useMemo)
  const searchExercises = useCallback((searchTerm) => {
    if (!searchTerm?.trim()) return exercises;
    
    const term = searchTerm.toLowerCase().trim();
    return exercises.filter(exercise => 
      exercise.name?.toLowerCase().includes(term) ||
      exercise.bodyPart?.toLowerCase().includes(term) ||
      exercise.target?.toLowerCase().includes(term) ||
      exercise.equipment?.toLowerCase().includes(term) ||
      exercise.instructions?.some(instruction => 
        instruction.toLowerCase().includes(term)
      )
    );
  }, [exercises]);

  // Verificar se um exercício está salvo
  const isSaved = useCallback((id) => {
    return savedExercises.includes(id);
  }, [savedExercises]);

  // Obter exercícios salvos (memoizado)
  const getSavedExercises = useMemo(() => {
    return exercises.filter(exercise => savedExercises.includes(exercise.id));
  }, [exercises, savedExercises]);

  // Obter exercícios visualizados recentemente (memoizado)
  const getRecentlyViewed = useMemo(() => {
    return recentlyViewed
      .map(id => exercises.find(exercise => exercise.id === id))
      .filter(Boolean); // Remover undefined
  }, [exercises, recentlyViewed]);

  // Obter exercícios por categoria (otimizado)
  const getExercisesByCategory = useCallback((category) => {
    if (!category) return exercises;
    return exercises.filter(exercise => 
      exercise.bodyPart?.toLowerCase() === category.toLowerCase()
    );
  }, [exercises]);

  // Obter exercícios por músculo alvo (otimizado)
  const getExercisesByTarget = useCallback((target) => {
    if (!target) return exercises;
    return exercises.filter(exercise => 
      exercise.target?.toLowerCase() === target.toLowerCase()
    );
  }, [exercises]);

  // Obter exercícios por equipamento (otimizado)
  const getExercisesByEquipment = useCallback((equipment) => {
    if (!equipment) return exercises;
    return exercises.filter(exercise => 
      exercise.equipment?.toLowerCase() === equipment.toLowerCase()
    );
  }, [exercises]);

  // Obter exercício por ID
  const getExerciseById = useCallback((id) => {
    return exercises.find(exercise => exercise.id === id);
  }, [exercises]);

  // Obter exercícios aleatórios
  const getRandomExercises = useCallback((count = 5) => {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, [exercises]);

  // Estatísticas dos exercícios
  const exerciseStats = useMemo(() => {
    const bodyParts = [...new Set(exercises.map(ex => ex.bodyPart))];
    const targets = [...new Set(exercises.map(ex => ex.target))];
    const equipment = [...new Set(exercises.map(ex => ex.equipment))];
    
    return {
      total: exercises.length,
      bodyParts: bodyParts.length,
      targets: targets.length,
      equipment: equipment.length,
      saved: savedExercises.length,
      recentlyViewed: recentlyViewed.length
    };
  }, [exercises, savedExercises, recentlyViewed]);

  // Limpar dados
  const clearSavedExercises = useCallback(() => {
    setSavedExercises([]);
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  // Valor do contexto memoizado
  const contextValue = useMemo(() => ({
    // Estado
    exercises,
    savedExercises,
    recentlyViewed,
    isLoading,
    error,
    
    // Ações
    toggleSavedExercise,
    addRecentlyViewed,
    clearSavedExercises,
    clearRecentlyViewed,
    
    // Buscas e filtros
    searchExercises,
    getExerciseById,
    getExercisesByCategory,
    getExercisesByTarget,
    getExercisesByEquipment,
    getRandomExercises,
    
    // Utilitários
    isSaved,
    getSavedExercises,
    getRecentlyViewed,
    exerciseStats
  }), [
    exercises,
    savedExercises,
    recentlyViewed,
    isLoading,
    error,
    toggleSavedExercise,
    addRecentlyViewed,
    clearSavedExercises,
    clearRecentlyViewed,
    searchExercises,
    getExerciseById,
    getExercisesByCategory,
    getExercisesByTarget,
    getExercisesByEquipment,
    getRandomExercises,
    isSaved,
    getSavedExercises,
    getRecentlyViewed,
    exerciseStats
  ]);

  return (
    <ExerciseContext.Provider value={contextValue}>
      {children}
    </ExerciseContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise deve ser usado dentro de ExerciseProvider');
  }
  return context;
};

// Hook para estatísticas rápidas
export const useExerciseStats = () => {
  const { exerciseStats } = useExercise();
  return exerciseStats;
};

// Hook para exercícios salvos
export const useSavedExercises = () => {
  const { getSavedExercises, toggleSavedExercise, isSaved } = useExercise();
  return { savedExercises: getSavedExercises, toggleSavedExercise, isSaved };
};
