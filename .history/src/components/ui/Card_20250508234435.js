import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ 
  children, 
  className = '', 
  padding = 'normal', 
  elevation = 'medium',
  onClick = null
}) => {
  const { theme } = useTheme();
  
  const baseStyles = 'rounded-lg transition-shadow';
  
  const paddingStyles = {
    none: '',
    small: 'p-2',
    normal: 'p-4',
    large: 'p-6',
  };
  
  const elevationStyles = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };
  
  const themeStyles = theme === 'dark' 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900';
  
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-lg' : '';
  
  const cardClasses = `
    ${baseStyles}
    ${paddingStyles[padding] || paddingStyles.normal}
    ${elevationStyles[elevation] || elevationStyles.medium}
    ${themeStyles}
    ${clickableStyles}
    ${className}
  `;
  
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
