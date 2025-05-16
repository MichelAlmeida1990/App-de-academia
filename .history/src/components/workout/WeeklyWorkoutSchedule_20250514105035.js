import React from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';

const WeeklyWorkoutSchedule = () => {
  const { weekSchedule, completedWorkouts, startWorkout } = useWorkout();
  const navigate = useNavigate();
  
  // Obter o dia atual da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
  const today = new Date().getDay();
  // Converter para nosso formato (0 = Segunda, ..., 6 = Domingo)
  const adjustedToday = today === 0 ? 6 : today - 1;
  
  const handleStartWorkout = (workoutId) => {
    if (workoutId && startWorkout(workoutId)) {
      navigate('/active-workout');
    }
  };
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Programação Semanal</h3>
      
      <div className="space-y-3">
        {weekSchedule.map((day, index) => {
          const isCompleted = day.workoutId && completedWorkouts && completedWorkouts[day.workoutId];
          
          return (
            <div 
              key={day.id}
              className={`p-3 rounded-lg border ${
                index === adjustedToday 
                  ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30' 
                  : 'border-gray-200 dark:border-gray-700'
              } ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    index === adjustedToday 
                      ? 'bg-blue-500' 
                      : isCompleted 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span className="font-medium">{day.day}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{day.muscles}</span>
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : day.workoutId ? (
                    <button 
                      onClick={() => handleStartWorkout(day.workoutId)}
                      className="ml-2 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
                    >
                      Iniciar
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyWorkoutSchedule;
