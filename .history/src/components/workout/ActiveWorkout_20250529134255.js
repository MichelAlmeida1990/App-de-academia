// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaCheck, FaStopwatch, FaDumbbell, FaUndo, FaFlag, FaPause, FaPlay, FaFire, FaTimes, FaChevronRight } from 'react-icons/fa';
import Card from '../common/Card';

// Dados mockados de treino ativo
const MOCK_WORKOUT = {
  id: 1,
  name: 'Treino de Peito e Tríceps',
  description: 'Treino focado em peito e tríceps para hipertrofia',
  duration: 45,
  difficulty: 'Intermediário',
  exercises: [
    {
      id: 1,
      name: 'Supino Reto',
      sets: [
        { reps: 12, weight: 60, rest: 90, completed: false },
        { reps: 10, weight: 65, rest: 90, completed: false },
        { reps: 8, weight: 70, rest: 90, completed: false },
        { reps: 6, weight: 75, rest: 120, completed: false }
      ],
      instructions: ['Deite no banco', 'Segure a barra', 'Desça controladamente', 'Empurre para cima'],
      completed: false,
      currentSet: 0
    },
    {
      id: 2,
      name: 'Supino Inclinado',
      sets: [
        { reps: 12, weight: 50, rest: 90, completed: false },
        { reps: 10, weight: 55, rest: 90, completed: false },
        { reps: 8, weight: 60, rest: 90, completed: false }
      ],
      instructions: ['Ajuste o banco', 'Posicione-se', 'Execute o movimento', 'Controle a descida'],
      completed: false,
      currentSet: 0
    },
    {
      id: 3,
      name: 'Crucifixo',
      sets: [
        { reps: 15, weight: 20, rest: 60, completed: false },
        { reps: 12, weight: 22, rest: 60, completed: false },
        { reps: 10, weight: 25, rest: 60, completed: false }
      ],
      instructions: ['Deite no banco', 'Abra os braços', 'Sinta o alongamento', 'Contraia o peito'],
      completed: false,
      currentSet: 0
    },
    {
      id: 4,
      name: 'Tríceps Testa',
      sets: [
        { reps: 12, weight: 30, rest: 60, completed: false },
        { reps: 10, weight: 32, rest: 60, completed: false },
        { reps: 8, weight: 35, rest: 60, completed: false }
      ],
      instructions: ['Deite no banco', 'Segure a barra', 'Flexione apenas os cotovelos', 'Estenda os braços'],
      completed: false,
      currentSet: 0
    },
    {
      id: 5,
      name: 'Tríceps Pulley',
      sets: [
        { reps: 15, weight: 40, rest: 45, completed: false },
        { reps: 12, weight: 45, rest: 45, completed: false },
        { reps: 10, weight: 50, rest: 45, completed: false }
      ],
      instructions: ['Posicione-se no cabo', 'Cotovelos fixos', 'Empurre para baixo', 'Controle a subida'],
      completed: false,
      currentSet: 0
    }
  ]
};

// Componente de Timer Circular
const CircularTimer = ({ timeLeft, totalTime, size = 120 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-600 opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-purple-400 transition-all duration-1000 ease-linear"
        />
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{timeLeft}</span>
      </div>
    </div>
  );
};

