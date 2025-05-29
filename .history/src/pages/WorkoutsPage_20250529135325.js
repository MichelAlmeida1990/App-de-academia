// src/pages/WorkoutsPage.js
import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaCalendar, 
  FaClock, 
  FaHeartbeat, // Substitui FaActivity
  FaList, 
  FaTrendingUp,
  FaSearch,
  FaFilter,
  FaSort,
  FaDumbbell,
  FaFire,
  FaHeart,
  FaRunning,
  FaPlay,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartLine
} from 'react-icons/fa';

// Dados mockados de treinos
const MOCK_WORKOUTS = [
  {
    id: 1,
    name: 'Treino de Peito e Tríceps',
    type: 'hipertrofia',
    date: '2025-05-29T10:30:00Z',
    duration: 65,
    exercises: [
      { id: 1, name: 'Supino Reto', sets: 4, reps: 12 },
      { id: 2, name: 'Supino Inclinado', sets: 3, reps: 10 },
      { id: 3, name: 'Crucifixo', sets: 3, reps: 15 },
      { id: 4, name: 'Tríceps Testa', sets: 3, reps: 12 },
      { id: 5, name: 'Tríceps Pulley', sets: 3, reps: 15 }
    ],
    calories: 320,
    notes: 'Treino intenso, foquei na conexão mente-músculo',
    completed: true
  },
  {
    id: 2,
    name: 'Treino de Costas e Bíceps',
    type: 'hipertrofia',
    date: '2025-05-27T14:15:00Z',
    duration: 70,
    exercises: [
      { id: 6, name: 'Puxada Frontal', sets: 4, reps: 12 },
      { id: 7, name: 'Remada Curvada', sets: 4, reps: 10 },
      { id: 8, name: 'Pulldown', sets: 3, reps: 12 },
      { id: 9, name: 'Rosca Direta', sets: 3, reps: 12 },
      { id: 10, name: 'Rosca Martelo', sets: 3, reps: 15 }
    ],
    calories: 350,
    notes: 'Excelente treino, senti bem o trabalho nas costas',
    completed: true
  },
  {
    id: 3,
    name: 'Treino de Pernas',
    type: 'força',
    date: '2025-05-25T16:00:00Z',
    duration: 80,
    exercises: [
      { id: 11, name: 'Agachamento', sets: 4, reps: 8 },
      { id: 12, name: 'Leg Press', sets: 4, reps: 12 },
      { id: 13, name: 'Cadeira Extensora', sets: 3, reps: 15 },
      { id: 14, name: 'Mesa Flexora', sets: 3, reps: 12 },
      { id: 15, name: 'Panturrilha', sets: 4, reps: 20 }
    ],
    calories: 420,
    notes: 'Treino pesado, aumentei a carga no agachamento',
    completed: true
  },
  {
    id: 4,
    name: 'Cardio HIIT',
    type: 'cardio',
    date: '2025-05-23T07:30:00Z',
    duration: 30,
    exercises: [
      { id: 16, name: 'Burpees', sets: 5, reps: 10 },
      { id: 17, name: 'Mountain Climbers', sets: 5, reps: 20 },
      { id: 18, name: 'Jumping Jacks', sets: 5, reps: 30 },
      { id: 19, name: 'High Knees', sets: 5, reps: 20 }
    ],
    calories: 280,
    notes: 'Treino matinal energizante, ótimo para queimar gordura',
    completed: true
  },
  {
    id: 5,
    name: 'Treino de Ombros',
    type: 'hipertrofia',
    date: '2025-05-21T18:45:00Z',
    duration: 55,
    exercises: [
      { id: 20, name: 'Desenvolvimento', sets: 4, reps: 10 },
      { id: 21, name: 'Elevação Lateral', sets: 4, reps: 12 },
      { id: 22, name: 'Elevação Frontal', sets: 3, reps: 12 },
      { id: 23, name: 'Encolhimento', sets: 3, reps: 15 }
    ],
    calories: 250,
    notes: 'Foco na definição dos ombros',
    completed: true
  },
  {
    id: 6,
    name: 'Treino Funcional',
    type: 'resistência',
    date: '2025-05-19T15:20:00Z',
    duration: 45,
    exercises: [
      { id: 24, name: 'Flexões', sets: 3, reps: 15 },
      { id: 25, name: 'Prancha', sets: 3, reps: 60 },
      { id: 26, name: 'Agachamento Livre', sets: 3, reps: 20 },
      { id: 27, name: 'Abdominais', sets: 3, reps: 25 }
    ],
    calories: 200,
    notes: 'Treino em casa, sem equipamentos',
    completed: true
  }
];

