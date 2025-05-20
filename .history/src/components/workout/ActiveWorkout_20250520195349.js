// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout } from '../../hooks/useWorkout';
import { ThemeContext } from '../../context/ThemeContext';
import { FaArrowLeft, FaCheck, FaStopwatch, FaDumbbell, FaUndo, FaFlag, FaPause, FaPlay, FaFire } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveWorkout = () => {
  const { workoutId } = useParams();
  const { workout, loading, error, markExerciseCompleted, resetWorkoutProgress, completeWorkout } = useWorkout(workoutId);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [timer, setTimer] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [calories, setCalories] = useState(0);

  // Iniciar o timer quando o componente montar
  useEffect(() => {
    if (!loading && !workout) {
      navigate('/workouts');
      return;
    }

    if (!isTimerPaused) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
        // Calcular calorias queimadas (estimativa simples)
        if (timer % 60 === 0 && timer > 0) {
          setCalories(prev => prev + Math.floor(Math.random() * 5) + 3);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [workout, loading, navigate, isTimerPaused, timer]);

  // Gerenciar o timer de descanso
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const interval = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (isResting && restTimeLeft === 0) {
      // Aqui poderíamos reproduzir um som, mas vamos apenas encerrar o descanso
      setIsResting(false);
    }
  }, [isResting, restTimeLeft]);

  // Atualizar o exercício atual com base no progresso
  useEffect(() => {
    if (workout && workout.exercises) {
      const index = workout.exercises.findIndex(ex => !ex.completed);
      if (index !== -1) {
        setCurrentExerciseIndex(index);
      }
    }
  }, [workout]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  if (error) return (
    <div className="text-red-500 text-center p-4 max-w-md mx-auto mt-10">
      <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Erro</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/workouts')}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  );
  
  if (!workout) return null;

  const handleToggleExercise = async (exerciseIndex) => {
    const isCompleted = workout.exercises[exerciseIndex].completed;
    await markExerciseCompleted(exerciseIndex, !isCompleted);
    
    // Verificar se todos os exercícios foram concluídos
    const allCompleted = workout.exercises.every((ex, idx) => 
      idx === exerciseIndex ? !isCompleted : ex.completed
    );
    
    if (allCompleted) {
      setShowCompletionModal(true);
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso deste treino?')) {
      await resetWorkoutProgress();
      setTimer(0);
      setCalories(0);
    }
  };

  const handleFinishWorkout = async () => {
    await completeWorkout(timer);
    
    setTimeout(() => {
      navigate(`/workouts/${workoutId}`);
    }, 1000);
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(`/workouts/${workoutId}`)}
            className={`mr-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:scale-110 transition-transform`}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className={`text-xl font-bold flex-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {workout.name}
          </h1>
          <button 
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className={`mr-3 p-2 rounded-full ${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
            } hover:scale-110 transition-transform`}
          >
            {isTimerPaused ? <FaPlay size={14} /> : <FaPause size={14} />}
          </button>
          <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} bg-opacity-20 rounded-lg px-3 py-1 ${
            darkMode ? 'bg-blue-900' : 'bg-blue-100'
          }`}>
            <FaStopwatch className="mr-2" />
            <span className="font-mono font-medium">{formatTime(timer)}</span>
          </div>
        </div>

        {/* Estatísticas do treino atual */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-sm text-center`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Exercícios</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {completedExercises}/{workout.exercises.length}
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-sm text-center`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tempo</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {Math.floor(timer / 60)}min
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-sm text-center`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Calorias</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center justify-center`}>
              <FaFire className="mr-1 text-orange-500" />
              {calories}
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Progresso do treino
            </span>
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {progressPercentage}%
            </span>
          </div>
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 overflow-hidden`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-blue-600 h-2.5 rounded-full"
            />
          </div>
        </div>

        {/* Timer de descanso */}
        <AnimatePresence>
          {isResting && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg mb-6 text-center shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-2">Descanso</h2>
              <div className="relative w-32 h-32 mx-auto mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-blue-300 opacity-25" 
                    cx="50" cy="50" r="45" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="none"
                  />
                  <motion.circle 
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: restTimeLeft / (workout.exercises[currentExerciseIndex]?.rest || 60) }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="text-white" 
                    cx="50" cy="50" r="45" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-4xl font-bold">{restTimeLeft}</p>
                </div>
              </div>
              <p className="text-blue-100 mb-4">Prepare-se para o próximo exercício</p>
              <button 
                onClick={() => setIsResting(false)}
                className="mt-2 bg-white text-blue-500 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Pular
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercício atual em destaque */}
        {!isResting && workout.exercises[currentExerciseIndex] && !workout.exercises[currentExerciseIndex].completed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'} border-2 p-4 rounded-lg mb-6`}
          >
            <div className="text-sm text-blue-600 dark:text-blue-300 mb-1">EXERCÍCIO ATUAL</div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              {workout.exercises[currentExerciseIndex].name}
            </h3>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
              {workout.exercises[currentExerciseIndex].sets && workout.exercises[currentExerciseIndex].sets.length > 0 
                ? `${workout.exercises[currentExerciseIndex].sets.length} séries • ${workout.exercises[currentExerciseIndex].reps || 'N/A'} repetições` 
                : 'Realize o exercício conforme sua capacidade'}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleToggleExercise(currentExerciseIndex)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                <FaCheck className="mr-2" /> Concluir
              </button>
              {workout.exercises[currentExerciseIndex].rest && (
                <button
                  onClick={() => startRest(workout.exercises[currentExerciseIndex].rest)}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-2 rounded-lg font-medium flex items-center justify-center"
                >
                  <FaStopwatch className="mr-1" /> {workout.exercises[currentExerciseIndex].rest}s
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Lista de exercícios */}
        <div className="space-y-3 mb-6">
          <h3 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Lista de exercícios
          </h3>
          
          {workout.exercises.map((exercise, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 ${
                exercise.completed 
                  ? `border-l-4 ${darkMode ? 'border-green-600' : 'border-green-500'}` 
                  : index === currentExerciseIndex && !isResting && !exercise.completed
                    ? `border-l-4 ${darkMode ? 'border-blue-600' : 'border-blue-500'}`
                    : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                    exercise.completed 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {exercise.completed ? (
                      <FaCheck size={14} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {exercise.name}
                    </h3>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                      {exercise.sets && exercise.sets.length > 0 
                        ? `${exercise.sets.length} séries • ${exercise.reps || 'N/A'} repetições` 
                        : 'Detalhes não disponíveis'}
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleExercise(index)}
                  className={`p-2 rounded-full ${
                    exercise.completed 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaCheck size={14} />
                </motion.button>
              </div>
              
              {!exercise.completed && exercise.rest && index !== currentExerciseIndex && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setCurrentExerciseIndex(index);
                      startRest(exercise.rest);
                    }}
                    className={`text-xs ${
                      darkMode 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'bg-blue-100 text-blue-800'
                    } px-2 py-1 rounded flex items-center`}
                  >
                    <FaStopwatch className="mr-1" size={10} />
                    Descanso {exercise.rest}s
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFinishWorkout}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-sm"
          >
            <FaFlag className="mr-2" /> Finalizar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleResetProgress}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-sm"
          >
            <FaUndo className="mr-2" /> Resetar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/workouts/${workoutId}`)}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-lg font-bold shadow-sm"
          >
            Voltar
          </motion.button>
        </div>
      </div>

      {/* Modal de conclusão do treino */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-sm w-full shadow-xl`}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-500" size={32} />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Parabéns!
                </h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Você completou todos os exercícios do treino. Deseja finalizar o treino agora?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleFinishWorkout}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg"
                  >
                    Finalizar
                  </button>
                  <button
                    onClick={() => setShowCompletionModal(false)}
                    className={`flex-1 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    } font-bold py-3 px-4 rounded-lg`}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveWorkout;
