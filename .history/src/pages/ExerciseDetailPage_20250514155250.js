// src/pages/ExerciseDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import ExerciseDetail from '../components/exercises/ExerciseDetail';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  
  return (
    <Container maxW="container.xl" py={4}>
      <ExerciseDetail id={id} />
    </Container>
  );
};

export default ExerciseDetailPage;
