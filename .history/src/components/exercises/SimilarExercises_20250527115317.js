// src/components/exercises/SimilarExercises.js

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const ExerciseCard = ({ exercise }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Link 
      as={RouterLink} 
      to={`/exercise/${exercise.id}`} 
      textDecoration="none" 
      _hover={{ textDecoration: 'none' }}
    >
      <div
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
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Image 
          src={exercise.gifUrl || 'https://via.placeholder.com/300x200?text=Exercise'} 
          alt={exercise.name}
          height="160px"
          objectFit="cover"
        />
        
        <div p={4} flex="1">
          <div justifyContent="space-between" alignItems="flex-start" mb={2} style={{display: "flex"}}
            <h2 as="h3" size="sm" noOfLines={2}>
              {exercise.name}
            </h2>
          </div>
          
          <div mt={2} flexWrap="wrap" gap={2} style={{display: "flex"}}
            <span colorScheme="purple" fontSize="0.7em" borderRadius="full" className="badge">
              {exercise.bodyPart}
            </span>
            <span colorScheme="blue" fontSize="0.7em" borderRadius="full" className="badge">
              {exercise.target}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const SimilarExercises = ({ targetMuscleExercises, equipmentExercises }) => {
  const headingColor = useColorModeValue('gray.700', 'white');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');

  return (
    <div mb={8}>
      <h2 as="h2" size="lg" mb={6} color={headingColor}>
        Exercícios Similares
      </h2>
      
      {targetMuscleExercises?.length > 0 && (
        <div mb={8} p={5} borderRadius="lg" bg={sectionBg}>
          <h2 as="h3" size="md" mb={4}>
            Mesmo Grupo Muscular
          </h2>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {targetMuscleExercises.slice(0, 4).map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </SimpleGrid>
        </div>
      )}
      
      {equipmentExercises?.length > 0 && (
        <div p={5} borderRadius="lg" bg={sectionBg}>
          <h2 as="h3" size="md" mb={4}>
            Mesmo Equipamento
          </h2>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {equipmentExercises.slice(0, 4).map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </SimpleGrid>
        </div>
      )}
      
      {(!targetMuscleExercises || targetMuscleExercises.length === 0) && 
       (!equipmentExercises || equipmentExercises.length === 0) && (
        <span color="gray.500" textAlign="center" py={8}>
          Nenhum exercício similar encontrado.
        </span>
      )}
    </div>
  );
};

export default SimilarExercises;




