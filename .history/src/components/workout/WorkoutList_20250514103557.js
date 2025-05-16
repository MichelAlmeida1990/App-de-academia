import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';

const WorkoutList = () => {
  const { workouts, loading, startWorkout } = useWorkout();
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediário':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Avançado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Força':
        return '💪';
      case 'Cardio':
        return '🏃';
      case 'Flexibilidade':
        return '🧘';
      case 'Equilíbrio':
        return '🤸';
      default:
        return '⚡';
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Função para iniciar um treino
  const handleStartWorkout = (workoutId) => {
    if (startWorkout(workoutId)) {
      navigate('/active-workout');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-8 w-1/3 mb-6"></div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="mb-4 last:mb-0">
            <div className="skeleton h-24 w-full rounded-lg mb-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card">
      {workouts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Nenhum treino encontrado</p>
          <button className="btn-primary mt-4">Adicionar treino</button>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div 
              key={workout.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow fade-in"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="mr-2 text-xl" aria-hidden="true">{getTypeIcon(workout.type)}</span>
                    <h3 className="text-lg font-medium">{workout.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {workout.type} • {workout.duration} min
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">{formatDate(workout.date)}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  {workout.completed ? (
                    <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Concluído
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      Pendente
                    </span>
                  )}
                </div>
                <div>
                  <button 
                    className="btn-secondary text-sm px-3 py-1"
                    onClick={() => handleStartWorkout(workout.id)}
                  >
                    Iniciar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-6 text-center">
            <button className="btn">Ver todos os treinos</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
