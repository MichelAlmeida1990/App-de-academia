// src/data/workoutTemplates.js

export const exercisesByMuscleGroup = {
  'Peito': [
    'Supino Reto',
    'Supino Inclinado',
    'Supino Declinado',
    'Crucifixo',
    'Crossover',
    'Supino com Halteres',
    'Flexão de Braço',
    'Peck Deck',
    'Pullover'
  ],
  'Costas': [
    'Puxada Frontal',
    'Remada Baixa',
    'Remada Curvada',
    'Remada Unilateral',
    'Pulldown',
    'Barra Fixa',
    'Remada Cavalinho',
    'Remada T-Bar',
    'Levantamento Terra'
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
    'Panturrilha Sentado',
    'Agachamento Búlgaro',
    'Hack Squat'
  ],
  'Ombros': [
    'Desenvolvimento Militar',
    'Desenvolvimento com Halteres',
    'Elevação Lateral',
    'Elevação Frontal',
    'Face Pull',
    'Encolhimento de Ombros',
    'Remada Alta',
    'Arnold Press',
    'Crucifixo Inverso'
  ],
  'Bíceps': [
    'Rosca Direta',
    'Rosca Alternada',
    'Rosca Martelo',
    'Rosca Scott',
    'Rosca Concentrada',
    'Rosca 21',
    'Rosca Inversa',
    'Rosca Cabo'
  ],
  'Tríceps': [
    'Tríceps Corda',
    'Tríceps Testa',
    'Tríceps Francês',
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
    'Bicicleta',
    'Abdominal Oblíquo',
    'Mountain Climber'
  ],
  'Cardio': [
    'Esteira',
    'Bicicleta Ergométrica',
    'Elíptico',
    'Corda',
    'Jumping Jack',
    'Burpee',
    'Corrida',
    'HIIT',
    'Step Up',
    'High Knees'
  ]
};

