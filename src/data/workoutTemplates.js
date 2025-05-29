// src/data/workoutTemplates.js
const workoutTemplates = [
    {
      id: 'template-a',
      title: 'Treino A - Peito e Tríceps',
      description: 'Treino focado em desenvolvimento de peito e tríceps',
      type: 'força',
      exercises: [
        {
          id: 'ex-1',
          name: 'Supino Reto',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Deite no banco com os pés apoiados no chão',
            'Segure a barra com as mãos um pouco mais abertas que a largura dos ombros',
            'Desça a barra controladamente até tocar levemente o peito',
            'Empurre a barra para cima até estender os braços'
          ]
        },
        {
          id: 'ex-2',
          name: 'Supino Inclinado',
          sets: 3,
          reps: '12',
          rest: 90,
          instructions: [
            'Ajuste o banco em uma inclinação de 30-45 graus',
            'Mantenha os pés apoiados no chão',
            'Desça a barra controladamente até a parte superior do peito',
            'Empurre a barra para cima mantendo os cotovelos alinhados'
          ]
        },
        {
          id: 'ex-3',
          name: 'Crucifixo',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Deite no banco segurando um halter em cada mão',
            'Comece com os braços estendidos acima do peito',
            'Abra os braços lateralmente mantendo uma leve flexão nos cotovelos',
            'Retorne à posição inicial aproximando os halteres'
          ]
        },
        {
          id: 'ex-4',
          name: 'Tríceps Corda',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Fixe a corda na polia alta',
            'Segure as extremidades da corda com as palmas voltadas uma para outra',
            'Mantenha os cotovelos junto ao corpo',
            'Estenda os braços para baixo, abrindo levemente a corda no final'
          ]
        },
        {
          id: 'ex-5',
          name: 'Tríceps Francês',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure um halter com as duas mãos acima da cabeça',
            'Flexione os cotovelos, baixando o halter atrás da cabeça',
            'Mantenha os braços próximos às orelhas',
            'Estenda os braços retornando à posição inicial'
          ]
        },
        {
          id: 'ex-6',
          name: 'Mergulho no Banco',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Apoie as mãos em dois bancos paralelos',
            'Mantenha o corpo suspenso com os braços estendidos',
            'Flexione os cotovelos descendo o corpo entre os bancos',
            'Empurre o corpo para cima retornando à posição inicial'
          ]
        }
      ]
    },
    {
      id: 'template-b',
      title: 'Treino B - Costas e Bíceps',
      description: 'Treino focado em desenvolvimento de costas e bíceps',
      type: 'força',
      exercises: [
        {
          id: 'ex-7',
          name: 'Puxada Frontal',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Segure a barra com as mãos um pouco mais abertas que os ombros',
            'Mantenha as costas retas e o peito aberto',
            'Puxe a barra até a altura do queixo',
            'Retorne controladamente à posição inicial'
          ]
        },
        {
          id: 'ex-8',
          name: 'Remada Curvada',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Segure a barra com as mãos na largura dos ombros',
            'Flexione o tronco mantendo as costas retas',
            'Puxe a barra até tocar o abdômen',
            'Controle o movimento de retorno'
          ]
        },
        {
          id: 'ex-9',
          name: 'Pulldown',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure a barra com pegada aberta',
            'Mantenha o tronco levemente inclinado para trás',
            'Puxe a barra em direção ao peito',
            'Solte a barra controladamente'
          ]
        },
        {
          id: 'ex-10',
          name: 'Rosca Direta',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure a barra com as palmas voltadas para cima',
            'Mantenha os cotovelos junto ao corpo',
            'Flexione os braços trazendo a barra até os ombros',
            'Desça a barra controladamente'
          ]
        },
        {
          id: 'ex-11',
          name: 'Rosca Martelo',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure os halteres com as palmas voltadas uma para outra',
            'Mantenha os cotovelos junto ao corpo',
            'Flexione os braços alternadamente',
            'Controle o movimento de descida'
          ]
        }
      ]
    },
    {
      id: 'template-c',
      title: 'Treino C - Pernas',
      description: 'Treino focado em desenvolvimento de pernas',
      type: 'força',
      exercises: [
        {
          id: 'ex-12',
          name: 'Agachamento',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Posicione a barra nos ombros',
            'Mantenha os pés na largura dos ombros',
            'Flexione os joelhos descendo até a posição paralela',
            'Retorne à posição inicial empurrando através dos calcanhares'
          ]
        },
        {
          id: 'ex-13',
          name: 'Leg Press',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Posicione os pés na plataforma na largura dos ombros',
            'Destrave o equipamento e flexione os joelhos',
            'Empurre a plataforma até estender as pernas',
            'Não trave os joelhos no topo do movimento'
          ]
        },
        {
          id: 'ex-14',
          name: 'Cadeira Extensora',
          sets: 3,
          reps: '15',
          rest: 60,
          instructions: [
            'Ajuste o encosto e o apoio das pernas',
            'Estenda as pernas até ficarem paralelas ao chão',
            'Mantenha a contração no topo por um segundo',
            'Retorne controladamente à posição inicial'
          ]
        },
        {
          id: 'ex-15',
          name: 'Mesa Flexora',
          sets: 3,
          reps: '15',
          rest: 60,
          instructions: [
            'Deite na mesa flexora com os joelhos alinhados',
            'Flexione as pernas trazendo os calcanhares em direção aos glúteos',
            'Mantenha a contração no topo por um segundo',
            'Retorne controladamente à posição inicial'
          ]
        },
        {
          id: 'ex-16',
          name: 'Elevação Pélvica',
          sets: 3,
          reps: '15',
          rest: 60,
          instructions: [
            'Deite no chão com os joelhos flexionados',
            'Eleve o quadril empurrando através dos calcanhares',
            'Mantenha a contração dos glúteos no topo',
            'Desça controladamente'
          ]
        }
      ]
    },
    {
      id: 'template-d',
      title: 'Treino D - Ombros e Abdômen',
      description: 'Treino focado em desenvolvimento de ombros e abdômen',
      type: 'força',
      exercises: [
        {
          id: 'ex-17',
          name: 'Desenvolvimento com Halteres',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Segure os halteres na altura dos ombros',
            'Pressione os halteres para cima',
            'Mantenha o core estabilizado',
            'Retorne controladamente à posição inicial'
          ]
        },
        {
          id: 'ex-18',
          name: 'Elevação Lateral',
          sets: 4,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure os halteres ao lado do corpo',
            'Eleve os braços lateralmente até a altura dos ombros',
            'Mantenha uma leve flexão nos cotovelos',
            'Desça controladamente'
          ]
        },
        {
          id: 'ex-19',
          name: 'Elevação Frontal',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure os halteres à frente do corpo',
            'Eleve os braços à frente até a altura dos ombros',
            'Mantenha os braços estendidos',
            'Alterne os braços durante o exercício'
          ]
        },
        {
          id: 'ex-20',
          name: 'Abdominal Supra',
          sets: 3,
          reps: '20',
          rest: 45,
          instructions: [
            'Deite com os joelhos flexionados',
            'Coloque as mãos atrás da cabeça',
            'Eleve os ombros do chão contraindo o abdômen',
            'Retorne controladamente'
          ]
        },
        {
          id: 'ex-21',
          name: 'Prancha',
          sets: 3,
          reps: '30 segundos',
          rest: 45,
          instructions: [
            'Apoie os antebraços e as pontas dos pés no chão',
            'Mantenha o corpo alinhado',
            'Contraia o abdômen e os glúteos',
            'Mantenha a posição pelo tempo determinado'
          ]
        }
      ]
    },
    {
      id: 'template-push',
      title: 'Treino Push (Empurrar)',
      description: 'Treino focado em músculos de empurrar (peito, ombros e tríceps)',
      type: 'força',
      exercises: [
        {
          id: 'ex-22',
          name: 'Supino Reto',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Deite no banco com os pés apoiados no chão',
            'Segure a barra com pegada um pouco mais aberta que os ombros',
            'Desça a barra controladamente até o peito',
            'Empurre a barra para cima'
          ]
        },
        {
          id: 'ex-23',
          name: 'Desenvolvimento Militar',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Segure a barra na altura dos ombros',
            'Pressione a barra para cima',
            'Mantenha o core estabilizado',
            'Retorne controladamente'
          ]
        },
        {
          id: 'ex-24',
          name: 'Elevação Lateral',
          sets: 3,
          reps: '15',
          rest: 60,
          instructions: [
            'Segure os halteres ao lado do corpo',
            'Eleve os braços lateralmente',
            'Mantenha uma leve flexão nos cotovelos',
            'Desça controladamente'
          ]
        },
        {
          id: 'ex-25',
          name: 'Extensão de Tríceps na Polia',
          sets: 3,
          reps: '15',
          rest: 60,
          instructions: [
            'Segure a corda com as palmas voltadas uma para outra',
            'Mantenha os cotovelos junto ao corpo',
            'Estenda os braços para baixo',
            'Retorne controladamente'
          ]
        }
      ]
    },
    {
      id: 'template-pull',
      title: 'Treino Pull (Puxar)',
      description: 'Treino focado em músculos de puxar (costas e bíceps)',
      type: 'força',
      exercises: [
        {
          id: 'ex-26',
          name: 'Puxada Frontal',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Segure a barra com pegada aberta',
            'Mantenha as costas retas',
            'Puxe a barra até o queixo',
            'Retorne controladamente'
          ]
        },
        {
          id: 'ex-27',
          name: 'Remada Baixa',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Sente no aparelho com os pés apoiados',
            'Puxe o triângulo em direção ao abdômen',
            'Mantenha os cotovelos próximos ao corpo',
            'Retorne controladamente'
          ]
        },
        {
          id: 'ex-28',
          name: 'Rosca Alternada',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure um halter em cada mão',
            'Alterne a flexão dos braços',
            'Mantenha os cotovelos junto ao corpo',
            'Controle o movimento de descida'
          ]
        },
        {
          id: 'ex-29',
          name: 'Rosca Scott',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Apoie os braços no banco Scott',
            'Segure a barra com pegada supinada',
            'Flexione os braços trazendo a barra para cima',
            'Desça controladamente'
          ]
        }
      ]
    },
    {
      id: 'template-legs',
      title: 'Treino Legs (Pernas)',
      description: 'Treino focado em desenvolvimento de pernas',
      type: 'força',
      exercises: [
        {
          id: 'ex-30',
          name: 'Agachamento',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Posicione a barra nos ombros',
            'Mantenha os pés na largura dos ombros',
            'Desça até a posição paralela',
            'Empurre através dos calcanhares'
          ]
        },
        {
          id: 'ex-31',
          name: 'Leg Press',
          sets: 4,
          reps: '12',
          rest: 90,
          instructions: [
            'Posicione os pés na plataforma',
            'Destrave o equipamento',
            'Flexione os joelhos',
            'Empurre a plataforma'
          ]
        },
        {
          id: 'ex-32',
          name: 'Stiff',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure a barra à frente das coxas',
            'Flexione o tronco mantendo as pernas estendidas',
            'Sinta o alongamento nos posteriores',
            'Retorne à posição inicial'
          ]
        },
        {
          id: 'ex-33',
          name: 'Panturrilha em Pé',
          sets: 4,
          reps: '15',
          rest: 45,
          instructions: [
            'Posicione-se no aparelho',
            'Eleve os calcanhares',
            'Mantenha a contração no topo',
            'Desça controladamente'
          ]
        }
      ]
    },
    {
      id: 'template-full',
      title: 'Treino Full Body',
      description: 'Treino completo para todo o corpo',
      type: 'força',
      exercises: [
        {
          id: 'ex-34',
          name: 'Agachamento',
          sets: 3,
          reps: '12',
          rest: 90,
          instructions: [
            'Posicione a barra nos ombros',
            'Mantenha os pés na largura dos ombros',
            'Desça até a posição paralela',
            'Empurre através dos calcanhares'
          ]
        },
        {
          id: 'ex-35',
          name: 'Supino Reto',
          sets: 3,
          reps: '12',
          rest: 90,
          instructions: [
            'Deite no banco',
            'Segure a barra com pegada média',
            'Desça até o peito',
            'Empurre para cima'
          ]
        },
        {
          id: 'ex-36',
          name: 'Puxada Frontal',
          sets: 3,
          reps: '12',
          rest: 90,
          instructions: [
            'Segure a barra com pegada aberta',
            'Puxe até o queixo',
            'Mantenha as costas retas',
            'Retorne controladamente'
          ]
        },
        {
          id: 'ex-37',
          name: 'Desenvolvimento',
          sets: 3,
          reps: '12',
          rest: 60,
          instructions: [
            'Segure os halteres na altura dos ombros',
            'Pressione para cima',
            'Mantenha o core estabilizado',
            'Desça controladamente'
          ]
        },
        {
          id: 'ex-38',
          name: 'Rosca Direta',
          sets: 2,
          reps: '15',
          rest: 60,
          instructions: [
            'Segure a barra com pegada supinada',
            'Flexione os braços',
            'Mantenha os cotovelos fixos',
            'Desça controladamente'
          ]
        },
        {
          id: 'ex-39',
          name: 'Extensão de Tríceps',
          sets: 2,
          reps: '15',
          rest: 60,
          instructions: [
            'Segure a corda na polia alta',
            'Estenda os braços para baixo',
            'Mantenha os cotovelos fixos',
            'Retorne controladamente'
          ]
        }
      ]
    }
];

export default workoutTemplates;
  