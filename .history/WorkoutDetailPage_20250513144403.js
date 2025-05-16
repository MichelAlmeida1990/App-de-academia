import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { FaCheckCircle, FaRegCircle, FaArrowLeft, FaTrophy, FaCalendarCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const { 
    workouts = [], 
    completedWorkouts = {}, 
    toggleWorkoutCompletion,
    getWorkoutProgress
  } = useWorkout() || {};
  
  const [showConfetti, setShowConfetti] = useState(false);

  // Verificar se workouts existe antes de usar find
  const workout = workouts && Array.isArray(workouts)
    ? workouts.find(w => w.id === parseInt(id))
    : null;

  // Verificar se o treino está concluído
  const isCompleted = (completedWorkouts && completedWorkouts[id]) || false;
  
  // Obter progresso do treino
  const workoutProgress = getWorkoutProgress(parseInt(id));

  // Verificar se o contexto está carregado
  if (!workouts) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Verificar se o treino existe
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

  // Função para lidar com o clique no botão de conclusão
  const handleToggleCompletion = () => {
    if (toggleWorkoutCompletion) {
      const numericId = parseInt(id);
      toggleWorkoutCompletion(numericId, !isCompleted);
      
      if (!isCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      console.log(`Treino ${numericId} marcado como ${!isCompleted ? 'concluído' : 'não concluído'}`);
    } else {
      console.error("toggleWorkoutCompletion não está disponível");
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Aqui você pode adicionar uma biblioteca de confetti se desejar */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
            🎉 🏆 💪
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{workout.name}</h1>
          {isCompleted && (
            <FaTrophy className="ml-3 text-yellow-500 text-2xl" />
          )}
        </div>
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar
        </Link>
      </div>

      <div className="relative mb-6">
        <img
          src={workout.image}
          alt={workout.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        {isCompleted && (
          <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center">
            <FaCheckCircle className="mr-1" /> Concluído
          </div>
        )}
      </div>

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
                {isCompleted && <th className="text-center py-2">Status</th>}
              </tr>
            </thead>
            <tbody>
              {workout.exercises && workout.exercises.map((exercise, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
                  <td className="py-3 font-medium">{exercise.name}</td>
                  <td className="py-3 text-center">{exercise.sets}</td>
                  <td className="py-3 text-center">{exercise.reps}</td>
                  <td className="py-3 text-center">{exercise.rest}</td>
                  {isCompleted && (
                    <td className="py-3 text-center text-green-500">
                      <FaCheckCircle />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {workoutProgress.lastUpdated && (
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <FaCalendarCheck className="mr-2" />
          Última atualização: {new Date(workoutProgress.lastUpdated).toLocaleDateString()}
        </div>
      )}

      <motion.button
        onClick={handleToggleCompletion}
        whileTap={{ scale: 0.95 }}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center ${
          isCompleted
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isCompleted ? (
          <>
            <FaCheckCircle className="mr-2" /> Treino Concluído
          </>
        ) : (
          <>
            <FaRegCircle className="mr-2" /> Marcar como Concluído
          </>
        )}
      </motion.button>
    </div>
  );
};

export default WorkoutDetailPage;
code