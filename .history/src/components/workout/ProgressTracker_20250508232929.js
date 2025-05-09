import React, { useContext } from "react";
import { WorkoutContext } from "../../context/WorkoutContext";

const ProgressTracker = () => {
  const { getCompletedCount, workouts, resetProgress } = useContext(WorkoutContext);
  
  const completedCount = getCompletedCount();
  const totalWorkouts = workouts.length;
  const progressPercentage = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Seu Progresso</h2>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: progressPercentage + "%" }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {completedCount} de {totalWorkouts} treinos concluídos ({Math.round(progressPercentage)}%)
        </p>
        
        <button
          onClick={resetProgress}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Resetar Progresso
        </button>
      </div>
    </div>
  );
};

export default ProgressTracker;
