import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente para envolver conteúdo de página com animações de transição
 */
const PageTransition = ({ children }) => {
  const { shouldAnimate } = useTheme();
  
  // Se o usuário preferir movimento reduzido, não animamos
  if (!shouldAnimate) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PageTransition;
