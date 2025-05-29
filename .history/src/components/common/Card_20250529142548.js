import React from 'react';

/**
 * Componente de Card genérico com glassmorphism e tema roxo unificado.
 * Aplica estilos consistentes com bordas roxas, background glassmorphism e elevação.
 * Pode ser clicável, adicionando estilos de cursor e hover roxos.
 */
const Card = ({
  children,
  className = '',
  padding = 'normal', // 'none', 'small', 'normal', 'large'
  elevation = 'medium', // 'none', 'low', 'medium', 'high'
  onClick = null, // Função de callback para tornar o card clicável
}) => {
  // Estilos base glassmorphism com tema roxo
  const baseStyles = 'bg-white/80 backdrop-blur-md border border-purple-100 rounded-lg transition-all duration-300';

  // Mapeamento de estilos de padding para classes Tailwind
  const paddingStyles = {
    none: '',
    small: 'p-3',
    normal: 'p-4',
    large: 'p-6',
  };

  // Mapeamento de estilos de elevação (sombras) com tema roxo
  const elevationStyles = {
    none: '',
    low: 'shadow-sm shadow-purple-100/50',
    medium: 'shadow-md shadow-purple-200/50',
    high: 'shadow-lg shadow-purple-300/50',
  };

  // Estilos de texto consistentes
  const textStyles = 'text-gray-900';

  // Estilos para tornar o card clicável com feedback visual roxo
  const clickableStyles = onClick 
    ? 'cursor-pointer hover:shadow-xl hover:shadow-purple-300/50 hover:border-purple-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50' 
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
