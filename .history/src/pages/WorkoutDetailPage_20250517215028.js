import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';

// Componente de exercício memoizado para evitar re-renderizações desnecessárias
const ExerciseItem = memo(({ 
  exercise, 
  index, 
  isCompleted, 
  isExpanded, 
  onToggle, 
  onExpand 
}) => {
  // Prevenção de propagação de eventos
  const handleToggleClick = (e) => {
    e.stopPropagation();
    onToggle(index);
  };

  return (
    <div 
      className={`border rounded-lg ${
        isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600'
      }`}
    >
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={onExpand}
      >
        <div className="flex items-center">
          <div 
            className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
              isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'
            }`}
            onClick={handleToggleClick}
          >
            {isCompleted && <FaCheck size={12} />}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {exercise.sets} séries × {exercise.reps} repetições
            </p>
          </div>
        </div>
        <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-600">
          {exercise.notes && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exercise.notes}</p>
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleToggleClick}
              className={`px-3 py-1 rounded text-sm ${
                isCompleted
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  : 'bg-green-600 text-white'
              }`}
            >
              {isCompleted ? 'Desmarcar' : 'Concluir'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Componente simples para barra de progresso
const SimpleProgressBar = memo(({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
    <div 
      className="bg-blue-600 h-2.5 rounded-full" 
      style={{ width: `${progress}%` }}
    ></div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Progresso: {progress}%
    </p>
  </div>
));

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedExercise, setExpandedExercise] = useState(null);
  
  const { 
    workouts, 
    completedWorkouts,
    toggleWorkoutCompletion,
    toggleExerciseCompletion,
    isExerciseCompleted,
    getWorkoutProgress,
    deleteWorkout
  } = useWorkout() || {};

  // Encontrar o treino com useEffect para evitar recálculos
  useEffect(() => {
    if (workouts) {
      const foundWorkout = workouts.find(w => 
        w.id === id || 
        w.id === String(id) || 
        String(w.id) === id
      );
      
      setWorkout(foundWorkout);
      setLoading(false);
    }
  }, [workouts, id]);

  const isCompleted = completedWorkouts && id ? completedWorkouts[id] : false;
  
  // Calcular o progresso apenas quando necessário
  const workoutProgress = getWorkoutProgress ? getWorkoutProgress(id) : { overallProgress: 0 };

  // Funções memoizadas para evitar recriações em cada renderização
  const handleDeleteWorkout = useCallback(() => {
    if (window.confirm("Tem certeza que deseja excluir este treino?")) {
      deleteWorkout(id);
      navigate('/');
    }
  }, [deleteWorkout, id, navigate]);

  const handleToggleComplete = useCallback(() => {
    toggleWorkoutCompletion(id, !isCompleted);
  }, [toggleWorkoutCompletion, id, isCompleted]);

  const handleToggleExercise = useCallback((exerciseIndex) => {
    const isCurrentlyCompleted = isExerciseCompleted ? isExerciseCompleted(id, exerciseIndex) : false;
    toggleExerciseCompletion(id, exerciseIndex, !isCurrentlyCompleted);
  }, [toggleExerciseCompletion, isExerciseCompleted, id]);

  const handleExpandExercise = useCallback((index) => {
    setExpandedExercise(prev => prev === index ? null : index);
  }, []);

  // Função simples para formatar data
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Treino não encontrado</h2>
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Botão de voltar */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
        <FaArrowLeft className="mr-2" /> Voltar
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        {/* Cabeçalho do treino */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {workout.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {workout.description}
            </p>
            {workout.createdAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Criado em: {formatDate(workout.createdAt)}
              </p>
            )}
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button
              onClick={handleToggleComplete}
              className={`px-3 py-2 rounded-md flex items-center text-sm ${
                isCompleted 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
                  : 'bg-green-600 text-white'
              }`}
            >
              {isCompleted ? <FaUndo className="mr-1" /> : <FaCheck className="mr-1" />}
              {isCompleted ? 'Desmarcar' : 'Concluído'}
            </button>
            
            <Link
              to={`/edit-workout/${id}`}
              className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm"
            >
              <FaEdit className="mr-1" /> Editar
            </Link>
            
            <button
              onClick={handleDeleteWorkout}
              className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center text-sm"
            >
              <FaTrash className="mr-1" /> Excluir
            </button>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mb-6">
          <SimpleProgressBar progress={workoutProgress.overallProgress} />
        </div>
        
        {/* Lista de exercícios */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Exercícios
        </h2>
        
        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => {
              const exerciseCompleted = isExerciseCompleted ? isExerciseCompleted(id, index) : false;
              
              return (
                <ExerciseItem
                  key={`${index}-${exerciseCompleted}`}
                  exercise={exercise}
                  index={index}
                  isCompleted={exerciseCompleted}
                  isExpanded={expandedExercise === index}
                  onToggle={handleToggleExercise}
                  onExpand={() => handleExpandExercise(index)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nenhum exercício adicionado a este treino.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
