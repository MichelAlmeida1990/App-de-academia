// src/components/exercises/ExerciseInstructions.js

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  List, 
  ListItem, 
  ListIcon, 
  Divider,
  Badge,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ExerciseInstructions = ({ instructions, tips, level }) => {
  // Cores dinâmicas baseadas no modo de cor
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Determinar a cor do badge baseado no nível de dificuldade
  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'orange';
      case 'advanced':
        return 'red';
      default:
        return 'blue';
    }
  };

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
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h3" size="md">
            Instruções
          </Heading>
          
          {level && (
            <Badge 
              colorScheme={getLevelColor(level)}
              fontSize="0.8em"
              px={2}
              py={1}
              borderRadius="full"
            >
              {level}
            </Badge>
          )}
        </Flex>
        
        {instructions && instructions.length > 0 ? (
          <List spacing={3}>
            {instructions.map((instruction, index) => (
              <ListItem key={index} display="flex">
                <ListIcon 
                  as={MdKeyboardArrowRight} 
                  color="blue.500" 
                  fontSize="1.2em"
                  mt={1}
                />
                <Text>{instruction}</Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <Text color="gray.500">Nenhuma instrução disponível para este exercício.</Text>
        )}
        
        {tips && tips.length > 0 && (
          <>
            <Divider my={4} />
            <Heading as="h3" size="md" mb={3}>
              Dicas
            </Heading>
            <List spacing={2}>
              {tips.map((tip, index) => (
                <ListItem key={index} display="flex">
                  <ListIcon 
                    as={MdKeyboardArrowRight} 
                    color="green.500" 
                    fontSize="1.2em"
                    mt={1}
                  />
                  <Text>{tip}</Text>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExerciseInstructions;
