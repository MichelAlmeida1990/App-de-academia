import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import { useToast } from '../context/ToastContext';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiList } from 'react-icons/fi';

// Lista de exercícios organizados por grupo muscular
const exercisesByMuscleGroup = {
  'Peito': [
    'Supino Reto',
    'Supino Inclinado',
    'Supino Declinado',
    'Crucifixo',
    'Crossover',
    'Supino com Halteres',
    'Flexão de Braço',
    'Peck Deck'
  ],
  'Costas': [
    'Puxada Frontal',
    'Remada Baixa',
    'Remada Curvada',
    'Remada Unilateral',
    'Pulldown',
    'Barra Fixa',
    'Remada Cavalinho',
    'Pullover'
  ],
  'Pernas': [
    'Agachamento',
    'Leg Press',
    'Cadeira Extensora',
    'Mesa Flexora',
    'Cadeira Adutora',
    'Cadeira Abdutora',
    'Stiff',
    'Elevação Pélvica',
    'Avanço',
    'Panturrilha em Pé',
    'Panturrilha Sentado'
  ],
  'Ombros': [
    'Desenvolvimento Militar',
    'Desenvolvimento com Halteres',
    'Elevação Lateral',
    'Elevação Frontal',
    'Face Pull',
    'Encolhimento de Ombros',
    'Remada Alta',
    'Arnold Press'
  ],
  'Bíceps': [
    'Rosca Direta',
    'Rosca Alternada',
    'Rosca Martelo',
    'Rosca Scott',
    'Rosca Concentrada',
    'Rosca 21',
    'Rosca Inversa'
  ],
  'Tríceps': [
    'Tríceps Corda',
    'Tríceps Francês',
    'Tríceps Testa',
    'Mergulho no Banco',
    'Tríceps Coice',
    'Tríceps Pulley',
    'Supino Fechado'
  ],
  'Abdômen': [
    'Abdominal Reto',
    'Abdominal Oblíquo',
    'Prancha',
    'Elevação de Pernas',
    'Abdominal Infra',
    'Russian Twist',
    'Bicicleta'
  ],
  'Cardio': [
    'Esteira',
    'Bicicleta Ergométrica',
    'Elíptico',
    'Corda',
    'Jumping Jack',
    'Burpee',
    'Corrida',
    'HIIT'
  ]
};

