// src/components/EmptyState.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const EmptyState = ({ 
  title = "Nenhum item encontrado", 
  description = "Não há itens para exibir no momento.",
  icon: Icon = FiPlus,
  actionLink,
  actionText
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
        <Icon className="w-12 h-12 text-gray-400 dark:text-gray-300" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      
      {actionLink && actionText && (
        <Link 
          to={actionLink} 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center transition"
        >
          <FiPlus className="mr-2" />
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
