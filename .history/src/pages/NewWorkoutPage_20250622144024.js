import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import { useToast } from '../context/ToastContext';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiList, FiX, FiClock, FiCalendar } from 'react-icons/fi';
import { FaDumbbell } from 'react-icons/fa';
import workoutTemplates from '../data/workoutTemplates.js';

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

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const { addWorkout } = useContext(WorkoutContext);
  const { showToast } = useToast();
  
  console.log('Templates disponíveis:', workoutTemplates); // Debug

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
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: 3,
    reps: 12,
    rest: 60
  });

  // Estado para controlar as sugestões de treino
  const [suggestedWorkouts, setSuggestedWorkouts] = useState([]);
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  // Inicializar sugestões de treino (um de cada tipo)
  useEffect(() => {
    const types = ['hipertrofia', 'forca', 'resistencia', 'cardio'];
    const suggestions = types.map(type => {
      const templatesOfType = workoutTemplates.filter(t => t.type === type);
      return templatesOfType[Math.floor(Math.random() * templatesOfType.length)];
    }).filter(Boolean);
    
    setSuggestedWorkouts(suggestions);
  }, []);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = workoutTemplates.find(t => t.id === templateId);
      if (template) {
        setWorkoutData({
          name: template.title,
          type: template.type,
          description: template.description,
          date: workoutData.date,
          duration: 60,
          exercises: template.exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest
          })),
          image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        });
      }
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

  const removeExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Melhor validação e mensagens de erro mais claras
    if (!workoutData.name.trim()) {
      showToast('Erro', 'Digite o nome do treino', 'error');
      return;
    }
    
    // Permitir criar treinos mesmo sem exercícios (o usuário pode adicionar depois)
    if (workoutData.exercises.length === 0) {
      const confirmCreate = window.confirm(
        'Você está criando um treino sem exercícios. Deseja continuar? Você pode adicionar exercícios depois.'
      );
      if (!confirmCreate) {
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      // Preparar os exercícios com o formato correto
      const formattedExercises = workoutData.exercises.map((exercise, index) => ({
        id: index,
        name: exercise.name,
        sets: Array.isArray(exercise.sets) ? exercise.sets : Array(exercise.sets).fill(null).map(() => ({
          reps: exercise.reps,
          weight: 0,
          rest: exercise.rest,
          completed: false
        })),
        completed: false,
        currentSet: 0
      }));
      
      // Criar o treino com os exercícios formatados
      const newWorkout = {
        ...workoutData,
        exercises: formattedExercises,
        createdAt: new Date().toISOString(),
        progress: 0,
        completed: false
      };
      
      console.log('Criando treino:', newWorkout); // Debug
      
      await addWorkout(newWorkout);
      showToast('Sucesso', 'Treino criado com sucesso!', 'success');
      navigate('/workouts');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      showToast('Erro', 'Erro ao criar treino. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/workouts')}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Novo Treino</h1>
          <div className="w-6" /> {/* Espaçador */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas do Treino - SEMPRE VISÍVEL */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações do Treino
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Treino *
                </label>
                <input
                  type="text"
                  name="name"
                  value={workoutData.name}
                  onChange={handleChange}
                  placeholder="Ex: Treino de Peito, Cardio Matinal..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Treino
                </label>
                <select
                  name="type"
                  value={workoutData.type}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                >
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="forca">Força</option>
                  <option value="resistencia">Resistência</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={workoutData.description}
                  onChange={handleChange}
                  placeholder="Descreva o objetivo do seu treino..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Exercícios do Treino - SEMPRE VISÍVEL */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Exercícios do Treino
              </h2>
              <button
                type="button"
                onClick={() => setShowExerciseSelector(true)}
                className="flex items-center text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <FiPlus className="mr-1" />
                Adicionar Exercício
              </button>
            </div>

            <div className="space-y-3">
              {workoutData.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-3">
                        <FaDumbbell className="mr-1" />
                        {exercise.sets} séries
                      </span>
                      <span className="flex items-center mr-3">
                        <FiList className="mr-1" />
                        {exercise.reps} reps
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" />
                        {exercise.rest}s
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newExercises = [...workoutData.exercises];
                      newExercises.splice(index, 1);
                      setWorkoutData({ ...workoutData, exercises: newExercises });
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}

              {workoutData.exercises.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <FiList className="mx-auto mb-2 w-8 h-8" />
                  <p className="font-medium">Nenhum exercício adicionado</p>
                  <p className="text-sm mt-1">Clique em "Adicionar Exercício" para começar</p>
                  <p className="text-xs mt-2 text-gray-400">Ou escolha um template abaixo</p>
                </div>
              )}
            </div>
          </div>

          {/* Seleção de Template - OPCIONAL */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📋 Templates de Treino (Opcional)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Escolha um template pronto ou crie seu treino personalizado
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  {showAllTemplates ? 'Mostrar apenas sugestões' : 'Ver todos os templates'}
                </button>
              </div>
            </div>
          </div>

          {/* Grid de Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllTemplates ? workoutTemplates : suggestedWorkouts).map((template) => (
              <div
                key={template.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 ${
                  selectedTemplate === template.id
                    ? 'border-purple-500'
                    : 'border-transparent'
                }`}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setWorkoutData({
                    ...workoutData,
                    name: workoutData.name || template.title,
                    type: template.type,
                    description: workoutData.description || template.description,
                    exercises: template.exercises.map(ex => ({
                      name: ex.name,
                      sets: ex.sets,
                      reps: ex.reps,
                      rest: ex.rest
                    }))
                  });
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {template.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm rounded-full">
                      {template.type}
                    </span>
                    {!showAllTemplates && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSuggestedWorkouts(prev => 
                            prev.filter(t => t.id !== template.id)
                          );
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {template.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-4 flex items-center">
                    <FaDumbbell className="mr-1" />
                    {template.exercises.length} exercícios
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" />
                    {Math.ceil(template.exercises.reduce((total, ex) => total + (ex.sets * ex.rest), 0) / 60)} min
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/workouts')}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando...' : 'Criar Treino'}
            </button>
          </div>
        </form>

        {/* Modal de Seleção de Exercício */}
        {showExerciseSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Adicionar Exercício
                  </h2>
                  <button
                    onClick={() => setShowExerciseSelector(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Seleção de Grupo Muscular */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grupo Muscular
                  </label>
                  <select
                    value={selectedMuscleGroup}
                    onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                  >
                    {Object.keys(exercisesByMuscleGroup).map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* Lista de Exercícios */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {exercisesByMuscleGroup[selectedMuscleGroup].map((exercise) => (
                    <button
                      key={exercise}
                      type="button"
                      onClick={() => {
                        setCurrentExercise({ ...currentExercise, name: exercise });
                        setShowExerciseSelector(false);
                      }}
                      className="text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {exercise}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configuração do Exercício */}
        {currentExercise.name && !showExerciseSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configurar Exercício
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Séries
                    </label>
                    <input
                      type="number"
                      value={currentExercise.sets}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Repetições
                    </label>
                    <input
                      type="number"
                      value={currentExercise.reps}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descanso (segundos)
                    </label>
                    <input
                      type="number"
                      value={currentExercise.rest}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, rest: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                      min="0"
                      step="15"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentExercise({ name: '', sets: 3, reps: 12, rest: 60 })}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkoutData({
                        ...workoutData,
                        exercises: [...workoutData.exercises, currentExercise]
                      });
                      setCurrentExercise({ name: '', sets: 3, reps: 12, rest: 60 });
                    }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewWorkoutPage;