// Componente de Card de Estatística
const StatCard = ({ icon, title, value, color = 'purple' }) => {
  const colorClasses = {
    purple: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    green: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    orange: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Treino
const WorkoutCard = ({ workout, onView, onEdit, onDelete, onStart }) => {
  const getWorkoutTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'força': return 'bg-red-500';
      case 'hipertrofia': return 'bg-purple-500';
      case 'resistência': return 'bg-green-500';
      case 'cardio': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getWorkoutTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'força': return <FaDumbbell />;
      case 'hipertrofia': return <FaFire />;
      case 'resistência': return <FaHeart />;
      case 'cardio': return <FaRunning />;
      default: return <FaHeartbeat />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    if (diffDays <= 30) return `${Math.floor((diffDays - 1) / 7)} semanas atrás`;
    return `${Math.floor((diffDays - 1) / 30)} meses atrás`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
      {/* Header do Card */}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
            {workout.name}
          </h3>
          <div className={`${getWorkoutTypeColor(workout.type)} text-white p-2 rounded-lg flex items-center justify-center`}>
            {getWorkoutTypeIcon(workout.type)}
          </div>
        </div>

        {/* Tipo e Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`${getWorkoutTypeColor(workout.type)} text-white text-xs py-1 px-3 rounded-full font-medium uppercase tracking-wide`}>
            {workout.type}
          </span>
          {workout.completed && (
            <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full font-medium">
              Concluído
            </span>
          )}
        </div>

        {/* Informações do Treino */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <FaCalendar className="mr-3 text-purple-500" />
            <span>{formatDate(workout.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <FaClock className="mr-3 text-purple-500" />
            <span>{workout.duration} minutos</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <FaHeartbeat className="mr-3 text-purple-500" />
            <span>{workout.exercises?.length || 0} exercícios</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <FaFire className="mr-3 text-orange-500" />
            <span>{workout.calories} calorias</span>
          </div>
        </div>

        {/* Notas */}
        {workout.notes && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {workout.notes}
            </p>
          </div>
        )}
      </div>

      {/* Ações do Card */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2">
          <button
            onClick={() => onStart(workout)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
          >
            <FaPlay className="mr-2" />
            Iniciar
          </button>
          
          <button
            onClick={() => onView(workout)}
            className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <FaEye />
          </button>
          
          <button
            onClick={() => onEdit(workout)}
            className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <FaEdit />
          </button>
          
          <button
            onClick={() => onDelete(workout)}
            className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Estado Vazio
const EmptyState = ({ title, description, onCreateNew }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
        <FaDumbbell className="text-4xl text-purple-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      <button
        onClick={onCreateNew}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
      >
        <FaPlus className="mr-2" />
        Criar Primeiro Treino
      </button>
    </div>
  );
};

// Componente principal
const WorkoutsPage = ({ onNavigate, onCreateWorkout, onStartWorkout }) => {
  const [workouts, setWorkouts] = useState(MOCK_WORKOUTS);
  const [filteredWorkouts, setFilteredWorkouts] = useState(MOCK_WORKOUTS);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(false);

  // Filtrar e ordenar treinos
  useEffect(() => {
    let result = [...workouts];

    // Filtrar por tipo
    if (filter !== 'all') {
      result = result.filter(workout => workout.type === filter);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(workout => 
        workout.name.toLowerCase().includes(term) || 
        workout.notes?.toLowerCase().includes(term)
      );
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    setFilteredWorkouts(result);
  }, [workouts, filter, searchTerm, sortBy]);

  // Calcular estatísticas
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((acc, workout) => acc + workout.exercises.length, 0);
  const totalCalories = workouts.reduce((acc, workout) => acc + workout.calories, 0);
  const avgDuration = workouts.length > 0 
    ? Math.round(workouts.reduce((acc, workout) => acc + workout.duration, 0) / workouts.length)
    : 0;

  // Handlers
  const handleCreateNew = () => {
    if (onCreateWorkout) {
      onCreateWorkout();
    } else {
      alert('Funcionalidade de criar treino será implementada em breve!');
    }
  };

  const handleViewWorkout = (workout) => {
    if (onNavigate) {
      onNavigate(`/workout/${workout.id}`);
    } else {
      alert(`Visualizar treino: ${workout.name}`);
    }
  };

  const handleEditWorkout = (workout) => {
    if (onNavigate) {
      onNavigate(`/workout/${workout.id}/edit`);
    } else {
      alert(`Editar treino: ${workout.name}`);
    }
  };

  const handleDeleteWorkout = (workout) => {
    if (window.confirm(`Tem certeza que deseja excluir o treino "${workout.name}"?`)) {
      setWorkouts(prev => prev.filter(w => w.id !== workout.id));
    }
  };

  const handleStartWorkout = (workout) => {
    if (onStartWorkout) {
      onStartWorkout(workout);
    } else {
      alert(`Iniciando treino: ${workout.name}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando treinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Meus Treinos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie e acompanhe seus treinos de forma inteligente
            </p>
          </div>
          
          <button 
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus className="mr-2" />
            Novo Treino
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaList className="text-2xl" />}
            title="Total de Treinos"
            value={totalWorkouts}
            color="purple"
          />
          <StatCard
            icon={<FaHeartbeat className="text-2xl" />}
            title="Total de Exercícios"
            value={totalExercises}
            color="blue"
          />
          <StatCard
            icon={<FaFire className="text-2xl" />}
            title="Calorias Queimadas"
            value={`${totalCalories}`}
            color="orange"
          />
          <StatCard
            icon={<FaClock className="text-2xl" />}
            title="Duração Média"
            value={`${avgDuration}min`}
            color="green"
          />
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar treinos por nome ou notas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select 
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer min-w-[160px]"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Todos os tipos</option>
                  <option value="força">Força</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="resistência">Resistência</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              
              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select 
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer min-w-[160px]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Mais recentes</option>
                  <option value="name">Nome A-Z</option>
                  <option value="duration">Duração</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Treinos */}
        {filteredWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onView={handleViewWorkout}
                onEdit={handleEditWorkout}
                onDelete={handleDeleteWorkout}
                onStart={handleStartWorkout}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchTerm || filter !== 'all' ? 'Nenhum treino encontrado' : 'Nenhum treino cadastrado'}
            description={
              searchTerm || filter !== 'all' 
                ? 'Nenhum treino corresponde aos filtros aplicados. Tente ajustar sua busca.'
                : 'Você ainda não tem treinos cadastrados. Que tal criar seu primeiro treino personalizado?'
            }
            onCreateNew={handleCreateNew}
          />
        )}

        {/* Insights */}
        {workouts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-3xl mr-4" />
              <h2 className="text-2xl font-bold">Seus Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{totalWorkouts}</div>
                <div className="text-purple-100">Treinos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{Math.round(totalCalories / totalWorkouts)}</div>
                <div className="text-purple-100">Calorias por Treino</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{Math.round(totalExercises / totalWorkouts)}</div>
                <div className="text-purple-100">Exercícios por Treino</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;
