import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { WorkoutContext } from "../context/WorkoutContext";

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const { workouts, completedWorkouts, toggleWorkoutCompletion } = useContext(WorkoutContext);
  
  const workout = workouts.find(w => w.id === parseInt(id));
  const isCompleted = completedWorkouts[id] || false;
  
  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Treino não encontrado</h2>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{workout.name}</h1>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar
        </Link>
      </div>
      
      <img 
        src={workout.image} 
        alt={workout.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">{workout.description}</p>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Exercícios</h2>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-2">Exercício</th>
                <th className="text-center py-2">Séries</th>
                <th className="text-center py-2">Repetições</th>
                <th className="text-center py-2">Descanso</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((exercise, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
                  <td className="py-3 font-medium">{exercise.name}</td>
                  <td className="py-3 text-center">{exercise.sets}</td>
                  <td className="py-3 text-center">{exercise.reps}</td>
                  <td className="py-3 text-center">{exercise.rest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => toggleWorkoutCompletion(workout.id, !isCompleted)}
          className={"px-6 py-3 rounded-lg font-semibold transition-colors " + 
            (isCompleted 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white")}
        >
          {isCompleted ? "Treino Concluído " : "Marcar como Concluído"}
        </button>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
