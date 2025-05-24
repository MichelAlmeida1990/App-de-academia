// src/data/exercisesData.js - Versão com GIFs gratuitos
const exercisesData = [
  {
    id: "0001",
    name: "Agachamento",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://i.pinimg.com/originals/96/2b/9c/962b9c8b6b8c8b8c8b8c8b8c8b8c8b8c.gif",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Dobre os joelhos, mantendo a coluna reta",
      "Desça até as coxas ficarem paralelas ao chão",
      "Retorne à posição inicial empurrando pelos calcanhares"
    ],
    level: "beginner",
    secondaryMuscles: ["glúteos", "panturrilhas"]
  },
  {
    id: "0002",
    name: "Flexão de Braço",
    bodyPart: "peito",
    target: "peitoral",
    equipment: "peso corporal",
    gifUrl: "https://thumbs.gfycat.com/DefiantInformalBluejay-size_restricted.gif",
    instructions: [
      "Comece na posição de prancha",
      "Mãos um pouco mais largas que os ombros",
      "Dobre os cotovelos para baixar o corpo",
      "Empurre para cima até a posição inicial"
    ],
    level: "beginner",
    secondaryMuscles: ["tríceps", "ombros"]
  },
  {
    id: "0003",
    name: "Abdominal",
    bodyPart: "abdômen",
    target: "abdominais",
    equipment: "peso corporal",
    gifUrl: "https://media.tenor.com/images/8b8c8b8c8b8c8b8c8b8c8b8c8b8c8b8c/tenor.gif",
    instructions: [
      "Deite-se de costas com joelhos dobrados",
      "Mãos atrás da cabeça ou cruzadas no peito",
      "Contraia os abdominais para levantar os ombros",
      "Desça lentamente para a posição inicial"
    ],
    level: "beginner",
    secondaryMuscles: ["oblíquos"]
  },
  {
    id: "0004",
    name: "Prancha",
    bodyPart: "abdômen",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
    instructions: [
      "Apoie-se nos antebraços e pontas dos pés",
      "Mantenha o corpo em linha reta",
      "Contraia abdômen, glúteos e pernas",
      "Segure a posição pelo tempo determinado"
    ],
    level: "beginner",
    secondaryMuscles: ["ombros", "glúteos"]
  },
  {
    id: "0005",
    name: "Burpee",
    bodyPart: "corpo todo",
    target: "cardiovascular",
    equipment: "peso corporal",
    gifUrl: "https://media1.tenor.com/images/8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f/tenor.gif",
    instructions: [
      "Comece em pé, depois agache e coloque as mãos no chão",
      "Pule os pés para trás em posição de prancha",
      "Faça uma flexão (opcional)",
      "Pule os pés de volta e salte para cima"
    ],
    level: "intermediate",
    secondaryMuscles: ["peito", "pernas", "ombros"]
  },
  {
    id: "0006",
    name: "Mountain Climber",
    bodyPart: "abdômen",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://thumbs.gfycat.com/SlowGrandAmericancrocodile-size_restricted.gif",
    instructions: [
      "Comece na posição de prancha",
      "Traga um joelho em direção ao peito",
      "Alterne rapidamente as pernas",
      "Mantenha o core contraído"
    ],
    level: "intermediate",
    secondaryMuscles: ["ombros", "pernas"]
  },
  {
    id: "0007",
    name: "Jumping Jacks",
    bodyPart: "corpo todo",
    target: "cardiovascular",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif",
    instructions: [
      "Comece em pé com pés juntos e braços ao lado",
      "Pule abrindo as pernas para os lados",
      "Simultaneamente levante os braços acima da cabeça",
      "Retorne à posição inicial"
    ],
    level: "beginner",
    secondaryMuscles: ["panturrilhas", "ombros"]
  },
  {
    id: "0008",
    name: "Afundo",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://thumbs.gfycat.com/ShamefulGloriousAmericanbittern-size_restricted.gif",
    instructions: [
      "Fique em pé com pés juntos",
      "Dê um passo à frente com uma perna",
      "Dobre ambos os joelhos em 90 graus",
      "Retorne à posição inicial"
    ],
    level: "beginner",
    secondaryMuscles: ["glúteos", "panturrilhas"]
  },
  {
    id: "0009",
    name: "High Knees",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.tenor.com/images/9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a/tenor.gif",
    instructions: [
      "Corra no lugar levantando os joelhos alto",
      "Tente tocar os joelhos no peito",
      "Mantenha um ritmo rápido",
      "Balance os braços naturalmente"
    ],
    level: "beginner",
    secondaryMuscles: ["panturrilhas", "core"]
  },
  {
    id: "0010",
    name: "Wall Sit",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "parede",
    gifUrl: "https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif",
    instructions: [
      "Encoste as costas na parede",
      "Deslize para baixo até as coxas ficarem paralelas",
      "Mantenha os joelhos em 90 graus",
      "Segure a posição pelo tempo determinado"
    ],
    level: "intermediate",
    secondaryMuscles: ["glúteos", "panturrilhas"]
  },
  {
    id: "0011",
    name: "Russian Twist",
    bodyPart: "abdômen",
    target: "oblíquos",
    equipment: "peso corporal",
    gifUrl: "https://thumbs.gfycat.com/InformalDirectCoot-size_restricted.gif",
    instructions: [
      "Sente-se com joelhos dobrados e pés elevados",
      "Incline o tronco ligeiramente para trás",
      "Gire o tronco de um lado para o outro",
      "Mantenha o core contraído"
    ],
    level: "intermediate",
    secondaryMuscles: ["abdominais", "hip flexors"]
  },
  {
    id: "0012",
    name: "Dead Bug",
    bodyPart: "abdômen",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://media1.tenor.com/images/7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c/tenor.gif",
    instructions: [
      "Deite-se de costas com braços estendidos para cima",
      "Joelhos dobrados em 90 graus",
      "Estenda braço e perna opostos simultaneamente",
      "Retorne à posição inicial e alterne"
    ],
    level: "intermediate",
    secondaryMuscles: ["hip flexors", "ombros"]
  }
];

export default exercisesData;
