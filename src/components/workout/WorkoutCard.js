import React from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../../context/WorkoutContext";

const WorkoutCard = ({ workout }) => {
  const { completedWorkouts } = useWorkout();
  
  // Verificar se o treino está completo usando diretamente completedWorkouts
  const isCompleted = completedWorkouts && workout && completedWorkouts[workout.id] || false;
  
  // Verificar se o workout e suas propriedades existem antes de renderizar
  if (!workout) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <p className="text-gray-500 dark:text-gray-400">Treino não disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      {workout.image && (
        <img 
          src={workout.image} 
          alt={workout.name || "Treino"} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{workout.name || "Sem nome"}</h3>
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            isCompleted ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          }`}>
            {isCompleted ? "Concluído" : "Pendente"}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{workout.description || "Sem descrição"}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {workout.exercises && Array.isArray(workout.exercises) ? `${workout.exercises.length} exercícios` : "0 exercícios"}
          </span>
          <Link 
            to={`/workout/${workout.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
