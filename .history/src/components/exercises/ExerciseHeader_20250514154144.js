// src/components/exercises/ExerciseHeader.js

import React from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Badge, 
  IconButton, 
  Text,
  useColorModeValue,
  Button,
  HStack,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBookmark, 
  FaShareAlt, 
  FaDumbbell 
} from 'react-icons/fa';

const ExerciseHeader = ({ 
  name, 
  bodyPart, 
  equipment, 
  target,
  onSave,
  isSaved = false,
  onShare
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const badgeBg = useColorModeValue('gray.100', 'gray.700');

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
        <Flex direction="column" width="100%">
          {/* Breadcrumb navigation */}
          <Breadcrumb fontSize="sm" color="gray.500" mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/">
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/exercises">
                Exercícios
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Back button and title */}
          <Flex 
            justifyContent="space-between" 
            alignItems={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            mb={4}
          >
            <Flex alignItems="center" mb={{ base: 4, md: 0 }}>
              <IconButton
                as={RouterLink}
                to="/exercises"
                icon={<FaArrowLeft />}
                aria-label="Voltar para exercícios"
                mr={3}
                size="sm"
                variant="outline"
              />
              <Heading as="h1" size="xl" color={headingColor} lineHeight="1.2">
                {name}
              </Heading>
            </Flex>
            
            <HStack spacing={2}>
              <Tooltip label={isSaved ? "Remover dos favoritos" : "Salvar exercício"}>
                <IconButton
                  icon={<FaBookmark />}
                  aria-label={isSaved ? "Remover dos favoritos" : "Salvar exercício"}
                  onClick={onSave}
                  colorScheme={isSaved ? "yellow" : "gray"}
                  variant={isSaved ? "solid" : "outline"}
                />
              </Tooltip>
              <Tooltip label="Compartilhar exercício">
                <IconButton
                  icon={<FaShareAlt />}
                  aria-label="Compartilhar exercício"
                  onClick={onShare}
                  variant="outline"
                />
              </Tooltip>
            </HStack>
          </Flex>
          
          {/* Exercise metadata */}
          <Flex 
            mt={2} 
            flexWrap="wrap" 
            gap={3}
            direction={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'flex-start', sm: 'center' }}
          >
            <Flex alignItems="center">
              <Badge 
                colorScheme="purple" 
                px={2} 
                py={1} 
                borderRadius="full" 
                mr={2}
              >
                Grupo Muscular
              </Badge>
              <Text fontWeight="medium">{bodyPart}</Text>
            </Flex>
            
            <Flex alignItems="center">
              <Badge 
                colorScheme="blue" 
                px={2} 
                py={1} 
                borderRadius="full" 
                mr={2}
              >
                Músculo Alvo
              </Badge>
              <Text fontWeight="medium">{target}</Text>
            </Flex>
            
            <Flex alignItems="center">
              <Badge 
                colorScheme="green" 
                px={2} 
                py={1} 
                borderRadius="full" 
                mr={2}
              >
                Equipamento
              </Badge>
              <Text fontWeight="medium">{equipment}</Text>
            </Flex>
          </Flex>
          
          {/* Start workout button */}
          <Button 
            leftIcon={<FaDumbbell />} 
            colorScheme="blue" 
            size="md" 
            mt={6}
            alignSelf={{ base: 'stretch', sm: 'flex-start' }}
          >
            Iniciar Treino com Este Exercício
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default ExerciseHeader;
