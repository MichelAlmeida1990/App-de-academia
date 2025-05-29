import React from 'react';

/**
 * Componente de Card genérico com glassmorphism e tema branco unificado.
 * Aplica estilos consistentes com bordas sutis, background glassmorphism e elevação.
 * Pode ser clicável, adicionando estilos de cursor e hover.
 */
const Card = ({
  children,
  className = '',
  padding = 'normal', // 'none', 'small', 'normal', 'large'
  elevation = 'medium', // 'none', 'low', 'medium', 'high'
  onClick = null, // Função de callback para tornar o card clicável
}) => {
  // Estilos base glassmorphism com tema branco
  const baseStyles = 'bg-white/80 backdrop-blur-md border border-white/30 rounded-lg transition-all duration-300';

  // Mapeamento de estilos de padding para classes Tailwind
  const paddingStyles = {
    none: '',
    small: 'p-3',
    normal: 'p-4',
    large: 'p-6',
  };

  // Mapeamento de estilos de elevação (sombras)
  const elevationStyles = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };

  // Estilos de texto consistentes
  const textStyles = 'text-gray-800';

  // Estilos para tornar o card clicável com feedback visual
  const clickableStyles = onClick 
    ? 'cursor-pointer hover:shadow-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50' 
    : '';

  // Combina todas as classes Tailwind
  const cardClasses = `
    ${baseStyles}
    ${paddingStyles[padding] || paddingStyles.normal}
    ${elevationStyles[elevation] || elevationStyles.medium}
    ${textStyles}
    ${clickableStyles}
    ${className}
  `.trim();

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      // Adiciona atributos de acessibilidade se o card for clicável
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      // Adiciona suporte para navegação por teclado
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
