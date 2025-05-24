// src/utils/fetchData.js - Versão 100% local otimizada
import exercisesData from '../data/exercisesData';

// Cache local para otimizar performance
const localCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Simulação de delay de API para UX realista
const simulateApiDelay = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Função para verificar cache
const getCachedData = (key) => {
  if (localCache.has(key)) {
    const cached = localCache.get(key);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    localCache.delete(key);
  }
  return null;
};

// Função para salvar no cache
const setCachedData = (key, data) => {
  localCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Buscar todos os exercícios
export const fetchExercises = async (limit = 50) => {
  const cacheKey = `exercises_${limit}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('📁 Exercícios carregados do cache');
    return cached;
  }

  console.log('📁 Carregando exercícios locais...');
  
  const exercises = exercisesData.slice(0, limit).map(exercise => ({
    ...exercise,
    // Garantir que todos os campos necessários existam
    id: exercise.id,
    name: exercise.name,
    bodyPart: exercise.bodyPart,
    target: exercise.target,
    equipment: exercise.equipment,
    gifUrl: exercise.gifUrl,
    instructions: exercise.instructions || [],
    tips: exercise.tips || [],
    level: exercise.level || 'intermediate',
    secondaryMuscles: exercise.secondaryMuscles || [],
    duration: exercise.duration || '3x10 repetições',
    calories: exercise.calories || 5
  }));

  setCachedData(cacheKey, exercises);
  return simulateApiDelay(exercises);
};

// Buscar exercício por ID
export const fetchExerciseById = async (id) => {
  const cacheKey = `exercise_${id}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🔍 Exercício ${id} carregado do cache`);
    return cached;
  }

  console.log(`🔍 Buscando exercício: ${id}`);
  const exercise = exercisesData.find(ex => ex.id === id || ex.id === String(id));
  
  if (exercise) {
    const processedExercise = {
      ...exercise,
      instructions: exercise.instructions || [],
      tips: exercise.tips || [],
      level: exercise.level || 'intermediate',
      secondaryMuscles: exercise.secondaryMuscles || [],
      duration: exercise.duration || '3x10 repetições',
      calories: exercise.calories || 5
    };
    
    setCachedData(cacheKey, processedExercise);
    return simulateApiDelay(processedExercise, 200);
  }
  
  return simulateApiDelay(null, 200);
};

// Buscar por parte do corpo
export const fetchExercisesByBodyPart = async (bodyPart) => {
  const cacheKey = `bodypart_${bodyPart.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🎯 Exercícios de ${bodyPart} carregados do cache`);
    return cached;
  }

  console.log(`🎯 Filtrando por parte do corpo: ${bodyPart}`);
  const filtered = exercisesData.filter(ex => 
    ex.bodyPart.toLowerCase().includes(bodyPart.toLowerCase()) ||
    ex.target.toLowerCase().includes(bodyPart.toLowerCase())
  );

  setCachedData(cacheKey, filtered);
  return simulateApiDelay(filtered, 400);
};

// Buscar por músculo alvo
export const fetchExercisesByTarget = async (target) => {
  const cacheKey = `target_${target.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🎯 Exercícios para ${target} carregados do cache`);
    return cached;
  }

  console.log(`🎯 Filtrando por músculo: ${target}`);
  const filtered = exercisesData.filter(ex => 
    ex.target.toLowerCase().includes(target.toLowerCase()) ||
    ex.secondaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(target.toLowerCase
