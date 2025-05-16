// src/components/layout/SearchExercises.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Box, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  InputRightElement,
  Button, 
  Flex, 
  Text, 
  SimpleGrid, 
  Heading,
  Badge,
  Image,
  useColorModeValue,
  IconButton,
  Select,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Collapse,
  Spinner,
  Link,
  Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp,
  FaBookmark,
  FaDumbbell
} from 'react-icons/fa';

// Contexto
import { ExerciseContext } from '../../context/ExerciseContext';

const ExerciseCard = ({ exercise, isSaved, onToggleSave }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-5px)', 
        boxShadow: 'lg',
        borderColor: 'blue.400'
      }}
      position="relative"
    >
      <IconButton
        icon={<FaBookmark />}
        aria-label={isSaved ? "Remover dos favoritos" : "Salvar exercício"}
        position="absolute"
        top={2}
        right={2}
        size="sm"
        zIndex={2}
        colorScheme={isSaved ? "yellow" : "gray"}
        variant={isSaved ? "solid" : "ghost"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave(exercise.id);
        }}
      />
      
      <Link 
        as={RouterLink} 
        to={`/exercise/${exercise.id}`} 
        _hover={{ textDecoration: 'none' }}
      >
        <Image 
          src={exercise.gifUrl || 'https://via.placeholder.com/300x200?text=Exercise'} 
          alt={exercise.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        
        <Box p={4}>
          <Heading as="h3" size="md" mb={2} noOfLines={2}>
            {exercise.name}
          </Heading>
          
          <Flex mt={3} flexWrap="wrap" gap={2}>
            <Badge colorScheme="purple" fontSize="0.8em" borderRadius="full">
              {exercise.bodyPart}
            </Badge>
            <Badge colorScheme="blue" fontSize="0.8em" borderRadius="full">
              {exercise.target}
            </Badge>
            <Badge colorScheme="green" fontSize="0.8em" borderRadius="full">
              {exercise.equipment}
            </Badge>
          </Flex>
        </Box>
      </Link>
    </Box>
  );
};

const SearchExercises = () => {
  const { exercises, savedExercises, toggleSavedExercise } = useContext(ExerciseContext);
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
    const bodyParts = [...new Set(exercises.map(ex => ex.bodyPart))].sort();
    const targets = [...new Set(exercises.map(ex => ex.target))].sort();
    const equipments = [...new Set(exercises.map(ex => ex.equipment))].sort();
    
    setBodyPartOptions(bodyParts);
    setTargetOptions(targets);
    setEquipmentOptions(equipments);
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
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box>
      <Box 
        bg={bgColor} 
        p={5} 
        borderRadius="lg" 
        boxShadow="md"
        border="1px"
        borderColor={borderColor}
        mb={6}
      >
        <Heading as="h2" size="lg" mb={4}>
          Buscar Exercícios
        </Heading>
        
        <InputGroup size="lg" mb={4}>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          
          <Input
            ref={searchInputRef}
            placeholder="Buscar por nome, músculo, equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          
          <InputRightElement width="4.5rem">
            {searchTerm && (
              <IconButton
                h="1.75rem"
                size="sm"
                icon={<FaTimes />}
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
              />
            )}
          </InputRightElement>
        </InputGroup>
        
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Button
            leftIcon={<FaFilter />}
            rightIcon={showFilters ? <FaChevronUp /> : <FaChevronDown />}
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            Filtros
          </Button>
          
          {activeFilters.length > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={clearAllFilters}
              colorScheme="blue"
            >
              Limpar Filtros
            </Button>
          )}
        </Flex>
        
        {/* Tags de filtros ativos */}
        {activeFilters.length > 0 && (
          <Wrap spacing={2} mb={4}>
            {activeFilters.map((filter, index) => (
              <WrapItem key={index}>
                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>{filter.value}</TagLabel>
                  <TagCloseButton onClick={() => removeFilter(filter.type)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
        
        {/* Painel de filtros colapsável */}
        <Collapse in={showFilters} animateOpacity>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} p={4} bg="gray.50" borderRadius="md">
            <Box>
              <Text fontWeight="medium" mb={2}>Grupo Muscular</Text>
              <Select 
                placeholder="Selecione um grupo" 
                value={bodyPartFilter}
                onChange={(e) => setBodyPartFilter(e.target.value)}
              >
                {bodyPartOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Box>
            
            <Box>
              <Text fontWeight="medium" mb={2}>Músculo Alvo</Text>
              <Select 
                placeholder="Selecione um músculo" 
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
              >
                {targetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Box>
            
            <Box>
              <Text fontWeight="medium" mb={2}>Equipamento</Text>
              <Select 
                placeholder="Selecione um equipamento" 
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
              >
                {equipmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Box>
          </SimpleGrid>
        </Collapse>
      </Box>
      
      {/* Resultados da busca */}
      <Box mb={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h3" size="md">
            {isLoading 
              ? 'Buscando exercícios...' 
              : `Resultados (${filteredExercises.length})`
            }
          </Heading>
          
          {filteredExercises.length > 0 && (
            <HStack>
              <FaDumbbell />
              <Text fontSize="sm">
                {filteredExercises.length} exercícios encontrados
              </Text>
            </HStack>
          )}
        </Flex>
        
        {isLoading ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Flex>
        ) : filteredExercises.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                isSaved={savedExercises.includes(exercise.id)}
                onToggleSave={toggleSavedExercise}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" mb={4}>
              Nenhum exercício encontrado com os filtros atuais.
            </Text>
            <Button onClick={clearAllFilters} colorScheme="blue">
              Limpar Filtros
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Sugestões */}
      {filteredExercises.length === 0 && !isLoading && (
        <Box mt={8}>
          <Divider mb={6} />
          <Heading as="h3" size="md" mb={4}>
            Sugestões de Busca
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('chest');
                setTargetFilter('');
                setEquipmentFilter('');
              }}
            >
              Peito
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('back');
                setTargetFilter('');
                setEquipmentFilter('');
              }}
            >
              Costas
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('');
                setTargetFilter('');
                setEquipmentFilter('barbell');
              }}
            >
              Barra
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setBodyPartFilter('');
                setTargetFilter('');
                setEquipmentFilter('dumbbell');
              }}
            >
              Halteres
            </Button>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default SearchExercises;
