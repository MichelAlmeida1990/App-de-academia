// src/components/layout/Header.js (Versão Atualizada - mantendo sua implementação com ajustes)
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
        scrolled 
          ? `${darkMode ? 'bg-gray-900/40 backdrop-blur-md border-b border-gray-800/50' : 'bg-white/40 backdrop-blur-md border-b border-gray-200/50'}` 
          : `${darkMode ? 'bg-gray-900/40 backdrop-blur-sm border-b border-gray-800/50' : 'bg-gradient-to-r from-blue-500/50 to-purple-600/50 backdrop-blur-sm'}`
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link to="/" className="flex items-center space-x-1.5">
              <span className={`font-bold text-lg ${scrolled && !darkMode ? 'text-gray-800' : 'text-white'} tracking-tight`}>
                Fitness<span className="text-blue-300 font-extrabold">Tracker</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Navegação */}
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 md:space-x-2">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-2 py-1.5 rounded-full flex items-center space-x-1 text-xs md:text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/60 text-white' : 'bg-white/60 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaTachometerAlt className="mr-1 text-xs" />
                  <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/workouts" 
                  className={({ isActive }) => 
                    `px-2 py-1.5 rounded-full flex items-center space-x-1 text-xs md:text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/60 text-white' : 'bg-white/60 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaDumbbell className="mr-1 text-xs" />
                  <span className="hidden sm:inline">Treinos</span>
                </NavLink>
                
                <NavLink 
                  to="/stats" 
                  className={({ isActive }) => 
                    `px-2 py-1.5 rounded-full flex items-center space-x-1 text-xs md:text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/60 text-white' : 'bg-white/60 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaChartLine className="mr-1 text-xs" />
                  <span className="hidden sm:inline">Estatísticas</span>
                </NavLink>
                
                {/* Dropdown do usuário */}
                <div className="relative ml-1.5">
                  <motion.button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/40 text-white hover:bg-gray-700/40' 
                        : scrolled ? 'bg-gray-100/50 text-gray-800 hover:bg-gray-200/50' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden md:inline">{user?.name || 'Michel'}</span>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600/60' : 'bg-blue-500/60'
                    }`}>
                      <FaUser className="text-white text-xs" />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-10 ${
                          darkMode 
                            ? 'bg-gray-800/90 backdrop-blur-md border border-gray-700/30' 
                            : 'bg-white/90 backdrop-blur-md border border-gray-200/30'
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          to="/profile" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Perfil
                        </Link>
                        <Link 
                          to="/settings" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Configurações
                        </Link>
                        <hr className={`my-2 ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700/50' : 'text-red-600 hover:bg-gray-100/50'
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-blue-600/60 text-white hover:bg-blue-700/60' 
                    : scrolled ? 'bg-blue-600/60 text-white hover:bg-blue-700/60' : 'bg-white/60 text-blue-600 hover:bg-blue-50/70'
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
                  ? 'bg-gray-800/40 text-yellow-300 hover:bg-gray-700/40' 
                  : scrolled ? 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
