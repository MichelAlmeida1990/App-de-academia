// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { FaArrowLeft, FaCheck, FaStopwatch, FaDumbbell } from 'react-icons/fa';

const ActiveWorkout = () => {
  const { activeWorkout, completeSet, completeWorkout, cancelWorkout } = useWorkout();
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  
  useEffect(() => {
    if (!activeWorkout) {
      navigate('/dashboard');
      return;
    }
    
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeWorkout, navigate]);
  
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const interval = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
    }
  }, [isResting, restTimeLeft]);
  
  if (!activeWorkout) return null;
  
  const currentExercise = activeWorkout.exercises[currentExerciseIndex];
  
  const handleCompleteSet = (setIndex, weight, reps) => {
    completeSet(currentExerciseIndex, setIndex, weight, reps);
    
    // Check if all sets are completed for this exercise
    const allSetsCompleted = currentExercise.sets.every((set, idx) => 
      idx === setIndex ? true : set.completed
    );
    
    if (allSetsCompleted) {
      // If this is the last exercise, complete workout
      if (currentExerciseIndex === activeWorkout.exercises.length - 1) {
        completeWorkout();
      } else {
        // Start rest timer
        setIsResting(true);
        setRestTimeLeft(currentExercise.rest);
        
        // Move to next exercise
        setCurrentExerciseIndex(prev => prev + 1);
      }
    } else {
      // Start rest timer between sets
      setIsResting(true);
      setRestTimeLeft(currentExercise.rest);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={cancelWorkout}
            className="mr-4 text-gray-600 dark:text-gray-300"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1 dark:text-white">{activeWorkout.name}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaStopwatch className="mr-2" />
            <span>{formatTime(timer)}</span>
          </div>
        </div>
        
        {isResting ? (
          <div className="bg-blue-500 text-white p-6 rounded-lg mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Descanso</h2>
            <p className="text-4xl font-bold">{formatTime(restTimeLeft)}</p>
            <p className="mt-2">Próximo: {activeWorkout.exercises[currentExerciseIndex].name}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaDumbbell className="mr-2 text-blue-500" />
              <h2 className="text-xl font-bold dark:text-white">{currentExercise.name}</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentExercise.sets.length} séries • {currentExercise.reps} repetições
            </p>
            
            <div className="space-y-4">
              {currentExercise.sets.map((set, setIndex) => (
                <div 
                  key={setIndex}
                  className={`p-4 rounded-lg ${set.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium dark:text-white">Série {setIndex + 1}</span>
                    {set.completed && (
                      <FaCheck className="text-green-500" />
                    )}
                  </div>
                  
                  {set.completed ? (
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>{set.weight} kg</span>
                      <span>{set.reps} reps</span>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Peso (kg)"
                        className="w-1/2 p-2 rounded border dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        className="w-1/2 p-2 rounded border dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        min="0"
                      />
                      <button
                        onClick={() => handleCompleteSet(setIndex, 70, 10)} // Example values
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={completeWorkout}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold"
        >
          Finalizar Treino
        </button>
      </div>
    </div>
  );
};

export default ActiveWorkout;
