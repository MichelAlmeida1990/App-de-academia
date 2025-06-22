// src/data/workoutTemplates.js

export const exercisesByMuscleGroup = {
  'Peito': [
    'Supino Reto',
    'Supino Inclinado',
    'Crucifixo',
    'Crossover',
    'Supino com Halteres',
    'Flexão de Braço',
    'Peck Deck'
  ],
  'Costas': [
    'Puxada Frontal',
    'Remada Baixa',
    'Remada Curvada',
    'Remada Unilateral',
    'Pulldown',
    'Barra Fixa',
    'Remada Cavalinho'
  ],
  'Pernas': [
    'Agachamento',
    'Leg Press',
    'Cadeira Extensora',
    'Mesa Flexora',
    'Cadeira Adutora',
    'Cadeira Abdutora',
    'Stiff',
    'Elevação Pélvica',
    'Avanço',
    'Panturrilha em Pé',
    'Panturrilha Sentado'
  ],
  'Ombros': [
    'Desenvolvimento com Halteres',
    'Elevação Lateral',
    'Elevação Frontal',
    'Face Pull',
    'Encolhimento de Ombros',
    'Remada Alta',
    'Arnold Press'
  ],
  'Bíceps': [
    'Rosca Direta',
    'Rosca Alternada',
    'Rosca Martelo',
    'Rosca Scott',
    'Rosca Concentrada',
    'Rosca 21',
    'Rosca Inversa'
  ],
  'Tríceps': [
    'Tríceps Corda',
    'Tríceps Testa',
    'Extensão de Tríceps',
    'Mergulho no Banco',
    'Tríceps Coice',
    'Tríceps Pulley',
    'Supino Fechado'
  ],
  'Abdômen': [
    'Abdominal Reto',
    'Prancha',
    'Russian Twist',
    'Elevação de Pernas',
    'Abdominal Infra',
    'Bicicleta'
  ],
  'Cardio': [
    'Esteira',
    'Bicicleta Ergométrica',
    'Elíptico',
    'Corda',
    'Jumping Jack',
    'Burpee',
    'Corrida',
    'HIIT'
  ]
};

