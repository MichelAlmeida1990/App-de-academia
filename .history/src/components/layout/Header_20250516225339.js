import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUser } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className={`shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">FitnessTracker</Link>
        
        <nav className="flex items-center space-x-1">
          {isAuthenticated ? (
            <>
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
              
              {/* Dropdown do usuário */}
              <div className="relative ml-3 group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium">
                  <span>{user?.name || 'Usuário'}</span>
                  <FaUser />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg hidden group-hover:block z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
          )}
          
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
