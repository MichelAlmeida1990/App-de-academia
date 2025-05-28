// src/components/Card.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Componente de Card genérico com estilos personalizáveis e suporte a tema.
 * Aplica estilos de padding, elevação (sombras) e tema (claro/escuro).
 * Pode ser clicável, adicionando estilos de cursor e hover.
 */
const Card = ({
  children,
  className = '',
  padding = 'normal', // 'none', 'small', 'normal', 'large'
  elevation = 'medium', // 'none', 'low', 'medium', 'high'
  onClick = null, // Função de callback para tornar o card clicável
}) => {
  const { darkMode } = useTheme(); // Usar darkMode diretamente do contexto

  // Estilos base para todos os cards
  const baseStyles = 'rounded-lg transition-shadow duration-300';

  // Mapeamento de estilos de padding para classes Tailwind
  const paddingStyles = {
    none: '',
    small: 'p-2',
    normal: 'p-4',
    large: 'p-6',
  };

  // Mapeamento de estilos de elevação (sombras) para classes Tailwind
  const elevationStyles = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };

  // Estilos de tema (claro/escuro)
  const themeStyles = darkMode
    ? 'bg-gray-800 text-white' // Modo escuro: fundo cinza escuro, texto branco
    : 'bg-white text-gray-900'; // Modo claro: fundo branco, texto cinza escuro

  // Estilos para tornar o card clicável, com feedback visual no hover
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-xl' : ''; // Adiciona sombra maior no hover

  // Combina todas as classes Tailwind
  const cardClasses = `
    ${baseStyles}
    ${paddingStyles[padding] || paddingStyles.normal}
    ${elevationStyles[elevation] || elevationStyles.medium}
    ${themeStyles}
    ${clickableStyles}
    ${className}
  `.trim(); // .trim() remove espaços em branco extras no início/fim

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      // Adiciona atributos de acessibilidade se o card for clicável
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
```javascript
// src/components/layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaDumbbell, FaChartLine, FaTachometerAlt, FaBars, FaTimes,
         FaCog, FaSignOutAlt, FaUserCircle, FaQuestionCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
// import logo from '../../assets/images/logo.png'; // Não está sendo usado diretamente no JSX

/**
 * Componente Header (cabeçalho) da aplicação.
 * Contém navegação, alternância de tema, menu do usuário e menu mobile.
 */
const Header = () => {
  const { darkMode, toggleTheme, accentColor } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para controlar a visibilidade de menus e o estado de scroll
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Refs para controlar cliques fora dos menus
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Efeito para detectar o scroll da página e aplicar estilos ao header
  useEffect(() => {
    const handleScroll = () => {
      // Define 'scrolled' como true se a página tiver rolado mais de 10px
      setScrolled(window.scrollY > 10);
    };

    // Adiciona o event listener para scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Remove o event listener na desmontagem do componente para evitar vazamento de memória
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Efeito para controlar o overflow do body quando o menu mobile está aberto
  // Isso impede o scroll do conteúdo principal enquanto o menu está ativo
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // Impede o scroll
      document.body.style.position = 'fixed';   // Fixa o body
      document.body.style.width = '100%';       // Garante que o body ocupe 100% da largura
    } else {
      // Restaura os estilos padrão do body
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Função de limpeza para restaurar os estilos do body na desmontagem
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]); // Dependência: executa quando isMobileMenuOpen muda

  // Efeito para fechar menus quando a rota (URL) muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]); // Dependência: executa quando o caminho da URL muda

  // Efeito para fechar o dropdown do usuário quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o clique não foi dentro do dropdown, fecha-o
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Adiciona o event listener para cliques no documento
    document.addEventListener('mousedown', handleClickOutside);
    // Remove o event listener na desmontagem
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Efeito para fechar menus com a tecla ESC
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    // Adiciona o event listener para teclas
    document.addEventListener('keydown', handleEscapeKey);
    // Remove o event listener na desmontagem
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto de autenticação
    navigate('/'); // Redireciona para a página inicial
    setIsDropdownOpen(false); // Fecha o dropdown
    setIsMobileMenuOpen(false); // Fecha o menu mobile
  };

  // Função para fechar o menu mobile
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Variantes para animações do Framer Motion para o dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  };

  // Definição dos links de navegação
  const navigationLinks = [
    { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt, auth: true },
    { to: "/workouts", label: "Treinos", icon: FaDumbbell, auth: true },
    { to: "/exercises", label: "Exercícios", icon: FaDumbbell, auth: true },
    { to: "/progress", label: "Progresso", icon: FaChartLine, auth: true },
    { to: "/stats", label: "Estatísticas", icon: FaChartLine, auth: true },
    // Adicione links públicos aqui se houver (ex: { to: "/about", label: "Sobre", public: true })
  ];

  // Filtra os links de navegação com base no estado de autenticação
  const visibleLinks = navigationLinks.filter(link =>
    link.public || (link.auth && isAuthenticated)
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'card-glass border-b border-white/20' // Estilo glassmorphism quando scrollado
            : 'bg-transparent' // Fundo transparente no topo
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
                  <span className="text-white text-xl font-bold">🏋️</span> {/* Ícone emoji */}
                </div>
                <span className="font-bold text-xl text-white tracking-tight hidden sm:block">
                  Fitness<span className="text-gradient-light">Tracker</span> {/* Texto com gradiente */}
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
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' // Estilo ativo
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm' // Estilo padrão/hover
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
                      {user?.name || user?.email || 'Usuário'} {/* Exibe nome ou email do usuário */}
                    </span>
                  </motion.button>

                  {/* Dropdown do usuário (animado com Framer Motion) */}
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
                // Botões de Login/Registro para usuários não autenticados
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

            {/* Controles Mobile (visíveis apenas em telas pequenas) */}
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

      {/* Menu Mobile (animado com Framer Motion) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Overlay de fundo (para fechar o menu ao clicar fora) */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Painel do menu mobile */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] card-glass shadow-2xl flex flex-col z-[70] overflow-y-auto border-l border-white/20"
              initial={{ x: "100%" }} // Começa fora da tela à direita
              animate={{ x: 0 }}     // Desliza para a posição 0
              exit={{ x: "100%" }}    // Desliza de volta para fora da tela
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              {/* Cabeçalho do menu mobile */}
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

                {/* Info do usuário no mobile (se autenticado) */}
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

              {/* Navegação principal do menu mobile */}
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
                            ? 'bg-white/20 text-white border-l-4 border-purple-400' // Estilo ativo com borda lateral
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      <link.icon className="text-lg flex-shrink-0" />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </nav>

                {/* Seção adicional para usuários autenticados no mobile */}
                {isAuthenticated && (
                  <>
                    <div className="mx-4 my-6 border-t border-white/20" /> {/* Divisor */}

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

              {/* Rodapé do menu mobile (botões de sair/entrar/registrar) */}
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
```javascript
// src/App.js - VERSÃO FINAL CORRIGIDA
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

