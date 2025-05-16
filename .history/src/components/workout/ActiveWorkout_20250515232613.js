// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { FaArrowLeft, FaCheck, FaStopwatch, FaDumbbell, FaUndo } from 'react-icons/fa';

const ActiveWorkout = () => {
  const { workoutId } = useParams();
  const { workout, loading, error, markExerciseCompleted, resetWorkoutProgress } = useWorkout(workoutId);
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [weightInputs, setWeightInputs] = useState({});
  const [repsInputs, setRepsInputs] = useState({});

  useEffect(() => {
    if (!loading && !workout) {
      navigate('/workouts');
      return;
    }

    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [workout, loading, navigate]);

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

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!workout) return null;

  const handleCompleteExercise = async (exerciseIndex) => {
    const isCompleted = workout.exercises[exerciseIndex].completed;
    await markExerciseCompleted(exerciseIndex, !isCompleted);
  };

  const handleResetProgress = async () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso deste treino?')) {
      await resetWorkoutProgress();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progresso atual
  const completedExercises = workout.exercises.filter(ex => ex.completed).length;
  const progressPercentage = Math.round((completedExercises / workout.exercises.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/workouts')}
            className="mr-4 text-gray-600 dark:text-gray-300"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1 dark:text-white">{workout.name}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaStopwatch className="mr-2" />
            <span>{formatTime(timer)}</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium dark:text-white">Progresso</span>
            <span className="text-sm font-medium dark:text-white">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Lista de exercícios */}
        <div className="space-y-4 mb-6">
          {workout.exercises.map((exercise, index) => (
            <div 
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${
                exercise.completed ? 'border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FaDumbbell className="mr-2 text-blue-500" />
                  <h3 className="font-medium dark:text-white">{exercise.name}</h3>
                </div>
                <button
                  onClick={() => handleCompleteExercise(index)}
                  className={`p-2 rounded-full ${
                    exercise.completed 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaCheck />
                </button>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {exercise.sets && exercise.sets.length > 0 
                  ? `${exercise.sets.length} séries • ${exercise.reps || 'N/A'} repetições` 
                  : 'Detalhes não disponíveis'}
              </div>
              
              {exercise.completed && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Exercício concluído
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/workouts')}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold"
          >
            Voltar
          </button>
          <button
            onClick={handleResetProgress}
            className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-bold flex items-center justify-center"
          >
            <FaUndo className="mr-2" /> Resetar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
