// src/components/exercises/MuscleHighlight.js

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Image, 
  Flex, 
  Badge,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react';

// Imagens de músculos (você precisará adicionar estas imagens ao seu projeto)
const muscleImages = {
  chest: '/images/muscles/chest.png',
  back: '/images/muscles/back.png',
  shoulders: '/images/muscles/shoulders.png',
  upperarms: '/images/muscles/upperarms.png',
  lowerarms: '/images/muscles/lowerarms.png',
  upperlegs: '/images/muscles/upperlegs.png',
  lowerlegs: '/images/muscles/lowerlegs.png',
  waist: '/images/muscles/waist.png',
  // Adicione mais músculos conforme necessário
};

// Fallback para quando a imagem específica não está disponível
const fallbackImage = '/images/muscles/body-outline.png';

const MuscleHighlight = ({ targetMuscle, secondaryMuscles = [] }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'white');
  
  // Normaliza o nome do músculo para corresponder às chaves do objeto muscleImages
  const normalizeMuscleName = (muscle) => {
    return muscle?.toLowerCase().replace(/\s+/g, '') || '';
  };
  
  const targetMuscleNormalized = normalizeMuscleName(targetMuscle);
  const targetMuscleImage = muscleImages[targetMuscleNormalized] || fallbackImage;
  
  return (
    <Box 
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor={borderColor}
      mb={6}
      overflow="hidden"
    >
      <Box p={5}>
        <Heading as="h3" size="md" mb={4} color={headingColor}>
          Músculos Trabalhados
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Flex alignItems="center" mb={4}>
              <Badge colorScheme="red" mr={2} px={2} py={1}>
                Principal
              </Badge>
              <Text fontWeight="bold">{targetMuscle}</Text>
            </Flex>
            
            {secondaryMuscles.length > 0 && (
              <Box>
                <Flex alignItems="center" mb={2}>
                  <Badge colorScheme="orange" mr={2} px={2} py={1}>
                    Secundários
                  </Badge>
                </Flex>
                <Flex flexWrap="wrap" gap={2}>
                  {secondaryMuscles.map((muscle, index) => (
                    <Badge key={index} colorScheme="gray" variant="subtle">
                      {muscle}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>
          
          <Box 
            borderRadius="md" 
            overflow="hidden" 
            bg="gray.50" 
            display="flex" 
            justifyContent="center"
            alignItems="center"
            p={4}
          >
            <Image 
              src={targetMuscleImage}
              alt={`${targetMuscle} muscle`}
              maxHeight="200px"
              objectFit="contain"
              fallbackSrc={fallbackImage}
            />
          </Box>
        </SimpleGrid>
        
        <Text fontSize="sm" color="gray.500" mt={4}>
          Nota: Este diagrama mostra os principais músculos trabalhados durante este exercício.
        </Text>
      </Box>
    </Box>
  );
};

export default MuscleHighlight;