// Componente de Set Individual
const SetCard = ({ set, index, isActive, isCompleted, onComplete, onSkip }) => {
  return (
    <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
      isCompleted 
        ? 'bg-green-900/30 border-green-600' 
        : isActive 
          ? 'bg-purple-900/30 border-purple-600' 
          : 'bg-gray-800/50 border-gray-600'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isCompleted 
              ? 'bg-green-600 text-white' 
              : isActive 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-600 text-gray-300'
          }`}>
            {isCompleted ? <FaCheck size={12} /> : index + 1}
          </div>
          
          <div>
            <div className="text-white font-medium">
              {set.reps} reps {set.weight && `• ${set.weight}kg`}
            </div>
            {set.rest && (
              <div className="text-sm text-gray-400">
                Descanso: {set.rest}s
              </div>
            )}
          </div>
        </div>
        
        {isActive && !isCompleted && (
          <div className="flex space-x-2">
            <button
              onClick={onComplete}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FaCheck size={12} />
            </button>
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Pular
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal
const ActiveWorkout = ({ workoutId, onBack, onComplete }) => {
  const [workout, setWorkout] = useState(MOCK_WORKOUT);
  const [timer, setTimer] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [restTotalTime, setRestTotalTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [calories, setCalories] = useState(0);
  const [showExerciseInstructions, setShowExerciseInstructions] = useState(false);
  
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);

  // Timer principal do treino
  useEffect(() => {
    if (!isTimerPaused) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          // Calcular calorias a cada minuto
          if (newTime % 60 === 0) {
            setCalories(prevCalories => prevCalories + Math.floor(Math.random() * 5) + 3);
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerPaused]);

  // Timer de descanso
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restTimerRef.current);
    }

    return () => clearInterval(restTimerRef.current);
  }, [isResting, restTimeLeft]);

  // Encontrar exercício atual
  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentExercise.currentSet];

  // Calcular progresso
  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0
  );
  const progressPercentage = Math.round((completedSets / totalSets) * 100);

  // Completar série
  const completeSet = (exerciseIndex, setIndex) => {
    setWorkout(prev => {
      const newWorkout = { ...prev };
      newWorkout.exercises[exerciseIndex].sets[setIndex].completed = true;
      
      // Verificar se o exercício foi completado
      const exercise = newWorkout.exercises[exerciseIndex];
      const allSetsCompleted = exercise.sets.every(set => set.completed);
      
      if (allSetsCompleted) {
        exercise.completed = true;
        // Avançar para próximo exercício
        const nextExerciseIndex = exerciseIndex + 1;
        if (nextExerciseIndex < newWorkout.exercises.length) {
          setCurrentExerciseIndex(nextExerciseIndex);
        } else {
          // Todos os exercícios completados
          setShowCompletionModal(true);
        }
      } else {
        // Avançar para próxima série
        exercise.currentSet = setIndex + 1;
        
        // Iniciar descanso se houver
        const completedSet = exercise.sets[setIndex];
        if (completedSet.rest) {
          startRest(completedSet.rest);
        }
      }
      
      return newWorkout;
    });
  };

  // Iniciar descanso
  const startRest = (seconds) => {
    setIsResting(true);
    setRestTimeLeft(seconds);
    setRestTotalTime(seconds);
  };

  // Pular descanso
  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
    setRestTotalTime(0);
  };

  // Resetar progresso
  const resetProgress = () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso?')) {
      setWorkout(prev => ({
        ...prev,
        exercises: prev.exercises.map(ex => ({
          ...ex,
          completed: false,
          currentSet: 0,
          sets: ex.sets.map(set => ({ ...set, completed: false }))
        }))
      }));
      setCurrentExerciseIndex(0);
      setTimer(0);
      setCalories(0);
      setIsResting(false);
      setRestTimeLeft(0);
    }
  };

  // Finalizar treino
  const finishWorkout = () => {
    const workoutData = {
      id: workout.id,
      name: workout.name,
      duration: timer,
      calories,
      completedSets,
      totalSets,
      completedAt: new Date().toISOString()
    };
    
    if (onComplete) {
      onComplete(workoutData);
    } else {
      alert('Treino finalizado com sucesso!');
    }
  };

  // Formatear tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 text-gray-300 hover:text-white hover:scale-110 transition-all"
          >
            <FaArrowLeft size={24} />
          </button>
          
          <h1 className="text-xl font-bold text-white flex-1">
            {workout.name}
          </h1>
          
          <button 
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="mr-3 p-2 bg-gray-800 text-gray-300 hover:text-white rounded-full hover:scale-110 transition-all"
          >
            {isTimerPaused ? <FaPlay size={14} /> : <FaPause size={14} />}
          </button>
          
          <div className="flex items-center bg-purple-900/30 text-purple-300 rounded-lg px-3 py-1">
            <FaStopwatch className="mr-2" />
            <span className="font-mono font-medium">{formatTime(timer)}</span>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-400">Séries</div>
            <div className="text-lg font-bold text-white">
              {completedSets}/{totalSets}
            </div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-400">Tempo</div>
            <div className="text-lg font-bold text-white">
              {Math.floor(timer / 60)}min
            </div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-400">Calorias</div>
            <div className="text-lg font-bold text-white flex items-center justify-center">
              <FaFire className="mr-1 text-orange-500" />
              {calories}
            </div>
          </Card>
        </div>

        {/* Barra de progresso */}
        <Card className="p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-white">Progresso do treino</span>
            <span className="text-sm font-medium text-white">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </Card>

        {/* Timer de descanso */}
        {isResting && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-purple-600">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Descanso</h2>
              
              <div className="flex justify-center mb-4">
                <CircularTimer 
                  timeLeft={restTimeLeft} 
                  totalTime={restTotalTime} 
                  size={120} 
                />
              </div>
              
              <p className="text-purple-200 mb-4">Prepare-se para a próxima série</p>
              
              <button 
                onClick={skipRest}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-50 transition-colors"
              >
                Pular Descanso
              </button>
            </div>
          </Card>
        )}

        {/* Exercício atual */}
        {currentExercise && !isResting && (
          <Card className="p-4 mb-6 border-2 border-purple-600 bg-purple-900/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-purple-400 mb-1">EXERCÍCIO ATUAL</div>
                <h3 className="text-lg font-bold text-white">{currentExercise.name}</h3>
                <div className="text-sm text-gray-400">
                  Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
                </div>
              </div>
              
              <button
                onClick={() => setShowExerciseInstructions(true)}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Série atual */}
            {currentSet && (
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Série Atual:</div>
                <SetCard
                  set={currentSet}
                  index={currentExercise.currentSet}
                  isActive={true}
                  isCompleted={currentSet.completed}
                  onComplete={() => completeSet(currentExerciseIndex, currentExercise.currentSet)}
                />
              </div>
            )}

            {/* Todas as séries */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Todas as séries:</div>
              {currentExercise.sets.map((set, setIndex) => (
                <SetCard
                  key={setIndex}
                  set={set}
                  index={setIndex}
                  isActive={setIndex === currentExercise.currentSet}
                  isCompleted={set.completed}
                  onComplete={() => completeSet(currentExerciseIndex, setIndex)}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Lista de exercícios */}
        <Card className="p-4 mb-6">
          <h3 className="font-medium text-gray-300 mb-3">Lista de exercícios</h3>
          
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                className={`p-3 rounded-lg border transition-all ${
                  exercise.completed 
                    ? 'bg-green-900/30 border-green-600' 
                    : index === currentExerciseIndex
                      ? 'bg-purple-900/30 border-purple-600'
                      : 'bg-gray-800/50 border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                      exercise.completed 
                        ? 'bg-green-600 text-white' 
                        : index === currentExerciseIndex
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                    }`}>
                      {exercise.completed ? (
                        <FaCheck size={14} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white">{exercise.name}</h4>
                      <div className="text-xs text-gray-400">
                        {exercise.sets.length} séries • {exercise.sets.filter(s => s.completed).length} concluídas
                      </div>
                    </div>
                  </div>
                  
                  {index === currentExerciseIndex && !exercise.completed && (
                    <div className="text-xs text-purple-400 font-medium">
                      ATIVO
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Botões de ação */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={finishWorkout}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all hover:scale-105"
          >
            <FaFlag className="mr-2" /> Finalizar
          </button>
          
          <button
            onClick={resetProgress}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all hover:scale-105"
          >
            <FaUndo className="mr-2" /> Resetar
          </button>
          
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Modal de instruções */}
      {showExerciseInstructions && currentExercise && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">{currentExercise.name}</h2>
                <button
                  onClick={() => setShowExerciseInstructions(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Como executar:</h3>
                <ol className="space-y-2">
                  {currentExercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => setShowExerciseInstructions(false)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Entendi
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de conclusão */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-green-400" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Parabéns!</h2>
              <p className="text-gray-300 mb-6">
                Você completou todos os exercícios do treino. Deseja finalizar agora?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={finishWorkout}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Finalizar
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkout;