export const workoutTemplates = [
  {
    id: 'hipertrofia-iniciante',
    title: 'Treino de Hipertrofia para Iniciantes',
    type: 'hipertrofia',
    description: 'Treino completo focado em ganho muscular para iniciantes',
    exercises: [
      { name: 'Supino Reto', sets: 3, reps: 12, rest: 60 },
      { name: 'Puxada Frontal', sets: 3, reps: 12, rest: 60 },
      { name: 'Agachamento', sets: 3, reps: 12, rest: 90 },
      { name: 'Desenvolvimento com Halteres', sets: 3, reps: 12, rest: 60 }
    ]
  },
  {
    id: 'forca-intermediario',
    title: 'Treino de Força Intermediário',
    type: 'forca',
    description: 'Treino focado em ganho de força para praticantes intermediários',
    exercises: [
      { name: 'Agachamento', sets: 5, reps: 5, rest: 180 },
      { name: 'Supino Reto', sets: 5, reps: 5, rest: 180 },
      { name: 'Remada Curvada', sets: 5, reps: 5, rest: 180 }
    ]
  },
  {
    id: 'treino-a-peito-triceps',
    title: 'Treino A - Peito e Tríceps',
    type: 'hipertrofia',
    description: 'Treino focado em peito e tríceps para ganho de massa muscular',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 10, rest: 90 },
      { name: 'Supino Inclinado', sets: 3, reps: 12, rest: 60 },
      { name: 'Crucifixo', sets: 3, reps: 15, rest: 60 },
      { name: 'Tríceps Corda', sets: 4, reps: 12, rest: 60 },
      { name: 'Tríceps Testa', sets: 3, reps: 15, rest: 60 }
    ]
  },
  {
    id: 'treino-b-costas-biceps',
    title: 'Treino B - Costas e Bíceps',
    type: 'hipertrofia',
    description: 'Treino focado em costas e bíceps para desenvolvimento muscular',
    exercises: [
      { name: 'Puxada Frontal', sets: 4, reps: 10, rest: 90 },
      { name: 'Remada Baixa', sets: 4, reps: 12, rest: 60 },
      { name: 'Remada Curvada', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Direta', sets: 4, reps: 12, rest: 60 },
      { name: 'Rosca Martelo', sets: 3, reps: 15, rest: 60 }
    ]
  },
  {
    id: 'treino-c-pernas',
    title: 'Treino C - Pernas e Glúteos',
    type: 'hipertrofia',
    description: 'Treino completo para pernas e glúteos',
    exercises: [
      { name: 'Agachamento', sets: 4, reps: 12, rest: 120 },
      { name: 'Leg Press', sets: 4, reps: 15, rest: 90 },
      { name: 'Cadeira Extensora', sets: 3, reps: 15, rest: 60 },
      { name: 'Mesa Flexora', sets: 3, reps: 15, rest: 60 },
      { name: 'Panturrilha em Pé', sets: 4, reps: 20, rest: 45 }
    ]
  },
  {
    id: 'treino-d-ombros-abdomen',
    title: 'Treino D - Ombros e Abdômen',
    type: 'hipertrofia',
    description: 'Treino para ombros e core',
    exercises: [
      { name: 'Desenvolvimento com Halteres', sets: 4, reps: 12, rest: 90 },
      { name: 'Elevação Lateral', sets: 4, reps: 15, rest: 60 },
      { name: 'Elevação Frontal', sets: 3, reps: 15, rest: 60 },
      { name: 'Abdominal Reto', sets: 4, reps: 20, rest: 45 },
      { name: 'Prancha', sets: 3, reps: 30, rest: 60 }
    ]
  },
  {
    id: 'cardio-hiit',
    title: 'HIIT - Queima de Gordura',
    type: 'cardio',
    description: 'Treino intervalado de alta intensidade para queima de gordura',
    exercises: [
      { name: 'Burpee', sets: 5, reps: 10, rest: 30 },
      { name: 'Jumping Jack', sets: 5, reps: 20, rest: 30 },
      { name: 'Corda', sets: 5, reps: 30, rest: 30 },
      { name: 'Agachamento', sets: 5, reps: 12, rest: 30 }
    ]
  },
  {
    id: 'cardio-esteira',
    title: 'Cardio - Esteira e Bike',
    type: 'cardio',
    description: 'Treino cardiovascular moderado',
    exercises: [
      { name: 'Esteira', sets: 1, reps: 30, rest: 120 },
      { name: 'Bicicleta Ergométrica', sets: 1, reps: 20, rest: 120 },
      { name: 'Elíptico', sets: 1, reps: 15, rest: 120 }
    ]
  },
  {
    id: 'funcional-iniciante',
    title: 'Funcional para Iniciantes',
    type: 'resistencia',
    description: 'Exercícios funcionais para iniciantes',
    exercises: [
      { name: 'Agachamento', sets: 3, reps: 15, rest: 60 },
      { name: 'Flexão de Braço', sets: 3, reps: 10, rest: 60 },
      { name: 'Prancha', sets: 3, reps: 30, rest: 60 },
      { name: 'Avanço', sets: 3, reps: 12, rest: 60 }
    ]
  },
  {
    id: 'funcional-avancado',
    title: 'Funcional Avançado',
    type: 'resistencia',
    description: 'Treino funcional para praticantes avançados',
    exercises: [
      { name: 'Burpee', sets: 4, reps: 8, rest: 90 },
      { name: 'Agachamento', sets: 4, reps: 15, rest: 60 },
      { name: 'Flexão de Braço', sets: 3, reps: 15, rest: 60 },
      { name: 'Prancha', sets: 3, reps: 45, rest: 60 }
    ]
  },
  {
    id: 'powerlifting',
    title: 'Powerlifting - Força Máxima',
    type: 'forca',
    description: 'Treino focado nos três movimentos do powerlifting',
    exercises: [
      { name: 'Agachamento', sets: 5, reps: 3, rest: 300 },
      { name: 'Supino Reto', sets: 5, reps: 3, rest: 300 },
      { name: 'Remada Curvada', sets: 5, reps: 3, rest: 300 }
    ]
  },
  {
    id: 'crossfit-wod',
    title: 'CrossFit WOD',
    type: 'resistencia',
    description: 'Workout of the Day estilo CrossFit',
    exercises: [
      { name: 'Agachamento', sets: 5, reps: 10, rest: 60 },
      { name: 'Flexão de Braço', sets: 5, reps: 8, rest: 60 },
      { name: 'Burpee', sets: 5, reps: 5, rest: 60 },
      { name: 'Jumping Jack', sets: 5, reps: 20, rest: 60 }
    ]
  },
  {
    id: 'core-abdomen',
    title: 'Foco no Core e Abdômen',
    type: 'hipertrofia',
    description: 'Treino específico para fortalecimento do core',
    exercises: [
      { name: 'Prancha', sets: 4, reps: 45, rest: 60 },
      { name: 'Russian Twist', sets: 4, reps: 20, rest: 45 },
      { name: 'Abdominal Reto', sets: 4, reps: 25, rest: 45 },
      { name: 'Elevação de Pernas', sets: 3, reps: 15, rest: 60 }
    ]
  },
  {
    id: 'upper-body',
    title: 'Membros Superiores Completo',
    type: 'hipertrofia',
    description: 'Treino completo para membros superiores',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 10, rest: 90 },
      { name: 'Puxada Frontal', sets: 4, reps: 10, rest: 90 },
      { name: 'Desenvolvimento com Halteres', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Direta', sets: 3, reps: 12, rest: 60 },
      { name: 'Tríceps Corda', sets: 3, reps: 12, rest: 60 }
    ]
  },
  {
    id: 'lower-body',
    title: 'Membros Inferiores Completo',
    type: 'hipertrofia',
    description: 'Treino completo para membros inferiores',
    exercises: [
      { name: 'Agachamento', sets: 4, reps: 12, rest: 120 },
      { name: 'Leg Press', sets: 3, reps: 15, rest: 90 },
      { name: 'Cadeira Extensora', sets: 3, reps: 15, rest: 60 },
      { name: 'Mesa Flexora', sets: 3, reps: 15, rest: 60 },
      { name: 'Panturrilha em Pé', sets: 4, reps: 20, rest: 45 }
    ]
  },
  {
    id: 'peito-completo',
    title: 'Peito Completo',
    type: 'hipertrofia',
    description: 'Treino específico para desenvolvimento do peitoral',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 10, rest: 90 },
      { name: 'Supino Inclinado', sets: 4, reps: 12, rest: 90 },
      { name: 'Crucifixo', sets: 3, reps: 15, rest: 60 },
      { name: 'Flexão de Braço', sets: 3, reps: 15, rest: 60 }
    ]
  },
  {
    id: 'costas-completo',
    title: 'Costas Completo',
    type: 'hipertrofia',
    description: 'Treino específico para desenvolvimento das costas',
    exercises: [
      { name: 'Puxada Frontal', sets: 4, reps: 10, rest: 90 },
      { name: 'Remada Baixa', sets: 4, reps: 12, rest: 90 },
      { name: 'Remada Curvada', sets: 3, reps: 12, rest: 60 },
      { name: 'Remada Unilateral', sets: 3, reps: 15, rest: 60 }
    ]
  },
  {
    id: 'bracos-completo',
    title: 'Braços Completo',
    type: 'hipertrofia',
    description: 'Treino específico para bíceps e tríceps',
    exercises: [
      { name: 'Rosca Direta', sets: 4, reps: 12, rest: 60 },
      { name: 'Rosca Martelo', sets: 3, reps: 15, rest: 60 },
      { name: 'Tríceps Corda', sets: 4, reps: 12, rest: 60 },
      { name: 'Tríceps Testa', sets: 3, reps: 15, rest: 60 }
    ]
  },
  {
    id: 'mobilidade-flexibilidade',
    title: 'Mobilidade e Flexibilidade',
    type: 'resistencia',
    description: 'Treino focado em mobilidade e alongamento',
    exercises: [
      { name: 'Prancha', sets: 3, reps: 30, rest: 60 },
      { name: 'Agachamento', sets: 3, reps: 15, rest: 60 },
      { name: 'Flexão de Braço', sets: 2, reps: 10, rest: 60 }
    ]
  }
];

export default workoutTemplates;
  