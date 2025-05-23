// src/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt, FaBars, FaTimes, 
         FaBook, FaQuestionCircle, FaHeadset, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { darkMode, toggleTheme, accentColor } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Definir cores de destaque com base no tema atual
  const accentColors = {
    blue: darkMode ? 'from-blue-600 to-blue-400' : 'from-blue-500 to-blue-600',
    purple: darkMode ? 'from-purple-600 to-purple-400' : 'from-purple-500 to-purple-600',
    green: darkMode ? 'from-green-600 to-green-400' : 'from-green-500 to-green-600',
    red: darkMode ? 'from-red-600 to-red-400' : 'from-red-500 to-red-600',
  };
  
  const accentGradient = accentColors[accentColor] || accentColors.blue;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Desabilitar rolagem quando o menu mobile está aberto
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  // Variantes para animações
  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };
  
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3,
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
      }
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? `${darkMode ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50' : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'}` 
          : `${darkMode ? 'bg-gray-900/40 backdrop-blur-sm' : `bg-gradient-to-r ${accentGradient} backdrop-blur-sm`}`
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="FitnessTracker Logo" className="h-8 w-auto" />
              <span className={`font-bold text-lg ${scrolled && !darkMode ? 'text-gray-800' : 'text-white'} tracking-tight hidden sm:block`}>
                Fitness<span className={`text-${accentColor}-300 font-extrabold`}>Tracker</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 md:space-x-3">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-full flex items-center space-x-1.5 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-white/70 text-${accentColor}-700`)
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaTachometerAlt className="text-xs" />
                  <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/workouts" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-full flex items-center space-x-1.5 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-white/70 text-${accentColor}-700`)
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaDumbbell className="text-xs" />
                  <span>Treinos</span>
                </NavLink>
                
                <NavLink 
                  to="/exercises" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-full flex items-center space-x-1.5 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-white/70 text-${accentColor}-700`)
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaDumbbell className="text-xs" />
                  <span>Exercícios</span>
                </NavLink>
                
                <NavLink 
                  to="/stats" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-full flex items-center space-x-1.5 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-white/70 text-${accentColor}-700`)
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-800/30' 
                            : `${scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'}`)
                    }`
                  }
                >
                  <FaChartLine className="text-xs" />
                  <span>Estatísticas</span>
                </NavLink>
                
                {/* Dropdown do usuário */}
                <div className="relative ml-1.5">
                  <motion.button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/40 text-white hover:bg-gray-700/40' 
                        : scrolled ? 'bg-gray-100/50 text-gray-800 hover:bg-gray-200/50' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>{user?.name || 'Michel'}</span>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-gradient-to-r ${accentGradient}`}>
                      <FaUser className="text-white text-xs" />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-50 ${
                          darkMode 
                            ? 'bg-gray-800/90 backdrop-blur-md border border-gray-700/30' 
                            : 'bg-white/90 backdrop-blur-md border border-gray-200/30'
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      >
                        <Link 
                          to="/profile" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                          role="menuitem"
                        >
                          Perfil
                        </Link>
                        <Link 
                          to="/settings" 
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/50'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                          role="menuitem"
                        >
                          Configurações
                        </Link>
                        <hr className={`my-2 ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-red-400 hover:bg-gray-700/50' : 'text-red-600 hover:bg-gray-100/50'
                          }`}
                          role="menuitem"
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  darkMode 
                    ? `bg-${accentColor}-600/60 text-white hover:bg-${accentColor}-700/60` 
                    : scrolled ? `bg-${accentColor}-600/60 text-white hover:bg-${accentColor}-700/60` : 'bg-white/60 text-blue-600 hover:bg-blue-50/70'
                }`}
              >
                Entrar
              </Link>
            )}
            
            {/* Botão de tema */}
            <motion.button 
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/40 text-yellow-300 hover:bg-gray-700/40' 
                  : scrolled ? 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </motion.button>
          </nav>
          
          {/* Navegação Mobile */}
          <div className="flex items-center md:hidden">
            {/* Botão de tema para mobile */}
            <motion.button 
              onClick={toggleTheme}
              className={`p-2 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/40 text-yellow-300 hover:bg-gray-700/40' 
                  : scrolled ? 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </motion.button>
            
            {/* Botão do menu mobile */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`ml-2 p-2 rounded-full focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/40 text-white hover:bg-gray-700/40' 
                  : scrolled ? 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
            </motion.button>
          </div>
          
          {/* Menu Mobile Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="fixed inset-0 z-50 md:hidden"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { opacity: 1, pointerEvents: "auto" },
                  closed: { opacity: 0, pointerEvents: "none" }
                }}
                style={{ zIndex: 9999 }} // Garantir que fique acima de iframes
              >
                {/* Overlay de fundo */}
                <motion.div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                
                {/* Painel do menu */}
                <motion.div
                  className={`absolute top-0 right-0 w-4/5 h-full max-w-xs ${
                    darkMode ? 'bg-gray-900' : 'bg-white'
                  } shadow-xl flex flex-col overflow-hidden`}
                  variants={mobileMenuVariants}
                >
                  {/* Cabeçalho do menu */}
                  <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Menu
                      </span>
                      <motion.button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`p-2 rounded-full ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Fechar menu"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Itens do menu */}
                  <div className="flex-1 overflow-y-auto py-4">
                    {isAuthenticated ? (
                      <div className="space-y-1 px-3">
                        <div className={`mb-6 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <div className="flex items-center space-x-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r ${accentGradient}`}>
                              <FaUser className="text-white" />
                            </div>
                            <div>
                              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {user?.name || 'Michel'}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {user?.email || 'usuario@exemplo.com'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className={`px-4 py-2 text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Links Rápidos
                        </h3>
                        
                        <NavLink 
                          to="/dashboard" 
                          className={({ isActive }) => 
                            `block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-${accentColor}-50 text-${accentColor}-700`)
                                : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaTachometerAlt />
                          <span>Dashboard</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/workouts" 
                          className={({ isActive }) => 
                            `block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-${accentColor}-50 text-${accentColor}-700`)
                                : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaDumbbell />
                          <span>Treinos</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/exercises" 
                          className={({ isActive }) => 
                            `block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-${accentColor}-50 text-${accentColor}-700`)
                                : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaDumbbell />
                          <span>Exercícios</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/stats" 
                          className={({ isActive }) => 
                            `block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-${accentColor}-50 text-${accentColor}-700`)
                                : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaChartLine />
                          <span>Estatísticas</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/profile" 
                          className={({ isActive }) => 
                            `block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-${accentColor}-50 text-${accentColor}-700`)
                                : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaUser />
                          <span>Perfil</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/settings" 
                          className={({ isActive }) => 
                            `block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? (darkMode ? `bg-${accentColor}-600/60 text-white` : `bg-${accentColor}-50 text-${accentColor}-700`)
                                : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaCog />
                          <span>Configurações</span>
                        </NavLink>
                        
                        <div className={`my-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>
                        
                        <h3 className={`px-4 py-2 text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Recursos
                        </h3>
                        
                        <Link 
                          to="/blog" 
                          className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                            darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaBook />
                          <span>Blog</span>
                        </Link>
                        
                        <Link 
                          to="/tutorials" 
                          className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                            darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaBook />
                          <span>Tutoriais</span>
                        </Link>
                        
                        <Link 
                          to="/faq" 
                          className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                            darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaQuestionCircle />
                          <span>FAQ</span>
                        </Link>
                        
                        <Link 
                          to="/support" 
                          className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                            darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaHeadset />
                          <span>Suporte</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6 px-3">
                        <div className="space-y-1">
                          <h3 className={`px-4 py-2 text-xs font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Links Rápidos
                          </h3>
                          
                          <Link 
                            to="/dashboard" 
                            className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <FaTachometerAlt />
                            <span>Dashboard</span>
                          </Link>
                          
                          <Link 
                            to="/workouts" 
                            className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <FaDumbbell />
                            <span>Treinos</span>
                          </Link>
                          
                          <Link 
                            to="/exercises" 
                            className={`block px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-medium transition-all duration-300 ${
                              darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <FaDumbbell />
                            <span>Exercícios</span>
                          </Link>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className={`px-4 py-2 text-xs font-semibold uppercase ${darkMode ? 'text-gray-500'
