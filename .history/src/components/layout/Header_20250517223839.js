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
          ? `${darkMode ? 'bg-gray-900/30 backdrop-blur-[1px]' : 'bg-white/30 backdrop-blur-[1px]'}` 
          : `${darkMode ? 'bg-transparent' : 'bg-gradient-to-r from-blue-500/40 to-purple-600/40 backdrop-blur-[1px]'}`
      }`}
    >
      <div className="max-w-6xl mx-auto px-2 py-0.5">
        <div className="flex justify-between items-center h-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <div className="bg-black p-0.5 rounded">
              <span className="font-bold text-white text-[10px]">FITNESS</span>
            </div>
            <span className={`font-bold text-sm ${scrolled && !darkMode ? 'text-gray-800' : 'text-white'} tracking-tight`}>
              Fitness<span className="text-blue-300 font-extrabold">Tracker</span>
            </span>
          </Link>
          
          {/* Navegação */}
          <nav className="flex items-center space-x-0.5">
            {isAuthenticated ? (
              <div className="flex items-center space-x-0.5">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-2 py-0.5 rounded-full flex items-center text-[10px] font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/50 text-white' : 'bg-white/50 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/40' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaTachometerAlt className="mr-0.5 text-[8px]" />
                  <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/workouts" 
                  className={({ isActive }) => 
                    `px-2 py-0.5 rounded-full flex items-center text-[10px] font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/50 text-white' : 'bg-white/50 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/40' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaDumbbell className="mr-0.5 text-[8px]" />
                  <span>Treinos</span>
                </NavLink>
                
                <NavLink 
                  to="/stats" 
                  className={({ isActive }) => 
                    `px-2 py-0.5 rounded-full flex items-center text-[10px] font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600/50 text-white' : 'bg-white/50 text-blue-700')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/40' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaChartLine className="mr-0.5 text-[8px]" />
                  <span>Estatísticas</span>
                </NavLink>
                
                {/* Dropdown do usuário */}
                <div className="relative ml-0.5">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/30 text-white hover:bg-gray-700/30' 
                        : scrolled ? 'bg-gray-100/40 text-gray-800 hover:bg-gray-200/40' : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    <span className="hidden md:inline">{user?.name || 'Michel'}</span>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600/50' : 'bg-blue-500/50'
                    }`}>
                      <FaUser className="text-white text-[7px]" />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-1 w-36 py-1 rounded-md shadow-md z-10 ${
                          darkMode ? 'bg-gray-800/90 border border-gray-700/20' : 'bg-white/90'
                        }`}
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Link 
                          to="/profile" 
                          className={`block w-full text-left px-2.5 py-1 text-[10px] ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/40' : 'text-gray-700 hover:bg-gray-100/40'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Perfil
                        </Link>
                        <Link 
                          to="/settings" 
                          className={`block w-full text-left px-2.5 py-1 text-[10px] ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/40' : 'text-gray-700 hover:bg-gray-100/40'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Configurações
                        </Link>
                        <hr className={`my-0.5 ${darkMode ? 'border-gray-700/20' : 'border-gray-200/20'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-2.5 py-1 text-[10px] ${
                            darkMode ? 'text-red-400 hover:bg-gray-700/40' : 'text-red-600 hover:bg-gray-100/40'
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
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-blue-600/50 text-white hover:bg-blue-700/50' 
                    : scrolled ? 'bg-blue-600/50 text-white hover:bg-blue-700/50' : 'bg-white/50 text-blue-600 hover:bg-blue-50/60'
                }`}
              >
                Entrar
              </Link>
            )}
            
            {/* Botão de tema */}
            <button 
              onClick={toggleDarkMode}
              className={`ml-0.5 p-0.5 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/30 text-yellow-300 hover:bg-gray-700/30' 
                  : scrolled ? 'bg-gray-100/40 text-gray-700 hover:bg-gray-200/40' : 'bg-white/10 text-white hover:bg-white/15'
              }`}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? <FaSun className="text-[10px]" /> : <FaMoon className="text-[10px]" />}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Espaçamento mínimo para evitar que o conteúdo fique sob o header */}
      <div className="h-6"></div>
    </header>
  );
};

export default Header;
