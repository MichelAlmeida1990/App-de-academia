import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

// Renomeado para evitar conflito com a página
const WorkoutDetailComponent = ({ workout, isCompleted }) => {
  const navigate = useNavigate();

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
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {workout.description}
      </p>
      {isCompleted && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded-lg mb-4">
          Este treino foi concluído!
        </div>
      )}
    </div>
  );
};

export default WorkoutDetailComponent;
