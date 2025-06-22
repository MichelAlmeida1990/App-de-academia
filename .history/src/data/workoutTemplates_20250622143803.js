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
  }
];

export default workoutTemplates;
  