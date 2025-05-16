import React, { useState, useEffect } from 'react';
import { useWorkout } from '../../context/WorkoutContext';

const ProgressTracker = () => {
  const { workouts, completedWorkouts } = useWorkout();
  
  const [progress, setProgress] = useState({
    weeklyWorkouts: 3,
    weeklyGoal: 5,
    monthlyProgress: 65,
    streakDays: 4
  });

  // Calcular o número de treinos concluídos esta semana
  useEffect(() => {
    if (workouts && completedWorkouts) {
      const completedCount = Object.keys(completedWorkouts).filter(id => completedWorkouts[id]).length;
      setProgress(prev => ({
        ...prev,
        weeklyWorkouts: completedCount
      }));
    }
  }, [workouts, completedWorkouts]);

  return (
    <div className="card slide-in">
      <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Treinos esta semana</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600">{progress.weeklyWorkouts}</span>
            <span className="text-gray-500 ml-2">/ {progress.weeklyGoal}</span>
          </div>
          <div className="progress-bar mt-2">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(progress.weeklyWorkouts / progress.weeklyGoal) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sequência atual</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-green-600">{progress.streakDays}</span>
            <span className="text-gray-500 ml-2">dias</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Continue treinando!</p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">Progresso mensal</p>
          <p className="text-sm font-medium">{progress.monthlyProgress}%</p>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill bg-green-500" 
            style={{ width: `${progress.monthlyProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
