// src/data/exercisesData.js
const exercisesData = [
  {
    id: "0001",
    name: "Agachamento Livre",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGJ4YzZhcWt5ZWNyZmJxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZBn3ZRprW0p68/giphy.gif",
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Mantenha o peito erguido e olhe para frente",
      "Dobre os joelhos e quadris, como se fosse sentar",
      "Desça até as coxas ficarem paralelas ao chão",
      "Empurre pelos calcanhares para retornar à posição inicial",
      "Mantenha os joelhos alinhados com os pés"
    ],
    tips: [
      "Não deixe os joelhos passarem da linha dos pés",
      "Mantenha o peso nos calcanhares",
      "Contraia o abdômen durante todo o movimento",
      "Desça controladamente, não rapidamente"
    ],
    level: "beginner",
    secondaryMuscles: ["glúteos", "panturrilhas", "core"],
    duration: "3x12-15 repetições",
    calories: 8
  },
  {
    id: "0002",
    name: "Flexão de Braço",
    bodyPart: "peito",
    target: "peitoral",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif",
    instructions: [
      "Comece na posição de prancha com mãos no chão",
      "Mãos ligeiramente mais largas que os ombros",
      "Mantenha o corpo em linha reta da cabeça aos pés",
      "Dobre os cotovelos para baixar o peito em direção ao chão",
      "Empurre para cima até os braços ficarem estendidos",
      "Mantenha o core contraído durante todo o movimento"
    ],
    tips: [
      "Não deixe os quadris subirem ou descerem",
      "Cotovelos devem formar um ângulo de 45 graus",
      "Expire na subida, inspire na descida",
      "Se for difícil, apoie os joelhos no chão"
    ],
    level: "beginner",
    secondaryMuscles: ["tríceps", "ombros", "core"],
    duration: "3x8-12 repetições",
    calories: 6
  },
  {
    id: "0003",
    name: "Abdominal Tradicional",
    bodyPart: "abdômen",
    target: "abdominais",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKqnN349PBUtGFO/giphy.gif",
    instructions: [
      "Deite-se de costas com joelhos dobrados",
      "Pés apoiados no chão, mãos atrás da cabeça",
      "Contraia os abdominais para levantar os ombros",
      "Levante até formar um ângulo de 45 graus",
      "Desça lentamente para a posição inicial",
      "Mantenha o queixo afastado do peito"
    ],
    tips: [
      "Não puxe o pescoço com as mãos",
      "Movimento deve vir do abdômen, não do pescoço",
      "Expire durante a subida",
      "Mantenha os pés no chão"
    ],
    level: "beginner",
    secondaryMuscles: ["oblíquos", "hip flexors"],
    duration: "3x15-20 repetições",
    calories: 5
  },
  {
    id: "0004",
    name: "Prancha",
    bodyPart: "abdômen",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/26FLgGTPUDH6UGAbm/giphy.gif",
    instructions: [
      "Apoie-se nos antebraços e pontas dos pés",
      "Mantenha o corpo em linha reta",
      "Cotovelos diretamente abaixo dos ombros",
      "Contraia abdômen, glúteos e pernas",
      "Respire normalmente durante o exercício",
      "Segure a posição pelo tempo determinado"
    ],
    tips: [
      "Não deixe os quadris subirem ou descerem",
      "Mantenha o pescoço neutro",
      "Contraia todos os músculos do core",
      "Comece com 30 segundos e aumente gradualmente"
    ],
    level: "beginner",
    secondaryMuscles: ["ombros", "glúteos", "pernas"],
    duration: "3x30-60 segundos",
    calories: 4
  },
  {
    id: "0005",
    name: "Burpee",
    bodyPart: "corpo todo",
    target: "cardiovascular",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlvtIPzPdt2usKs/giphy.gif",
    instructions: [
      "Comece em pé, depois agache e coloque as mãos no chão",
      "Pule os pés para trás em posição de prancha",
      "Faça uma flexão (opcional para iniciantes)",
      "Pule os pés de volta para a posição de agachamento",
      "Salte para cima com os braços estendidos",
      "Aterrisse suavemente e repita"
    ],
    tips: [
      "Mantenha o core contraído durante todo movimento",
      "Aterrisse suavemente para proteger as articulações",
      "Modifique removendo o salto se necessário",
      "Mantenha um ritmo constante"
    ],
    level: "intermediate",
    secondaryMuscles: ["peito", "pernas", "ombros", "core"],
    duration: "3x8-12 repetições",
    calories: 12
  },
  {
    id: "0006",
    name: "Mountain Climber",
    bodyPart: "abdômen",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZBn3ZRprW0p68/giphy.gif",
    instructions: [
      "Comece na posição de prancha alta",
      "Mãos diretamente abaixo dos ombros",
      "Traga um joelho em direção ao peito",
      "Alterne rapidamente as pernas",
      "Mantenha os quadris estáveis",
      "Continue o movimento alternado"
    ],
    tips: [
      "Não deixe os quadris subirem muito",
      "Mantenha as mãos firmes no chão",
      "Respire de forma ritmada",
      "Comece devagar e aumente a velocidade"
    ],
    level: "intermediate",
    secondaryMuscles: ["ombros", "pernas", "cardiovascular"],
    duration: "3x30-45 segundos",
    calories: 10
  },
  {
    id: "0007",
    name: "Jumping Jacks",
    bodyPart: "corpo todo",
    target: "cardiovascular",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l0HlvtIPzPdt2usKs/giphy.gif",
    instructions: [
      "Comece em pé com pés juntos e braços ao lado",
      "Pule abrindo as pernas para os lados",
      "Simultaneamente levante os braços acima da cabeça",
      "Pule novamente para retornar à posição inicial",
      "Mantenha um ritmo constante e energético",
      "Aterrisse suavemente nos pés"
    ],
    tips: [
      "Mantenha os joelhos levemente flexionados",
      "Aterrisse na ponta dos pés primeiro",
      "Mantenha o core contraído",
      "Respire de forma ritmada"
    ],
    level: "beginner",
    secondaryMuscles: ["panturrilhas", "ombros", "core"],
    duration: "3x30-60 segundos",
    calories: 8
  },
  {
    id: "0008",
    name: "Afundo",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif",
    instructions: [
      "Fique em pé com pés na largura dos quadris",
      "Dê um passo à frente com uma perna",
      "Dobre ambos os joelhos em ângulos de 90 graus",
      "O joelho de trás deve quase tocar o chão",
      "Empurre com a perna da frente para voltar",
      "Alterne as pernas ou complete uma série de cada vez"
    ],
    tips: [
      "Não deixe o joelho da frente passar da linha do pé",
      "Mantenha o tronco ereto",
      "Distribua o peso igualmente entre as pernas",
      "Desça controladamente"
    ],
    level: "beginner",
    secondaryMuscles: ["glúteos", "panturrilhas", "core"],
    duration: "3x10-12 cada perna",
    calories: 7
  },
  {
    id: "0009",
    name: "High Knees",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKqnN349PBUtGFO/giphy.gif",
    instructions: [
      "Corra no lugar levantando os joelhos alto",
      "Tente tocar os joelhos no peito",
      "Mantenha um ritmo rápido e constante",
      "Balance os braços naturalmente",
      "Aterrisse na ponta dos pés",
      "Mantenha o tronco ereto"
    ],
    tips: [
      "Levante os joelhos o mais alto possível",
      "Mantenha o core contraído",
      "Respire de forma ritmada",
      "Comece devagar e aumente a intensidade"
    ],
    level: "beginner",
    secondaryMuscles: ["panturrilhas", "core", "cardiovascular"],
    duration: "3x30-45 segundos",
    calories: 9
  },
  {
    id: "0010",
    name: "Wall Sit",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "parede",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/26FLgGTPUDH6UGAbm/giphy.gif",
    instructions: [
      "Encoste as costas em uma parede",
      "Caminhe com os pés para frente",
      "Deslize para baixo até as coxas ficarem paralelas",
      "Mantenha os joelhos em ângulo de 90 graus",
      "Segure a posição pelo tempo determinado",
      "Mantenha as costas completamente na parede"
    ],
    tips: [
      "Não deixe os joelhos passarem da linha dos pés",
      "Mantenha o peso distribuído igualmente",
      "Respire normalmente durante o exercício",
      "Comece com 30 segundos e aumente gradualmente"
    ],
    level: "intermediate",
    secondaryMuscles: ["glúteos", "panturrilhas", "core"],
    duration: "3x30-60 segundos",
    calories: 6
  },
  {
    id: "0011",
    name: "Russian Twist",
    bodyPart: "abdômen",
    target: "oblíquos",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlvtIPzPdt2usKs/giphy.gif",
    instructions: [
      "Sente-se com joelhos dobrados e pés elevados",
      "Incline o tronco ligeiramente para trás",
      "Mantenha as costas retas",
      "Gire o tronco de um lado para o outro",
      "Toque o chão de cada lado com as mãos",
      "Mantenha o core contraído durante todo movimento"
    ],
    tips: [
      "Não arredonde as costas",
      "Movimento deve vir da cintura",
      "Mantenha os pés elevados",
      "Controle a velocidade do movimento"
    ],
    level: "intermediate",
    secondaryMuscles: ["abdominais", "hip flexors"],
    duration: "3x20-30 repetições",
    calories: 6
  },
  {
    id: "0012",
    name: "Dead Bug",
    bodyPart: "abdômen",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZBn3ZRprW0p68/giphy.gif",
    instructions: [
      "Deite-se de costas com braços estendidos para cima",
      "Joelhos dobrados em 90 graus, coxas perpendiculares",
      "Estenda braço e perna opostos simultaneamente",
      "Mantenha a lombar pressionada no chão",
      "Retorne à posição inicial controladamente",
      "Alterne braços e pernas"
    ],
    tips: [
      "Não deixe a lombar sair do chão",
      "Movimento deve ser lento e controlado",
      "Respire normalmente",
      "Mantenha o core sempre contraído"
    ],
    level: "intermediate",
    secondaryMuscles: ["hip flexors", "ombros"],
    duration: "3x10-12 cada lado",
    calories: 5
  },
  {
    id: "0013",
    name: "Glute Bridge",
    bodyPart: "glúteos",
    target: "glúteos",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l46Cy1rHbQ92uuLXa/giphy.gif",
    instructions: [
      "Deite-se de costas com joelhos dobrados",
      "Pés apoiados no chão, braços ao lado do corpo",
      "Contraia os glúteos e levante os quadris",
      "Forme uma linha reta dos joelhos aos ombros",
      "Segure por 2 segundos no topo",
      "Desça controladamente"
    ],
    tips: [
      "Aperte os glúteos no topo do movimento",
      "Não arqueie demais as costas",
      "Mantenha os joelhos alinhados",
      "Empurre através dos calcanhares"
    ],
    level: "beginner",
    secondaryMuscles: ["isquiotibiais", "core"],
    duration: "3x12-15 repetições",
    calories: 5
  },
  {
    id: "0014",
    name: "Pike Push-up",
    bodyPart: "ombros",
    target: "deltoides",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKqnN349PBUtGFO/giphy.gif",
    instructions: [
      "Comece na posição de prancha",
      "Caminhe com os pés em direção às mãos",
      "Forme um 'V' invertido com o corpo",
      "Dobre os cotovelos para baixar a cabeça",
      "Empurre para cima até os braços ficarem estendidos",
      "Mantenha a posição de pike durante todo movimento"
    ],
    tips: [
      "Mantenha as pernas o mais retas possível",
      "Foque o peso nos ombros",
      "Não deixe a cabeça tocar o chão com força",
      "Movimento deve ser controlado"
    ],
    level: "intermediate",
    secondaryMuscles: ["tríceps", "core"],
    duration: "3x8-12 repetições",
    calories: 7
  },
  {
    id: "0015",
    name: "Bicycle Crunch",
    bodyPart: "abdômen",
    target: "oblíquos",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlvtIPzPdt2usKs/giphy.gif",
    instructions: [
      "Deite-se de costas com mãos atrás da cabeça",
      "Levante os ombros do chão",
      "Traga os joelhos em direção ao peito",
      "Simule o movimento de pedalar uma bicicleta",
      "Toque o cotovelo direito no joelho esquerdo",
      "Alterne os lados de forma contínua"
    ],
    tips: [
      "Não puxe o pescoço com as mãos",
      "Mantenha os ombros elevados",
      "Movimento deve ser fluido e controlado",
      "Expire a cada toque cotovelo-joelho"
    ],
    level: "intermediate",
    secondaryMuscles: ["abdominais", "hip flexors"],
    duration: "3x20-30 repetições",
    calories: 6
  },
  {
    id: "0016",
    name: "Bear Crawl",
    bodyPart: "corpo todo",
    target: "core",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/ZBn3ZRprW0p68/giphy.gif",
    instructions: [
      "Comece em posição de quatro apoios",
      "Levante os joelhos alguns centímetros do chão",
      "Mova a mão direita e pé esquerdo para frente",
      "Depois mova a mão esquerda e pé direito",
      "Mantenha os joelhos baixos e core contraído",
      "Continue o movimento coordenado"
    ],
    tips: [
      "Mantenha os joelhos próximos ao chão",
      "Movimento deve ser lento e controlado",
      "Mantenha o core sempre contraído",
      "Coordene braços e pernas opostos"
    ],
    level: "intermediate",
    secondaryMuscles: ["ombros", "pernas", "cardiovascular"],
    duration: "3x30-45 segundos",
    calories: 8
  },
  {
    id: "0017",
    name: "Superman",
    bodyPart: "costas",
    target: "lombar",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FLgGTPUDH6UGAbm/giphy.gif",
    instructions: [
      "Deite-se de bruços com braços estendidos à frente",
      "Mantenha a testa no chão",
      "Simultaneamente levante braços, peito e pernas",
      "Segure por 2-3 segundos no topo",
      "Desça controladamente",
      "Mantenha o pescoço neutro"
    ],
    tips: [
      "Não levante muito alto para evitar tensão",
      "Mantenha o olhar para baixo",
      "Contraia os glúteos durante o movimento",
      "Respire normalmente"
    ],
    level: "beginner",
    secondaryMuscles: ["glúteos", "isquiotibiais"],
    duration: "3x10-15 repetições",
    calories: 4
  },
  {
    id: "0018",
    name: "Lateral Lunge",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif",
    instructions: [
      "Fique em pé com pés juntos",
      "Dê um passo largo para o lado",
      "Dobre o joelho da perna que se moveu",
      "Mantenha a outra perna reta",
      "Empurre de volta à posição inicial",
      "Alterne os lados"
    ],
    tips: [
      "Mantenha o tronco ereto",
      "Não deixe o joelho passar da linha do pé",
      "Empurre através do calcanhar",
      "Mantenha o peso na perna que está trabalhando"
    ],
    level: "intermediate",
    secondaryMuscles: ["glúteos", "adutores"],
    duration: "3x10-12 cada lado",
    calories: 6
  },
  {
    id: "0019",
    name: "Reverse Lunge",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKqnN349PBUtGFO/giphy.gif",
    instructions: [
      "Fique em pé com pés na largura dos quadris",
      "Dê um passo para trás com uma perna",
      "Dobre ambos os joelhos em 90 graus",
            "O joelho de trás deve quase tocar o chão",
      "Empurre com a perna da frente para voltar",
      "Alterne as pernas"
    ],
    tips: [
      "Mantenha a maior parte do peso na perna da frente",
      "Não deixe o joelho da frente passar do pé",
      "Mantenha o tronco ereto",
      "Controle a descida"
    ],
    level: "beginner",
    secondaryMuscles: ["glúteos", "panturrilhas"],
    duration: "3x10-12 cada perna",
    calories: 7
  },
  {
    id: "0020",
    name: "Crab Walk",
    bodyPart: "corpo todo",
    target: "tríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l0HlvtIPzPdt2usKs/giphy.gif",
    instructions: [
      "Sente-se com joelhos dobrados e mãos atrás do corpo",
      "Levante os quadris do chão",
      "Caminhe para frente movendo mão e pé opostos",
      "Mantenha os quadris elevados",
      "Continue o movimento coordenado",
      "Pode caminhar para frente e para trás"
    ],
    tips: [
      "Mantenha os quadris altos",
      "Não deixe o bumbum tocar o chão",
      "Coordene braços e pernas opostos",
      "Mantenha o core contraído"
    ],
    level: "intermediate",
    secondaryMuscles: ["ombros", "core", "glúteos"],
    duration: "3x30-45 segundos",
    calories: 8
  },
  {
    id: "0021",
    name: "Single Leg Glute Bridge",
    bodyPart: "glúteos",
    target: "glúteos",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FLgGTPUDH6UGAbm/giphy.gif",
    instructions: [
      "Deite-se de costas com um joelho dobrado",
      "Estenda a outra perna para cima",
      "Contraia os glúteos e levante os quadris",
      "Use apenas uma perna para o apoio",
      "Segure por 2 segundos no topo",
      "Desça controladamente e alterne"
    ],
    tips: [
      "Mantenha a perna estendida reta",
      "Foque na contração do glúteo",
      "Não arqueie demais as costas",
      "Empurre através do calcanhar"
    ],
    level: "intermediate",
    secondaryMuscles: ["isquiotibiais", "core"],
    duration: "3x8-10 cada perna",
    calories: 6
  },
  {
    id: "0022",
    name: "Diamond Push-up",
    bodyPart: "peito",
    target: "tríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXd2eWE4ZGJoMnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZBn3ZRprW0p68/giphy.gif",
    instructions: [
      "Posição de prancha com mãos formando um diamante",
      "Polegares e indicadores se tocando",
      "Mantenha o corpo em linha reta",
      "Dobre os cotovelos para baixar o peito",
      "Empurre para cima mantendo a forma",
      "Mantenha os cotovelos próximos ao corpo"
    ],
    tips: [
      "Movimento mais difícil que flexão normal",
      "Mantenha o core contraído",
      "Se for difícil, apoie os joelhos",
      "Foque na contração dos tríceps"
    ],
    level: "advanced",
    secondaryMuscles: ["peito", "ombros", "core"],
    duration: "3x5-8 repetições",
    calories: 8
  },
  {
    id: "0023",
    name: "Side Plank",
    bodyPart: "abdômen",
    target: "oblíquos",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif",
    instructions: [
      "Deite-se de lado apoiado no antebraço",
      "Cotovelo diretamente abaixo do ombro",
      "Levante os quadris do chão",
      "Forme uma linha reta da cabeça aos pés",
      "Mantenha a posição pelo tempo determinado",
      "Repita do outro lado"
    ],
    tips: [
      "Não deixe os quadris caírem",
      "Mantenha o pescoço neutro",
      "Respire normalmente",
      "Contraia os oblíquos"
    ],
    level: "intermediate",
    secondaryMuscles: ["core", "ombros"],
    duration: "3x20-45 segundos cada lado",
    calories: 5
  },
  {
    id: "0024",
    name: "Squat Jump",
    bodyPart: "pernas",
    target: "quadríceps",
    equipment: "peso corporal",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3F3dmVhOGRiaDBucW1jdmNybzRxd2lhd3RiZGVja2FicTYwb2RlZmQmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7TKqnN349PBUtGFO/giphy.gif",
    instructions: [
      "Comece em posição de agachamento",
      "Desça até as coxas ficarem paralelas",
      "Exploda para cima em um salto",
      "Aterrisse suavemente em agachamento",
      "Absorva o impacto com os joelhos",
      "Repita o movimento de forma fluida"
    ],
    tips: [
      "Aterrisse suavemente",
      "Mantenha os joelhos alinhados",
      "Use os braços para impulsão",
      "Controle a aterrissagem"
    ],
    level: "intermediate",
    secondaryMuscles: ["glúteos", "panturrilhas", "core"],
    duration: "3x8-12 repetições",
    calories: 10
  },
  {
    id: "0025",
    name: "Tricep Dips",
    bodyPart: "braços",
    target: "tríceps",
    equipment: "cadeira/banco",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZkNXB3YnBxbWN2Y3JvNHF3aWF3dGJkZWNrYWJxNjBvZGVmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlvtIPzPdt2usKs/giphy.gif",
    instructions: [
      "Sente-se na borda de uma cadeira ou banco",
      "Coloque as mãos ao lado dos quadris",
      "Deslize o corpo para frente da cadeira",
      "Dobre os cotovelos para descer o corpo",
      "Empurre para cima até os braços ficarem retos",
      "Mantenha os cotovelos próximos ao corpo"
    ],
    tips: [
      "Não desça muito para evitar lesões",
      "Mantenha os ombros para baixo",
      "Foque na contração dos tríceps",
      "Controle tanto a descida quanto a subida"
    ],
    level: "beginner",
    secondaryMuscles: ["ombros", "peito"],
    duration: "3x8-12 repetições",
    calories: 6
  }
];

export default exercisesData;

