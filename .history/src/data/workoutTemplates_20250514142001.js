// src/data/workoutTemplates.js
const workoutTemplates = [
    {
      id: 'template-1',
      title: 'Treino de Peito e Tríceps',
      description: 'Foco em desenvolvimento de peito e tríceps',
      type: 'Peito/Tríceps',
      exercises: [
        {
          id: 'ex-1',
          name: 'Supino Reto',
          sets: 4,
          reps: '8-12',
          rest: 90,
          instructions: 'Mantenha os cotovelos em ângulo de 90 graus'
        },
        {
          id: 'ex-2',
          name: 'Supino Inclinado',
          sets: 3,
          reps: '10-12',
          rest: 90,
          instructions: 'Foco na parte superior do peito'
        },
        {
          id: 'ex-3',
          name: 'Crucifixo com Halteres',
          sets: 3,
          reps: '12-15',
          rest: 60,
          instructions: 'Mantenha um leve dobra nos cotovelos'
        },
        {
          id: 'ex-4',
          name: 'Tríceps Corda',
          sets: 4,
          reps: '12-15',
          rest: 60,
          instructions: 'Mantenha os cotovelos junto ao corpo'
        },
        {
          id: 'ex-5',
          name: 'Tríceps Francês',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: 'Controle o movimento na descida'
        }
      ]
    },
    {
      id: 'template-2',
      title: 'Treino de Costas e Bíceps',
      description: 'Foco em desenvolvimento de costas e bíceps',
      type: 'Costas/Bíceps',
      exercises: [
        {
          id: 'ex-6',
          name: 'Puxada Frontal',
          sets: 4,
          reps: '8-12',
          rest: 90,
          instructions: 'Puxe a barra até a altura do queixo'
        },
        {
          id: 'ex-7',
          name: 'Remada Curvada',
          sets: 4,
          reps: '8-12',
          rest: 90,
          instructions: 'Mantenha as costas retas e puxe até o abdômen'
        },
        {
          id: 'ex-8',
          name: 'Pulldown',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: 'Foco na contração das costas'
        },
        {
          id: 'ex-9',
          name: 'Rosca Direta',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: 'Mantenha os cotovelos junto ao corpo'
        },
        {
          id: 'ex-10',
          name: 'Rosca Martelo',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: 'Alterne os braços durante o exercício'
        }
      ]
    },
    {
      id: 'template-3',
      title: 'Treino de Pernas',
      description: 'Foco em desenvolvimento de quadríceps, posterior e glúteos',
      type: 'Pernas',
      exercises: [
        {
          id: 'ex-11',
          name: 'Agachamento',
          sets: 4,
          reps: '8-12',
          rest: 120,
          instructions: 'Mantenha os joelhos alinhados com os pés'
        },
        {
          id: 'ex-12',
          name: 'Leg Press',
          sets: 4,
          reps: '10-12',
          rest: 90,
          instructions: 'Não trave os joelhos no topo do movimento'
        },
        {
          id: 'ex-13',
          name: 'Cadeira Extensora',
          sets: 3,
          reps: '12-15',
          rest: 60,
          instructions: 'Foco na contração do quadríceps'
        },
        {
          id: 'ex-14',
          name: 'Mesa Flexora',
          sets: 3,
          reps: '12-15',
          rest: 60,
          instructions: 'Controle o movimento na descida'
        },
        {
          id: 'ex-15',
          name: 'Elevação Pélvica',
          sets: 3,
          reps: '15-20',
          rest: 60,
          instructions: 'Foco na contração dos glúteos'
        }
      ]
    },
    {
      id: 'template-4',
      title: 'Treino de Ombros',
      description: 'Foco em desenvolvimento de ombros',
      type: 'Ombros',
      exercises: [
        {
          id: 'ex-16',
          name: 'Desenvolvimento com Halteres',
          sets: 4,
          reps: '8-12',
          rest: 90,
          instructions: 'Mantenha o core estabilizado'
        },
        {
          id: 'ex-17',
          name: 'Elevação Lateral',
          sets: 4,
          reps: '10-15',
          rest: 60,
          instructions: 'Mantenha um leve dobra nos cotovelos'
        },
        {
          id: 'ex-18',
          name: 'Elevação Frontal',
          sets: 3,
          reps: '10-15',
          rest: 60,
          instructions: 'Alterne os braços durante o exercício'
        },
        {
          id: 'ex-19',
          name: 'Remada Alta',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: 'Puxe os cotovelos para cima'
        },
        {
          id: 'ex-20',
          name: 'Face Pull',
          sets: 3,
          reps: '12-15',
          rest: 60,
          instructions: 'Foco na parte posterior dos ombros'
        }
      ]
    },
    {
      id: 'template-5',
      title: 'Treino Fullbody',
      description: 'Treino completo para todo o corpo',
      type: 'Fullbody',
      exercises: [
        {
          id: 'ex-21',
          name: 'Agachamento',
          sets: 3,
          reps: '10-12',
          rest: 90,
          instructions: 'Mantenha os joelhos alinhados com os pés'
        },
        {
          id: 'ex-22',
          name: 'Supino Reto',
          sets: 3,
          reps: '10-12',
          rest: 90,
          instructions: 'Mantenha os cotovelos em ângulo de 90 graus'
        },
        {
          id: 'ex-23',
          name: 'Puxada Frontal',
          sets: 3,
          reps: '10-12',
          rest: 90,
          instructions: 'Puxe a barra até a altura do queixo'
        },
        {
          id: 'ex-24',
          name: 'Desenvolvimento com Halteres',
          sets: 3,
          reps: '10-12',
          rest: 60,
          instructions: 'Mantenha o core estabilizado'
        },
        {
          id: 'ex-25',
          name: 'Rosca Direta',
          sets: 2,
          reps: '12-15',
          rest: 60,
          instructions: 'Mantenha os cotovelos junto ao corpo'
        },
        {
          id: 'ex-26',
          name: 'Tríceps Corda',
          sets: 2,
          reps: '12-15',
          rest: 60,
          instructions: 'Mantenha os cotovelos junto ao corpo'
        }
      ]
    }
  ];
  
  export default workoutTemplates;
  