// Treinos pré-definidos
const workoutTemplates = {
  'a': {
    name: 'Treino A - Peito e Tríceps',
    type: 'hipertrofia',
    description: 'Foco em peito e tríceps com exercícios compostos e isolados',
    duration: 60,
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 12, rest: 90 },
      { name: 'Supino Inclinado', sets: 3, reps: 12, rest: 90 },
      { name: 'Crucifixo', sets: 3, reps: 15, rest: 60 },
      { name: 'Tríceps Corda', sets: 3, reps: 15, rest: 60 },
      { name: 'Tríceps Francês', sets: 3, reps: 12, rest: 60 },
      { name: 'Mergulho no Banco', sets: 3, reps: 15, rest: 60 }
    ]
  },
  'b': {
    name: 'Treino B - Costas e Bíceps',
    type: 'hipertrofia',
    description: 'Foco em costas e bíceps com exercícios compostos e isolados',
    duration: 60,
    exercises: [
      { name: 'Puxada Frontal', sets: 4, reps: 12, rest: 90 },
      { name: 'Remada Curvada', sets: 4, reps: 12, rest: 90 },
      { name: 'Remada Unilateral', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Direta', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Martelo', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Concentrada', sets: 3, reps: 12, rest: 60 }
    ]
  },
  'c': {
    name: 'Treino C - Pernas',
    type: 'hipertrofia',
    description: 'Treino completo de pernas com foco em quadríceps, posterior e glúteos',
    duration: 70,
    exercises: [
      { name: 'Agachamento', sets: 4, reps: 12, rest: 120 },
      { name: 'Leg Press', sets: 4, reps: 15, rest: 90 },
      { name: 'Cadeira Extensora', sets: 3, reps: 15, rest: 60 },
      { name: 'Mesa Flexora', sets: 3, reps: 12, rest: 60 },
      { name: 'Stiff', sets: 3, reps: 12, rest: 90 },
      { name: 'Panturrilha em Pé', sets: 4, reps: 20, rest: 45 }
    ]
  },
  'd': {
    name: 'Treino D - Ombros e Abdômen',
    type: 'hipertrofia',
    description: 'Foco em desenvolvimento de ombros e fortalecimento do core',
    duration: 50,
    exercises: [
      { name: 'Desenvolvimento com Halteres', sets: 4, reps: 12, rest: 90 },
      { name: 'Elevação Lateral', sets: 4, reps: 15, rest: 60 },
      { name: 'Elevação Frontal', sets: 3, reps: 15, rest: 60 },
      { name: 'Face Pull', sets: 3, reps: 15, rest: 60 },
      { name: 'Abdominal Reto', sets: 3, reps: 20, rest: 45 },
      { name: 'Prancha', sets: 3, reps: '30s', rest: 45 }
    ]
  },
  'push': {
    name: 'Treino Push (Empurrar)',
    type: 'hipertrofia',
    description: 'Treino de empurrar focado em peito, ombros e tríceps',
    duration: 65,
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 10, rest: 90 },
      { name: 'Desenvolvimento Militar', sets: 4, reps: 10, rest: 90 },
      { name: 'Elevação Lateral', sets: 3, reps: 15, rest: 60 },
      { name: 'Supino Inclinado', sets: 3, reps: 12, rest: 90 },
      { name: 'Tríceps Corda', sets: 3, reps: 15, rest: 60 },
      { name: 'Tríceps Testa', sets: 3, reps: 12, rest: 60 }
    ]
  },
  'pull': {
    name: 'Treino Pull (Puxar)',
    type: 'hipertrofia',
    description: 'Treino de puxar focado em costas e bíceps',
    duration: 65,
    exercises: [
      { name: 'Barra Fixa', sets: 4, reps: 'Máximo', rest: 120 },
      { name: 'Remada Baixa', sets: 4, reps: 12, rest: 90 },
      { name: 'Puxada Alta', sets: 3, reps: 12, rest: 90 },
      { name: 'Remada Curvada', sets: 3, reps: 12, rest: 90 },
      { name: 'Rosca Alternada', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Scott', sets: 3, reps: 12, rest: 60 }
    ]
  },
  'legs': {
    name: 'Treino Legs (Pernas)',
    type: 'hipertrofia',
    description: 'Treino completo de pernas',
    duration: 70,
    exercises: [
      { name: 'Agachamento', sets: 5, reps: 10, rest: 120 },
      { name: 'Leg Press', sets: 4, reps: 12, rest: 90 },
      { name: 'Cadeira Extensora', sets: 3, reps: 15, rest: 60 },
      { name: 'Cadeira Flexora', sets: 3, reps: 15, rest: 60 },
      { name: 'Elevação Pélvica', sets: 3, reps: 15, rest: 60 },
      { name: 'Panturrilha Sentado', sets: 4, reps: 20, rest: 45 }
    ]
  },
  'fullbody': {
    name: 'Treino Full Body',
    type: 'hipertrofia',
    description: 'Treino completo para todo o corpo em uma única sessão',
    duration: 80,
    exercises: [
      { name: 'Agachamento', sets: 4, reps: 10, rest: 90 },
      { name: 'Supino Reto', sets: 4, reps: 10, rest: 90 },
      { name: 'Puxada Alta', sets: 4, reps: 10, rest: 90 },
      { name: 'Desenvolvimento', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca Direta', sets: 3, reps: 12, rest: 60 },
      { name: 'Tríceps Corda', sets: 3, reps: 12, rest: 60 },
      { name: 'Abdominal', sets: 3, reps: 20, rest: 45 }
    ]
  }
};

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const { addWorkout } = useContext(WorkoutContext);
  const { showToast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Peito');
  
  const [workoutData, setWorkoutData] = useState({
    name: '',
    type: 'hipertrofia',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    exercises: [],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' // Imagem padrão
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: 3,
    reps: 12,
    rest: 60
  });

  const handleTemplateChange = (e) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);
    
    if (templateKey && workoutTemplates[templateKey]) {
      const template = workoutTemplates[templateKey];
      setWorkoutData({
        ...template,
        date: workoutData.date, // Mantém a data atual
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' // Adiciona imagem padrão
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseInt(value, 10) || 0
    }));
  };

  const selectExerciseFromList = (exerciseName) => {
    setCurrentExercise(prev => ({
      ...prev,
      name: exerciseName
    }));
    setShowExerciseSelector(false);
  };

  const addExercise = () => {
    if (!currentExercise.name) {
      showToast('Erro', 'Digite o nome do exercício', 'error');
      return;
    }
    
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...currentExercise }]
    }));
    
    setCurrentExercise({
      name: '',
      sets: 3,
      reps: 12,
      rest: 60
    });
  };

  const removeExercise = (index) =>
