// src/components/exercises/ExerciseHeader.js

import React from 'react';
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
    <div 
      bg={bgColor} 
      borderRadius="lg" 
      boxShadow="md"
      border="1px"
      borderColor={borderColor}
      mb={6}
      overflow="hidden"
    >
      <div p={5}>
        <div direction="column" width="100%" style={{display: "flex"}}
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
          <div 
            justifyContent="space-between" 
            alignItems={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            mb={4}
           style={{display: "flex"}}
            <div alignItems="center" mb={{ base: 4, md: 0 }} style={{display: "flex"}}
              <IconButton
                as={RouterLink}
                to="/exercises"
                icon={<FaArrowLeft />}
                aria-label="Voltar para exercícios"
                mr={3}
                size="sm"
                variant="outline"
              />
              <h2 as="h1" size="xl" color={headingColor} lineHeight="1.2">
                {name}
              </h2>
            </div>
            
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
          </div>
          
          {/* Exercise metadata */}
          <div 
            mt={2} 
            flexWrap="wrap" 
            gap={3}
            direction={{ base: 'column', sm: 'row' }}
            alignItems={{ base: 'flex-start', sm: 'center' }}
           style={{display: "flex"}}
            <div alignItems="center" style={{display: "flex"}}
              <span 
                colorScheme="purple" 
                px={2} 
                py={1} 
                borderRadius="full" 
                mr={2}
               className="badge">
                Grupo Muscular
              </span>
              <span fontWeight="medium">{bodyPart}</span>
            </div>
            
            <div alignItems="center" style={{display: "flex"}}
              <span 
                colorScheme="blue" 
                px={2} 
                py={1} 
                borderRadius="full" 
                mr={2}
               className="badge">
                Músculo Alvo
              </span>
              <span fontWeight="medium">{target}</span>
            </div>
            
            <div alignItems="center" style={{display: "flex"}}
              <span 
                colorScheme="green" 
                px={2} 
                py={1} 
                borderRadius="full" 
                mr={2}
               className="badge">
                Equipamento
              </span>
              <span fontWeight="medium">{equipment}</span>
            </div>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default ExerciseHeader;




