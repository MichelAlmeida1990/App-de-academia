// src/components/exercises/ExerciseTips.js
import React, { useState } from 'react';
import { 
  FaLightbulb, 
  FaExclamationTriangle, 
  FaCheck, 
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const AccordionItem = ({ icon, title, children, type = "info", defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getIconColor = () => {
    switch(type) {
      case "warning": return "text-orange-500";
      case "success": return "text-green-500";
      case "error": return "text-red-500";
      case "info":
      default: return "text-blue-500";
    }
  };

  const getBorderColor = () => {
    switch(type) {
      case "warning": return "border-orange-200 dark:border-orange-700";
      case "success": return "border-green-200 dark:border-green-700";
      case "error": return "border-red-200 dark:border-red-700";
      case "info":
      default: return "border-blue-200 dark:border-blue-700";
    }
  };

  return (
    <div className={`border rounded-md mb-3 bg-gray-50 dark:bg-gray-700 ${getBorderColor()}`}>
      <button
        className="w-full py-3 px-4 text-left font-medium flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <icon className={`mr-2 ${getIconColor()}`} />
          <span className="text-gray-700 dark:text-gray-200">{title}</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="text-gray-500 dark:text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="pb-4 px-4">
          {children}
        </div>
      )}
    </div>
  );
};

const ExerciseTips = ({ 
  commonMistakes = [], 
  formTips = [], 
  safetyTips = [], 
  variations = [] 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          💡 Dicas e Informações Adicionais
        </h3>

        <div className="space-y-3">
          {formTips.length > 0 && (
            <AccordionItem
              icon={FaCheck}
              title="Dicas de Forma Correta"
              type="success"
              defaultOpen={true}
            >
              <ul className="space-y-2 mt-3">
                {formTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {commonMistakes.length > 0 && (
            <AccordionItem
              icon={FaExclamationTriangle}
              title="Erros Comuns a Evitar"
              type="warning"
            >
              <ul className="space-y-2 mt-3">
                {commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                    <span className="text-gray-600 dark:text-gray-300">{mistake}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {safetyTips.length > 0 && (
            <AccordionItem
              icon={FaInfoCircle}
              title="Dicas de Segurança"
              type="info"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-3 mb-3">
                <div className="flex items-center">
                  <FaInfoCircle className="text-blue-500 mr-2" />
                  <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Sempre consulte um profissional antes de iniciar um novo programa de exercícios.
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">ℹ️</span>
                    <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {variations.length > 0 && (
            <AccordionItem
              icon={FaLightbulb}
              title="Variações do Exercício"
              type="info"
            >
              <ul className="space-y-2 mt-3">
                {variations.map((variation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2 mt-1">💡</span>
                    <span className="text-gray-600 dark:text-gray-300">{variation}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTips;
