// src/data/workoutData.js
export const workoutTemplates = [
    {
      id: 'peito-triceps',
      name: 'Peito + Tríceps',
      exercises: [
        { name: 'Supino Reto', sets: 4, reps: '10-12', rest: 60 },
        { name: 'Crucifixo', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Supino Inclinado', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Tríceps Corda', sets: 4, reps: '12-15', rest: 45 },
        { name: 'Tríceps Francês', sets: 3, reps: '10-12', rest: 45 },
        { name: 'Mergulho no Banco', sets: 3, reps: '12-15', rest: 45 }
      ]
    },
    {
      id: 'biceps-ombro',
      name: 'Bíceps + Ombro',
      exercises: [
        { name: 'Rosca Direta', sets: 4, reps: '10-12', rest: 60 },
        { name: 'Rosca Alternada', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Rosca Concentrada', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Desenvolvimento', sets: 4, reps: '10-12', rest: 60 },
        { name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Elevação Frontal', sets: 3, reps: '12-15', rest: 45 }
      ]
    },
    {
      id: 'perna-costas',
      name: 'Perna + Costas',
      exercises: [
        { name: 'Agachamento', sets: 4, reps: '10-12', rest: 90 },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: 90 },
        { name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Puxada Frontal', sets: 4, reps: '10-12', rest: 60 },
        { name: 'Remada Curvada', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Pulldown', sets: 3, reps: '12-15', rest: 60 }
      ]
    }
  ];
  