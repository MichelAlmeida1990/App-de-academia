// src/pages/ExerciseDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ExerciseDetail from '../components/exercises/ExerciseDetail';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ExerciseDetail id={id} />
    </div>
  );
};

export default ExerciseDetailPage;
