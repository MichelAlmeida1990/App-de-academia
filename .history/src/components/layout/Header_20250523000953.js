// src/components/layout/Header.js - VERSÃO COMPLETA E CORRIGIDA
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt, FaBars, FaTimes, 
         FaBook, FaQuestionCircle, FaHeadset, FaCog, FaSignOutAlt, FaUserCircle, FaHome,
         FaUtensils, FaCalendarAlt, FaBell, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { darkMode, toggleTheme, accentColor } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Refs para controle de cliques fora
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Definir cores de destaque com base no tema atual
  const accentColors = {
    blue: darkMode ? 'from-blue-600 to-blue-400' : 'from-blue-500 to-blue-600',
    purple: darkMode ? 'from-purple-600 to-purple-400' : 'from-purple-500 to-purple-600',
    green: darkMode ? 'from-green-600 to-green-400' : 'from-green-500 to-green-600',
    red: darkMode ? 'from-red-600 to-red-400' : 'from-red-500 to-red-600',
  };
  
  const accentGradient = accentColors[accentColor] || accentColors.blue;
  
  // Effect para scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Effect para controlar overflow do body quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);
  
  // Effect para fechar menus quando a rota muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);
  
  // Effect para fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Effect para fechar menu mobile com ESC
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);
  
  // Função para logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  // Função para fechar menu mobile
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Variantes para animações
  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };
  
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
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
  
  // Links de navegação
  const navigationLinks = [
    { to: "/", label: "Início", icon: FaHome, public: true },
    { to: "/workouts/overview", label: "Dashboard", icon: FaTachometerAlt, auth: true },
    { to: "/workouts/exercises", label: "Exercícios", icon: FaDumbbell, auth: true },
    { to: "/workouts/nutrition", label: "Nutrição", icon: FaUtensils, auth: true },
    { to: "/workouts/plans", label: "Planos", icon: FaCalendarAlt, auth: true },
    { to: "/progress", label: "Progresso", icon: FaChartLine, auth: true },
  ];
  
  // Filtrar links baseado na autenticação
  const visibleLinks = navigationLinks.filter(link => 
    link.public || (link.auth && isAuthenticated)
  );
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? `${darkMode ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50' : 'bg-white/95 backdrop-blur-md border-b border-gray-200/50'}` 
          : `${darkMode ? 'bg-gray-900/40 backdrop-blur-sm' : `bg-gradient-to-r ${accentGradient} backdrop-blur-sm`}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="FitnessTracker Logo" className="h-8 w-auto" />
              <span className={`font-bold text-lg ${scrolled && !darkMode ? 'text-gray-800' : 'text-white'} tracking-tight hidden sm:block`}>
                Fitness<span className={`text-${accentColor}-300 font-extrabold`}>Tracker</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleLinks.map((link, index) => (
              <motion.div
                key={link.to}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? `${darkMode ? 'bg-white/10 text-white' : scrolled ? 'bg-gray-800/10 text-gray-800' : 'bg-white/20 text-white'}`
                        : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : scrolled ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50' : 'text-white/80 hover:text-white hover:bg-white/10'}`
                    }`
                  }
                >
                  <link.icon className="text-sm" />
                  <span className="text-sm">{link.label}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>
          
          {/* Ações do usuário - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Botão de tema */}
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
            
            {/* Menu do usuário ou botões de login/registro */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-full focus:outline-none transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/40 text-white hover:bg-gray-700/40' 
                      : scrolled ? 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-expanded={isDropdownOpen}
                  aria-label="Menu do usuário"
                >
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm font-medium hidden xl:block">
                    {user?.name || user?.email || 'Usuário'}
                  </span>
                </motion.button>
                
                {/* Dropdown do usuário */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={`absolute right-0 mt-2 w-56 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-lg shadow-lg border ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      } py-2 z-50`}
                    >
                      <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {user?.name || 'Usuário'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user?.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                          darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } transition-colors`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUser />
                        <span>Perfil</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                          darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } transition-colors`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaCog />
                        <span>Configurações</span>
                      </Link>
                      
                      <Link
                        to="/help"
                        className={`flex items-center space-x-3 px-4 py-2 text-sm ${
                          darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } transition-colors`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaQuestionCircle />
                        <span>Ajuda</span>
                      </Link>
                      
                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-2 pt-2`}>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-600 hover:text-red-700 hover:bg-gray-100'
                          } transition-colors`}
                        >
                          <FaSignOutAlt />
                          <span>Sair</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-white/5' 
                      : scrolled ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
          
          {/* Controles Mobile */}
          <div className="flex items-center lg:hidden space-x-2">
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
              className={`p-2 rounded-full focus:outline-none transition-all duration-300 ${
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
      
      {/* Menu Mobile - VERSÃO COMPLETA E OTIMIZADA */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Overlay de fundo */}
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            {/* Painel do menu */}
            <motion.div
              ref={mobileMenuRef}
              className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-2xl flex flex-col z-50`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Cabeçalho do menu */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                    <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Fitness<span className={`text-${accentColor}-500`}>Tracker</span>
                    </span>
                  </div>
                  <motion.button
                    onClick={closeMobileMenu}
                    className={`p-2 rounded-full ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Fechar menu"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
                
                {/* Info do usuário no mobile */}
                {isAuthenticated && user && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                        <FaUserCircle className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {user.name || 'Usuário'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navegação principal */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-4">
                  {visibleLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={link.to}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                            isActive
                              ? `${darkMode ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-400' : 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'}`
                              : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
                          }`
                        }
                      >
                        <link.icon className="text-lg flex-shrink-0" />
                        <span>{link.label}</span>
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>
                
                {/* Seção adicional para usuários autenticados */}
                {isAuthenticated && (
                  <>
                    <div className={`mx-4 my-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`} />
                    
                    <nav className="space-y-1 px-4">
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <FaUser className="text-lg flex-shrink-0" />
                        <span>Perfil</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <FaCog className="text-lg flex-shrink-0" />
                        <span>Configurações</span>
                      </Link>
                      
                      <Link
                        to="/help"
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <FaQuestionCircle className="text-lg flex-shrink-0" />
                        <span>Ajuda</span>
                      </Link>
                    </nav>
                  </>
                )}
              </div>
              
              {/* Rodapé do menu */}
              <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                        : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                    }`}
                  >
                    <FaSignOutAlt className="text-lg flex-shrink-0" />
                    <span>Sair</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        darkMode 
                          ? 'border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800' 
                          : 'border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        darkMode 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Registrar
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
