// src/components/layout/Header.js
// Adicione esta linha no final do arquivo

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
            {/* Conteúdo da navegação desktop - mantido como está */}
            {/* ... */}
          </nav>
          
          {/* Navegação Mobile - PARTE CORRIGIDA */}
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
        </div>
      </div>
      
      {/* Menu Mobile - CORRIGIDO E SEPARADO DO HEADER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay de fundo escuro */}
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Painel lateral do menu */}
            <motion.div
              className={`fixed inset-y-0 right-0 w-4/5 max-w-sm h-full z-50 flex flex-col ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-xl`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
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
                      darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Fechar menu"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>
              
              {/* Conteúdo do menu */}
              <div className="flex-1 overflow-y-auto py-4 px-4">
                <nav className="space-y-1">
                  {isAuthenticated ? (
                    <>
                      <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                          isActive 
                            ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                            : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaTachometerAlt className="mr-3" />
                        <span>Dashboard</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/workouts" 
                        className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                          isActive 
                            ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                            : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaDumbbell className="mr-3" />
                        <span>Treinos</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/stats" 
                        className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                          isActive 
                            ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                            : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaChartLine className="mr-3" />
                        <span>Estatísticas</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/profile" 
                        className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                          isActive 
                            ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                            : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUser className="mr-3" />
                        <span>Perfil</span>
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink 
                        to="/login" 
                        className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                          isActive 
                            ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                            : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUser className="mr-3" />
                        <span>Entrar</span>
                      </NavLink>
                      
                      <NavLink 
                        to="/register" 
                        className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                          isActive 
                            ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                            : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUser className="mr-3" />
                        <span>Registrar</span>
                      </NavLink>
                    </>
                  )}
                  
                  <div className={`my-2 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                  
                  <NavLink 
                    to="/faq" 
                    className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                        : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaQuestionCircle className="mr-3" />
                    <span>FAQ</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/support" 
                    className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                        : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaHeadset className="mr-3" />
                    <span>Suporte</span>
                  </NavLink>
                </nav>
              </div>
              
              {/* Rodapé do menu com botão de logout */}
              {isAuthenticated && (
                <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center p-3 rounded-lg text-center font-medium ${
                      darkMode 
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                        : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                    }`}
                  >
                    Sair
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

// Adicione esta linha para exportar o componente corretamente
export default Header;
