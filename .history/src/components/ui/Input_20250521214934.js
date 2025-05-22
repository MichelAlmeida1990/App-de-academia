// src/components/ui/Input.js
import React from 'react';

const Input = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  helperText,
  className = ''
}) => {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    dark:bg-gray-700 dark:border-gray-600 dark:text-white
    ${className}`;
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={inputClasses}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {helperText && (
        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
