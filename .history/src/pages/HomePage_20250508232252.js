import React from 'react';
import WorkoutList from '../components/workout/WorkoutList';
import ProgressTracker from '../components/workout/ProgressTracker';

const HomePage = () => {
  return (
    <div>
      <ProgressTracker />
      <WorkoutList />
    </div>
  );
};

export default HomePage;
