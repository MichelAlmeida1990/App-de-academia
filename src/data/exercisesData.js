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
      gifUrl: "https://example.com/images/bench-press.gif",
      instructions: [
        "Deite-se em um banco plano com os pés no chão.",
        "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros.",
        "Abaixe a barra até o meio do peito.",
        "Empurre a barra para cima até que os braços estejam estendidos."
      ],
      secondaryMuscles: ["triceps", "deltoids"]
    },
    {
      id: "0002",
      name: "Agachamento",
      bodyPart: "legs",
      target: "quadriceps",
      equipment: "barbell",
      gifUrl: "https://example.com/images/squat.gif",
      instructions: [
        "Coloque a barra sobre os trapézios (não sobre o pescoço).",
        "Posicione os pés na largura dos ombros, com os dedos levemente apontados para fora.",
        "Desça até que as coxas fiquem paralelas ao chão.",
        "Retorne à posição inicial empurrando pelos calcanhares."
      ],
      secondaryMuscles: ["glutes", "hamstrings", "lower back"]
    },
    {
      id: "0003",
      name: "Levantamento Terra",
      bodyPart: "back",
      target: "erector spinae",
      equipment: "barbell",
      gifUrl: "https://example.com/images/deadlift.gif",
      instructions: [
        "Posicione-se com os pés na largura dos ombros, com a barra sobre o meio dos pés.",
        "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros.",
        "Abaixe os quadris, mantenha o peito para cima e as costas retas.",
        "Levante a barra mantendo-a próxima ao corpo, até ficar completamente ereto."
      ],
      secondaryMuscles: ["glutes", "hamstrings", "trapezius", "forearms"]
    },
    {
      id: "0004",
      name: "Rosca Direta",
      bodyPart: "arms",
      target: "biceps",
      equipment: "barbell",
      gifUrl: "https://example.com/images/bicep-curl.gif",
      instructions: [
        "Fique em pé com os pés na largura dos ombros.",
        "Segure a barra com as palmas das mãos para cima, na largura dos ombros.",
        "Mantenha os cotovelos próximos ao corpo e levante a barra até os ombros.",
        "Abaixe a barra lentamente até a posição inicial."
      ],
      secondaryMuscles: ["forearms"]
    },
    {
      id: "0005",
      name: "Elevação Lateral",
      bodyPart: "shoulders",
      target: "deltoids",
      equipment: "dumbbell",
      gifUrl: "https://example.com/images/lateral-raise.gif",
      instructions: [
        "Fique em pé com os pés na largura dos ombros.",
        "Segure um haltere em cada mão ao lado do corpo.",
        "Levante os halteres para os lados até que os braços fiquem paralelos ao chão.",
        "Abaixe lentamente até a posição inicial."
      ],
      secondaryMuscles: ["trapezius"]
    },
    {
      id: "0006",
      name: "Prancha",
      bodyPart: "core",
      target: "abdominals",
      equipment: "body weight",
      gifUrl: "https://example.com/images/plank.gif",
      instructions: [
        "Apoie-se nos antebraços e nas pontas dos pés.",
        "Mantenha o corpo em linha reta da cabeça aos calcanhares.",
        "Contraia o abdômen e os glúteos.",
        "Mantenha a posição pelo tempo desejado."
      ],
      secondaryMuscles: ["lower back", "shoulders"]
    },
    {
      id: "0007",
      name: "Puxada Alta",
      bodyPart: "back",
      target: "latissimus dorsi",
      equipment: "cable",
      gifUrl: "https://example.com/images/lat-pulldown.gif",
      instructions: [
        "Sente-se na máquina com as coxas sob os apoios.",
        "Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros.",
        "Puxe a barra para baixo até a altura do queixo ou clavícula.",
        "Solte lentamente até a posição inicial com os braços estendidos."
      ],
      secondaryMuscles: ["biceps", "rhomboids"]
    },
    {
      id: "0008",
      name: "Flexão de Braço",
      bodyPart: "chest",
      target: "pectorals",
      equipment: "body weight",
      gifUrl: "https://example.com/images/push-up.gif",
      instructions: [
        "Comece na posição de prancha com as mãos um pouco mais afastadas que a largura dos ombros.",
        "Mantenha o corpo em linha reta da cabeça aos calcanhares.",
        "Dobre os cotovelos e abaixe o corpo até quase tocar o chão.",
        "Empurre de volta à posição inicial."
      ],
      secondaryMuscles: ["triceps", "deltoids", "core"]
    }
  ];
  
  export default exercisesData;
  