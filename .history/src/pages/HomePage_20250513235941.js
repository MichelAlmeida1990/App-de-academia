import React from 'react';
import WorkoutList from '../components/workout/WorkoutList';
import ProgressTracker from '../components/workout/ProgressTracker';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Seu Progresso</h1>
      <ProgressTracker />
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 dark:text-white">Seus Treinos</h2>
      <WorkoutList />
    </div>
  );
};

export default HomePage;
