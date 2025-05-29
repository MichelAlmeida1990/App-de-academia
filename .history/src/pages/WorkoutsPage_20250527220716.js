// src/pages/WorkoutsPage.js (versão sugerida com melhorias de layout e conteúdo)
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
// Importe os ícones que você já usa, ou adicione outros que achar interessante
import { FiPlus, FiCalendar, FiClock, FiActivity, FiList, FiTrendingUp } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EmptyState from '../components/ui/EmptyState';

const WorkoutsPage = () => {
  const { workouts, loading } = useContext(WorkoutContext);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!workouts || !Array.isArray(workouts)) {
        setFilteredWorkouts([]);
        return;
      }

      let result = [...workouts];

      if (filter !== 'all') {
        result = result.filter(workout => workout && workout.type === filter);
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(workout => 
          workout && 
          ((workout.name && workout.name.toLowerCase().includes(term)) || 
            (workout.notes && workout.notes.toLowerCase().includes(term)))
        );
      }

      result.sort((a, b) => {
        if (!a || !b) return 0;
        
        switch (sortBy) {
          case 'date':
            return new Date(b.date || 0) - new Date(a.date || 0);
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'duration':
            return (b.duration || 0) - (a.duration || 0);
          default:
            return 0;
        }
      });

      setFilteredWorkouts(result);
    } catch (err) {
      console.error("Erro ao processar workouts:", err);
      setError("Ocorreu um erro ao processar seus treinos");
      setFilteredWorkouts([]);
    }
  }, [workouts, filter, searchTerm, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return '';
    }
  };

  const getWorkoutTypeColor = (type) => {
    if (!type) return 'bg-gray-500';
    
    switch (type.toLowerCase()) {
      case 'força': return 'bg-red-500';
      case 'hipertrofia': return 'bg-blue-500';
      case 'resistência': return 'bg-green-500';
      case 'cardio': return 'bg-orange-500';
      default: return 'bg-purple-500';
    }
  };

  // --- Nova Lógica para Estatísticas Rápidas ---
  const totalWorkouts = workouts?.length || 0;
  const lastWorkoutDate = workouts && workouts.length > 0 
    ? formatDate(workouts[0].date) 
    : 'Nenhum'; // Assume que 'workouts' já está ordenado por data descendente ou pegamos o mais recente
  const totalExercises = workouts?.reduce((acc, workout) => acc + (workout.exercises?.length || 0), 0) || 0;
  // --- Fim da Nova Lógica ---

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Carregando treinos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Treinos</h1>
        <Link 
          to="/workout/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <FiPlus className="mr-2" />
          Novo Treino
        </Link>
      </div>

      {/* Seção de Visão Geral/Estatísticas Rápidas */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm flex items-center">
            <FiList className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">Total de Treinos</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm flex items-center">
            <FiClock className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">Último Treino</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{lastWorkoutDate}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm flex items-center">
            <FiActivity className="text-purple-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">Total de Exercícios</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalExercises}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Fim da Seção de Visão Geral */}

      {/* Filtros e busca (mantidos como estão) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 border border-gray-200 dark:border-gray-700"> {/* Adicionado borda */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar treinos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" // Melhoria visual no input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2"> {/* Alterado para flex-col em telas pequenas, flex-row em sm+ */}
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" // Melhoria visual no select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todos os tipos</option>
              <option value="força">Força</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="resistência">Resistência</option>
              <option value="cardio">Cardio</option>
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" // Melhoria visual no select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Mais recentes</option>
              <option value="name">Nome</option>
              <option value="duration">Duração</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de treinos */}
      {filteredWorkouts && filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"> {/* Adicionado xl:grid-cols-4 e items-stretch */}
          {filteredWorkouts.map((workout) => (
            workout && workout.id ? (
              <Link 
                key={workout.id} 
                to={`/workout/${workout.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col" // Adicionado h-full e flex flex-col
              >
                <div className="p-6 flex-grow flex flex-col"> {/* flex-grow para que o conteúdo ocupe o espaço */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{workout.name || 'Treino sem nome'}</h2>
                    <span className={`${getWorkoutTypeColor(workout.type)} text-white text-xs py-1 px-2 rounded-full font-medium`}> {/* py-1 px-3 e rounded-full para um visual mais clean */}
                      {workout.type || 'Geral'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2 text-sm"> {/* Ajuste de tamanho da fonte */}
                    <FiCalendar className="mr-2 text-lg" /> {/* Ícone maior */}
                    <span>{formatDate(workout.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2 text-sm"> {/* Ajuste de tamanho da fonte */}
                    <FiClock className="mr-2 text-lg" /> {/* Ícone maior */}
                    <span>{workout.duration || 0} minutos</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-auto text-sm"> {/* mt-auto para empurrar para o final do card, ajuste de tamanho da fonte */}
                    <FiActivity className="mr-2 text-lg" /> {/* Ícone maior */}
                    <span>{workout.exercises?.length || 0} exercícios</span>
                  </div>
                </div>
              </Link>
            ) : null
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Nenhum treino encontrado" 
          description="Você ainda não tem treinos registrados ou nenhum treino corresponde aos filtros aplicados."
          actionLink="/workout/new"
          actionText="Criar Novo Treino"
        />
      )}
    </div>
  );
};

export default WorkoutsPage;

