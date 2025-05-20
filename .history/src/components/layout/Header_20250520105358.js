import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        darkMode 
          ? scrolled ? 'bg-gray-900/90 border-b border-gray-800' : 'bg-gray-900/80' 
          : scrolled ? 'bg-white/90 shadow-md' : 'bg-gradient-to-r from-blue-600 to-purple-700'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link to="/" className="flex items-center space-x-1.5">
              <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-white'} tracking-tight`}>
                Fitness<span className="text-blue-300 font-extrabold">Tracker</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Navegação */}
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600 text-white' : 'bg-white/80 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800' 
                            : `${scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`)
                    }`
                  }
                >
                  <FaTachometerAlt className="mr-1 text-xs" />
                  <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/workouts" 
                  className={({ isActive }) => 
                    `px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600 text-white' : 'bg-white/80 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800' 
                            : `${scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`)
                    }`
                  }
                >
                  <FaDumbbell className="mr-1 text-xs" />
                  <span>Treinos</span>
                </NavLink>
                
                <NavLink 
                  to="/stats" 
                  className={({ isActive }) => 
                    `px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600 text-white' : 'bg-white/80 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800' 
                            : `${scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`)
                    }`
                  }
                >
                  <FaChartLine className="mr-1 text-xs" />
                  <span>Estatísticas</span>
                </NavLink>
                
                {/* Dropdown do usuário */}
                <div className="relative ml-2">
                  <motion.button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800 text-white hover:bg-gray-700' 
                        : scrolled ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden md:inline">{user?.name || 'Michel'}</span>
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      <FaUser className="text-white text-[10px]" />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-10 ${
                          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          to="/profile" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Perfil
                        </Link>
                        <Link 
                          to="/settings" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Configurações
                        </Link>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                          }`}
                        >
                          Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white/80 text-blue-700 hover:bg-white/90'
                }`}
              >
                Entrar
              </Link>
            )}
            
            {/* Botão de tema */}
            <button 
              onClick={toggleDarkMode}
              className={`ml-2 p-2 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                  : scrolled ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Espaçamento para evitar que o conteúdo fique sob o header */}
      <div className="h-12"></div>
    </header>
  );
};

export default Header;
