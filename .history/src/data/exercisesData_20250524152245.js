// src/data/exercisesData.js
// Este arquivo contém uma pequena amostra de dados de exercícios para uso local
// quando a API não estiver disponível

const exercisesData = [
  {
    id: "0001",
    name: "Supino Reto",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXA",
    instructions: [
      "Deite-se em um banco plano com os pés firmemente apoiados no chão",
      "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros",
      "Retire a barra do suporte e posicione-a sobre o meio do peito",
      "Abaixe a barra de forma controlada até tocar levemente o peito",
      "Empurre a barra para cima até que os braços estejam completamente estendidos",
      "Mantenha os ombros retraídos e o core contraído durante todo o movimento"
    ],
    tips: [
      "Mantenha os pés no chão durante todo o exercício",
      "Não deixe a barra quicar no peito",
      "Expire durante a fase de empurrar",
      "Use um spotter para cargas pesadas"
    ],
    level: "intermediate",
    secondaryMuscles: ["triceps", "deltoids"]
  },
  {
    id: "0002",
    name: "Agachamento",
    bodyPart: "legs",
    target: "quadriceps",
    equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXB",
    instructions: [
      "Coloque a barra sobre os trapézios superiores (não sobre o pescoço)",
      "Posicione os pés na largura dos ombros com os dedos levemente apontados para fora",
      "Mantenha o peito erguido e o core contraído",
      "Inicie o movimento empurrando os quadris para trás",
      "Desça até que as coxas fiquem paralelas ao chão ou mais baixo se possível",
      "Retorne à posição inicial empurrando pelos calcanhares e contraindo os glúteos"
    ],
    tips: [
      "Mantenha os joelhos alinhados com os pés",
      "Não deixe os joelhos colapsarem para dentro",
      "Desça de forma controlada",
      "Mantenha o peso nos calcanhares"
    ],
    level: "intermediate",
    secondaryMuscles: ["glutes", "hamstrings", "lower back", "core"]
  },
  {
    id: "0003",
    name: "Levantamento Terra",
    bodyPart: "back",
    target: "erector spinae",
    equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXC",
    instructions: [
      "Posicione-se com os pés na largura dos ombros, com a barra sobre o meio dos pés",
      "Agache-se e segure a barra com as mãos um pouco mais afastadas que a largura dos ombros",
      "Mantenha as costas retas, peito erguido e ombros sobre a barra",
      "Levante a barra mantendo-a próxima ao corpo durante todo o movimento",
      "Estenda os quadris e joelhos simultaneamente",
      "Termine o movimento em pé, com os ombros para trás e quadris completamente estendidos"
    ],
    tips: [
      "Mantenha a barra sempre próxima ao corpo",
      "Não arredonde as costas",
      "Inicie o movimento com os quadris",
      "Use uma pegada mista para cargas pesadas"
    ],
    level: "advanced",
    secondaryMuscles: ["glutes", "hamstrings", "trapezius", "forearms", "core"]
  },
  {
    id: "0004",
    name: "Rosca Direta",
    bodyPart: "arms",
    target: "biceps",
    equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXD",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Segure a barra com as palmas das mãos para cima, na largura dos ombros",
      "Mantenha os cotovelos próximos ao corpo e fixos",
      "Levante a barra contraindo os bíceps até a altura dos ombros",
      "Pause brevemente no topo do movimento",
      "Abaixe a barra lentamente até a posição inicial"
    ],
    tips: [
      "Não balance o corpo para ajudar no movimento",
      "Mantenha os cotovelos fixos",
      "Controle a descida da barra",
      "Não estenda completamente os braços na posição inicial"
    ],
    level: "beginner",
    secondaryMuscles: ["forearms"]
  },
  {
    id: "0005",
    name: "Elevação Lateral",
    bodyPart: "shoulders",
    target: "deltoids",
    equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXE",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Segure um haltere em cada mão ao lado do corpo",
      "Mantenha uma leve flexão nos cotovelos",
      "Levante os halteres para os lados até que os braços fiquem paralelos ao chão",
      "Pause brevemente no topo do movimento",
      "Abaixe lentamente até a posição inicial"
    ],
    tips: [
      "Não use impulso para levantar os pesos",
      "Mantenha os ombros para baixo",
      "Não levante os braços acima da linha dos ombros",
      "Use um peso que permita controle total do movimento"
    ],
    level: "beginner",
    secondaryMuscles: ["trapezius"]
  },
  {
    id: "0006",
    name: "Prancha",
    bodyPart: "core",
    target: "abdominals",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXF",
    instructions: [
      "Apoie-se nos antebraços e nas pontas dos pés",
      "Posicione os cotovelos diretamente abaixo dos ombros",
      "Mantenha o corpo em linha reta da cabeça aos calcanhares",
      "Contraia o abdômen, glúteos e músculos das pernas",
      "Respire normalmente durante o exercício",
      "Mantenha a posição pelo tempo desejado"
    ],
    tips: [
      "Não deixe os quadris caírem ou subirem",
      "Mantenha o pescoço neutro",
      "Contraia ativamente o core",
      "Comece com períodos curtos e aumente gradualmente"
    ],
    level: "beginner",
    secondaryMuscles: ["lower back", "shoulders", "glutes"]
  },
  {
    id: "0007",
    name: "Puxada Alta",
    bodyPart: "back",
    target: "latissimus dorsi",
    equipment: "cable",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXG",
    instructions: [
      "Sente-se na máquina com as coxas firmemente sob os apoios",
      "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros",
      "Incline-se ligeiramente para trás mantendo o peito erguido",
      "Puxe a barra para baixo até a altura da clavícula",
      "Concentre-se em usar os músculos das costas",
      "Solte lentamente até a posição inicial com os braços estendidos"
    ],
    tips: [
      "Não use o peso corporal para puxar",
      "Mantenha os ombros para baixo e para trás",
      "Não puxe a barra atrás da cabeça",
      "Concentre-se na contração das escápulas"
    ],
    level: "intermediate",
    secondaryMuscles: ["biceps", "rhomboids", "middle trapezius"]
  },
  {
    id: "0008",
    name: "Flexão de Braço",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXH",
    instructions: [
      "Comece na posição de prancha com as mãos um pouco mais afastadas que a largura dos ombros",
      "Mantenha o corpo em linha reta da cabeça aos calcanhares",
      "Posicione as mãos diretamente abaixo dos ombros",
      "Dobre os cotovelos e abaixe o corpo até o peito quase tocar o chão",
      "Mantenha o core contraído durante todo o movimento",
      "Empurre de volta à posição inicial estendendo os braços"
    ],
    tips: [
      "Mantenha o corpo rígido como uma prancha",
      "Não deixe os quadris caírem",
      "Desça até um ângulo de 90 graus nos cotovelos",
      "Se for muito difícil, faça com os joelhos apoiados"
    ],
    level: "beginner",
    secondaryMuscles: ["triceps", "deltoids", "core"]
  },
  {
    id: "0009",
    name: "Desenvolvimento com Halteres",
    bodyPart: "shoulders",
    target: "deltoids",
    equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXI",
    instructions: [
      "Sente-se em um banco com encosto ou fique em pé",
      "Segure um haltere em cada mão na altura dos ombros",
      "Mantenha os cotovelos abaixo dos punhos",
      "Empurre os halteres para cima até os braços ficarem estendidos",
      "Pause brevemente no topo",
      "Abaixe controladamente até a posição inicial"
    ],
    tips: [
      "Não arqueie excessivamente as costas",
      "Mantenha o core contraído",
      "Não deixe os cotovelos irem muito para trás",
      "Use toda a amplitude de movimento"
    ],
    level: "intermediate",
    secondaryMuscles: ["triceps", "upper chest"]
  },
  {
    id: "0010",
    name: "Remada Curvada",
    bodyPart: "back",
    target: "latissimus dorsi",
    equipment: "barbell",
    gifUrl: "https://v2.exercisedb.io/image/QmYhOCaHhskj5H3dLYSFXJ",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros",
      "Incline o tronco para frente mantendo as costas retas",
      "Puxe a barra em direção ao abdômen inferior",
      "Concentre-se em apertar as escápulas",
      "Abaixe a barra controladamente até os braços ficarem estendidos"
    ],
    tips: [
      "Mantenha as costas retas durante todo o movimento",
      "Não use impulso para puxar a barra",
      "Mantenha os cotovelos próximos ao corpo",
      "Concentre-se na contração dos músculos das costas"
    ],
    level: "intermediate",
    secondaryMuscles: ["biceps", "rhomboids", "middle trapezius"]
  }
];

export default exercisesData;
