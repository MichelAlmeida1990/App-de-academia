// src/components/layout/Navbar.js - Versão modificada para evitar conflitos
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Este Navbar será usado como uma navegação secundária ou específica para seções
const Navbar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const { accentColor, darkMode } = useTheme();
  
  // Definir seção ativa com base no caminho atual
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/exercises')) {
      setActiveSection('exercises');
    } else if (path.includes('/nutrition')) {
      setActiveSection('nutrition');
    } else if (path.includes('/plans')) {
      setActiveSection('plans');
    } else {
      setActiveSection('overview');
    }
  }, [location]);

  // Variantes para animações
  const indicatorVariants = {
    initial: { opacity: 0, width: 0 },
    animate: { opacity: 1, width: '100%', transition: { duration: 0.3 } }
  };

  return (
    <nav className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full flex flex-wrap items-center">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center w-full">
            <li className="mr-2 flex-1">
              <Link
                to="/workouts/overview"
                className={`inline-block p-4 w-full border-b-2 rounded-t-lg ${
                  activeSection === 'overview'
                    ? `border-${accentColor}-600 text-${accentColor}-600 dark:text-${accentColor}-400 dark:border-${accentColor}-400`
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className="relative">
                  Visão Geral
                  {activeSection === 'overview' && (
                    <motion.div
                      variants={indicatorVariants}
                      initial="initial"
                      animate="animate"
                      className={`absolute bottom-0 left-0 h-0.5 bg-${accentColor}-600 dark:bg-${accentColor}-400 rounded-full -mb-1`}
                    />
                  )}
                </div>
              </Link>
            </li>
            <li className="mr-2 flex-1">
              <Link
                to="/workouts/exercises"
                className={`inline-block p-4 w-full border-b-2 rounded-t-lg ${
                  activeSection === 'exercises'
                    ? `border-${accentColor}-600 text-${accentColor}-600 dark:text-${accentColor}-400 dark:border-${accentColor}-400`
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className="relative">
                  Exercícios
                  {activeSection === 'exercises' && (
                    <motion.div
                      variants={indicatorVariants}
                      initial="initial"
                      animate="animate"
                      className={`absolute bottom-0 left-0 h-0.5 bg-${accentColor}-600 dark:bg-${accentColor}-400 rounded-full -mb-1`}
                    />
                  )}
                </div>
              </Link>
            </li>
            <li className="mr-2 flex-1">
              <Link
                to="/workouts/nutrition"
                className={`inline-block p-4 w-full border-b-2 rounded-t-lg ${
                  activeSection === 'nutrition'
                    ? `border-${accentColor}-600 text-${accentColor}-600 dark:text-${accentColor}-400 dark:border-${accentColor}-400`
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className="relative">
                  Nutrição
                  {activeSection === 'nutrition' && (
                    <motion.div
                      variants={indicatorVariants}
                      initial="initial"
                      animate="animate"
                      className={`absolute bottom-0 left-0 h-0.5 bg-${accentColor}-600 dark:bg-${accentColor}-400 rounded-full -mb-1`}
                    />
                  )}
                </div>
              </Link>
            </li>
            <li className="flex-1">
              <Link
                to="/workouts/plans"
                className={`inline-block p-4 w-full border-b-2 rounded-t-lg ${
                  activeSection === 'plans'
                    ? `border-${accentColor}-600 text-${accentColor}-600 dark:text-${accentColor}-400 dark:border-${accentColor}-400`
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className="relative">
                  Planos
                  {activeSection === 'plans' && (
                    <motion.div
                      variants={indicatorVariants}
                      initial="initial"
                      animate="animate"
                      className={`absolute bottom-0 left-0 h-0.5 bg-${accentColor}-600 dark:bg-${accentColor}-400 rounded-full -mb-1`}
                    />
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
