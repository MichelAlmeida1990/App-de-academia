import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaEdit, FaTrash, FaUndo, FaClipboardCheck } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedExercise, setExpandedExercise] = useState(null);
  
  const { 
    workouts = [], 
    completedWorkouts = {},
    toggleWorkoutCompletion,
    toggleExerciseCompletion,
    isExerciseCompleted,
    getWorkoutProgress,
    deleteWorkout
  } = useWorkout() || {};

  // Encontrar o treino pelo ID (sem usar parseInt)
  const workout = workouts && Array.isArray(workouts)
    ? workouts.find(w => w.id === id)
    : null;

  const isCompleted = completedWorkouts[id] || false;
  
  // Obter o progresso do treino
  const workoutProgress = getWorkoutProgress ? getWorkoutProgress(id) : { exercises: {}, overallProgress: 0, lastUpdated: null };
  
  const handleDeleteWorkout = async () => {
    try {
      await deleteWorkout(id);
      alert('Treino excluído com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao excluir treino');
      console.error(error);
    }
  };

  const handleToggleComplete = () => {
    try {
      toggleWorkoutCompletion(id, !isCompleted);
      alert(isCompleted ? 'Treino marcado como não concluído' : 'Treino marcado como concluído');
    } catch (error) {
      alert('Erro ao atualizar status do treino');
      console.error(error);
    }
  };

  const handleToggleExercise = (exerciseIndex) => {
    try {
      const isCurrentlyCompleted = isExerciseCompleted ? isExerciseCompleted(id, exerciseIndex) : false;
      toggleExerciseCompletion(id, exerciseIndex, !isCurrentlyCompleted);
    } catch (error) {
      alert('Erro ao atualizar exercício');
      console.error(error);
    }
  };

  // Função simples para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Renderizar mensagem de erro se o treino não for encontrado
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

  // Componente simples para barra de progresso
  const SimpleProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Progresso: {progress}%
      </p>
    </div>
  );

  // Componente simples para confirmação de exclusão
  const confirmDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.")) {
      handleDeleteWorkout();
    }
  };

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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Criado em: {formatDate(workout.createdAt)}
            </p>
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
              onClick={confirmDelete}
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <FaClipboardCheck className="mr-2" /> Exercícios
        </h2>
        
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => {
            const exerciseCompleted = isExerciseCompleted ? isExerciseCompleted(id, index) : false;
            const isExpanded = expandedExercise === index;
            
            return (
              <div 
                key={index}
                className={`border rounded-lg overflow-hidden ${
                  exerciseCompleted 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedExercise(isExpanded ? null : index)}
                >
                  <div className="flex items-center">
                    <div 
                      className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                        exerciseCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExercise(index);
                      }}
                    >
                      {exerciseCompleted && <FaCheck size={12} />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exercise.sets} séries × {exercise.reps} repetições
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-600">
                    {exercise.notes && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {exercise.notes}
                        </p>
                      </div>
                    )}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExercise(index);
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          exerciseCompleted
                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {exerciseCompleted ? 'Desmarcar' : 'Concluir'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
