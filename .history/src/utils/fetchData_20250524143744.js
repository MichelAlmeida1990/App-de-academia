// src/utils/fetchData.js
// Dados simulados para exercícios
const mockExercises = [
    {
      id: "0001",
      name: "Agachamento",
      bodyPart: "pernas",
      target: "quadríceps",
      equipment: "peso corporal",
      gifUrl: "https://via.placeholder.com/400x300?text=Agachamento",
      instructions: "Fique em pé com os pés na largura dos ombros. Dobre os joelhos, mantendo a coluna reta, como se fosse sentar em uma cadeira. Desça até as coxas ficarem paralelas ao chão e retorne à posição inicial."
    },
    {
      id: "0002",
      name: "Flexão de Braço",
      bodyPart: "peito",
      target: "peitoral",
      equipment: "peso corporal",
      gifUrl: "https://via.placeholder.com/400x300?text=Flexao+de+Braco",
      instructions: "Comece na posição de prancha com mãos um pouco mais largas que os ombros. Dobre os cotovelos para baixar o corpo até quase tocar o chão e depois empurre para cima até a posição inicial."
    },
    {
      id: "0003",
      name: "Abdominal",
      bodyPart: "abdômen",
      target: "abdominais",
      equipment: "peso corporal",
      gifUrl: "https://via.placeholder.com/400x300?text=Abdominal",
      instructions: "Deite-se de costas com os joelhos dobrados e os pés apoiados no chão. Coloque as mãos atrás da cabeça ou cruzadas no peito. Contraia os músculos abdominais para levantar os ombros do chão e depois desça lentamente."
    },
    {
      id: "0004",
      name: "Levantamento Terra",
      bodyPart: "costas",
      target: "lombar",
      equipment: "barra",
      gifUrl: "https://via.placeholder.com/400x300?text=Levantamento+Terra",
      instructions: "Fique em pé com os pés na largura dos ombros. Dobre-se pela cintura para segurar a barra com as mãos um pouco mais largas que os pés. Mantendo as costas retas, levante a barra empurrando os quadris para frente até ficar totalmente ereto."
    },
    {
      id: "0005",
      name: "Barra Fixa",
      bodyPart: "costas",
      target: "latíssimo do dorso",
      equipment: "barra fixa",
      gifUrl: "https://via.placeholder.com/400x300?text=Barra+Fixa",
      instructions: "Segure a barra fixa com as palmas das mãos viradas para frente e as mãos um pouco mais largas que os ombros. Puxe seu corpo para cima até que seu queixo ultrapasse a barra e depois desça com controle."
    },
    {
      id: "0006",
      name: "Afundo",
      bodyPart: "pernas",
      target: "quadríceps",
      equipment: "peso corporal",
      gifUrl: "https://via.placeholder.com/400x300?text=Afundo",
      instructions: "Fique em pé com os pés juntos. Dê um passo à frente com uma perna e dobre ambos os joelhos, descendo até que o joelho traseiro quase toque o chão. Empurre com o pé da frente para voltar à posição inicial."
    },
    {
      id: "0007",
      name: "Rosca Direta",
      bodyPart: "braços",
      target: "bíceps",
      equipment: "halteres",
      gifUrl: "https://via.placeholder.com/400x300?text=Rosca+Direta",
      instructions: "Fique em pé segurando um haltere em cada mão com os braços estendidos. Dobre os cotovelos para levantar os halteres em direção aos ombros, mantendo os cotovelos próximos ao corpo. Desça lentamente para a posição inicial."
    },
    {
      id: "0008",
      name: "Tríceps Mergulho",
      bodyPart: "braços",
      target: "tríceps",
      equipment: "barras paralelas",
      gifUrl: "https://via.placeholder.com/400x300?text=Triceps+Mergulho",
      instructions: "Segure-se entre barras paralelas com os braços estendidos. Dobre os cotovelos para baixar o corpo até que os braços formem um ângulo de 90 graus, depois empurre para cima até estender os cotovelos novamente."
    },
    {
      id: "0009",
      name: "Prancha",
      bodyPart: "abdômen",
      target: "core",
      equipment: "peso corporal",
      gifUrl: "https://via.placeholder.com/400x300?text=Prancha",
      instructions: "Apoie-se nos antebraços e nas pontas dos pés, mantendo o corpo em linha reta da cabeça aos calcanhares. Mantenha o core contraído e segure a posição pelo tempo determinado."
    },
    {
      id: "0010",
      name: "Desenvolvimento de Ombros",
      bodyPart: "ombros",
      target: "deltoides",
      equipment: "halteres",
      gifUrl: "https://via.placeholder.com/400x300?text=Desenvolvimento+Ombros",
      instructions: "Sente-se ou fique em pé segurando um haltere em cada mão na altura dos ombros. Empurre os halteres para cima até que os braços estejam totalmente estendidos acima da cabeça, depois baixe lentamente de volta à posição inicial."
    }
  ];
  
  // Dados simulados para vídeos
  const mockVideos = [
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2A",
        channelName: "Treino em Casa",
        description: "Aprenda a fazer agachamentos perfeitos para fortalecer as pernas",
        lengthText: "10:15",
        publishedTimeText: "2 meses atrás",
        thumbnails: [
          {
            height: 202,
            url: "https://via.placeholder.com/320x180?text=Agachamento+Video",
            width: 360
          }
        ],
        title: "Técnica perfeita de agachamento para iniciantes",
        videoId: "vid001"
      }
    },
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2B",
        channelName: "Fitness Pro",
        description: "Variações de flexões para todos os níveis",
        lengthText: "8:22",
        publishedTimeText: "3 semanas atrás",
        thumbnails: [
          {
            height: 202,
            url: "https://via.placeholder.com/320x180?text=Flexao+Video",
            width: 360
          }
        ],
        title: "5 tipos de flexões para desenvolver o peitoral",
        videoId: "vid002"
      }
    },
    {
      video: {
        channelId: "UCe0TLA0EsQbE-MjuHXevj2C",
        channelName: "Abdômen Definido",
        description: "Treino completo de abdominais em apenas 10 minutos",
        lengthText: "10:05",
        publishedTimeText: "1 mês atrás",
        thumbnails: [
          {
            height: 202,
            url: "https://via.placeholder.com/320x180?text=Abdominal+Video",
            width: 360
          }
        ],
        title: "Abdominais em 10 minutos para iniciantes",
        videoId: "vid003"
      }
    }
  ];
  
  // Funções para buscar dados simulados
  export const fetchExercises = async () => {
    // Simulando um atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockExercises);
      }, 500);
    });
  };
  
  export const fetchExerciseById = async (id) => {
    // Simulando um atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        const exercise = mockExercises.find(ex => ex.id === id);
        resolve(exercise || null);
      }, 300);
    });
  };
  
  export const fetchExerciseVideos = async (name) => {
    // Simulando um atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filtra vídeos que contenham parte do nome do exercício no título
        // Na versão simulada, retornamos todos os vídeos
        resolve(mockVideos);
      }, 700);
    });
  };
  
  export const fetchExercisesByBodyPart = async (bodyPart) => {
    // Simulando um atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        const exercises = mockExercises.filter(ex => ex.bodyPart.toLowerCase() === bodyPart.toLowerCase());
        resolve(exercises);
      }, 400);
    });
  };
  
  export const fetchExercisesByTarget = async (target) => {
    // Simulando um atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        const exercises = mockExercises.filter(ex => ex.target.toLowerCase() === target.toLowerCase());
        resolve(exercises);
      }, 400);
    });
  };
  
  export const fetchExercisesByEquipment = async (equipment) => {
    // Simulando um atraso de rede
    return new Promise((resolve) => {
      setTimeout(() => {
        const exercises = mockExercises.filter(ex => ex.equipment.toLowerCase() === equipment.toLowerCase());
        resolve(exercises);
      }, 400);
    });
  };
  