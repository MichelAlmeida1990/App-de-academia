import React from 'react';
import { useParams } from 'react-router-dom';
import ActiveWorkout from '../components/workout/ActiveWorkout';

const ActiveWorkoutPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ActiveWorkout workoutId={id} />
    </div>
  );
};

export default ActiveWorkoutPage;
