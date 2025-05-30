import React from 'react';
import { FaTimes, FaDumbbell, FaClock, FaList } from 'react-icons/fa';
import { getExerciseImage } from '../../services/exerciseMediaService';

const ExerciseModal = ({ exercise, onClose }) => {
  const imageUrl = getExerciseImage(exercise.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {exercise.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          {/* Imagem de demonstração */}
          <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Demonstração do exercício ${exercise.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaDumbbell className="text-6xl text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Informações do exercício */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informações Básicas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaDumbbell className="mr-2" />
                  <span>Grupo Muscular: {exercise.group}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Execução Recomendada
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaList className="mr-2" />
                  <span>Séries: 3-4</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaList className="mr-2" />
                  <span>Repetições: 8-12</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaClock className="mr-2" />
                  <span>Descanso: 60-90 segundos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Instruções de Execução
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Posicione-se corretamente no equipamento</li>
              <li>Mantenha a postura adequada durante todo o movimento</li>
              <li>Realize o movimento de forma controlada</li>
              <li>Mantenha a respiração constante</li>
              <li>Foque na contração do músculo alvo</li>
            </ol>
          </div>

          {/* Dicas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dicas e Observações
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Mantenha o core sempre ativado</li>
              <li>Evite movimentos bruscos</li>
              <li>Ajuste a carga de acordo com sua capacidade</li>
              <li>Em caso de dor, interrompa o exercício</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal; 