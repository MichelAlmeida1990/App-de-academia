import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  return (
    <header className={`shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">FitnessTracker</Link>
        
        <nav className="flex items-center space-x-1">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive 
                  ? (darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-700')
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/workouts" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive 
                  ? (darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-700')
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
              }`
            }
          >
            Treinos
          </NavLink>
          <NavLink 
            to="/stats" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive 
                  ? (darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-700')
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
              }`
            }
          >
            Estatísticas
          </NavLink>
          
          <button 
            onClick={toggleDarkMode}
            className={`ml-3 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode 
                ? 'focus:ring-yellow-500 text-yellow-300 hover:text-yellow-200' 
                : 'focus:ring-gray-500 text-gray-500 hover:text-gray-700'
            }`}
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
