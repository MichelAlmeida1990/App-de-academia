// src/pages/WorkoutsPage.js (versão corrigida)
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import { FiPlus, FiCalendar, FiClock, FiActivity } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EmptyState from './ui/EmptyState';

const WorkoutsPage = () => {
  const { workouts, loading } = useContext(WorkoutContext);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Garantir que workouts é um array antes de qualquer operação
      if (!workouts || !Array.isArray(workouts)) {
        setFilteredWorkouts([]);
        return;
      }

      let result = [...workouts];

      // Aplicar filtro
      if (filter !== 'all') {
        result = result.filter(workout => workout && workout.type === filter);
      }

      // Aplicar busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(workout => 
          workout && 
          ((workout.name && workout.name.toLowerCase().includes(term)) || 
           (workout.notes && workout.notes.toLowerCase().includes(term)))
        );
      }

      // Aplicar ordenação
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
        <h1 className="text-3xl font-bold">Meus Treinos</h1>
        <Link 
          to="/workout/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center transition"
        >
          <FiPlus className="mr-2" />
          Novo Treino
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar treinos..."
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            workout && workout.id ? (
              <Link 
                key={workout.id} 
                to={`/workout/${workout.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold">{workout.name || 'Treino sem nome'}</h2>
                    <span className={`${getWorkoutTypeColor(workout.type)} text-white text-xs py-1 px-2 rounded`}>
                      {workout.type || 'Geral'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <FiCalendar className="mr-2" />
                    <span>{formatDate(workout.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <FiClock className="mr-2" />
                    <span>{workout.duration || 0} minutos</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FiActivity className="mr-2" />
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

