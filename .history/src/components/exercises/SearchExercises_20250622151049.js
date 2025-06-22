// src/components/exercises/SearchExercises.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaBookmark, FaDumbbell, FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';
import Card from '../common/Card';
import { useSettings } from '../../context/SettingsContext';
import ExerciseVisual from './ExerciseVisual';

// Dados mockados de exercícios
const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Supino Reto',
    bodyPart: 'chest',
    target: 'pectorals',
    equipment: 'barbell',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Deite-se no banco com os pés firmes no chão',
      'Segure a barra com pegada um pouco mais larga que os ombros',
      'Desça a barra controladamente até o peito',
      'Empurre a barra de volta à posição inicial'
    ]
  },
  {
    id: 2,
    name: 'Agachamento Livre',
    bodyPart: 'lower legs',
    target: 'quadriceps',
    equipment: 'barbell',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Posicione a barra nos ombros',
      'Mantenha os pés na largura dos ombros',
      'Desça até as coxas ficarem paralelas ao chão',
      'Retorne à posição inicial'
    ]
  },
  {
    id: 3,
    name: 'Remada Curvada',
    bodyPart: 'back',
    target: 'lats',
    equipment: 'barbell',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Curve o tronco para frente mantendo as costas retas',
      'Segure a barra com pegada pronada',
      'Puxe a barra em direção ao abdômen',
      'Retorne controladamente'
    ]
  },
  {
    id: 4,
    name: 'Desenvolvimento com Halteres',
    bodyPart: 'shoulders',
    target: 'delts',
    equipment: 'dumbbell',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Sente-se no banco com os halteres na altura dos ombros',
      'Empurre os halteres para cima',
      'Estenda completamente os braços',
      'Retorne controladamente'
    ]
  },
  {
    id: 5,
    name: 'Rosca Direta',
    bodyPart: 'upper arms',
    target: 'biceps',
    equipment: 'barbell',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Fique em pé com a barra nas mãos',
      'Mantenha os cotovelos fixos',
      'Flexione os braços levantando a barra',
      'Retorne controladamente'
    ]
  },
  {
    id: 6,
    name: 'Flexão de Braço',
    bodyPart: 'chest',
    target: 'pectorals',
    equipment: 'body weight',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Posicione-se em prancha com as mãos no chão',
      'Mantenha o corpo alinhado',
      'Desça flexionando os braços',
      'Empurre de volta à posição inicial'
    ]
  },
  {
    id: 7,
    name: 'Leg Press',
    bodyPart: 'lower legs',
    target: 'quadriceps',
    equipment: 'leverage machine',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Sente-se no aparelho com os pés na plataforma',
      'Desça controladamente flexionando os joelhos',
      'Empurre a plataforma de volta',
      'Não trave completamente os joelhos'
    ]
  },
  {
    id: 8,
    name: 'Puxada na Polia',
    bodyPart: 'back',
    target: 'lats',
    equipment: 'cable',
    gifUrl: '/api/placeholder/300/200',
    instructions: [
      'Sente-se no aparelho e segure a barra',
      'Incline ligeiramente o tronco para trás',
      'Puxe a barra em direção ao peito',
      'Retorne controladamente'
    ]
  }
];

// Componente de Card de Exercício Simplificado
const ExerciseCard = ({ exercise, isFavorite, onToggleFavorite, onSelect }) => {
  const { settings } = useSettings();
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(exercise.id);
  };

  const formatBodyPart = (bodyPart) => {
    const translations = {
      'chest': 'Peito',
      'back': 'Costas',
      'shoulders': 'Ombros',
      'upper arms': 'Braços',
      'lower legs': 'Pernas',
      'core': 'Core'
    };
    return translations[bodyPart] || bodyPart;
  };

  const formatEquipment = (equipment) => {
    const translations = {
      'barbell': 'Barra',
      'dumbbell': 'Halteres',
      'body weight': 'Peso Corporal',
      'cable': 'Cabo',
      'leverage machine': 'Máquina'
    };
    return translations[equipment] || equipment;
  };

  return (
    <Card 
      className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
      onClick={() => onSelect(exercise)}
    >
      <div className="relative overflow-hidden">
        {/* Visual do exercício */}
        <ExerciseVisual 
          exercise={exercise} 
          className="aspect-video rounded-t-xl"
        />

        {/* Botão de favorito */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-white" />
          )}
        </button>

        {/* Overlay de play */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <FaPlay className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{exercise.name}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Grupo:</span>
            <span className="text-purple-400 font-medium">{formatBodyPart(exercise.bodyPart)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Equipamento:</span>
            <span className="text-gray-300">{formatEquipment(exercise.equipment)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(exercise);
            }}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </Card>
  );
};

