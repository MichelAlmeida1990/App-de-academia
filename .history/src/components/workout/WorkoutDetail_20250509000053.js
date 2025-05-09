import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkout } from "../../context/WorkoutContext";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workouts, completedWorkouts, completeWorkout } = useWorkout() || {};
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função para verificar se o workout está completo
  const isWorkoutCompleted = (workoutId) => {
    if (!completedWorkouts || !workoutId) return false;
    return !!completedWorkouts[workoutId];
  };

  useEffect(() => {
    // Função para carregar os dados do treino
    const loadWorkout = () => {
      setLoading(true);
      setError(false);

      try {
        // Verificar se workouts existe
        if (!workouts || !Array.isArray(workouts)) {
          setError(true);
          setLoading(false);
          return;
        }

        // Encontrar o treino pelo ID (considerando tanto string quanto número)
        const foundWorkout = workouts.find(w => {
          if (!w || !w.id) return false;
          return w.id.toString() === id.toString();
        });

        if (foundWorkout) {
          setWorkout(foundWorkout);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao carregar treino:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [id, workouts]);

  // Handler para marcar/desmarcar treino como concluído
  const handleCompleteWorkout = () => {
    if (workout && workout.id && completeWorkout) {
      completeWorkout(workout.id);
    }
  };

  // Renderiza o estado de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Renderiza mensagem de erro se o treino não for encontrado
  if (error || !workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 dark:text-blue-400 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
          <h2 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">Treino não encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400">
            O treino que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  // Verifica se o treino está completo
  const isCompleted = isWorkoutCompleted(workout.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho com imagem */}
        <div className="relative">
          {workout.image && (
            <img 
              src={workout.image} 
              alt={workout.name || "Imagem do treino"} 
              className="w-full h-64 object-cover"
            />
          )}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
          >
            <FaArrowLeft className="text-gray-800 dark:text-white" />
          </button>
        </div>
        
        {/* Conteúdo principal */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {workout.name || "Treino sem nome"}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCompleted ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}>
              {isCompleted ? "Concluído" : "Pendente"}
            </span>
          </div>
          
          {/* Descrição */}
          {workout.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">{workout.description}</p>
          )}
          
          {/* Lista de exercícios */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Exercícios</h2>
            {workout.exercises && Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
              <ul className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <li key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {exercise && exercise.name ? exercise.name : `Exercício ${index + 1}`}
                        </h3>
                        {exercise && exercise.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {exercise.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {exercise && exercise.sets && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                              {exercise.sets} séries
                            </span>
                          )}
                          {exercise && exercise.reps && (
                            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">
                              {exercise.reps} repetições
                            </span>
                          )}
                          {exercise && exercise.rest && (
                            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded">
                              {exercise.rest}s descanso
                            </span>
                          )}
                        </div>
                      </div>
                      {exercise && exercise.image && (
                        <img 
                          src={exercise.image} 
                          alt={exercise.name || `Exercício ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Nenhum exercício cadastrado para este treino.</p>
            )}
          </div>
          
          {/* Botão de completar treino */}
          <button
            onClick={handleCompleteWorkout}
            className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors ${
              isCompleted 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isCompleted ? (
              <>
                <FaTimes className="mr-2" /> Desmarcar como concluído
              </>
            ) : (
              <>
                <FaCheck className="mr-2" /> Marcar como concluído
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
