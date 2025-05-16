// src/components/workout/WorkoutDetail.js
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { FaArrowLeft, FaPlay, FaEdit, FaTrash, FaDumbbell } from 'react-icons/fa';

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const { workout, loading, error, removeWorkout } = useWorkout(workoutId);
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!workout) return <div className="text-center p-4">Treino não encontrado</div>;

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      const success = await removeWorkout();
      if (success) {
        navigate('/workouts');
      }
    }
  };

  const handleStartWorkout = () => {
    navigate(`/workouts/${workoutId}/active`);
  };

  // Calcular progresso se existir
  const progressPercentage = workout.progress || 0;
  const hasProgress = progressPercentage > 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/workouts')}
            className="mr-4 text-gray-600 dark:text-gray-300"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1 dark:text-white">{workout.name}</h1>
        </div>

        {/* Barra de progresso (se houver progresso) */}
        {hasProgress && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium dark:text-white">Progresso</span>
              <span className="text-sm font-medium dark:text-white">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {workout.completedAt && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                Concluído em: {new Date(workout.completedAt).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        )}

        {/* Informações do treino */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {workout.description || 'Sem descrição'}
          </p>
          {workout.date && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Data: {new Date(workout.date).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Lista de exercícios */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Exercícios</h2>
          <div className="space-y-3">
            {workout.exercises && workout.exercises.map((exercise, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  exercise.completed 
                    ? 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500' 
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center">
                  <FaDumbbell className={`mr-2 ${exercise.completed ? 'text-green-500' : 'text-blue-500'}`} />
                  <h3 className="font-medium dark:text-white">{exercise.name}</h3>
                  {exercise.completed && (
                    <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      Concluído
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {exercise.sets && exercise.sets.length > 0 
                    ? `${exercise.sets.length} séries • ${exercise.reps || 'N/A'} repetições` 
                    : 'Detalhes não disponíveis'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleStartWorkout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center"
          >
            <FaPlay className="mr-2" /> {hasProgress ? 'Continuar Treino' : 'Iniciar Treino'}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/workouts/${workoutId}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-bold flex items-center justify-center"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