// MUI Imports (se estiver usando Material-UI)
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getMuiTheme from './theme/muiTheme'; // Importa seu tema MUI personalizado

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import ProgressPage from './pages/ProgressPage';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Components
import ActiveWorkout from './components/workout/ActiveWorkout';

/**
 * Componente para a página de treino ativo.
 * Encapsula o componente ActiveWorkout para ser usado em uma rota.
 */
const ActiveWorkoutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ActiveWorkout />
    </div>
  );
};

/**
 * Componente placeholder para a página de edição de treino.
 * Substitua este placeholder pela sua implementação real de EditWorkoutPage
 * se você tiver um arquivo `src/pages/EditWorkoutPage.js` completo.
 */
const EditWorkoutPage = () => {
  // Exemplo de como importar e usar a página real se ela existir:
  // import ActualEditWorkoutPage from './pages/EditWorkoutPage';
  // return <ActualEditWorkoutPage />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Editar Treino</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Funcionalidade de edição em desenvolvimento...
        </p>
      </div>
    </div>
  );
};

/**
 * Componente de redirecionamento inteligente.
 * Redireciona para o dashboard se o usuário estiver autenticado,
 * caso contrário, exibe a HomePage.
 */
const SmartRedirect = () => {
  const { isAuthenticated } = useAuth();

  // Se autenticado, redireciona para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não autenticado, mostra HomePage
  return <HomePage />;
};

/**
 * Componente que consome o ThemeContext e aplica o Material-UI ThemeProvider.
 * Isso garante que o tema do Material-UI seja sincronizado com o tema personalizado.
 */
const ThemedAppContent = () => {
  const { darkMode } = useTheme(); // Pega o estado darkMode do seu ThemeContext
  const muiTheme = getMuiTheme(darkMode); // Cria o tema MUI baseado no darkMode

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* Normaliza o CSS do navegador e aplica as cores base do tema MUI */}
      <Router>
        {/* O min-h-screen e transition-colors são importantes para o layout e transição de tema */}
        {/* Removido bg-gray-50 dark:bg-gray-900 aqui para permitir que o body.css em index.css defina o background */}
        <div className="min-h-screen transition-colors duration-200">
          <Routes>
            {/* ROTA RAIZ CORRIGIDA - Redirecionamento inteligente */}
            <Route path="/" element={<SmartRedirect />} />

            {/* Rotas públicas de autenticação */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Rotas protegidas que usam o Layout (Header, Footer, etc.) */}
            <Route element={<Layout />}>
              {/* Dashboard - página principal após login */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de treinos */}
              <Route
                path="/workouts"
                element={
                  <ProtectedRoute>
                    <WorkoutsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/new"
                element={
                  <ProtectedRoute>
                    <NewWorkoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/:id"
                element={
                  <ProtectedRoute>
                    <WorkoutDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditWorkoutPage /> {/* Usa a página de edição correta aqui */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/:id/active"
                element={
                  <ProtectedRoute>
                    <ActiveWorkoutPage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de exercícios */}
              <Route
                path="/exercises"
                element={
                  <ProtectedRoute>
                    <ExercisesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exercise/:id"
                element={
                  <ProtectedRoute>
                    <ExerciseDetailPage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de perfil e configurações */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de estatísticas e progresso */}
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <StatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <ProgressPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Rota de fallback - redireciona para a home se nenhuma rota corresponder */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Componentes globais que aparecem em todas as páginas */}
          <ConnectionStatus />
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

/**
 * Componente principal da aplicação.
 * Envolve toda a aplicação com os provedores de contexto necessários.
 */
function App() {
  return (
    <AuthProvider>
      <AppThemeProvider> {/* Seu ThemeContext personalizado */}
        <ToastProvider>
          <WorkoutProvider>
            <ExerciseProvider>
              <ThemedAppContent /> {/* Renderiza o componente que configura o tema MUI e as rotas */}
            </ExerciseProvider>
          </WorkoutProvider>
        </ToastProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}

export default App;
