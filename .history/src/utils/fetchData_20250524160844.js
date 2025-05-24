// src/utils/fetchData.js - Versão 100% local
import exercisesData from '../data/exercisesData';

// Simulação de delay para parecer uma API real
const simulateApiDelay = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Buscar todos os exercícios
export const fetchExercises = async () => {
  console.log('📁 Carregando exercícios locais...');
  return simulateApiDelay(exercisesData);
};

// Buscar exercício por ID
export const fetchExerciseById = async (id) => {
  console.log(`🔍 Buscando exercício: ${id}`);
  const exercise = exercisesData.find(ex => ex.id === id);
  return simulateApiDelay(exercise || null, 300);
};

// Buscar por parte do corpo
export const fetchExercisesByBodyPart = async (bodyPart) => {
  console.log(`🎯 Filtrando por parte do corpo: ${bodyPart}`);
  const filtered = exercisesData.filter(ex => 
    ex.bodyPart.toLowerCase().includes(bodyPart.toLowerCase())
  );
  return simulateApiDelay(filtered, 400);
};

// Buscar por músculo alvo
export const fetchExercisesByTarget = async (target) => {
  console.log(`🎯 Filtrando por músculo: ${target}`);
  const filtered = exercisesData.filter(ex => 
    ex.target.toLowerCase().includes(target.toLowerCase())
  );
  return simulateApiDelay(filtered, 400);
};

// Buscar por equipamento
export const fetchExercisesByEquipment = async (equipment) => {
  console.log(`🏋️ Filtrando por equipamento: ${equipment}`);
  const filtered = exercisesData.filter(ex => 
    ex.equipment.toLowerCase().includes(equipment.toLowerCase())
  );
  return simulateApiDelay(filtered, 400);
};

// Buscar vídeos relacionados (simulado)
export const fetchExerciseVideos = async (exerciseName) => {
  console.log(`🎥 Buscando vídeos para: ${exerciseName}`);
  
  const mockVideos = [
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2A",
        channelName: "Treino em Casa",
        description: `Como fazer ${exerciseName} corretamente`,
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
        videoId: `${exerciseName.replace(/\s+/g, '_').toLowerCase()}_001`
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
        title: `${exerciseName} - 5 Variações`,
        videoId: `${exerciseName.replace(/\s+/g, '_').toLowerCase()}_002`
      }
    }
  ];

  return simulateApiDelay(mockVideos, 700);
};

// Listas de categorias disponíveis
export const fetchBodyPartsList = async () => {
  const bodyParts = [...new Set(exercisesData.map(ex => ex.bodyPart))];
  return simulateApiDelay(bodyParts, 200);
};

export const fetchEquipmentList = async () => {
  const equipment = [...new Set(exercisesData.map(ex => ex.equipment))];
  return simulateApiDelay(equipment, 200);
};

export const fetchTargetsList = async () => {
  const targets = [...new Set(exercisesData.map(ex => ex.target))];
  return simulateApiDelay(targets, 200);
};
