import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActiveWorkout from '../components/workout/ActiveWorkout';

const ActiveWorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900">
      <ActiveWorkout 
        workoutId={id} 
      />
    </div>
  );
};

export default ActiveWorkoutPage;
