import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false, 
  onClick, 
  type = 'button',
  className = ''
}) => {
  const { theme } = useTheme();
  
  const baseStyles = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${theme === 'dark' ? 'hover:bg-blue-500' : ''}`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : ''}`,
    outline: `border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 ${theme === 'dark' ? 'border-blue-400 text-blue-400 hover:bg-blue-900' : ''}`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 ${theme === 'dark' ? 'hover:bg-red-500' : ''}`,
    success: `bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 ${theme === 'dark' ? 'hover:bg-green-500' : ''}`,
  };
  
  const sizeStyles = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `
    ${baseStyles} 
    ${variantStyles[variant] || variantStyles.primary} 
    ${sizeStyles[size] || sizeStyles.medium} 
    ${widthStyles} 
    ${disabledStyles}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
