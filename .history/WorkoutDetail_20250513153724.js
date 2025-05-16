import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useWorkout } from "../../context/WorkoutContext";

const WorkoutDetail = ({ workout, workoutId }) => {
  const navigate = useNavigate();
  
  const { 
    toggleExerciseCompletion, 
    isExerciseCompleted,
    completedWorkouts
  } = useWorkout();
  
  // Verificar se o treino está completo
  const isWorkoutCompleted = completedWorkouts && completedWorkouts[workoutId] || false;
  
  // Função para lidar com o clique no checkbox
  const handleCheckboxChange = (exerciseIndex) => {
    const currentStatus = isExerciseCompleted(workoutId, exerciseIndex);
    toggleExerciseCompletion(workoutId, exerciseIndex, !currentStatus);
  };

  if (!workout) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>
        <h2 className="text-2xl font-bold mb-4">Treino não encontrado</h2>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 dark:text-blue-400 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">{workout.name}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{workout.description}</p>
      
      {isWorkoutCompleted && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-lg mb-6">
          Este treino foi concluído!
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-4">Exercícios</h3>
      
      <div className="space-y-4">
        {workout.exercises && workout.exercises.map((exercise, index) => (
          <div 
            key={index}
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <input
              type="checkbox"
              id={`exercise-${workoutId}-${index}`}
              checked={isExerciseCompleted(workoutId, index)}
              onChange={() => handleCheckboxChange(index)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3 cursor-pointer"
            />
            <label 
              htmlFor={`exercise-${workoutId}-${index}`}
              className="flex-1 cursor-pointer"
            >
              <div className="font-medium text-gray-800 dark:text-white">
                {exercise.name}
              </div>
              {exercise.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.description}
                </div>
              )}
              {exercise.sets && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {exercise.sets} séries × {exercise.reps} repetições
                </div>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDetail;
