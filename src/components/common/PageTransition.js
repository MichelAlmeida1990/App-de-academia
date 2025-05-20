import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';

/**
 * Componente avançado para envolver conteúdo de página com animações de transição
 * Oferece diferentes estilos de transição baseados no tipo de página
 */
const PageTransition = ({ children, transitionType = 'default' }) => {
  const { shouldAnimate, theme } = useTheme();
  const location = useLocation();
  
  // Se o usuário preferir movimento reduzido, não animamos
  if (!shouldAnimate) {
    return <>{children}</>;
  }
  
  // Mapa de animações para diferentes tipos de páginas
  const transitions = {
    // Transição padrão com fade e movimento suave
    default: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1
      }
    },
    
    // Transição para páginas de exercícios - mais dinâmica
    exercise: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    
    // Transição para páginas de workout - mais energética
    workout: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20
      }
    },
    
    // Transição para dashboard - mais profissional
    dashboard: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0 },
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.4
      }
    },
    
    // Transição para páginas de perfil/configurações - mais suave
    profile: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    
    // Transição para páginas de estatísticas - mais técnica
    stats: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0 },
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20
      }
    }
  };
  
  // Detectar automaticamente o tipo de página com base na URL
  const detectPageType = () => {
    const path = location.pathname;
    if (path.includes('/exercise')) return 'exercise';
    if (path.includes('/workout')) return 'workout';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/profile') || path.includes('/settings')) return 'profile';
    if (path.includes('/stats') || path.includes('/progress')) return 'stats';
    return 'default';
  };
  
  // Usar o tipo de transição fornecido ou detectar automaticamente
  const pageType = transitionType === 'default' ? detectPageType() : transitionType;
  const animationProps = transitions[pageType] || transitions.default;
  
  // Adicionar variação sutil baseada no tema atual
  const themeVariation = theme === 'dark' 
    ? { backgroundColor: 'rgba(0,0,0,0)' } 
    : { backgroundColor: 'rgba(255,255,255,0)' };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ ...animationProps.initial, ...themeVariation }}
        animate={{ ...animationProps.animate, ...themeVariation }}
        exit={animationProps.exit}
        transition={animationProps.transition}
        className="page-transition-container"
      >
        {children}
        
        {/* Efeito sutil de destaque para páginas importantes */}
        {(pageType === 'workout' || pageType === 'exercise') && (
          <motion.div
            className="page-highlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme === 'dark' 
                ? 'radial-gradient(circle at 50% 30%, rgba(100,100,255,0.15), transparent 70%)' 
                : 'radial-gradient(circle at 50% 30%, rgba(0,100,255,0.07), transparent 70%)',
              zIndex: -1,
              pointerEvents: 'none'
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
