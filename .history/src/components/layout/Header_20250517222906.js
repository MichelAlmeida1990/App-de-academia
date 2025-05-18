import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png'; // Certifique-se de criar esta pasta e adicionar um logo

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
        yoyo: Infinity,
        ease: "easeInOut" 
      }
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? `shadow-lg ${darkMode ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}` 
          : `${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial="normal"
            whileHover="hover"
            variants={logoVariants}
          >
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="FitnessTracker Logo" className="h-10 w-auto" />
              <span className={`font-bold text-xl ${scrolled && !darkMode ? 'text-gray-800' : 'text-white'} tracking-tight`}>
                Fitness<span className="text-blue-400">Tracker</span>
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
                      `px-3 py-2 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600 text-white' : 'bg-white/90 text-blue-700 shadow-md')
                          : (darkMode 
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                              : `${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`)
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
                      `px-3 py-2 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600 text-white' : 'bg-white/90 text-blue-700 shadow-md')
                          : (darkMode 
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                              : `${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`)
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
                      `px-3 py-2 rounded-full flex items-center space-x-1 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600 text-white' : 'bg-white/90 text-blue-700 shadow-md')
                          : (darkMode 
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                              : `${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`)
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800 text-white hover:bg-gray-700' 
                        : scrolled ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden md:inline">{user?.name || 'Usuário'}</span>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      <FaUser className="text-white" />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-2 w-48 py-2 rounded-xl shadow-xl z-10 ${
                          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                        }`}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Entrar
                </Link>
              </motion.div>
            )}
            
            {/* Botão de tema */}
            <motion.button 
              onClick={toggleDarkMode}
              className={`ml-3 p-2 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                  : scrolled ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </motion.button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
