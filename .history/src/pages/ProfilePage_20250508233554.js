import React, { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { getCompletedCount, workouts, resetProgress } = useContext(WorkoutContext);
  
  const completedCount = getCompletedCount();
  const totalWorkouts = workouts.length;
  const progressPercentage = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Seu Perfil</h1>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
          
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Acompanhe seu progresso e gerencie seus treinos</p>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Estat韘ticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total de Treinos</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">Treinos Conclu韉os</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">Progresso</p>
                <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={resetProgress}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Resetar Progresso
            </button>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Ver Treinos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
