// src/components/workout/WorkoutCard.js
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaPlay, FaCheck, FaClock } from 'react-icons/fa';
import { useWorkout } from '../../hooks/useWorkout';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

const WorkoutCard = ({ workout }) => {
  const { startWorkout } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  
  const formattedDate = format(new Date(workout.date), "dd 'de' MMMM", { locale: ptBR });
  
  const getTotalSets = () => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };
  
  const getCompletedSets = () => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(set => set.completed).length;
    }, 0);
  };
  
  const getProgress = () => {
    const totalSets = getTotalSets();
    const completedSets = getCompletedSets();
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };
  
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return '--';
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return `${minutes} min`;
  };
  
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-4 ${workout.completed ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{workout.name}</h3>
          {workout.completed && <FaCheck />}
        </div>
        <p className="text-sm opacity-90">{formattedDate}</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {workout.exercises.length} exercícios
          </span>
          {workout.completed && (
            <span className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              {formatDuration(workout.duration)}
            </span>
          )}
        </div>
        
        {!workout.completed && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            
            <button
              onClick={() => startWorkout(workout.id)}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
            >
              <FaPlay className="mr-2" />
              Iniciar Treino
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
