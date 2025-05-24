// src/utils/fetchData.js
import exercisesData from '../data/exercisesData';

// Configuração da ExerciseDB API
const EXERCISEDB_API_KEY = process.env.REACT_APP_EXERCISEDB_API_KEY || 'demo-key';
const EXERCISEDB_BASE_URL = 'https://exercisedb.p.rapidapi.com';

// Headers para a API
const apiHeaders = {
  'X-RapidAPI-Key': EXERCISEDB_API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
};

// Cache para otimizar requisições
const exerciseCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// Função para verificar se o cache é válido
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Função para buscar exercícios da API com fallback
export const fetchExercises = async (limit = 50) => {
  const cacheKey = `exercises_${limit}`;
  
  // Verificar cache primeiro
  if (exerciseCache.has(cacheKey)) {
    const cached = exerciseCache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      console.log('Usando exercícios do cache');
      return cached.data;
    }
  }

  try {
    console.log('Buscando exercícios da ExerciseDB API...');
    
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises?limit=${limit}`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const apiExercises = await response.json();
    
    if (apiExercises && apiExercises.length > 0) {
      // Processar dados da API para o formato esperado
      const processedExercises = apiExercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl, // URL do GIF de alta qualidade da ExerciseDB
        instructions: exercise.instructions || [],
        secondaryMuscles: exercise.secondaryMuscles || [],
        level: determineLevel(exercise.equipment, exercise.bodyPart)
      }));

      // Salvar no cache
      exerciseCache.set(cacheKey, {
        data: processedExercises,
        timestamp: Date.now()
      });

      console.log(`✅ ${processedExercises.length} exercícios carregados da API`);
      return processedExercises;
    }
  } catch (error) {
    console.warn('Erro ao buscar da API, usando dados locais:', error.message);
  }

  // Fallback para dados locais
  console.log('📁 Usando dados locais como fallback');
  return exercisesData;
};

// Função para buscar exercício específico por ID
export const fetchExerciseById = async (id) => {
  const cacheKey = `exercise_${id}`;
  
  // Verificar cache primeiro
  if (exerciseCache.has(cacheKey)) {
    const cached = exerciseCache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/exercise/${id}`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (response.ok) {
      const exercise = await response.json();
      
      const processedExercise = {
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        instructions: exercise.instructions || [],
        secondaryMuscles: exercise.secondaryMuscles || [],
        level: determineLevel(exercise.equipment, exercise.bodyPart)
      };

      // Salvar no cache
      exerciseCache.set(cacheKey, {
        data: processedExercise,
        timestamp: Date.now()
      });

      return processedExercise;
    }
  } catch (error) {
    console.warn('Erro ao buscar exercício da API:', error.message);
  }

  // Fallback para dados locais
  return exercisesData.find(ex => ex.id === id) || null;
};

// Função para buscar exercícios por parte do corpo
export const fetchExercisesByBodyPart = async (bodyPart) => {
  const cacheKey = `bodypart_${bodyPart}`;
  
  if (exerciseCache.has(cacheKey)) {
    const cached = exerciseCache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/bodyPart/${bodyPart}`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (response.ok) {
      const exercises = await response.json();
      
      const processedExercises = exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        instructions: exercise.instructions || [],
        secondaryMuscles: exercise.secondaryMuscles || [],
        level: determineLevel(exercise.equipment, exercise.bodyPart)
      }));

      exerciseCache.set(cacheKey, {
        data: processedExercises,
        timestamp: Date.now()
      });

      return processedExercises;
    }
  } catch (error) {
    console.warn('Erro ao buscar por parte do corpo:', error.message);
  }

  // Fallback para dados locais
  return exercisesData.filter(ex => 
    ex.bodyPart.toLowerCase() === bodyPart.toLowerCase()
  );
};

// Função para buscar exercícios por músculo alvo
export const fetchExercisesByTarget = async (target) => {
  const cacheKey = `target_${target}`;
  
  if (exerciseCache.has(cacheKey)) {
    const cached = exerciseCache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/target/${target}`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (response.ok) {
      const exercises = await response.json();
      
      const processedExercises = exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        instructions: exercise.instructions || [],
        secondaryMuscles: exercise.secondaryMuscles || [],
        level: determineLevel(exercise.equipment, exercise.bodyPart)
      }));

      exerciseCache.set(cacheKey, {
        data: processedExercises,
        timestamp: Date.now()
      });

      return processedExercises;
    }
  } catch (error) {
    console.warn('Erro ao buscar por músculo alvo:', error.message);
  }

  // Fallback para dados locais
  return exercisesData.filter(ex => 
    ex.target.toLowerCase() === target.toLowerCase()
  );
};

// Função para buscar exercícios por equipamento
export const fetchExercisesByEquipment = async (equipment) => {
  const cacheKey = `equipment_${equipment}`;
  
  if (exerciseCache.has(cacheKey)) {
    const cached = exerciseCache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/equipment/${equipment}`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (response.ok) {
      const exercises = await response.json();
      
      const processedExercises = exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        instructions: exercise.instructions || [],
        secondaryMuscles: exercise.secondaryMuscles || [],
        level: determineLevel(exercise.equipment, exercise.bodyPart)
      }));

      exerciseCache.set(cacheKey, {
        data: processedExercises,
        timestamp: Date.now()
      });

      return processedExercises;
    }
  } catch (error) {
    console.warn('Erro ao buscar por equipamento:', error.message);
  }

  // Fallback para dados locais
  return exercisesData.filter(ex => 
    ex.equipment.toLowerCase() === equipment.toLowerCase()
  );
};

// Função para buscar vídeos do YouTube (mantida para compatibilidade)
export const fetchExerciseVideos = async (exerciseName) => {
  // Simulação de vídeos relacionados
  const mockVideos = [
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2A",
        channelName: "Treino em Casa",
        description: `Aprenda a fazer ${exerciseName} com técnica perfeita`,
        lengthText: "10:15",
        publishedTimeText: "2 meses atrás",
        thumbnails: [
          {
            height: 202,
            url: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
            width: 360
          }
        ],
        title: `Técnica perfeita de ${exerciseName}`,
        videoId: `vid_${exerciseName.replace(/\s+/g, '_').toLowerCase()}`
      }
    }
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVideos), 500);
  });
};

// Função auxiliar para determinar nível de dificuldade
const determineLevel = (equipment, bodyPart) => {
  if (equipment === 'body weight') return 'beginner';
  if (equipment === 'barbell' || equipment === 'cable') return 'intermediate';
  if (bodyPart === 'back' && equipment !== 'body weight') return 'advanced';
  return 'intermediate';
};

// Função para obter lista de partes do corpo disponíveis
export const fetchBodyPartsList = async () => {
  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/bodyPartList`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Erro ao buscar lista de partes do corpo:', error.message);
  }

  // Fallback para lista local
  return ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
};

// Função para obter lista de equipamentos disponíveis
export const fetchEquipmentList = async () => {
  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/equipmentList`, {
      method: 'GET',
      headers: apiHeaders,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Erro ao buscar lista de equipamentos:', error.message);
  }

  // Fallback para lista local
  return ['assisted', 'band', 'barbell', 'body weight', 'bosu ball', 'cable', 'dumbbell', 'elliptical machine', 'ez barbell', 'hammer', 'kettlebell', 'leverage machine', 'medicine ball', 'olympic barbell', 'resistance band', 'roller', 'rope', 'skierg machine', 'sled machine', 'smith machine', 'stability ball', 'stationary bike', 'stepmill machine', 'tire', 'trap bar', 'upper body ergometer', 'weighted', 'wheel roller'];
};
