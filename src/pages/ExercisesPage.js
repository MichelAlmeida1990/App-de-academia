// src/pages/ExercisesPage.js
import React from 'react';
import SearchExercises from '../components/exercises/SearchExercises';

const ExercisesPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Biblioteca de Exercícios
      </h1>
      <SearchExercises />
    </div>
  );
};

export default ExercisesPage;
