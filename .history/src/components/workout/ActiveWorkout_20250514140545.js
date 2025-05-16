// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { 
  FaClock, 
  FaArrowLeft, 
  FaCheck, 
  FaPlus, 
  FaMinus, 
  FaRegClock,
  FaDumbbell,
  FaAngleRight,
  FaAngleLeft
} from 'react-icons/fa';
import { format, addSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ActiveWorkout = () => {
  const { activeWorkout, completeWorkout, exitWorkout } = useWorkout();
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState([]);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  // Inicializar o progresso do exercício
  useEffect(() => {
    if (activeWorkout && activeWorkout.template) {
      const initialProgress = activeWorkout.template.exercises.map(() => ({
        completed: false,
        sets: []
      }));
      setExerciseProgress(initialProgress);
      setCurrentExercise(0);
      setTimer(0);
      setIsResting(false);
      setRestTimer(0);
    }
  }, [activeWorkout]);

  // Gerenciar o timer
  useEffect(() => {
    if (!activeWorkout) return;
    
    const interval = setInterval(() => {
      if (isResting) {
        if (restTimer > 0) {
          setRestTimer(prev => prev - 1);
        } else {
          setIsResting(false);
        }
      } else {
        setTimer(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeWorkout, isResting, restTimer]);

  if (!activeWorkout) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetComplete = (exerciseIndex, weight, reps) => {
    const newProgress = [...exerciseProgress];
    newProgress[exerciseIndex].sets.push({ weight, reps });
    setExerciseProgress(newProgress);
    
    // Iniciar descanso se o exercício tiver tempo de descanso definido
    const exercise = activeWorkout.template.exercises[exerciseIndex];
    if (exercise.rest > 0) {
      setIsResting(true);
      setRestTimer(exercise.rest);
    }
  };

  const handleExerciseComplete = (exerciseIndex) => {
    const newProgress = [...exerciseProgress];
    newProgress[exerciseIndex].completed = true;
    setExerciseProgress(newProgress);
    
    // Verificar se é o último exercício
    if (exerciseIndex === activeWorkout.template.exercises.length - 1) {
      setShowCompleteConfirm(true);
    } else {
      // Avançar para o próximo exercício
      setCurrentExercise(exerciseIndex + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < activeWorkout.template.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    }
  };

  const handleCompleteWorkout = () => {
    completeWorkout(activeWorkout.id);
  };

  const handleExitWorkout = () => {
    exitWorkout(); // Usar a nova função exitWorkout ao invés de setActiveWorkout(null)
  };

  const exercise = activeWorkout.template.exercises[currentExercise];
  const progress = exerciseProgress[currentExercise];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowCompleteConfirm(true)}
            className="p-2"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">{activeWorkout.title}</h2>
          <div className="w-8"></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{formatTime(timer)}</span>
          </div>
          <div className="text-sm">
            Exercício {currentExercise + 1} de {activeWorkout.template.exercises.length}
          </div>
        </div>
      </div>
      
      {/* Descanso */}
      {isResting && (
        <div className="bg-green-100 dark:bg-green-900 p-4 text-center">
          <h3 className="text-lg font-medium mb-2">Tempo de Descanso</h3>
          <div className="text-3xl font-bold mb-2">{formatTime(restTimer)}</div>
          <p className="text-sm">Próximo exercício: {currentExercise < activeWorkout.template.exercises.length - 1 ? 
            activeWorkout.template.exercises[currentExercise + 1].name : 
            "Fim do treino"}
          </p>
        </div>
      )}
      
      {/* Corpo principal */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{exercise.name}</h3>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {exercise.sets} séries × {exercise.reps} reps
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={handlePrevExercise}
                disabled={currentExercise === 0}
                className={`p-2 rounded-full ${
                  currentExercise === 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              >
                <FaAngleLeft size={24} />
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Séries completadas
                </div>
                <div className="text-2xl font-bold">
                  {progress?.sets.length || 0} / {exercise.sets}
                </div>
              </div>
              
              <button 
                onClick={handleNextExercise}
                disabled={currentExercise === activeWorkout.template.exercises.length - 1}
                className={`p-2 rounded-full ${
                  currentExercise === activeWorkout.template.exercises.length - 1
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              >
                <FaAngleRight size={24} />
              </button>
            </div>
            
            {/* Formulário para registrar série */}
            {!progress?.completed && progress?.sets.length < exercise.sets && (
              <SetForm 
                onComplete={(weight, reps) => handleSetComplete(currentExercise, weight, reps)} 
                setNumber={progress?.sets.length + 1}
                totalSets={exercise.sets}
                recommendedReps={exercise.reps}
              />
            )}
            
            {/* Histórico de séries */}
            {progress?.sets.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Séries Completadas</h4>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-3 text-sm font-medium p-2 border-b dark:border-gray-600">
                    <div>Série</div>
                    <div>Peso</div>
                    <div>Reps</div>
                  </div>
                  {progress.sets.map((set, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-2 text-sm border-b last:border-b-0 dark:border-gray-600">
                      <div>{idx + 1}</div>
                      <div>{set.weight} kg</div>
                      <div>{set.reps}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Botão para completar exercício */}
            {progress?.sets.length >= exercise.sets && !progress?.completed && (
              <button
                onClick={() => handleExerciseComplete(currentExercise)}
                className="w-full mt-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"
              >
                <FaCheck className="mr-2" /> Completar Exercício
              </button>
            )}
          </div>
        </div>
        
        {/* Lista de exercícios */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold">Todos os Exercícios</h3>
          </div>
          
          <div className="divide-y dark:divide-gray-700">
            {activeWorkout.template.exercises.map((ex, idx) => {
              const exProgress = exerciseProgress[idx];
              
              return (
                <div 
                  key={idx}
                  className={`p-3 flex items-center justify-between ${
                    idx === currentExercise ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center">
                    {exProgress?.completed ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        idx === currentExercise 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>
                    )}
                    <span className={exProgress?.completed ? 'line-through text-gray-500' : ''}>
                      {ex.name}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {exProgress?.completed ? 'Concluído' : `${exProgress?.sets.length || 0}/${ex.sets} séries`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Confirmação para completar ou sair */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Finalizar Treino?</h3>
            
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {exerciseProgress.every(ex => ex.completed)
                ? "Todos os exercícios foram concluídos. Deseja finalizar o treino?"
                : "Você ainda tem exercícios não concluídos. O que deseja fazer?"}
            </p>
            
            <div className="flex flex-col space-y-2">
              {exerciseProgress.every(ex => ex.completed) && (
                <button
                  onClick={handleCompleteWorkout}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"
                >
                  <FaCheck className="mr-2" /> Completar Treino
                </button>
              )}
              
              <button
                onClick={handleExitWorkout}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
              >
                Sair sem Completar
              </button>
              
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="w-full py-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              >
                Continuar Treino
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para registrar uma série
const SetForm = ({ onComplete, setNumber, totalSets, recommendedReps }) => {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(10);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(weight, reps);
    // Manter o peso para a próxima série, mas resetar as reps
    setReps(10);
  };
  
  const handleWeightChange = (amount) => {
    setWeight(prev => Math.max(0, prev + amount));
  };
  
  const handleRepsChange = (amount) => {
    setReps(prev => Math.max(1, prev + amount));
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
      <div className="text-center mb-3">
        <span className="text-sm font-medium bg-blue-500 text-white px-3 py-1 rounded-full">
          Série {setNumber} de {totalSets}
        </span>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Peso (kg)</label>
        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => handleWeightChange(-2.5)}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded-l-lg"
          >
            <FaMinus />
          </button>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
            className="flex-1 p-2 text-center border-t border-b dark:border-gray-600 dark:bg-gray-800"
            min="0"
            step="2.5"
          />
          <button 
            type="button"
            onClick={() => handleWeightChange(2.5)}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded-r-lg"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Repetições ({recommendedReps})</label>
        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => handleRepsChange(-1)}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded-l-lg"
          >
            <FaMinus />
          </button>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 p-2 text-center border-t border-b dark:border-gray-600 dark:bg-gray-800"
            min="1"
          />
          <button 
            type="button"
            onClick={() => handleRepsChange(
