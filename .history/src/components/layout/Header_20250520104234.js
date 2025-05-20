import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Corrigido para toggleTheme
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
          ? `${darkMode ? 'bg-gray-900/40' : 'bg-white/40'}` 
          : `${darkMode ? 'bg-transparent' : 'bg-gradient-to-r from-blue-500/50 to-purple-600/50'}`
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 py-0.5"> {/* Reduzido o padding vertical */}
        <div className="flex justify-between items-center h-10"> {/* Altura fixa reduzida */}
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
          <nav className="flex items-center space-x-1">
            {isAuthenticated ? (
              <div className="flex items-center space-x-1">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-2 py-0.5 rounded-full flex items-center space-x-1 text-xs font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/60 text-white' : 'bg-white/60 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaTachometerAlt className="mr-1 text-xs" />
                  <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/workouts" 
                  className={({ isActive }) => 
                    `px-2 py-0.5 rounded-full flex items-center space-x-1 text-xs font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/60 text-white' : 'bg-white/60 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaDumbbell className="mr-1 text-xs" />
                  <span>Treinos</span>
                </NavLink>
                
                <NavLink 
                  to="/stats" 
                  className={({ isActive }) => 
                    `px-2 py-0.5 rounded-full flex items-center space-x-1 text-xs font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/60 text-white' : 'bg-white/60 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaChartLine className="mr-1 text-xs" />
                  <span>Estatísticas</span>
                </NavLink>
                
                {/* Dropdown do usuário */}
                <div className="relative ml-1.5">
                  <motion.button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/40 text-white hover:bg-gray-700/40' 
                        : scrolled ? 'bg-gray-100/50 text-gray-800 hover:bg-gray-200/50' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden md:inline">{user?.name || 'Michel'}</span>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600/60' : 'bg-blue-500/60'
                    }`}>
                      <FaUser className="text-white text-[8px]" />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-1 w-40 py-1.5 rounded-lg shadow-lg z-10 ${
                          darkMode ? 'bg-gray-800/90 border border-gray-700/30' : 'bg-white/90'
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          to="/profile" 
                          className={`block w-full text-left px-3 py-1.5 text-xs ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Perfil
                        </Link>
                        <Link 
                          to="/settings" 
                          className={`block w-full text-left px-3 py-1.5 text-xs ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Configurações
                        </Link>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-3 py-1.5 text-xs ${
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
                className={`px-3 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
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
              onClick={toggleTheme} {/* Corrigido para toggleTheme */}
              className={`ml-1 p-1 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/40 text-yellow-300 hover:bg-gray-700/40' 
                  : scrolled ? 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? <FaSun className="text-xs" /> : <FaMoon className="text-xs" />}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Espaçamento mínimo para evitar que o conteúdo fique sob o header */}
      <div className="h-8"></div> {/* Reduzido o espaçamento */}
    </header>
  );
};

export default Header;
