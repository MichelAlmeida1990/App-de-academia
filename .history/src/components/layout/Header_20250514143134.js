// src/components/layout/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import { FaDumbbell, FaChartBar, FaHome } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const { getOverallProgress } = useWorkout();
  
  // Obter o progresso geral
  const progress = getOverallProgress();
  
  // Determinar o título com base na rota atual
  let title = "FitnessTracker";
  if (location.pathname === "/") {
    title = "Dashboard";
  } else if (location.pathname === "/workouts") {
    title = "Meus Treinos";
  } else if (location.pathname === "/stats") {
    title = "Estatísticas";
  }
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
          
          {/* Progresso geral */}
          <div className="flex items-center">
            <div className="mr-4 hidden sm:block">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Progresso geral
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {progress.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
