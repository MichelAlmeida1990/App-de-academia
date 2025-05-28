// src/components/exercises/ExerciseHeader.js - Refatorado para Tailwind CSS
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBookmark, FaShareAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ExerciseHeader = ({
  name,
  bodyPart,
  equipment,
  target,
  onSave,
  isSaved = false,
  onShare
}) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Estilos Tailwind baseados no modo escuro
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
  const headingColor = darkMode ? 'text-white' : 'text-gray-800';
  const textColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  const badgeBg = darkMode ? 'bg-gray-700' : 'bg-gray-100'; // Este não é usado diretamente nos badges, que já têm cores específicas
  const badgeText = darkMode ? 'text-gray-200' : 'text-gray-800'; // Este também não é usado diretamente

  return (
    <div
      className={`${cardBg} rounded-lg shadow-md border ${cardBorder} mb-6 overflow-hidden p-5`}
    >
      {/* Breadcrumb navigation */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Início
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/exercises" className="text-blue-600 dark:text-blue-400 hover:underline">
              Exercícios
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <span className="font-medium capitalize">{name}</span> {/* Adicionado capitalize para o nome do exercício */}
          </li>
        </ol>
      </nav>

      {/* Back button and title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => navigate('/exercises')}
            className="p-2 mr-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Voltar para exercícios"
          >
            <FaArrowLeft />
          </button>
          <h1 className={`text-xl md:text-3xl font-bold ${headingColor} leading-tight capitalize`}> {/* Adicionado capitalize */}
            {name}
          </h1>
        </div>

        <div className="flex space-x-2">
          {/* Botão Salvar/Favoritar */}
          <button
            onClick={onSave}
            className={`flex items-center px-3 py-1 rounded-md transition-colors ${
              isSaved
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            aria-label={isSaved ? "Remover dos favoritos" : "Salvar exercício"}
          >
            <FaBookmark className="mr-1" />
            {isSaved ? 'Salvo' : 'Salvar'}
          </button>

          {/* Botão Compartilhar */}
          <button
            onClick={onShare}
            className="flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 transition-colors"
            aria-label="Compartilhar exercício"
          >
            <FaShareAlt className="mr-1" />
            Compartilhar
          </button>
        </div>
      </div>

      {/* Exercise metadata */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className={`px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 capitalize`}> {/* Adicionado capitalize */}
          {bodyPart}
        </span>
        <span className={`px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 capitalize`}> {/* Adicionado capitalize */}
          {target}
          </span>
        <span className={`px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 capitalize`}> {/* Adicionado capitalize */}
          {equipment}
        </span>
      </div>
    </div>
  );
};

export default ExerciseHeader;
