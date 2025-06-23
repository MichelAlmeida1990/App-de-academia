// src/components/dev/ClearDataButton.js
import React, { useState } from 'react';
import { FaTrash, FaDatabase, FaInfoCircle } from 'react-icons/fa';
import useClearData from '../../hooks/useClearData';

/**
 * Botão para limpar dados durante desenvolvimento
 * Só aparece em ambiente de desenvolvimento
 */
const ClearDataButton = () => {
  const { clearAll, clearDemo, listData, debugLocalStorage } = useClearData();
  const [showMenu, setShowMenu] = useState(false);
  const [lastAction, setLastAction] = useState('');

  // Só renderiza em desenvolvimento
  const isDev = process.env.NODE_ENV === 'development' || 
               window.location.hostname.includes('localhost');

  if (!isDev) return null;

  const handleClearAll = () => {
    if (window.confirm('🗑️ Limpar TODOS os dados salvos? Esta ação não pode ser desfeita.')) {
      const count = clearAll();
      setLastAction(`✅ ${count} itens removidos`);
      setShowMenu(false);
    }
  };

  const handleClearDemo = () => {
    const count = clearDemo();
    setLastAction(`🎯 ${count} dados demo removidos`);
    setShowMenu(false);
  };

  const handleListData = () => {
    const data = listData();
    setLastAction(`📊 ${Object.keys(data).length} itens listados no console`);
  };

  const handleDebug = () => {
    debugLocalStorage();
    setLastAction('🔍 Debug executado - veja o console');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Resultado da última ação */}
      {lastAction && (
        <div className="mb-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm max-w-xs">
          {lastAction}
          <button 
            onClick={() => setLastAction('')}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Menu de opções */}
      {showMenu && (
        <div className="mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[200px]">
          <div className="space-y-1">
            <button
              onClick={handleClearAll}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm"
            >
              <FaTrash />
              Limpar Todos os Dados
            </button>
            
            <button
              onClick={handleClearDemo}
              className="w-full flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md text-sm"
            >
              <FaDatabase />
              Limpar Dados Demo
            </button>
            
            <button
              onClick={handleListData}
              className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-sm"
            >
              <FaInfoCircle />
              Listar Dados
            </button>
            
            <button
              onClick={handleDebug}
              className="w-full flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md text-sm"
            >
              <FaInfoCircle />
              Debug Console
            </button>
          </div>
        </div>
      )}

      {/* Botão principal */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        title="Ferramentas de desenvolvimento - Limpar dados"
      >
        <FaDatabase size={20} />
      </button>
    </div>
  );
};

export default ClearDataButton; 