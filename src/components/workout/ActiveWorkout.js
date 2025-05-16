// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { FaArrowLeft, FaCheck, FaStopwatch, FaDumbbell, FaUndo, FaFlag } from 'react-icons/fa';

const ActiveWorkout = () => {
  const { workoutId } = useParams();
  const { workout, loading, error, markExerciseCompleted, resetWorkoutProgress } = useWorkout(workoutId);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);

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

  const handleToggleExercise = async (exerciseIndex) => {
    const isCompleted = workout.exercises[exerciseIndex].completed;
    await markExerciseCompleted(exerciseIndex, !isCompleted);
  };

  const handleResetProgress = async () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso deste treino?')) {
      await resetWorkoutProgress();
    }
  };

  const handleFinishWorkout = () => {
    navigate(`/workouts/${workoutId}`);
  };

  const startRest = (seconds) => {
    setIsResting(true);
    setRestTimeLeft(seconds);
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
            onClick={() => navigate(`/workouts/${workoutId}`)}
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

        {/* Timer de descanso */}
        {isResting && (
          <div className="bg-blue-500 text-white p-6 rounded-lg mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Descanso</h2>
            <p className="text-4xl font-bold">{formatTime(restTimeLeft)}</p>
            <button 
              onClick={() => setIsResting(false)}
              className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-lg font-bold"
            >
              Pular
            </button>
          </div>
        )}

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
                  onClick={() => handleToggleExercise(index)}
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
              
              {exercise.completed ? (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Exercício concluído
                </div>
              ) : (
                <div className="mt-2 flex space-x-2">
                  {exercise.rest && (
                    <button
                      onClick={() => startRest(exercise.rest)}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300"
                    >
                      Descanso {exercise.rest}s
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleFinishWorkout}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center"
          >
            <FaFlag className="mr-2" /> Finalizar
          </button>
          <button
            onClick={handleResetProgress}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-bold flex items-center justify-center"
          >
            <FaUndo className="mr-2" /> Resetar
          </button>
          <button
            onClick={() => navigate(`/workouts/${workoutId}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
