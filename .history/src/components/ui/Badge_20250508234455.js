import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  rounded = true,
  className = ''
}) => {
  const { theme } = useTheme();
  
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variantStyles = {
    default: `bg-gray-100 text-gray-800 ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}`,
    primary: `bg-blue-100 text-blue-800 ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : ''}`,
    success: `bg-green-100 text-green-800 ${theme === 'dark' ? 'bg-green-900 text-green-200' : ''}`,
    warning: `bg-yellow-100 text-yellow-800 ${theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : ''}`,
    danger: `bg-red-100 text-red-800 ${theme === 'dark' ? 'bg-red-900 text-red-200' : ''}`,
    info: `bg-indigo-100 text-indigo-800 ${theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : ''}`,
  };
  
  const sizeStyles = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-2.5 py-0.5',
    large: 'text-base px-3 py-1',
  };
  
  const roundedStyles = rounded ? 'rounded-full' : 'rounded';
  
  const badgeClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.default}
    ${sizeStyles[size] || sizeStyles.medium}
    ${roundedStyles}
    ${className}
  `;
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;
