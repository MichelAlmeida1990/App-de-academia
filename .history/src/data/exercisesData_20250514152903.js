// src/data/exercisesData.js

const exercisesData = [
    {
      id: 'squat',
      name: 'Agachamento',
      category: 'pernas',
      primaryMuscles: ['quadríceps', 'glúteos', 'isquiotibiais'],
      secondaryMuscles: ['core', 'lombar'],
      equipment: ['barra', 'peso corporal'],
      difficulty: 'intermediário',
      description: 'O agachamento é um exercício composto que trabalha principalmente os músculos das pernas e glúteos. É considerado um dos exercícios mais eficientes para desenvolver força e massa muscular na parte inferior do corpo.',
      instructions: [
        'Posicione-se com os pés na largura dos ombros ou um pouco mais afastados',
        'Mantenha a coluna em posição neutra e o peito erguido',
        'Respire fundo e segure o ar enquanto desce',
        'Flexione os joelhos e quadris, descendo como se fosse sentar em uma cadeira',
        'Desça até que suas coxas fiquem paralelas ao chão (ou mais fundo se tiver mobilidade)',
        'Pressione os calcanhares para subir, expirando ao final do movimento',
        'Mantenha os joelhos alinhados com os pés durante todo o movimento'
      ],
      tips: [
        'Nunca deixe os joelhos colapsarem para dentro',
        'Mantenha o peso nos calcanhares e meio do pé, não na ponta dos pés',
        'Não arredonde as costas durante o movimento',
        'Comece com peso corporal antes de adicionar carga externa'
      ],
      variations: [
        {
          name: 'Agachamento com peso corporal',
          difficulty: 'iniciante'
        },
        {
          name: 'Agachamento frontal',
          difficulty: 'intermediário'
        },
        {
          name: 'Agachamento sumô',
          difficulty: 'intermediário'
        },
        {
          name: 'Agachamento búlgaro',
          difficulty: 'avançado'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
      imageUrl: '/images/exercises/squat.jpg',
    },
    {
      id: 'bench-press',
      name: 'Supino',
      category: 'peito',
      primaryMuscles: ['peitoral', 'tríceps'],
      secondaryMuscles: ['ombros', 'core'],
      equipment: ['barra', 'banco'],
      difficulty: 'intermediário',
      description: 'O supino é um exercício composto focado no desenvolvimento do peitoral, sendo um dos exercícios mais populares para a parte superior do corpo. Também trabalha significativamente os tríceps e ombros como músculos secundários.',
      instructions: [
        'Deite-se em um banco plano com os pés apoiados no chão',
        'Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros',
        'Retire a barra do suporte, mantendo os braços estendidos acima do peito',
        'Respire fundo e desça a barra lentamente até tocar levemente o meio do peito',
        'Pressione a barra para cima até que os braços estejam estendidos, expirando durante o movimento',
        'Mantenha os punhos retos e cotovelos em ângulo adequado durante todo o movimento'
      ],
      tips: [
        'Mantenha os ombros para trás e para baixo, pressionados contra o banco',
        'Não deixe o quadril se levantar do banco durante o movimento',
        'Controle a descida da barra - não deixe cair rapidamente',
        'Mantenha os cotovelos em um ângulo de aproximadamente 45° em relação ao corpo'
      ],
      variations: [
        {
          name: 'Supino com halteres',
          difficulty: 'intermediário'
        },
        {
          name: 'Supino inclinado',
          difficulty: 'intermediário'
        },
        {
          name: 'Supino declinado',
          difficulty: 'intermediário'
        },
        {
          name: 'Supino com pegada fechada',
          difficulty: 'intermediário'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
      imageUrl: '/images/exercises/bench-press.jpg',
    },
    {
      id: 'deadlift',
      name: 'Levantamento Terra',
      category: 'costas',
      primaryMuscles: ['lombar', 'isquiotibiais', 'glúteos'],
      secondaryMuscles: ['trapézio', 'antebraços', 'core', 'quadríceps'],
      equipment: ['barra'],
      difficulty: 'avançado',
      description: 'O levantamento terra é um dos exercícios mais completos, trabalhando quase todos os grandes grupos musculares do corpo. É excelente para desenvolver força total, especialmente na cadeia posterior.',
      instructions: [
        'Posicione-se com os pés na largura dos quadris, com a barra sobre o meio dos pés',
        'Flexione os quadris e joelhos para segurar a barra com as mãos na largura dos ombros',
        'Mantenha a coluna em posição neutra, peito para cima e ombros para trás',
        'Respire fundo, contraia o core e pressione o chão com os pés enquanto estende quadris e joelhos',
        'Mantenha a barra próxima ao corpo durante todo o movimento',
        'No topo, fique completamente ereto, com quadris e joelhos estendidos',
        'Desça a barra controladamente, iniciando o movimento pelos quadris'
      ],
      tips: [
        'Nunca arredonde as costas durante o movimento',
        'Mantenha a barra sempre próxima ao corpo',
        'Não hiperextenda excessivamente a coluna no topo do movimento',
        'Use straps apenas quando necessário para não limitar o desenvolvimento da força de pegada'
      ],
      variations: [
        {
          name: 'Levantamento terra sumo',
          difficulty: 'avançado'
        },
        {
          name: 'Levantamento terra com pernas rígidas',
          difficulty: 'avançado'
        },
        {
          name: 'Levantamento terra romeno',
          difficulty: 'intermediário'
        },
        {
          name: 'Levantamento terra com trap bar',
          difficulty: 'intermediário'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
      imageUrl: '/images/exercises/deadlift.jpg',
    },
    {
      id: 'pull-up',
      name: 'Barra Fixa',
      category: 'costas',
      primaryMuscles: ['latíssimo do dorso', 'bíceps'],
      secondaryMuscles: ['antebraços', 'ombros', 'trapézio', 'core'],
      equipment: ['barra fixa'],
      difficulty: 'intermediário',
      description: 'A barra fixa é um exercício de peso corporal que trabalha principalmente as costas e os braços. É um movimento excelente para desenvolver força na parte superior do corpo e largura nas costas.',
      instructions: [
        'Segure a barra com as palmas das mãos voltadas para frente e as mãos um pouco mais afastadas que a largura dos ombros',
        'Comece na posição pendurada com os braços completamente estendidos',
        'Contraia as escápulas e puxe o corpo para cima até que o queixo ultrapasse a barra',
        'Desça controladamente até a posição inicial com os braços estendidos',
        'Repita o movimento mantendo controle durante todo o exercício'
      ],
      tips: [
        'Evite balançar o corpo para gerar impulso',
        'Concentre-se em puxar com as costas, não apenas com os braços',
        'Mantenha o core engajado durante todo o movimento',
        'Se não conseguir fazer uma repetição completa, comece com variações assistidas'
      ],
      variations: [
        {
          name: 'Barra fixa assistida (com elástico ou máquina)',
          difficulty: 'iniciante'
        },
        {
          name: 'Barra fixa com pegada neutra',
          difficulty: 'intermediário'
        },
        {
          name: 'Barra fixa com pegada supinada (chin-up)',
          difficulty: 'intermediário'
        },
        {
          name: 'Barra fixa com peso adicional',
          difficulty: 'avançado'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
      imageUrl: '/images/exercises/pull-up.jpg',
    },
    {
      id: 'overhead-press',
      name: 'Desenvolvimento',
      category: 'ombros',
      primaryMuscles: ['deltoides', 'trapézio'],
      secondaryMuscles: ['tríceps', 'core'],
      equipment: ['barra', 'halteres'],
      difficulty: 'intermediário',
      description: 'O desenvolvimento é um exercício composto que trabalha principalmente os ombros. É fundamental para desenvolver força e tamanho nos deltoides, além de ser um excelente indicador de força na parte superior do corpo.',
      instructions: [
        'Fique em pé com os pés na largura dos quadris',
        'Segure a barra na altura dos ombros, com as mãos um pouco mais afastadas que a largura dos ombros',
        'Mantenha o core contraído e as escápulas levemente retraídas',
        'Pressione a barra para cima até que os braços estejam completamente estendidos',
        'Desça a barra controladamente de volta à posição inicial na altura dos ombros',
        'Mantenha a trajetória da barra em linha reta, movendo a cabeça ligeiramente para trás quando necessário'
      ],
      tips: [
        'Não arquee excessivamente as costas durante o movimento',
        'Mantenha os cotovelos sob a barra durante a fase de pressão',
        'Contraia os glúteos e o core para estabilizar a coluna',
        'Evite usar impulso das pernas (isso seria um push press, outro exercício)'
      ],
      variations: [
        {
          name: 'Desenvolvimento com halteres',
          difficulty: 'intermediário'
        },
        {
          name: 'Push press',
          difficulty: 'intermediário'
        },
        {
          name: 'Desenvolvimento sentado',
          difficulty: 'intermediário'
        },
        {
          name: 'Desenvolvimento Arnold',
          difficulty: 'intermediário'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
      imageUrl: '/images/exercises/overhead-press.jpg',
    },
    {
      id: 'barbell-row',
      name: 'Remada com Barra',
      category: 'costas',
      primaryMuscles: ['latíssimo do dorso', 'trapézio', 'romboides'],
      secondaryMuscles: ['bíceps', 'antebraços', 'ombros posteriores'],
      equipment: ['barra'],
      difficulty: 'intermediário',
      description: 'A remada com barra é um exercício composto que foca no desenvolvimento da musculatura das costas. É excelente para melhorar a postura e equilibrar o desenvolvimento do corpo em relação aos exercícios de empurrar.',
      instructions: [
        'Posicione-se com os pés na largura dos quadris',
        'Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros',
        'Flexione os quadris e mantenha as costas retas em um ângulo de aproximadamente 45 graus',
        'Mantenha o core contraído e a coluna em posição neutra',
        'Puxe a barra em direção ao abdômen inferior, trazendo os cotovelos para trás',
        'Aperte as escápulas no ponto mais alto do movimento',
        'Desça a barra controladamente até os braços estarem completamente estendidos'
      ],
      tips: [
        'Mantenha as costas retas durante todo o movimento',
        'Não use impulso para levantar a barra',
        'Concentre-se em puxar com as costas, não com os braços',
        'Mantenha o pescoço alinhado com a coluna, não olhe para cima'
      ],
      variations: [
        {
          name: 'Remada curvada com pegada invertida',
          difficulty: 'intermediário'
        },
        {
          name: 'Remada Pendlay',
          difficulty: 'avançado'
        },
        {
          name: 'Remada com halteres',
          difficulty: 'iniciante'
        },
        {
          name: 'Remada T-bar',
          difficulty: 'intermediário'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/T3N-TO4reLQ',
      imageUrl: '/images/exercises/barbell-row.jpg',
    },
    {
      id: 'lunges',
      name: 'Avanço',
      category: 'pernas',
      primaryMuscles: ['quadríceps', 'glúteos', 'isquiotibiais'],
      secondaryMuscles: ['core', 'panturrilhas'],
      equipment: ['peso corporal', 'halteres', 'barra'],
      difficulty: 'intermediário',
      description: 'O avanço é um exercício unilateral que trabalha as pernas individualmente, ajudando a corrigir desequilíbrios musculares e melhorando a estabilidade. É excelente para desenvolver força funcional nas pernas.',
      instructions: [
        'Fique em pé com os pés na largura dos quadris',
        'Dê um passo à frente com uma perna, mantendo o tronco ereto',
        'Desça o corpo flexionando ambos os joelhos até que o joelho traseiro quase toque o chão',
        'O joelho da frente deve estar alinhado com o tornozelo, não ultrapassando os dedos do pé',
        'Pressione o calcanhar da frente para retornar à posição inicial',
        'Repita com a outra perna ou continue com a mesma perna por todas as repetições'
      ],
      tips: [
        'Mantenha o tronco ereto, não se incline para frente',
        'Controle o movimento durante a descida',
        'Mantenha o joelho da frente alinhado com o pé, não deixe colapsar para dentro',
        'Engaje o core durante todo o movimento para estabilidade'
      ],
      variations: [
        {
          name: 'Avanço estacionário',
          difficulty: 'iniciante'
        },
        {
          name: 'Avanço caminhando',
          difficulty: 'intermediário'
        },
        {
          name: 'Avanço reverso',
          difficulty: 'iniciante'
        },
        {
          name: 'Avanço lateral',
          difficulty: 'intermediário'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
      imageUrl: '/images/exercises/lunges.jpg',
    },
    {
      id: 'dips',
      name: 'Mergulho',
      category: 'peito',
      primaryMuscles: ['peitoral', 'tríceps', 'ombros anteriores'],
      secondaryMuscles: ['core'],
      equipment: ['barras paralelas'],
      difficulty: 'intermediário',
      description: 'O mergulho é um exercício de peso corporal que trabalha principalmente o peitoral e o tríceps. É excelente para desenvolver força na parte superior do corpo e definição muscular.',
      instructions: [
        'Segure-se nas barras paralelas com os braços estendidos',
        'Incline o tronco ligeiramente para frente para focar mais no peitoral (ou mantenha-o reto para focar mais no tríceps)',
        'Desça o corpo flexionando os cotovelos até que os ombros estejam alinhados ou ligeiramente abaixo dos cotovelos',
        'Pressione as barras para estender os braços e retornar à posição inicial',
        'Mantenha os ombros afastados das orelhas durante todo o movimento'
      ],
      tips: [
        'Não desça demais para evitar estresse excessivo nos ombros',
        'Mantenha os cotovelos próximos ao corpo para reduzir o estresse nos ombros',
        'Controle o movimento durante a descida',
        'Se for muito difícil, comece com variações assistidas'
      ],
      variations: [
        {
          name: 'Mergulho assistido (com elástico ou máquina)',
          difficulty: 'iniciante'
        },
        {
          name: 'Mergulho no banco',
          difficulty: 'iniciante'
        },
        {
          name: 'Mergulho com peso adicional',
          difficulty: 'avançado'
        },
        {
          name: 'Mergulho entre anéis',
          difficulty: 'avançado'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As',
      imageUrl: '/images/exercises/dips.jpg',
    },
    {
      id: 'bicep-curl',
      name: 'Rosca Direta',
      category: 'braços',
      primaryMuscles: ['bíceps'],
      secondaryMuscles: ['antebraços'],
      equipment: ['halteres', 'barra'],
      difficulty: 'iniciante',
      description: 'A rosca direta é um exercício de isolamento que trabalha especificamente o bíceps. É um dos exercícios mais populares para desenvolver os músculos da parte anterior do braço.',
      instructions: [
        'Fique em pé com os pés na largura dos quadris',
        'Segure os halteres com os braços estendidos ao lado do corpo e as palmas voltadas para frente',
        'Mantenha os cotovelos próximos ao tronco durante todo o movimento',
        'Flexione os cotovelos e levante os halteres em direção aos ombros',
        'Contraia o bíceps no topo do movimento',
        'Desça os halteres controladamente até a posição inicial'
      ],
      tips: [
        'Evite balançar o corpo para gerar impulso',
        'Mantenha os cotovelos fixos ao lado do corpo',
        'Controle o movimento na fase excêntrica (descida)',
        'Concentre-se na contração do bíceps, não apenas em mover o peso'
      ],
      variations: [
        {
          name: 'Rosca martelo',
          difficulty: 'iniciante'
        },
        {
          name: 'Rosca concentrada',
          difficulty: 'iniciante'
        },
        {
          name: 'Rosca Scott',
          difficulty: 'intermediário'
        },
        {
          name: 'Rosca 21s',
          difficulty: 'intermediário'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
      imageUrl: '/images/exercises/bicep-curl.jpg',
    },
    {
      id: 'tricep-extension',
      name: 'Extensão de Tríceps',
      category: 'braços',
      primaryMuscles: ['tríceps'],
      secondaryMuscles: [],
      equipment: ['corda', 'barra', 'halteres'],
      difficulty: 'iniciante',
      description: 'A extensão de tríceps é um exercício de isolamento focado no desenvolvimento dos músculos posteriores do braço. É eficaz para definir e fortalecer o tríceps.',
      instructions: [
        'Fixe uma corda na polia alta da máquina de cabos',
        'Fique de frente para a máquina com os pés na largura dos quadris',
        'Segure a corda com ambas as mãos e posicione os cotovelos dobrados próximos ao corpo',
        'Mantenha os cotovelos fixos e estenda os antebraços para baixo',
        'Contraia o tríceps no ponto de extensão máxima',
        'Retorne lentamente à posição inicial'
      ],
      tips: [
        'Mantenha os cotovelos fixos ao lado do corpo durante todo o movimento',
        'Concentre-se em mover apenas o antebraço',
        'Controle o movimento na fase excêntrica (retorno)',
        'Não use impulso ou balance o corpo'
      ],
      variations: [
        {
          name: 'Extensão de tríceps com halteres sobre a cabeça',
          difficulty: 'iniciante'
        },
        {
          name: 'Mergulho para tríceps no banco',
          difficulty: 'iniciante'
        },
        {
          name: 'Extensão de tríceps na polia com barra reta',
          difficulty: 'iniciante'
        },
        {
          name: 'Kickback de tríceps',
          difficulty: 'iniciante'
        }
      ],
      videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU',
      imageUrl: '/images/exercises/tricep-extension.jpg',
    }
  ];
  
  export default exercisesData;
  