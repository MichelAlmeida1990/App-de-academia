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