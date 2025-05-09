import React, { useContext } from 'react';
import WorkoutCard from './WorkoutCard';
import { WorkoutContext } from '../../context/WorkoutContext';

const WorkoutList = () => {
  const { workouts } = useContext(WorkoutContext);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Seus Treinos</h1>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
};

export default WorkoutList;
