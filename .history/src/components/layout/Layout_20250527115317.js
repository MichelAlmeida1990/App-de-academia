// src/components/layout/Layout.js (Versão Aprimorada)
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "../../context/ThemeContext";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "../common/ScrollToTop";
import PageTransition from "../common/PageTransition";

const Layout = () => {
  const { darkMode, accentColor, shouldAnimate } = useTheme();
  const location = useLocation();

  // Rola para o topo quando a rota muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Variantes de animação para a transição de página
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div 
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode 
          ? "dark bg-gradient-to-b from-gray-900 to-gray-800 text-white" 
          : `bg-gradient-to-b from-gray-50 to-white text-gray-800`
      }`}
    >
      {/* Componente para rolar para o topo quando a rota muda */}
      <ScrollToTop />
      
      {/* Cabeçalho fixo */}
      <Header />
      
      {/* Conteúdo principal com animação de transição */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className="flex-grow w-full pt-20 pb-10 px-4 sm:px-6 md:px-8"
          initial={shouldAnimate ? "initial" : false}
          animate={shouldAnimate ? "animate" : false}
          exit={shouldAnimate ? "exit" : false}
          variants={pageVariants}
          transition={{ duration: 0.3 }}
        >
          {/* Gradiente decorativo superior */}
          <div 
            className={`absolute top-16 left-0 right-0 h-64 opacity-30 pointer-events-none ${
              darkMode ? 'opacity-10' : 'opacity-30'
            }`}
            style={{
              background: `radial-gradient(circle at 50% 0%, var(--${accentColor}-500), transparent 70%)`
            }}
          />
          
          {/* Container do conteúdo principal */}
          <div className="relative max-w-6xl mx-auto w-full">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </motion.main>
      </AnimatePresence>
      
      {/* Rodapé */}
      <Footer />
      
      {/* Indicador de carregamento para navegação */}
      <div 
        className={`fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-300 transform origin-left scale-x-0 transition-transform duration-300`}
        id="navigation-progress"
      />
    </div>
  );
};

export default Layout;
