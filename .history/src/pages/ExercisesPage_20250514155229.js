// src/pages/ExercisesPage.js
import React from 'react';
import { Box, Heading, Container } from '@chakra-ui/react';
import SearchExercises from '../components/exercises/SearchExercises';

const ExercisesPage = () => {
  return (
    <Container maxW="container.xl" py={4}>
      <Heading as="h1" size="xl" mb={6}>
        Biblioteca de Exercícios
      </Heading>
      <SearchExercises />
    </Container>
  );
};

export default ExercisesPage;
