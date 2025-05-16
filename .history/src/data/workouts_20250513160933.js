const workouts = [
  {
    id: 1,
    name: "Treino de Peito",
    description: "Supino reto, inclinado e flexoes",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
    exercises: [
      { name: "Supino Reto", sets: 4, reps: "10-12", rest: "60s" },
      { name: "Supino Inclinado", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Crossover", sets: 3, reps: "12-15", rest: "45s" },
      { name: "Flexoes", sets: 3, reps: "Até a falha", rest: "60s" }
    ]
  },
  {
    id: 2,
    name: "Treino de Pernas",
    description: "Agachamento livre e leg press",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    exercises: [
      { name: "Agachamento Livre", sets: 4, reps: "8-10", rest: "90s" },
      { name: "Leg Press", sets: 4, reps: "10-12", rest: "60s" },
      { name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: "45s" },
      { name: "Cadeira Flexora", sets: 3, reps: "12-15", rest: "45s" }
    ]
  },
  {
    id: 3,
    name: "Treino de Costas",
    description: "Barra fixa e remada curvada",
    image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&q=80&w=800",
    exercises: [
      { name: "Barra Fixa", sets: 4, reps: "Até a falha", rest: "90s" },
      { name: "Remada Curvada", sets: 4, reps: "10-12", rest: "60s" },
      { name: "Puxada Alta", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Remada Unilateral", sets: 3, reps: "10-12 (cada lado)", rest: "45s" }
    ]
  },
];

export default workouts;
