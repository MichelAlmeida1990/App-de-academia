// src/components/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WorkoutService from '../../services/WorkoutService';
import WorkoutCard from './WorkoutCard';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';
import { saveToCache, getFromCache } from '../../utils/offlineCache';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'favorites'
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        
        // Tentar buscar do Firestore
        const userWorkouts = await WorkoutService.getUserWorkouts(user.uid);
        
        // Se conseguiu dados, salvar no cache
        if (userWorkouts && userWorkouts.length > 0) {
          saveToCache(`workouts_${user.uid}`, userWorkouts);
        }
        
        setWorkouts(userWorkouts);
        setError('');
      } catch (err) {
        console.error('Erro ao buscar treinos:', err);
        
        // Se estiver offline, tentar usar cache
        const cachedWorkouts = getFromCache(`workouts_${user.uid}`);
        if (cachedWorkouts) {
          console.log('Usando dados em cache para treinos');
          setWorkouts(cachedWorkouts);
          if (isOffline) {
            setError('Você está offline. Mostrando dados salvos anteriormente.');
          }
        } else {
          setError('Não foi possível carregar seus treinos. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user?.uid, isOffline]);

  const handleCreateWorkout = () => {
    navigate('/workouts/new');
  };

  const handleWorkoutClick = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };

  const filteredWorkouts = () => {
    switch (filter) {
      case 'recent':
        // Ordenar por data mais recente
        return [...workouts].sort((a, b) => 
          new Date(b.lastPerformed || b.createdAt) - new Date(a.lastPerformed || a.createdAt)
        );
      case 'favorites':
        // Filtrar apenas favoritos
        return workouts.filter(workout => workout.isFavorite);
      default:
        return workouts;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Meus Treinos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {workouts.length > 0 
              ? `Você tem ${workouts.length} treino${workouts.length !== 1 ? 's' : ''} cadastrado${workouts.length !== 1 ? 's' : ''}`
              : 'Comece criando seu primeiro treino'}
          </p>
        </div>
        
        <button 
          onClick={handleCreateWorkout}
          className="btn-primary mt-4 md:mt-0"
          disabled={isOffline}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Treino
        </button>
      </div>

      {/* Aviso de modo offline */}
      {isOffline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Você está no modo offline. Algumas funcionalidades podem estar limitadas.
          </p>
        </div>
      )}

      {/* Filtros */}
      {workouts.length > 0 && (
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'recent' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('recent')}
          >
            Recentes
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'favorites' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('favorites')}
          >
            Favoritos
          </button>
        </div>
      )}

      {/* Estado de carregamento */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Mensagem de erro */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Estado vazio */}
      {!loading && !error && workouts.length === 0 && (
        <EmptyState
          title="Nenhum treino encontrado"
          description="Você ainda não criou nenhum treino. Comece criando seu primeiro treino agora!"
          buttonText="Criar meu primeiro treino"
          buttonAction={handleCreateWorkout}
          buttonDisabled={isOffline}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      )}

      {/* Lista de treinos */}
      {!loading && !error && filteredWorkouts().length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts().map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={() => handleWorkoutClick(workout.id)}
            />
          ))}
        </div>
      )}

      {/* Estado vazio para filtros */}
      {!loading && !error && workouts.length > 0 && filteredWorkouts().length === 0 && (
        <EmptyState
          title={`Nenhum treino ${filter === 'favorites' ? 'favorito' : 'recente'} encontrado`}
          description={filter === 'favorites' 
            ? "Você ainda não marcou nenhum treino como favorito."
            : "Você ainda não tem treinos recentes."
          }
          buttonText="Ver todos os treinos"
          buttonAction={() => setFilter('all')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