export const workoutTemplates = [
  // ========== HIPERTROFIA ==========
  {
    id: 'hipertrofia-iniciante',
    title: 'Treino de Hipertrofia para Iniciantes',
    type: 'hipertrofia',
    level: 'iniciante',
    description: 'Treino completo focado em ganho muscular para iniciantes',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Supino Reto', sets: 3, reps: 12, rest: 60 },
      { name: 'Puxada Frontal', sets: 3, reps: 12, rest: 60 },
      { name: 'Agachamento', sets: 3, reps: 12, rest: 90 },
      { name: 'Desenvolvimento com Halteres', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Direta', sets: 3, reps: 12, rest: 45 },
      { name: 'Tríceps Corda', sets: 3, reps: 12, rest: 45 }
    ]
  },
  {
    id: 'hipertrofia-push-pull-legs',
    title: 'Push/Pull/Legs - Hipertrofia',
    type: 'hipertrofia',
    level: 'intermediario',
    description: 'Divisão clássica Push/Pull/Legs para ganho de massa muscular',
    duration: 60,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Supino Inclinado', sets: 4, reps: 10, rest: 90 },
      { name: 'Desenvolvimento Militar', sets: 4, reps: 10, rest: 90 },
      { name: 'Crucifixo', sets: 3, reps: 12, rest: 60 },
      { name: 'Elevação Lateral', sets: 3, reps: 15, rest: 60 },
      { name: 'Tríceps Francês', sets: 4, reps: 12, rest: 60 },
      { name: 'Tríceps Pulley', sets: 3, reps: 15, rest: 45 }
    ]
  },
  {
    id: 'hipertrofia-upper-lower',
    title: 'Upper/Lower - Massa Muscular',
    type: 'hipertrofia',
    level: 'intermediario',
    description: 'Treino dividido em membros superiores e inferiores',
    duration: 65,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 8, rest: 90 },
      { name: 'Remada Curvada', sets: 4, reps: 8, rest: 90 },
      { name: 'Desenvolvimento com Halteres', sets: 3, reps: 10, rest: 75 },
      { name: 'Puxada Frontal', sets: 3, reps: 10, rest: 75 },
      { name: 'Rosca Alternada', sets: 3, reps: 12, rest: 60 },
      { name: 'Tríceps Testa', sets: 3, reps: 12, rest: 60 }
    ]
  },
  {
    id: 'hipertrofia-full-body',
    title: 'Full Body - Hipertrofia',
    type: 'hipertrofia',
    level: 'iniciante',
    description: 'Treino completo do corpo inteiro em uma sessão',
    duration: 50,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Agachamento', sets: 3, reps: 12, rest: 90 },
      { name: 'Supino com Halteres', sets: 3, reps: 12, rest: 75 },
      { name: 'Remada Baixa', sets: 3, reps: 12, rest: 75 },
      { name: 'Desenvolvimento com Halteres', sets: 3, reps: 12, rest: 60 },
      { name: 'Stiff', sets: 3, reps: 12, rest: 75 },
      { name: 'Prancha', sets: 3, reps: 30, rest: 45 }
    ]
  },

  // ========== FORÇA ==========
  {
    id: 'forca-intermediario',
    title: 'Treino de Força Intermediário',
    type: 'forca',
    level: 'intermediario',
    description: 'Treino focado em ganho de força para praticantes intermediários',
    duration: 75,
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Agachamento', sets: 5, reps: 5, rest: 180 },
      { name: 'Supino Reto', sets: 5, reps: 5, rest: 180 },
      { name: 'Remada Curvada', sets: 5, reps: 5, rest: 180 }
    ]
  },
  {
    id: 'forca-stronglifts',
    title: 'StrongLifts 5x5',
    type: 'forca',
    level: 'intermediario',
    description: 'Programa clássico 5x5 para desenvolvimento de força',
    duration: 60,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Agachamento', sets: 5, reps: 5, rest: 180 },
      { name: 'Supino Reto', sets: 5, reps: 5, rest: 180 },
      { name: 'Remada Curvada', sets: 5, reps: 5, rest: 180 },
      { name: 'Desenvolvimento Militar', sets: 3, reps: 8, rest: 120 },
      { name: 'Levantamento Terra', sets: 1, reps: 5, rest: 300 }
    ]
  },
  {
    id: 'forca-powerlifting',
    title: 'Powerlifting Básico',
    type: 'forca',
    level: 'avancado',
    description: 'Treino focado nos três movimentos do powerlifting',
    duration: 90,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Agachamento', sets: 6, reps: 3, rest: 240 },
      { name: 'Supino Reto', sets: 6, reps: 3, rest: 240 },
      { name: 'Levantamento Terra', sets: 5, reps: 3, rest: 300 },
      { name: 'Supino Fechado', sets: 3, reps: 8, rest: 120 }
    ]
  },
  {
    id: 'forca-iniciante',
    title: 'Força para Iniciantes',
    type: 'forca',
    level: 'iniciante',
    description: 'Introdução ao treinamento de força com movimentos básicos',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Agachamento', sets: 3, reps: 8, rest: 120 },
      { name: 'Supino com Halteres', sets: 3, reps: 8, rest: 120 },
      { name: 'Remada Unilateral', sets: 3, reps: 8, rest: 90 },
      { name: 'Desenvolvimento com Halteres', sets: 3, reps: 8, rest: 90 },
      { name: 'Prancha', sets: 3, reps: 30, rest: 60 }
    ]
  },

  // ========== RESISTÊNCIA ==========
  {
    id: 'resistencia-circuit',
    title: 'Circuit Training',
    type: 'resistencia',
    level: 'intermediario',
    description: 'Treino em circuito para melhorar resistência muscular',
    duration: 40,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Flexão de Braço', sets: 4, reps: 15, rest: 30 },
      { name: 'Agachamento', sets: 4, reps: 20, rest: 30 },
      { name: 'Prancha', sets: 4, reps: 45, rest: 30 },
      { name: 'Jumping Jack', sets: 4, reps: 30, rest: 30 },
      { name: 'Mountain Climber', sets: 4, reps: 20, rest: 30 },
      { name: 'Burpee', sets: 4, reps: 10, rest: 60 }
    ]
  },
  {
    id: 'resistencia-funcional',
    title: 'Treino Funcional',
    type: 'resistencia',
    level: 'intermediario',
    description: 'Exercícios funcionais para resistência e mobilidade',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Agachamento Búlgaro', sets: 3, reps: 12, rest: 45 },
      { name: 'Flexão de Braço', sets: 3, reps: 15, rest: 45 },
      { name: 'Avanço', sets: 3, reps: 12, rest: 45 },
      { name: 'Prancha', sets: 3, reps: 60, rest: 45 },
      { name: 'Russian Twist', sets: 3, reps: 20, rest: 45 },
      { name: 'Step Up', sets: 3, reps: 15, rest: 45 }
    ]
  },
  {
    id: 'resistencia-crossfit',
    title: 'CrossFit Style WOD',
    type: 'resistencia',
    level: 'avancado',
    description: 'Treino estilo CrossFit para resistência extrema',
    duration: 35,
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Burpee', sets: 5, reps: 10, rest: 60 },
      { name: 'Agachamento', sets: 5, reps: 15, rest: 60 },
      { name: 'Flexão de Braço', sets: 5, reps: 12, rest: 60 },
      { name: 'Jumping Jack', sets: 5, reps: 25, rest: 60 },
      { name: 'Mountain Climber', sets: 5, reps: 20, rest: 60 }
    ]
  },
  {
    id: 'resistencia-iniciante',
    title: 'Resistência para Iniciantes',
    type: 'resistencia',
    level: 'iniciante',
    description: 'Introdução ao treinamento de resistência muscular',
    duration: 30,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Flexão de Braço', sets: 3, reps: 8, rest: 60 },
      { name: 'Agachamento', sets: 3, reps: 15, rest: 60 },
      { name: 'Prancha', sets: 3, reps: 30, rest: 60 },
      { name: 'Elevação de Pernas', sets: 3, reps: 12, rest: 60 },
      { name: 'Jumping Jack', sets: 3, reps: 20, rest: 60 }
    ]
  },

  // ========== CARDIO ==========
  {
    id: 'cardio-hiit',
    title: 'HIIT Intenso',
    type: 'cardio',
    level: 'intermediario',
    description: 'Treino intervalado de alta intensidade para queima de gordura',
    duration: 25,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Burpee', sets: 6, reps: 30, rest: 90 },
      { name: 'High Knees', sets: 6, reps: 30, rest: 90 },
      { name: 'Jumping Jack', sets: 6, reps: 30, rest: 90 },
      { name: 'Mountain Climber', sets: 6, reps: 30, rest: 90 }
    ]
  },
  {
    id: 'cardio-liss',
    title: 'LISS - Baixa Intensidade',
    type: 'cardio',
    level: 'iniciante',
    description: 'Cardio de baixa intensidade e longa duração',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Esteira', sets: 1, reps: 30, rest: 0 },
      { name: 'Bicicleta Ergométrica', sets: 1, reps: 15, rest: 0 },
      { name: 'Elíptico', sets: 1, reps: 10, rest: 0 }
    ]
  },
  {
    id: 'cardio-tabata',
    title: 'Tabata Protocol',
    type: 'cardio',
    level: 'avancado',
    description: 'Protocolo Tabata: 4 minutos de intensidade máxima',
    duration: 20,
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Burpee', sets: 8, reps: 20, rest: 10 },
      { name: 'Agachamento', sets: 8, reps: 20, rest: 10 },
      { name: 'Flexão de Braço', sets: 8, reps: 20, rest: 10 },
      { name: 'Jumping Jack', sets: 8, reps: 20, rest: 10 }
    ]
  },
  {
    id: 'cardio-core',
    title: 'Cardio + Core',
    type: 'cardio',
    level: 'intermediario',
    description: 'Combinação de cardio com fortalecimento do core',
    duration: 35,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    exercises: [
      { name: 'Jumping Jack', sets: 4, reps: 30, rest: 45 },
      { name: 'Prancha', sets: 4, reps: 45, rest: 45 },
      { name: 'Mountain Climber', sets: 4, reps: 20, rest: 45 },
      { name: 'Russian Twist', sets: 4, reps: 25, rest: 45 },
      { name: 'Bicicleta', sets: 4, reps: 20, rest: 45 },
      { name: 'High Knees', sets: 4, reps: 30, rest: 60 }
    ]
  }
];

export default workoutTemplates;
