// src/components/exercises/ExerciseVideo.js

import React, { useState } from 'react';
import { Box, AspectRatio, Text, Spinner, Center, Icon } from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';

const ExerciseVideo = ({ videoUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Função para lidar com o carregamento do vídeo
  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  // Função para lidar com erros no carregamento do vídeo
  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="gray.50"
      mb={6}
    >
      <AspectRatio ratio={16 / 9}>
        {isLoading && (
          <Center bg="gray.100" position="absolute" top="0" left="0" right="0" bottom="0" zIndex="1">
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Center>
        )}
        
        {hasError ? (
          <Center bg="gray.100" flexDirection="column">
            <Icon as={FaPlay} w={12} h={12} color="gray.400" mb={2} />
            <Text color="gray.500">
              Não foi possível carregar o vídeo
            </Text>
          </Center>
        ) : (
          <iframe
            title={title || "Demonstração do exercício"}
            src={videoUrl}
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        )}
      </AspectRatio>
      
      {title && (
        <Box p={4} bg="white">
          <Text fontWeight="medium" fontSize="lg">
            {title}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ExerciseVideo;
