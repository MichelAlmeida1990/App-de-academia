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

  const removeExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!workoutData.name) {
      showToast('Erro', 'Por favor, dê um nome ao seu treino', 'error');
      return;
    }
    
    if (workoutData.exercises.length === 0) {
      showToast('Erro', 'Adicione pelo menos um exercício ao treino', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      console.log("Enviando dados para criação de treino:", workoutData);
      
      // Adicionar treino com o contexto
      const newWorkout = await addWorkout({
        ...workoutData,
        // Garantir que todos os campos necessários estejam presentes
        date: workoutData.date || new Date().toISOString().split('T')[0],
        type: workoutData.type || 'hipertrofia',
        duration: workoutData.duration || 60,
        image: workoutData.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      });
      
      console.log("Treino criado com sucesso:", newWorkout);
      
      // Verificar se o ID existe antes de redirecionar
      if (newWorkout && newWorkout.id) {
        showToast('Sucesso', 'Treino criado com sucesso!', 'success');
        console.log("Redirecionando para:", `/workout/${newWorkout.id}`);
        navigate(`/workout/${newWorkout.id}`);
      } else {
        throw new Error("Treino criado sem ID válido");
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      showToast('Erro', `Não foi possível criar o treino: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/workouts')}
          className="mr-4 text-blue-500 hover:text-blue-700"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Novo Treino</h1>
      </div>

      {/* Seleção de Template */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Escolha um Modelo de Treino</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Modelo de Treino
            </label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione um modelo ou crie do zero</option>
              <option value="a">Treino A - Peito e Tríceps</option>
              <option value="b">Treino B - Costas e Bíceps</option>
              <option value="c">Treino C - Pernas</option>
              <option value="d">Treino D - Ombros e Abdômen</option>
              <option value="push">Treino Push (Empurrar)</option>
              <option value="pull">Treino Pull (Puxar)</option>
              <option value="legs">Treino Legs (Pernas)</option>
              <option value="fullbody">Treino Full Body</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecione um modelo pré-definido ou personalize seu próprio treino abaixo.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Nome do Treino
          </label>
          <input
            type="text"
            name="name"
            value={workoutData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ex: Treino A - Peito e Tríceps"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Tipo de Treino
            </label>
            <select
              name="type"
              value={workoutData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="hipertrofia">Hipertrofia</option>
              <option value="força">Força</option>
              <option value="resistência">Resistência</option>
              <option value="cardio">Cardio</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={workoutData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={workoutData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
            placeholder="Descrição opcional do treino"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Duração Estimada (minutos)
          </label>
          <input
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="1"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Exercícios</h2>
          
          {workoutData.exercises.length > 0 ? (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2">Exercício</th>
                    <th className="text-center py-2">Séries</th>
                    <th className="text-center py-2">Repetições</th>
                    <th className="text-center py-2">Descanso</th>
                    <th className="text-center py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutData.exercises.map((exercise, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
                      <td className="py-3 font-medium">{exercise.name}</td>
                      <td className="py-3 text-center">{exercise.sets}</td>
                      <td className="py-3 text-center">{exercise.reps}</td>
                      <td className="py-3 text-center">{exercise.rest}s</td>
                      <td className="py-3 text-center">
                        <button 
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">Nenhum exercício adicionado</p>
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Adicionar Exercício</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium mb-1">Nome do Exercício</label>
                <div className="flex">
                  <input
                    type="text"
                    name="name"
                    value={currentExercise.name}
                    onChange={handleExerciseChange}
                    className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Ex: Supino Reto"
                  />
                  <button
                    type="button"
                    onClick={() => setShowExerciseSelector(!showExerciseSelector)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-lg"
                  >
                    <FiList />
                  </button>
                </div>
                
                {/* Seletor de Exercícios */}
                {showExerciseSelector && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <select 
                        value={selectedMuscleGroup}
                        onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {Object.keys(exercisesByMuscleGroup).map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {exercisesByMuscleGroup[selectedMuscleGroup].map((exercise, index) => (
                        <div 
                          key={index}
                          onClick={() => selectExerciseFromList(exercise)}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          {exercise}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Séries</label>
                <input
                  type="number"
                  name="sets"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Repetições</label>
                <input
                  type="number"
                  name="reps"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                />
              </div>
            </div>
            <div className="flex items-end">
                <button
                  type="button"
                  onClick={addExercise}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition flex items-center"
                  disabled={!currentExercise.name}
                >
                  <FiPlus className="mr-2" />
                  Adicionar Exercício
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg flex items-center transition"
            disabled={isSubmitting}
          >
            <FiSave className="mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Treino'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWorkoutPage;
