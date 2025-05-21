// src/components/workout/ProgressTracker.js - Versão simplificada
import React, { useState, useEffect, useContext } from 'react';
import { useWorkout } from '../../hooks/useWorkout';
import { ThemeContext } from '../../context/ThemeContext';
import { FaChartLine } from 'react-icons/fa';

const ProgressTracker = () => {
  const { workouts, loading, getCompletedWorkouts } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  
  const [progress, setProgress] = useState({
    totalCompleted: 0
  });

  useEffect(() => {
    if (loading) return;
    
    try {
      const completedWorkouts = getCompletedWorkouts();
      setProgress({
        totalCompleted: completedWorkouts?.length || 0
      });
    } catch (error) {
      console.error("Erro ao calcular progresso:", error);
      setProgress({ totalCompleted: 0 });
    }
  }, [workouts, loading, getCompletedWorkouts]);

  if (loading) {
    return (
      <div className="card p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <FaChartLine className="text-blue-500 mr-2" />
        <h3 className="text-xl font-semibold">Seu Progresso</h3>
      </div>
      <p className="text-lg">Total de treinos concluídos: <span className="font-bold text-blue-500">{progress.totalCompleted}</span></p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Esta é uma versão simplificada do componente para verificação.
      </p>
    </div>
  );
};

export default ProgressTracker;
