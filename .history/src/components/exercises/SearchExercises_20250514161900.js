// src/components/exercises/SearchExercises.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaBookmark, FaDumbbell } from 'react-icons/fa';
import { useExercise } from '../../context/ExerciseContext';

const ExerciseCard = ({ exercise, isFavorite, onToggleFavorite }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 relative">
      <button
        className={`absolute top-2 right-2 z-10 p-1 rounded-full ${isFavorite ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' : 'text-gray-400 bg-gray-100 dark:bg-gray-700'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(exercise.id);
        }}
        aria-label={isFavorite ? "Remover dos favoritos" : "Salvar exercício"}
      >
        <FaBookmark className="text-lg" />
      </button>
      
      <Link to={`/exercise/${exercise.id}`} className="block">
        <img 
          src={exercise.gifUrl || 'https://via.placeholder.com/300x200?text=Exercise'} 
          alt={exercise.name}
          className="h-48 w-full object-cover"
        />
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 dark:text-white">
            {exercise.name}
          </h3>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              {exercise.bodyPart}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {exercise.target}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {exercise.equipment}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const SearchExercises = () => {
  const { exercises, savedExercises, toggleSavedExercise } = useExercise();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtros
  const [bodyPartFilter, setBodyPartFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Opções únicas para os filtros
  const [bodyPartOptions, setBodyPartOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  
  const searchInputRef = useRef(null);
  
  // Extrair opções de filtro únicas
  useEffect(() => {
    if (exercises.length > 0) {
      const bodyParts = [...new Set(exercises.map(ex => ex.bodyPart))].sort();
      const targets = [...new Set(exercises.map(ex => ex.target))].sort();
      const equipments = [...new Set(exercises.map(ex => ex.equipment))].sort();
      
      setBodyPartOptions(bodyParts);
      setTargetOptions(targets);
      setEquipmentOptions(equipments);
    }
  }, [exercises]);
  
  // Função de busca e filtragem
  const handleSearch = () => {
    setIsLoading(true);
    
    // Simular um pequeno atraso para mostrar o estado de carregamento
    setTimeout(() => {
      let results = [...exercises];
      
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
  
  // Atualizar resultados quando os filtros mudarem
  useEffect(() => {
    handleSearch();
    
    // Atualizar filtros ativos
    const newActiveFilters = [];
    if (bodyPartFilter) newActiveFilters.push({ type: 'bodyPart', value: bodyPartFilter });
    if (targetFilter) newActiveFilters.push({ type: 'target', value: targetFilter });
    if (equipmentFilter) newActiveFilters.push({ type: 'equipment', value: equipmentFilter });
    
    setActiveFilters(newActiveFilters);
  }, [searchTerm, bodyPartFilter, targetFilter, equipmentFilter]);
  
  // Remover um filtro específico
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
      default:
        break;
    }
  };
  
  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setBodyPartFilter('');
    setTargetFilter('');
    setEquipmentFilter('');
    searchInputRef.current.focus();
  };
  
  return (
    <div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Buscar Exercícios
        </h2>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          
          <input
            ref={searchInputRef}
            className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <FaTimes className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button
            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-gray-500" />
            <span>Filtros</span>
            {showFilters ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </button>
          
          {activeFilters.length > 0 && (
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {filter.value}
                <button 
                  className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  onClick={() => removeFilter(filter.type)}
                >
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Painel de filtros colapsável */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Grupo Muscular</label>
              <select 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={bodyPartFilter}
                onChange={(e) => setBodyPartFilter(e.target.value)}
              >
                <option value="">Selecione um grupo</option>
                {bodyPartOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Músculo Alvo</label>
              <select 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
              >
                <option value="">Selecione um músculo</option>
                {targetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Equipamento</label>
              <select 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
              >
                <option value="">Selecione um equipamento</option>
                {equipmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Resultados da busca */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isLoading 
              ? 'Buscando exercícios...' 
              : `Resultados (${filteredExercises.length})`
            }
          </h3>
          
          {filteredExercises.length > 0 && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <FaDumbbell />
              <span className="text-sm">
                {filteredExercises.length} exercícios encontrados
              </span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                isFavorite={savedExercises.includes(exercise.id)}
                onToggleFavorite={toggleSavedExercise}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">
              Nenhum exercício encontrado com os filtros atuais.
            </p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={clearAllFilters}
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
      
      {/* Sugestões */}
      {filteredExercises.length === 0 && !isLoading && (
        <div className="mt-8">
          <hr className="mb-6 border-gray-200 dark:border-gray-700" />
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Sugestões de Busca
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('chest');
                setTargetFilter('');
                setEquipmentFilter('');
              }}
            >
              Peito
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('back');
                setTargetFilter('');
                setEquipmentFilter('');
              }}
            >
              Costas
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('');
                setTargetFilter('');
                setEquipmentFilter('barbell');
              }}
            >
              Barra
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('');
                setTargetFilter('');
                setEquipmentFilter('dumbbell');
              }}
            >
              Halteres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchExercises;
