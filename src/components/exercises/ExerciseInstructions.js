// src/components/exercises/ExerciseInstructions.js
import React from 'react';
import { FaListOl, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

const ExerciseInstructions = ({ instructions, tips, level }) => {
  // Debug para ver o que está sendo recebido
  console.log('ExerciseInstructions - instructions:', instructions);
  console.log('ExerciseInstructions - type:', typeof instructions);
  console.log('ExerciseInstructions - isArray:', Array.isArray(instructions));

  // Proteção: garantir que instructions seja um array
  const instructionsList = React.useMemo(() => {
    if (!instructions) {
      console.log('No instructions provided');
      return [];
    }
    
    // Se instructions já é um array
    if (Array.isArray(instructions)) {
      console.log('Instructions is array:', instructions);
      return instructions;
    }
    
    // Se instructions é uma string, dividir por quebras de linha ou pontos
    if (typeof instructions === 'string') {
      console.log('Instructions is string:', instructions);
      // Tentar dividir por quebras de linha primeiro
      let split = instructions.split('\n').filter(item => item.trim());
      
      // Se não há quebras de linha, tentar dividir por números seguidos de ponto
      if (split.length === 1) {
        split = instructions.split(/\d+\.\s*/).filter(item => item.trim());
      }
      
      // Se ainda é apenas um item, dividir por pontos finais
      if (split.length === 1) {
        split = instructions.split('.').filter(item => item.trim());
      }
      
      const result = split.map(item => item.trim()).filter(item => item.length > 0);
      console.log('Processed string instructions:', result);
      return result;
    }
    
    console.log('Instructions is unknown type, returning empty array');
    return [];
  }, [instructions]);

  // Proteção: garantir que tips seja um array
  const tipsList = React.useMemo(() => {
    if (!tips) return [];
    
    if (Array.isArray(tips)) {
      return tips;
    }
    
    if (typeof tips === 'string') {
      return tips.split('\n').filter(item => item.trim()).map(item => item.trim());
    }
    
    return [];
  }, [tips]);

  // Função para determinar a cor do badge baseado no nível
  const getLevelBadgeClasses = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
      case 'iniciante':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate':
      case 'intermediário':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'advanced':
      case 'avançado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div className="p-5">
        {/* Cabeçalho com título e nível */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaListOl className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Instruções
            </h3>
          </div>
          
          {level && (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelBadgeClasses(level)}`}>
              {level}
            </span>
          )}
        </div>
        
        {/* Lista de instruções */}
        {instructionsList && instructionsList.length > 0 ? (
          <ol className="space-y-3 mb-4">
            {instructionsList.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <FaExclamationTriangle />
              <span className="font-medium">Instruções não disponíveis</span>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 mt-1 text-sm">
              As instruções para este exercício não estão disponíveis no momento.
            </p>
          </div>
        )}
        
        {/* Seção de dicas (se existirem) */}
        {tipsList && tipsList.length > 0 && (
          <>
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            <div className="flex items-center gap-2 mb-3">
              <FaLightbulb className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Dicas
              </h3>
            </div>
            <ul className="space-y-2">
              {tipsList.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseInstructions;
