import React from 'react';
import Navbar from '../components/layout/Navbar';
import ProgressTracker from '../components/workout/ProgressTracker';
import WeeklyWorkoutSchedule from '../components/workout/WeeklyWorkoutSchedule';
import WorkoutList from '../components/workout/WorkoutList';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressTracker />
          </div>
          <div className="lg:col-span-1">
            <WeeklyWorkoutSchedule />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Próximos Treinos</h2>
          <WorkoutList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
