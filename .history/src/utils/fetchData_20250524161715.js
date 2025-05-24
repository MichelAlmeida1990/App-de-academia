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
      muscle.toLowerCase().includes(target.toLowerCase())
    )
  );

  setCachedData(cacheKey, filtered);
  return simulateApiDelay(filtered, 400);
};

// Buscar por equipamento
export const fetchExercisesByEquipment = async (equipment) => {
  const cacheKey = `equipment_${equipment.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🏋️ Exercícios com ${equipment} carregados do cache`);
    return cached;
  }

  console.log(`🏋️ Filtrando por equipamento: ${equipment}`);
  const filtered = exercisesData.filter(ex => 
    ex.equipment.toLowerCase().includes(equipment.toLowerCase())
  );

  setCachedData(cacheKey, filtered);
  return simulateApiDelay(filtered, 400);
};

// Buscar por nível de dificuldade
export const fetchExercisesByLevel = async (level) => {
  const cacheKey = `level_${level.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`📊 Exercícios nível ${level} carregados do cache`);
    return cached;
  }

  console.log(`📊 Filtrando por nível: ${level}`);
  const filtered = exercisesData.filter(ex => 
    ex.level.toLowerCase() === level.toLowerCase()
  );

  setCachedData(cacheKey, filtered);
  return simulateApiDelay(filtered, 400);
};

// Buscar exercícios similares
export const fetchSimilarExercises = async (exerciseId, limit = 6) => {
  const cacheKey = `similar_${exerciseId}_${limit}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🔗 Exercícios similares carregados do cache`);
    return cached;
  }

  console.log(`🔗 Buscando exercícios similares ao: ${exerciseId}`);
  const currentExercise = exercisesData.find(ex => ex.id === exerciseId);
  
  if (!currentExercise) {
    return simulateApiDelay([], 300);
  }

  const similar = exercisesData
    .filter(ex => ex.id !== exerciseId)
    .filter(ex => 
      ex.bodyPart === currentExercise.bodyPart || 
      ex.target === currentExercise.target ||
      ex.equipment === currentExercise.equipment
    )
    .slice(0, limit);

  setCachedData(cacheKey, similar);
  return simulateApiDelay(similar, 500);
};

// Buscar vídeos relacionados (simulado com dados locais)
export const fetchExerciseVideos = async (exerciseName) => {
  const cacheKey = `videos_${exerciseName.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🎥 Vídeos carregados do cache`);
    return cached;
  }

  console.log(`🎥 Buscando vídeos para: ${exerciseName}`);
  
  const mockVideos = [
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2A",
        channelName: "Treino em Casa",
        description: `Como fazer ${exerciseName} corretamente - Tutorial completo`,
        lengthText: "8:45",
        publishedTimeText: "2 semanas atrás",
        thumbnails: [
          {
            height: 202,
            url: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
            width: 360
          }
        ],
        title: `${exerciseName} - Técnica Perfeita`,
        videoId: `${exerciseName.replace(/\s+/g, '_').toLowerCase()}_001`,
        views: "125K visualizações"
      }
    },
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2B",
        channelName: "Fitness Pro",
        description: `Variações de ${exerciseName} para todos os níveis`,
        lengthText: "12:30",
        publishedTimeText: "1 mês atrás",
        thumbnails: [
          {
            height: 202,
            url: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
            width: 360
          }
        ],
        title: `${exerciseName} - 5 Variações Incríveis`,
        videoId: `${exerciseName.replace(/\s+/g, '_').toLowerCase()}_002`,
        views: "89K visualizações"
      }
    },
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2C",
        channelName: "Academia Virtual",
        description: `Erros comuns no ${exerciseName} e como evitá-los`,
        lengthText: "6:15",
        publishedTimeText: "3 semanas atrás",
        thumbnails: [
          {
            height: 202,
            url: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
            width: 360
          }
        ],
        title: `${exerciseName} - Evite Estes Erros!`,
        videoId: `${exerciseName.replace(/\s+/g, '_').toLowerCase()}_003`,
        views: "67K visualizações"
      }
    }
  ];

  setCachedData(cacheKey, mockVideos);
  return simulateApiDelay(mockVideos, 700);
};

// Listas de categorias disponíveis
export const fetchBodyPartsList = async () => {
  const cacheKey = 'bodyparts_list';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('📋 Lista de partes do corpo carregada do cache');
    return cached;
  }

  console.log('📋 Carregando lista de partes do corpo');
  const bodyParts = [...new Set(exercisesData.map(ex => ex.bodyPart))].sort();
  
  setCachedData(cacheKey, bodyParts);
  return simulateApiDelay(bodyParts, 200);
};

export const fetchEquipmentList = async () => {
  const cacheKey = 'equipment_list';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('🏋️ Lista de equipamentos carregada do cache');
    return cached;
  }

  console.log('🏋️ Carregando lista de equipamentos');
  const equipment = [...new Set(exercisesData.map(ex => ex.equipment))].sort();
  
  setCachedData(cacheKey, equipment);
  return simulateApiDelay(equipment, 200);
};

export const fetchTargetsList = async () => {
  const cacheKey = 'targets_list';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('🎯 Lista de músculos carregada do cache');
    return cached;
  }

  console.log('🎯 Carregando lista de músculos');
  const targets = [...new Set(exercisesData.map(ex => ex.target))].sort();
  
  setCachedData(cacheKey, targets);
  return simulateApiDelay(targets, 200);
};

export const fetchLevelsList = async () => {
  const cacheKey = 'levels_list';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('📊 Lista de níveis carregada do cache');
    return cached;
  }

  console.log('📊 Carregando lista de níveis');
  const levels = [...new Set(exercisesData.map(ex => ex.level))].sort();
  
  setCachedData(cacheKey, levels);
  return simulateApiDelay(levels, 200);
};

// Busca geral (pesquisa por texto)
export const searchExercises = async (query, limit = 20) => {
  const cacheKey = `search_${query.toLowerCase()}_${limit}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log(`🔍 Resultados da busca "${query}" carregados do cache`);
    return cached;
  }

  console.log(`🔍 Buscando por: "${query}"`);
  const searchTerm = query.toLowerCase();
  
  const filtered = exercisesData.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm) ||
    ex.bodyPart.toLowerCase().includes(searchTerm) ||
    ex.target.toLowerCase().includes(searchTerm) ||
    ex.equipment.toLowerCase().includes(searchTerm) ||
    ex.secondaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(searchTerm)
    ) ||
    ex.instructions.some(instruction => 
      instruction.toLowerCase().includes(searchTerm)
    )
  ).slice(0, limit);

  setCachedData(cacheKey, filtered);
  return simulateApiDelay(filtered, 600);
};

