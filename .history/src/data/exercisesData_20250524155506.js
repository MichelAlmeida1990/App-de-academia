// src/data/exercisesData.js
// Dados locais com GIFs de alta qualidade da ExerciseDB

const exercisesData = [
  {
    id: "0001",
    name: "3/4 sit-up",
    bodyPart: "waist",
    target: "abs",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNHZ8",
    instructions: [
      "Deite-se de costas com os joelhos dobrados e os pés apoiados no chão",
      "Coloque as mãos atrás da cabeça ou cruzadas no peito",
      "Contraia os músculos abdominais para levantar os ombros do chão",
      "Levante apenas 3/4 do movimento completo de sit-up",
      "Desça lentamente para a posição inicial",
      "Repita o movimento de forma controlada"
    ],
    tips: [
      "Não puxe o pescoço com as mãos",
      "Mantenha o movimento controlado",
      "Expire durante a subida",
      "Mantenha os pés no chão"
    ],
    level: "beginner",
    secondaryMuscles: ["hip flexors"]
  },
  {
    id: "0002",
    name: "45° side bend",
    bodyPart: "waist",
    target: "abs",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNHZ9",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Coloque uma mão na cintura e a outra atrás da cabeça",
      "Incline o tronco lateralmente em um ângulo de 45 graus",
      "Contraia os oblíquos para retornar à posição inicial",
      "Complete todas as repetições de um lado antes de trocar",
      "Mantenha o movimento controlado e fluido"
    ],
    tips: [
      "Não se incline para frente ou para trás",
      "Mantenha o core contraído",
      "Movimento deve ser apenas lateral",
      "Controle a velocidade do movimento"
    ],
    level: "beginner",
    secondaryMuscles: ["obliques"]
  },
  {
    id: "0003",
    name: "air bike",
    bodyPart: "waist",
    target: "abs",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH10",
    instructions: [
      "Deite-se de costas com as mãos atrás da cabeça",
      "Levante os ombros do chão e traga os joelhos em direção ao peito",
      "Simule o movimento de pedalar uma bicicleta",
      "Toque o cotovelo direito no joelho esquerdo e vice-versa",
      "Mantenha o movimento alternado e controlado",
      "Continue por toda a duração do exercício"
    ],
    tips: [
      "Não puxe o pescoço",
      "Mantenha os ombros elevados",
      "Movimento deve ser fluido",
      "Expire a cada toque cotovelo-joelho"
    ],
    level: "intermediate",
    secondaryMuscles: ["obliques", "hip flexors"]
  },
  {
    id: "0004",
    name: "all fours squad stretch",
    bodyPart: "upper legs",
    target: "quads",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH11",
    instructions: [
      "Comece na posição de quatro apoios",
      "Traga um joelho em direção ao peito",
      "Estenda a perna para trás, mantendo o joelho dobrado",
      "Puxe o calcanhar em direção aos glúteos",
      "Sinta o alongamento na parte frontal da coxa",
      "Mantenha por 20-30 segundos e troque de lado"
    ],
    tips: [
      "Mantenha os quadris alinhados",
      "Não force o alongamento",
      "Respire normalmente",
      "Use uma mão para apoio se necessário"
    ],
    level: "beginner",
    secondaryMuscles: ["hip flexors"]
  },
  {
    id: "0005",
    name: "alternate heel touchers",
    bodyPart: "waist",
    target: "abs",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH12",
    instructions: [
      "Deite-se de costas com os joelhos dobrados e pés no chão",
      "Mantenha os braços estendidos ao lado do corpo",
      "Levante ligeiramente os ombros do chão",
      "Incline para um lado e toque o calcanhar com a mão",
      "Retorne ao centro e repita para o outro lado",
      "Continue alternando de forma controlada"
    ],
    tips: [
      "Mantenha os ombros elevados",
      "Movimento deve ser lateral",
      "Contraia os oblíquos",
      "Não levante muito os ombros"
    ],
    level: "beginner",
    secondaryMuscles: ["obliques"]
  },
  {
    id: "0006",
    name: "archer pull up",
    bodyPart: "back",
    target: "lats",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH13",
    instructions: [
      "Segure a barra com as mãos mais afastadas que a largura dos ombros",
      "Puxe o corpo para cima direcionando o peso para um lado",
      "Um braço faz a maior parte do trabalho enquanto o outro assiste",
      "Desça controladamente",
      "Alterne os lados a cada repetição",
      "Mantenha o core contraído durante todo o movimento"
    ],
    tips: [
      "Movimento muito avançado",
      "Desenvolva força em pull-ups regulares primeiro",
      "Controle total da descida",
      "Foque na qualidade, não quantidade"
    ],
    level: "advanced",
    secondaryMuscles: ["biceps", "rhomboids", "middle traps"]
  },
  {
    id: "0007",
    name: "arm slingers hanging bent knee legs",
    bodyPart: "waist",
    target: "abs",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH14",
    instructions: [
      "Pendure-se em uma barra com os braços estendidos",
      "Dobre os joelhos e traga-os em direção ao peito",
      "Balance as pernas de um lado para o outro",
      "Mantenha os joelhos dobrados durante todo o movimento",
      "Controle o movimento usando o core",
      "Evite usar impulso excessivo"
    ],
    tips: [
      "Exercício muito avançado",
      "Requer força significativa de pegada",
      "Mantenha o core contraído",
      "Movimento controlado, não balançado"
    ],
    level: "advanced",
    secondaryMuscles: ["obliques", "hip flexors", "forearms"]
  },
  {
    id: "0008",
    name: "assisted parallel bars dip",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "leverage machine",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH15",
    instructions: [
      "Posicione-se na máquina de dips assistidos",
      "Segure as barras paralelas com os braços estendidos",
      "Ajuste o peso de assistência conforme necessário",
      "Dobre os cotovelos para descer o corpo",
      "Desça até sentir um alongamento no peito",
      "Empurre para cima até a posição inicial"
    ],
    tips: [
      "Incline ligeiramente para frente para focar no peito",
      "Não desça muito se sentir desconforto no ombro",
      "Mantenha os cotovelos próximos ao corpo",
      "Use a assistência necessária para manter boa forma"
    ],
    level: "intermediate",
    secondaryMuscles: ["triceps", "anterior deltoids"]
  },
  {
    id: "0009",
    name: "assisted prone lying quads stretch",
    bodyPart: "upper legs",
    target: "quads",
    equipment: "assisted",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH16",
    instructions: [
      "Deite-se de bruços em uma superfície confortável",
      "Dobre um joelho e traga o calcanhar em direção aos glúteos",
      "Use a mão para puxar suavemente o pé",
      "Sinta o alongamento na parte frontal da coxa",
      "Mantenha os quadris no chão",
      "Segure por 20-30 segundos e troque de lado"
    ],
    tips: [
      "Não force o alongamento",
      "Mantenha os quadris no chão",
      "Respire profundamente durante o alongamento",
      "Pare se sentir dor"
    ],
    level: "beginner",
    secondaryMuscles: ["hip flexors"]
  },
  {
    id: "0010",
    name: "assisted standing triceps extension",
    bodyPart: "upper arms",
    target: "triceps",
    equipment: "assisted",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH17",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Levante um braço acima da cabeça",
      "Dobre o cotovelo para baixar a mão atrás da cabeça",
      "Use a outra mão para aplicar pressão suave",
      "Sinta o alongamento na parte de trás do braço",
      "Mantenha por 20-30 segundos e troque de lado"
    ],
    tips: [
      "Mantenha o cotovelo apontando para cima",
      "Não force o alongamento",
      "Mantenha a postura ereta",
      "Respire normalmente"
    ],
    level: "beginner",
    secondaryMuscles: ["shoulders"]
  },
  {
    id: "0011",
    name: "astride jumps (male)",
    bodyPart: "cardio",
    target: "cardiovascular system",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH18",
    instructions: [
      "Comece em pé com os pés juntos e braços ao lado do corpo",
      "Pule abrindo as pernas para os lados",
      "Simultaneamente, levante os braços acima da cabeça",
      "Pule novamente para retornar à posição inicial",
      "Mantenha um ritmo constante e energético",
      "Continue pelo tempo determinado"
    ],
    tips: [
      "Aterrisse suavemente nos pés",
      "Mantenha o core contraído",
      "Respire de forma ritmada",
      "Comece devagar e aumente a velocidade"
    ],
    level: "beginner",
    secondaryMuscles: ["calves", "shoulders"]
  },
  {
    id: "0012",
    name: "back pec stretch",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmNqzMzZNHZ8QmNqzMzZNH19",
    instructions: [
      "Fique em pé próximo a uma parede ou porta",
      "Coloque o antebraço contra a superfície",
      "O cotovelo deve estar na altura do ombro",
      "Gire o corpo para longe do braço apoiado",
      "Sinta o alongamento na parte frontal do peito",
      "Mantenha por 20-30 segundos e troque de lado"
    ],
    tips: [
      "Não force o alongamento",
      "Mantenha o antebraço fixo na parede",
      "Gire apenas o tronco",
      "Respire profundamente"
    ],
    level: "beginner",
    secondaryMuscles: ["anterior deltoids"]
  }
];

export default exercisesData;
