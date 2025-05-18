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
  
  // Detectar scroll para mudar aparência do header
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
  
  // Variantes para animações
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? `shadow-sm ${darkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}` 
          : `${darkMode ? 'bg-transparent' : 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm'}`
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial="normal"
            whileHover="hover"
            variants={logoVariants}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-black p-1.5 rounded">
                <span className="font-bold text-white text-xs">FITNESS</span>
              </div>
              <span className={`font-bold text-xl ${scrolled && !darkMode ? 'text-gray-800' : 'text-white'} tracking-tight`}>
                Fitness<span className="text-blue-300 font-extrabold">Tracker</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Navegação */}
          <nav className="flex items-center space-x-1">
            {isAuthenticated ? (
              <motion.div 
                className="flex items-center space-x-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
              >
                <motion.div custom={0} variants={navItemVariants}>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600/80 text-white' : 'bg-white/80 text-blue-700 shadow-sm')
                          : (darkMode 
                              ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                              : `${scrolled ? 'text-gray-700 hover:bg-gray-100/80' : 'text-white hover:bg-white/20'}`)
                      }`
                    }
                  >
                    <FaTachometerAlt className="mr-1" />
                    <span>Dashboard</span>
                  </NavLink>
                </motion.div>
                
                <motion.div custom={1} variants={navItemVariants}>
                  <NavLink 
                    to="/workouts" 
                    className={({ isActive }) => 
                      `px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600/80 text-white' : 'bg-white/80 text-blue-700 shadow-sm')
                          : (darkMode 
                              ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                              : `${scrolled ? 'text-gray-700 hover:bg-gray-100/80' : 'text-white hover:bg-white/20'}`)
                      }`
                    }
                  >
                    <FaDumbbell className="mr-1" />
                    <span>Treinos</span>
                  </NavLink>
                </motion.div>
                
                <motion.div custom={2} variants={navItemVariants}>
                  <NavLink 
                    to="/stats" 
                    className={({ isActive }) => 
                      `px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600/80 text-white' : 'bg-white/80 text-blue-700 shadow-sm')
                          : (darkMode 
                              ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                              : `${scrolled ? 'text-gray-700 hover:bg-gray-100/80' : 'text-white hover:bg-white/20'}`)
                      }`
                    }
                  >
                    <FaChartLine className="mr-1" />
                    <span>Estatísticas</span>
                  </NavLink>
                </motion.div>
                
                {/* Dropdown do usuário */}
                <motion.div 
                  className="relative ml-3"
                  custom={3} 
                  variants={navItemVariants}
                >
                  <motion.button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/70 text-white hover:bg-gray-700/70' 
                        : scrolled ? 'bg-gray-100/80 text-gray-800 hover:bg-gray-200/80' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden md:inline">{user?.name || 'Michel'}</span>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600/80' : 'bg-blue-500/80'
                    }`}>
                      <FaUser className="text-white text-xs" />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-xl z-10 ${
                          darkMode ? 'bg-gray-800/95 border border-gray-700/50' : 'bg-white/95'
                        }`}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          to="/profile" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/70' : 'text-gray-700 hover:bg-gray-100/70'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Perfil
                        </Link>
                        <Link 
                          to="/settings" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/70' : 'text-gray-700 hover:bg-gray-100/70'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Configurações
                        </Link>
                        <hr className={`my-1 ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700/70' : 'text-red-600 hover:bg-gray-100/70'
                          }`}
                        >
                          Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  to="/auth" 
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-blue-600/80 text-white hover:bg-blue-700/80' 
                      : scrolled ? 'bg-blue-600/80 text-white hover:bg-blue-700/80' : 'bg-white/80 text-blue-600 hover:bg-blue-50/90'
                  }`}
                >
                  Entrar
                </Link>
              </motion.div>
            )}
            
            {/* Botão de tema */}
            <motion.button 
              onClick={toggleDarkMode}
              className={`ml-2 p-1.5 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/70 text-yellow-300 hover:bg-gray-700/70' 
                  : scrolled ? 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </motion.button>
          </nav>
        </div>
      </div>
      
      {/* Espaçamento para evitar que o conteúdo fique sob o header */}
      <div className="h-16"></div>
    </header>
  );
};

export default Header;