// Estatísticas dos exercícios
export const getExerciseStats = async () => {
  const cacheKey = 'exercise_stats';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('📊 Estatísticas carregadas do cache');
    return cached;
  }

  console.log('📊 Calculando estatísticas dos exercícios');
  
  const stats = {
    totalExercises: exercisesData.length,
    bodyParts: [...new Set(exercisesData.map(ex => ex.bodyPart))].length,
    equipment: [...new Set(exercisesData.map(ex => ex.equipment))].length,
    targets: [...new Set(exercisesData.map(ex => ex.target))].length,
    levels: [...new Set(exercisesData.map(ex => ex.level))].length,
    averageCalories: Math.round(
      exercisesData.reduce((sum, ex) => sum + (ex.calories || 5), 0) / exercisesData.length
    ),
    byLevel: {
      beginner: exercisesData.filter(ex => ex.level === 'beginner').length,
      intermediate: exercisesData.filter(ex => ex.level === 'intermediate').length,
      advanced: exercisesData.filter(ex => ex.level === 'advanced').length
    },
    byBodyPart: exercisesData.reduce((acc, ex) => {
      acc[ex.bodyPart] = (acc[ex.bodyPart] || 0) + 1;
      return acc;
    }, {}),
    byEquipment: exercisesData.reduce((acc, ex) => {
      acc[ex.equipment] = (acc[ex.equipment] || 0) + 1;
      return acc;
    }, {})
  };

  setCachedData(cacheKey, stats);
  return simulateApiDelay(stats, 300);
};

// Exercício aleatório
export const getRandomExercise = async () => {
  console.log('🎲 Selecionando exercício aleatório');
  const randomIndex = Math.floor(Math.random() * exercisesData.length);
  const randomExercise = exercisesData[randomIndex];
  
  return simulateApiDelay(randomExercise, 200);
};

// Exercícios recomendados baseados no histórico (simulado)
export const getRecommendedExercises = async (userPreferences = {}, limit = 10) => {
  const cacheKey = `recommended_${JSON.stringify(userPreferences)}_${limit}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('💡 Exercícios recomendados carregados do cache');
    return cached;
  }

  console.log('💡 Gerando exercícios recomendados');
  
  let recommended = [...exercisesData];
  
  // Filtrar por preferências do usuário
  if (userPreferences.level) {
    recommended = recommended.filter(ex => ex.level === userPreferences.level);
  }
  
  if (userPreferences.bodyPart) {
    recommended = recommended.filter(ex => ex.bodyPart === userPreferences.bodyPart);
  }
  
  if (userPreferences.equipment) {
    recommended = recommended.filter(ex => ex.equipment === userPreferences.equipment);
  }
  
  // Embaralhar e limitar
  recommended = recommended
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);

  setCachedData(cacheKey, recommended);
  return simulateApiDelay(recommended, 500);
};

// Limpar cache (útil para desenvolvimento)
export const clearCache = () => {
  localCache.clear();
  console.log('🧹 Cache limpo');
};

// Informações do cache (útil para debug)
export const getCacheInfo = () => {
  return {
    size: localCache.size,
    keys: Array.from(localCache.keys()),
    totalMemory: JSON.stringify(Array.from(localCache.values())).length
  };
};

// Exportar dados brutos (se necessário)
export const getRawExercisesData = () => {
  return exercisesData;
};

// Validar integridade dos dados
export const validateExercisesData = () => {
  const errors = [];
  
  exercisesData.forEach((exercise, index) => {
    if (!exercise.id) errors.push(`Exercício ${index}: ID ausente`);
    if (!exercise.name) errors.push(`Exercício ${index}: Nome ausente`);
    if (!exercise.gifUrl) errors.push(`Exercício ${index}: GIF URL ausente`);
    if (!exercise.bodyPart) errors.push(`Exercício ${index}: Parte do corpo ausente`);
    if (!exercise.target) errors.push(`Exercício ${index}: Músculo alvo ausente`);
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    totalExercises: exercisesData.length
  };
};

export default {
  fetchExercises,
  fetchExerciseById,
  fetchExercisesByBodyPart,
  fetchExercisesByTarget,
  fetchExercisesByEquipment,
  fetchExercisesByLevel,
  fetchSimilarExercises,
  fetchExerciseVideos,
  fetchBodyPartsList,
  fetchEquipmentList,
  fetchTargetsList,
  fetchLevelsList,
  searchExercises,
  getExerciseStats,
  getRandomExercise,
  getRecommendedExercises,
  clearCache,
  getCacheInfo,
  getRawExercisesData,
  validateExercisesData
};

