import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useWorkout } from '../../context/WorkoutContext';
  
const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { getOverallProgress, workouts } = useWorkout();

  const completedCount = Math.round(getOverallProgress() * workouts.length / 100);
  const totalWorkouts = workouts.length;

  return (
    <header className="bg-blue-600 text-white p-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">App de Academia</Link>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm md:text-base">
            Progresso: {completedCount} de {totalWorkouts} treinos concluídos
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-blue-700"
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          
          <Link to="/profile" className="p-2 hover:bg-blue-700 rounded-full">
            👤
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
