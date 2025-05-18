import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';

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
    deleteWorkout
  } = useWorkout() || {};

  // Usar useEffect para encontrar o treino quando os workouts estiverem disponíveis
  useEffect(() => {
    if (workouts) {
      // Imprimir para depuração
      console.log("ID da URL:", id);
      console.log("Todos os treinos:", workouts);
      
      // Tentar encontrar o treino de várias maneiras
      const foundWorkout = workouts.find(w => 
        w.id === id || 
        w.id === String(id) || 
        String(w.id) === id
      );
      
      console.log("Treino encontrado:", foundWorkout);
      
      setWorkout(foundWorkout);
      setLoading(false);
    }
  }, [workouts, id]);

  const isCompleted = completedWorkouts && id ? completedWorkouts[id] : false;

  const handleDeleteWorkout = () => {
    if (window.confirm("Tem certeza que deseja excluir este treino?")) {
      deleteWorkout(id);
      navigate('/');
    }
  };

  const handleToggleComplete = () => {
    toggleWorkoutCompletion(id, !isCompleted);
  };

  const handleToggleExercise = (exerciseIndex) => {
    const isCurrentlyCompleted = isExerciseCompleted(id, exerciseIndex);
    toggleExerciseCompletion(id, exerciseIndex, !isCurrentlyCompleted);
  };

  // Função simples para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Treino não encontrado</h2>
        <p className="mb-4">
          Não foi possível encontrar o treino com ID: {id}
        </p>
        <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center">
          <FaArrowLeft className="mr-2" /> Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline flex items-center mb-6">
        <FaArrowLeft className="mr-2" /> Voltar
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{workout.name}</h1>
            <p className="text-gray-600">{workout.description}</p>
            {workout.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Criado em: {formatDate(workout.createdAt)}
              </p>
            )}
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button
              onClick={handleToggleComplete}
              className={`px-3 py-2 rounded-md flex items-center ${
                isCompleted ? 'bg-gray-200 text-gray-700' : 'bg-green-600 text-white'
              }`}
            >
              {isCompleted ? <FaUndo className="mr-1" /> : <FaCheck className="mr-1" />}
              {isCompleted ? 'Desmarcar' : 'Concluído'}
            </button>
            
            <Link
              to={`/edit-workout/${id}`}
              className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center"
            >
              <FaEdit className="mr-1" /> Editar
            </Link>
            
            <button
              onClick={handleDeleteWorkout}
              className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center"
            >
              <FaTrash className="mr-1" /> Excluir
            </button>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Exercícios</h2>
        
        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => {
              const exerciseCompleted = isExerciseCompleted ? isExerciseCompleted(id, index) : false;
              const isExpanded = expandedExercise === index;
              
              return (
                <div 
                  key={index}
                  className={`border rounded-lg ${
                    exerciseCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedExercise(isExpanded ? null : index)}
                  >
                    <div className="flex items-center">
                      <div 
                        className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                          exerciseCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExercise(index);
                        }}
                      >
                        {exerciseCompleted && <FaCheck size={12} />}
                      </div>
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-gray-500">
                          {exercise.sets} séries × {exercise.reps} repetições
                        </p>
                      </div>
                    </div>
                    <span>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                      {exercise.notes && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Notas:</h4>
                          <p className="text-sm text-gray-600 mt-1">{exercise.notes}</p>
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
                              ? 'bg-gray-200 text-gray-700'
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
        ) : (
          <p className="text-gray-500">Nenhum exercício adicionado a este treino.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
