import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import Navbar from '../layout/Navbar';

const ActiveWorkout = () => {
  const navigate = useNavigate();
  const { activeWorkout, completeWorkout, cancelActiveWorkout, isExerciseCompleted, toggleExerciseCompletion } = useWorkout();
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Redirecionar se não houver treino ativo
  useEffect(() => {
    if (!activeWorkout) {
      navigate('/');
    }
  }, [activeWorkout, navigate]);

  // Configurar timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Formatar o tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Verificar se todos os exercícios estão completos
  const allExercisesCompleted = () => {
    if (!activeWorkout || !activeWorkout.exercises) return false;
    
    return activeWorkout.exercises.every((_, index) => 
      isExerciseCompleted(activeWorkout.id, index)
    );
  };

  // Manipular conclusão do treino
  const handleCompleteWorkout = () => {
    if (activeWorkout) {
      completeWorkout(activeWorkout.id);
      navigate('/');
    }
  };

  // Manipular cancelamento do treino
  const handleCancelWorkout = () => {
    cancelActiveWorkout();
    navigate('/');
  };

  if (!activeWorkout) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{activeWorkout.title}</h1>
            <div className="text-lg font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
              {formatTime(timer)}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progresso</span>
              <span className="font-medium">
                {activeWorkout.exercises ? 
                  `${activeWorkout.exercises.filter((_, index) => isExerciseCompleted(activeWorkout.id, index)).length}/${activeWorkout.exercises.length}` : 
                  '0/0'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${activeWorkout.exercises && activeWorkout.exercises.length > 0 ? 
                    (activeWorkout.exercises.filter((_, index) => 
                      isExerciseCompleted(activeWorkout.id, index)).length / activeWorkout.exercises.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">Exercícios</h2>
            {activeWorkout.exercises && activeWorkout.exercises.map((exercise, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  isExerciseCompleted(activeWorkout.id, index) 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`exercise-${index}`}
                    checked={isExerciseCompleted(activeWorkout.id, index)}
                    onChange={() => toggleExerciseCompletion(
                      activeWorkout.id, 
                      index, 
                      !isExerciseCompleted(activeWorkout.id, index)
                    )}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <label htmlFor={`exercise-${index}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.sets} séries × {exercise.reps} repetições
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button 
              onClick={handleCancelWorkout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCompleteWorkout}
              disabled={!allExercisesCompleted()}
              className={`px-6 py-2 rounded-lg text-white transition-colors ${
                allExercisesCompleted() 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Concluir Treino
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
