import { 
  FaDumbbell, 
  FaRunning, 
  FaHeart, 
  FaFistRaised,
  FaHandPaper,
  FaArrowUp,
  FaArrowDown,
  FaCircle,
  FaSquare,
  FaPlay,
  FaPause,
  FaStop
} from 'react-icons/fa';

// Mapeamento de exercícios para ícones específicos
export const exerciseIcons = {
  // Peito
  'Supino Reto': FaDumbbell,
  'Supino Inclinado': FaArrowUp,
  'Supino Declinado': FaArrowDown,
  'Crucifixo': FaHandPaper,
  'Crossover': FaPlay,
  'Flexão de Braço': FaFistRaised,
  'Peck Deck': FaCircle,

  // Costas
  'Puxada Frontal': FaArrowDown,
  'Remada Baixa': FaArrowUp,
  'Remada Curvada': FaDumbbell,
  'Barra Fixa': FaArrowUp,
  'Remada Unilateral': FaHandPaper,
  'Pulldown': FaArrowDown,

  // Pernas
  'Agachamento': FaArrowDown,
  'Leg Press': FaFistRaised,
  'Cadeira Extensora': FaArrowUp,
  'Mesa Flexora': FaArrowDown,
  'Panturrilha em Pé': FaArrowUp,
  'Panturrilha Sentado': FaCircle,
  'Stiff': FaDumbbell,

  // Ombros
  'Desenvolvimento com Halteres': FaArrowUp,
  'Elevação Lateral': FaHandPaper,
  'Elevação Frontal': FaArrowUp,
  'Face Pull': FaPlay,

  // Bíceps
  'Rosca Direta': FaArrowUp,
  'Rosca Alternada': FaPlay,
  'Rosca Martelo': FaDumbbell,
  'Rosca Scott': FaCircle,

  // Tríceps
  'Tríceps Corda': FaArrowDown,
  'Tríceps Testa': FaDumbbell,
  'Extensão de Tríceps': FaArrowUp,

  // Abdômen
  'Abdominal Reto': FaArrowUp,
  'Prancha': FaStop,
  'Russian Twist': FaPlay,
  'Elevação de Pernas': FaArrowUp,

  // Cardio
  'Esteira': FaRunning,
  'Bicicleta': FaCircle,
  'Elíptico': FaPlay,
  'Corda': FaArrowUp,
  'HIIT': FaHeart,

  // Default
  'default': FaDumbbell
};

// Cores por grupo muscular
export const muscleGroupColors = {
  'Peito': {
    primary: '#ef4444', // red-500
    secondary: '#fef2f2', // red-50
    gradient: 'from-red-500 to-red-600'
  },
  'Costas': {
    primary: '#3b82f6', // blue-500
    secondary: '#eff6ff', // blue-50
    gradient: 'from-blue-500 to-blue-600'
  },
  'Pernas': {
    primary: '#10b981', // emerald-500
    secondary: '#ecfdf5', // emerald-50
    gradient: 'from-emerald-500 to-emerald-600'
  },
  'Ombros': {
    primary: '#f59e0b', // amber-500
    secondary: '#fffbeb', // amber-50
    gradient: 'from-amber-500 to-amber-600'
  },
  'Bíceps': {
    primary: '#8b5cf6', // violet-500
    secondary: '#f5f3ff', // violet-50
    gradient: 'from-violet-500 to-violet-600'
  },
  'Tríceps': {
    primary: '#ec4899', // pink-500
    secondary: '#fdf2f8', // pink-50
    gradient: 'from-pink-500 to-pink-600'
  },
  'Abdômen': {
    primary: '#06b6d4', // cyan-500
    secondary: '#ecfeff', // cyan-50
    gradient: 'from-cyan-500 to-cyan-600'
  },
  'Cardio': {
    primary: '#f97316', // orange-500
    secondary: '#fff7ed', // orange-50
    gradient: 'from-orange-500 to-orange-600'
  },
  'default': {
    primary: '#6366f1', // indigo-500
    secondary: '#eef2ff', // indigo-50
    gradient: 'from-indigo-500 to-indigo-600'
  }
};

// Função para obter ícone do exercício
export const getExerciseIcon = (exerciseName) => {
  return exerciseIcons[exerciseName] || exerciseIcons.default;
};

// Função para obter grupo muscular baseado no nome do exercício
export const getExerciseMuscleGroup = (exerciseName) => {
  const muscleGroups = {
    'Peito': ['Supino', 'Crucifixo', 'Crossover', 'Flexão', 'Peck'],
    'Costas': ['Puxada', 'Remada', 'Barra Fixa', 'Pulldown'],
    'Pernas': ['Agachamento', 'Leg Press', 'Cadeira', 'Mesa', 'Panturrilha', 'Stiff'],
    'Ombros': ['Desenvolvimento', 'Elevação', 'Face Pull'],
    'Bíceps': ['Rosca'],
    'Tríceps': ['Tríceps', 'Extensão'],
    'Abdômen': ['Abdominal', 'Prancha', 'Russian', 'Elevação de Pernas'],
    'Cardio': ['Esteira', 'Bicicleta', 'Elíptico', 'Corda', 'HIIT', 'Corrida']
  };

  for (const [group, keywords] of Object.entries(muscleGroups)) {
    if (keywords.some(keyword => exerciseName.includes(keyword))) {
      return group;
    }
  }
  return 'default';
};

// Função para obter cores do grupo muscular
export const getMuscleGroupColors = (muscleGroup) => {
  return muscleGroupColors[muscleGroup] || muscleGroupColors.default;
};

// Função para gerar gradiente baseado no exercício
export const getExerciseGradient = (exerciseName) => {
  const muscleGroup = getExerciseMuscleGroup(exerciseName);
  const colors = getMuscleGroupColors(muscleGroup);
  return `bg-gradient-to-br ${colors.gradient}`;
};

// Função para gerar padrão visual baseado no nome
export const getExercisePattern = (exerciseName) => {
  const hash = exerciseName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const patterns = [
    'bg-gradient-to-r',
    'bg-gradient-to-br',
    'bg-gradient-to-b',
    'bg-gradient-to-bl',
    'bg-gradient-to-l'
  ];
  
  return patterns[Math.abs(hash) % patterns.length];
};

// Badges para diferentes tipos de exercício
export const exerciseBadges = {
  'Força': { color: 'bg-red-500', icon: FaDumbbell },
  'Cardio': { color: 'bg-orange-500', icon: FaHeart },
  'Flexibilidade': { color: 'bg-green-500', icon: FaHandPaper },
  'Resistência': { color: 'bg-blue-500', icon: FaRunning },
  'Funcional': { color: 'bg-purple-500', icon: FaPlay }
};

// Função para classificar tipo de exercício
export const getExerciseType = (exerciseName) => {
  const cardioKeywords = ['Esteira', 'Bicicleta', 'Elíptico', 'Corda', 'HIIT', 'Corrida'];
  const flexibilityKeywords = ['Alongamento', 'Yoga', 'Prancha'];
  
  if (cardioKeywords.some(keyword => exerciseName.includes(keyword))) {
    return 'Cardio';
  }
  if (flexibilityKeywords.some(keyword => exerciseName.includes(keyword))) {
    return 'Flexibilidade';
  }
  return 'Força';
}; 