// Componente para exibir imagem do exercício respeitando configurações
const ExerciseImageSection = ({ exercise }) => {
  const { settings } = useSettings();
  
  if (settings.showExerciseImages) {
    return (
      <>
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-full items-center justify-center">
          <FaDumbbell className="text-6xl text-gray-500" />
        </div>
      </>
    );
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <FaDumbbell className="text-6xl text-gray-400" />
    </div>
  );
};

// Componente de Modal de Detalhes
const ExerciseModal = ({ exercise, isOpen, onClose }) => {
  if (!isOpen || !exercise) return null;

  const formatBodyPart = (bodyPart) => {
    const translations = {
      'chest': 'Peito',
      'back': 'Costas',
      'shoulders': 'Ombros',
      'upper arms': 'Braços',
      'lower legs': 'Pernas',
      'core': 'Core'
    };
    return translations[bodyPart] || bodyPart;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Imagem */}
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg mb-6 flex items-center justify-center">
            {exercise && (
              <ExerciseImageSection exercise={exercise} />
            )}
          </div>

          {/* Informações */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Grupo Muscular</h3>
              <p className="text-purple-400 font-semibold">{formatBodyPart(exercise.bodyPart)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Equipamento</h3>
              <p className="text-white font-semibold">{exercise.equipment}</p>
            </div>
          </div>

          {/* Instruções */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Como Executar</h3>
            <ol className="space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Botão de fechar */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const SearchExercises = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(MOCK_EXERCISES);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedExercises, setSavedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const [bodyPartFilter, setBodyPartFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  const searchInputRef = useRef(null);

  // Opções de filtro extraídas dos dados
  const filterOptions = useMemo(() => {
    const bodyParts = [...new Set(MOCK_EXERCISES.map(ex => ex.bodyPart))].sort();
    const targets = [...new Set(MOCK_EXERCISES.map(ex => ex.target))].sort();
    const equipments = [...new Set(MOCK_EXERCISES.map(ex => ex.equipment))].sort();

    return { bodyParts, targets, equipments };
  }, []);

  // Filtros ativos
  const activeFilters = useMemo(() => {
    const filters = [];
    if (bodyPartFilter) filters.push({ type: 'bodyPart', value: bodyPartFilter, label: bodyPartFilter });
    if (targetFilter) filters.push({ type: 'target', value: targetFilter, label: targetFilter });
    if (equipmentFilter) filters.push({ type: 'equipment', value: equipmentFilter, label: equipmentFilter });
    return filters;
  }, [bodyPartFilter, targetFilter, equipmentFilter]);

  // Função de busca e filtragem
  const handleSearch = () => {
    setIsLoading(true);

    setTimeout(() => {
      let results = [...MOCK_EXERCISES];

      // Filtrar por termo de busca
      if (searchTerm.trim()) {
        const searchTermLower = searchTerm.toLowerCase();
        results = results.filter(exercise =>
          exercise.name.toLowerCase().includes(searchTermLower) ||
          exercise.target.toLowerCase().includes(searchTermLower) ||
          exercise.bodyPart.toLowerCase().includes(searchTermLower) ||
          exercise.equipment.toLowerCase().includes(searchTermLower)
        );
      }

      // Aplicar filtros
      if (bodyPartFilter) {
        results = results.filter(exercise => exercise.bodyPart === bodyPartFilter);
      }

      if (targetFilter) {
        results = results.filter(exercise => exercise.target === targetFilter);
      }

      if (equipmentFilter) {
        results = results.filter(exercise => exercise.equipment === equipmentFilter);
      }

      setFilteredExercises(results);
      setIsLoading(false);
    }, 500);
  };

  // Executar busca quando filtros mudarem
  useEffect(() => {
    handleSearch();
  }, [searchTerm, bodyPartFilter, targetFilter, equipmentFilter]);

  // Remover filtro específico
  const removeFilter = (filterType) => {
    switch (filterType) {
      case 'bodyPart':
        setBodyPartFilter('');
        break;
      case 'target':
        setTargetFilter('');
        break;
      case 'equipment':
        setEquipmentFilter('');
        break;
    }
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setBodyPartFilter('');
    setTargetFilter('');
    setEquipmentFilter('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Toggle exercício salvo
  const toggleSavedExercise = (exerciseId) => {
    setSavedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // Abrir modal de detalhes
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExercise(null);
  };

  // Sugestões de filtro
  const handleSuggestionClick = (type, value) => {
    setSearchTerm('');
    setBodyPartFilter(type === 'bodyPart' ? value : '');
    setTargetFilter(type === 'target' ? value : '');
    setEquipmentFilter(type === 'equipment' ? value : '');
  };

  return (
    <div className="space-y-6">
      {/* Header de busca */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Buscar Exercícios
          </h2>

          {/* Campo de busca */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>

            <input
              ref={searchInputRef}
              className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Buscar por nome, músculo, equipamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />

            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
              >
                <FaTimes className="text-gray-400 hover:text-gray-200 transition-colors" />
              </button>
            )}
          </div>

          {/* Controles de filtro */}
          <div className="flex justify-between items-center mb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="text-gray-400" />
              <span>Filtros</span>
              {showFilters ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
            </button>

            {activeFilters.length > 0 && (
              <button
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                onClick={clearAllFilters}
              >
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Tags de filtros ativos */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((filter, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700"
                >
                  {filter.label}
                  <button
                    className="ml-2 text-purple-400 hover:text-purple-200 transition-colors"
                    onClick={() => removeFilter(filter.type)}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Painel de filtros */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <div>
                <label className="block font-medium mb-2 text-gray-300">Grupo Muscular</label>
                <select
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={bodyPartFilter}
                  onChange={(e) => setBodyPartFilter(e.target.value)}
                >
                  <option value="">Todos os grupos</option>
                  {filterOptions.bodyParts.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-300">Músculo Alvo</label>
                <select
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={targetFilter}
                  onChange={(e) => setTargetFilter(e.target.value)}
                >
                  <option value="">Todos os músculos</option>
                  {filterOptions.targets.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-300">Equipamento</label>
                <select
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                >
                  <option value="">Todos os equipamentos</option>
                  {filterOptions.equipments.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Resultados */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isLoading
              ? 'Buscando exercícios...'
              : `Resultados (${filteredExercises.length})`
            }
          </h3>

          {filteredExercises.length > 0 && !isLoading && (
            <div className="flex items-center gap-2 text-gray-400">
              <FaDumbbell />
              <span className="text-sm">
                {filteredExercises.length} exercícios encontrados
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorite={savedExercises.includes(exercise.id)}
                onToggleFavorite={toggleSavedExercise}
                onSelect={handleSelectExercise}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <FaDumbbell className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-lg mb-4 text-gray-400">
                Nenhum exercício encontrado com os filtros atuais.
              </p>
              <button
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                onClick={clearAllFilters}
              >
                Limpar Filtros
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Sugestões */}
      {filteredExercises.length === 0 && !isLoading && (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Sugestões de Busca
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                className="px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                onClick={() => handleSuggestionClick('bodyPart', 'chest')}
              >
                Peito
              </button>
              <button
                className="px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                onClick={() => handleSuggestionClick('bodyPart', 'back')}
              >
                Costas
              </button>
              <button
                className="px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                onClick={() => handleSuggestionClick('equipment', 'barbell')}
              >
                Barra
              </button>
              <button
                className="px-4 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                onClick={() => handleSuggestionClick('equipment', 'dumbbell')}
              >
                Halteres
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de detalhes */}
      <ExerciseModal
        exercise={selectedExercise}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SearchExercises;
