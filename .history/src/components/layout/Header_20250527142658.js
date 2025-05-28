// src/components/layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt, FaBars, FaTimes, 
         FaCog, FaSignOutAlt, FaUserCircle, FaQuestionCircle } from 'react-icons/fa';
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
  
  // Effect para scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Effect para controlar overflow do body quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
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
  
  // Variantes para animações otimizadas
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };
  
  // Links de navegação
  const navigationLinks = [
    { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt, auth: true },
    { to: "/workouts", label: "Treinos", icon: FaDumbbell, auth: true },
    { to: "/exercises", label: "Exercícios", icon: FaDumbbell, auth: true },
    { to: "/progress", label: "Progresso", icon: FaChartLine, auth: true },
    { to: "/stats", label: "Estatísticas", icon: FaChartLine, auth: true },
  ];
  
  // Filtrar links baseado na autenticação
  const visibleLinks = navigationLinks.filter(link => 
    link.public || (link.auth && isAuthenticated)
  );
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'card-glass border-b border-white/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center flex-shrink-0"
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">🏋️</span>
                </div>
                <span className="font-bold text-xl text-white tracking-tight hidden sm:block">
                  Fitness<span className="text-gradient-light">Tracker</span>
                </span>
              </Link>
            </motion.div>
            
            {/* Navegação Desktop */}
            <nav className="hidden lg:flex items-center space-x-2">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                    }`
                  }
                >
                  <link.icon className="text-sm" />
                  <span className="text-sm">{link.label}</span>
                </NavLink>
              ))}
            </nav>
            
            {/* Ações do usuário - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              
              {/* Botão de tema */}
              <motion.button 
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-all duration-300 backdrop-blur-sm border border-white/20"
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
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-all duration-300 backdrop-blur-sm border border-white/20"
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
                        className="absolute right-0 mt-3 w-64 card-glass rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                      >
                        <div className="px-4 py-4 border-b border-white/20">
                          <p className="text-sm font-medium text-white">
                            {user?.name || 'Usuário'}
                          </p>
                          <p className="text-sm text-white/70">
                            {user?.email}
                          </p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUser />
                          <span>Perfil</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog />
                          <span>Configurações</span>
                        </Link>
                        
                        <div className="border-t border-white/20 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 text-sm w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-300"
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
                <div className="flex items-center space-x-3">
                  <Link
                    to="/auth"
                    className="px-4 py-2.5 text-sm font-medium rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/auth"
                    className="btn-gradient px-6 py-2.5 text-sm font-medium rounded-xl"
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
                className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-all duration-300 backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
              </motion.button>
              
              {/* Botão do menu mobile */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-all duration-300 backdrop-blur-sm border border-white/20"
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
      </header>
      
      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Overlay de fundo */}
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            {/* Painel do menu */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] card-glass shadow-2xl flex flex-col z-[70] overflow-y-auto border-l border-white/20"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              {/* Cabeçalho do menu */}
              <div className="p-6 border-b border-white/20 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🏋️</span>
                    </div>
                    <span className="font-bold text-lg text-white">
                      Fitness<span className="text-gradient-light">Tracker</span>
                    </span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Fechar menu"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                {/* Info do usuário no mobile */}
                {isAuthenticated && user && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <FaUserCircle className="text-lg text-white/70" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {user.name || 'Usuário'}
                        </p>
                        <p className="text-sm text-white/70">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navegação principal */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-4">
                  {visibleLinks.map((link, index) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-white/20 text-white border-l-4 border-purple-400'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      <link.icon className="text-lg flex-shrink-0" />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </nav>
                
                {/* Seção adicional para usuários autenticados */}
                {isAuthenticated && (
                  <>
                    <div className="mx-4 my-6 border-t border-white/20" />
                    
                    <nav className="space-y-2 px-4">
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <FaUser className="text-lg flex-shrink-0" />
                        <span>Perfil</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <FaCog className="text-lg flex-shrink-0" />
                        <span>Configurações</span>
                      </Link>
                    </nav>
                  </>
                )}
              </div>
              
              {/* Rodapé do menu */}
              <div className="p-4 border-t border-white/20 flex-shrink-0">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                  >
                    <FaSignOutAlt className="text-lg flex-shrink-0" />
                    <span>Sair</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth"
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/auth"
                      onClick={closeMobileMenu}
                      className="btn-gradient block w-full text-center px-4 py-3 rounded-xl font-medium"
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
    </>
  );
};

export default Header;
