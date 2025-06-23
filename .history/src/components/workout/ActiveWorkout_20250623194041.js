// src/components/workout/ActiveWorkout.js
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaCheck, FaStopwatch, FaDumbbell, FaUndo, FaFlag, FaPause, FaPlay, FaFire, FaTimes, FaChevronRight, FaPlus, FaMinus, FaEdit, FaCheckCircle, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import Card from '../common/Card';

// Componente de Timer Circular Melhorado
const CircularTimer = ({ timeLeft, totalTime, size = 120, isFullscreen = false }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - (progress * circumference);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          strokeWidth={isFullscreen ? "8" : "4"}
          fill="none"
          className="text-gray-600 opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={isFullscreen ? "8" : "4"}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-linear ${
            timeLeft <= 10 ? 'text-red-400' : timeLeft <= 30 ? 'text-yellow-400' : 'text-purple-400'
          }`}
        />
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold text-white ${isFullscreen ? 'text-6xl' : 'text-2xl'}`}>
          {isFullscreen ? formatTime(timeLeft) : timeLeft}
        </span>
        {isFullscreen && (
          <span className="text-gray-300 text-lg mt-2">DESCANSO</span>
        )}
      </div>
    </div>
  );
};

// Componente de Input de Peso
const WeightInput = ({ value, onChange, exerciseName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseFloat(tempValue) || 0;
    onChange(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value.toString());
    setIsEditing(false);
  };

  const increment = () => {
    const newValue = value + 2.5;
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(0, value - 2.5);
    onChange(newValue);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
        <input
          type="number"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="w-16 px-2 py-1 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white"
          step="0.5"
          min="0"
          autoFocus
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">kg</span>
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-700"
        >
          <FaCheck size={12} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:text-red-700"
        >
          <FaTimes size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <button
          onClick={decrement}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <FaMinus size={12} />
        </button>
        
        <div 
          className="px-3 py-2 min-w-[60px] text-center font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {value > 0 ? `${value}kg` : '--'}
        </div>
        
        <button
          onClick={increment}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <FaPlus size={12} />
        </button>
      </div>
      
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
      >
        <FaEdit size={12} />
      </button>
    </div>
  );
};

// Componente de Set Individual Melhorado
const EnhancedSetCard = ({ set, index, isActive, isCompleted, onComplete, onSkip, onWeightChange, exerciseName }) => {
  const [weight, setWeight] = useState(set.weight || 0);
  const [isCompleting, setIsCompleting] = useState(false);

  // Atualizar peso quando o set muda
  useEffect(() => {
    setWeight(set.weight || 0);
  }, [set.weight]);

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
    if (onWeightChange) {
      onWeightChange(index, newWeight);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
    }, 200);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
      isCompleted 
        ? 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-500 scale-[0.98]' 
        : isActive 
          ? 'bg-white dark:bg-gray-800 border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-600'
    }`}>
      
      {/* Indicador de progresso animado */}
      {isCompleting && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 animate-pulse" />
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              isCompleted 
                ? 'bg-purple-600 text-white scale-110' 
                : isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              {isCompleted ? <FaCheckCircle size={14} /> : index + 1}
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {set.reps} repetições
              </div>
              {set.rest && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Descanso: {set.rest}s
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input de peso */}
        {isActive && !isCompleted && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Peso usado:</div>
            <WeightInput
              value={weight}
              onChange={handleWeightChange}
              exerciseName={exerciseName}
            />
          </div>
        )}

        {/* Botões de ação */}
        {isActive && !isCompleted && (
          <div className="flex space-x-3">
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                isCompleting 
                  ? 'bg-green-500 scale-105' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              {isCompleting ? (
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="mr-2" />
                  Concluída!
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaCheck className="mr-2" />
                  Marcar como Concluída
                </div>
              )}
            </button>
            
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                Pular
              </button>
            )}
          </div>
        )}

        {/* Peso exibido para séries completadas */}
        {isCompleted && weight > 0 && (
          <div className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
            ✓ Realizada com {weight}kg
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Timer de Descanso em Tela Cheia
const FullscreenRestTimer = ({ timeLeft, totalTime, onSkip, onAddTime, onSubtractTime, isSoundEnabled, onToggleSound }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <CircularTimer 
          timeLeft={timeLeft} 
          totalTime={totalTime} 
          size={200} 
          isFullscreen={true}
        />
        
        {/* Controles de tempo */}
        <div className="flex items-center justify-center space-x-4 mt-8 mb-6">
          <button
            onClick={onSubtractTime}
            className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
          >
            <FaMinus />
          </button>
          
          <span className="text-white text-lg font-medium min-w-[100px]">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
          
          <button
            onClick={onAddTime}
            className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
          >
            <FaPlus />
          </button>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={onToggleSound}
            className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
          >
            {isSoundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          
          <button
            onClick={onSkip}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all hover:scale-105"
          >
            Pular Descanso
          </button>
        </div>

        {/* Motivação */}
        <div className="mt-8 text-gray-300 text-lg">
          {timeLeft <= 10 ? '🔥 Vamos lá!' : timeLeft <= 30 ? '⚡ Quase pronto!' : '💪 Descanse bem!'}
        </div>
      </div>
    </div>
  );
};

// Componente principal
const ActiveWorkout = ({ workoutId }) => {
  const navigate = useNavigate();
  const { getWorkoutById, updateWorkout } = useWorkout();
  const [workout, setWorkout] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [restTotalTime, setRestTotalTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [calories, setCalories] = useState(0);
  const [showExerciseInstructions, setShowExerciseInstructions] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);

  // Buscar dados do treino
  useEffect(() => {
    const currentWorkout = getWorkoutById(workoutId);
    if (currentWorkout) {
      // Preparar exercícios com sets se não existirem
      const workoutWithSets = {
        ...currentWorkout,
        exercises: currentWorkout.exercises.map(exercise => ({
          ...exercise,
          sets: Array.isArray(exercise.sets) ? exercise.sets : 
            Array(exercise.sets).fill(null).map(() => ({
              reps: exercise.reps,
              weight: 0,
              rest: exercise.rest,
              completed: false
            })),
          completed: false,
          currentSet: 0
        }))
      };
      setWorkout(workoutWithSets);
    }
  }, [workoutId, getWorkoutById]);

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

  // Timer de descanso com notificações
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            clearInterval(restTimerRef.current);
            // Notificação sonora (se habilitada)
            if (isSoundEnabled) {
              playNotificationSound();
            }
            return 0;
          }
          // Notificações de contagem regressiva
          if (isSoundEnabled && prev <= 3 && prev > 0) {
            playTickSound();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restTimerRef.current);
    }

    return () => clearInterval(restTimerRef.current);
  }, [isResting, restTimeLeft, isSoundEnabled]);

  // Funções de som
  const playNotificationSound = () => {
    // Implementar som de notificação
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const playTickSound = () => {
    // Implementar som de tick
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
        <div className="text-white">Carregando treino...</div>
      </div>
    );
  }

  // Encontrar exercício atual
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  // CORREÇÃO PRINCIPAL: Melhor lógica para encontrar o currentSet
  const getCurrentSet = () => {
    if (!currentExercise || !currentExercise.sets) return null;
    
    // Encontrar a primeira série não completada
    const nextIncompleteSet = currentExercise.sets.find(set => !set.completed);
    if (nextIncompleteSet) {
      const nextIncompleteIndex = currentExercise.sets.indexOf(nextIncompleteSet);
      // Atualizar o currentSet se necessário
      if (currentExercise.currentSet !== nextIncompleteIndex) {
        // Atualizar silenciosamente o índice da série atual
        setWorkout(prev => {
          const newWorkout = { ...prev };
          newWorkout.exercises[currentExerciseIndex].currentSet = nextIncompleteIndex;
          return newWorkout;
        });
      }
      return nextIncompleteSet;
    }
    
    // Se todas as séries estão completadas, retornar null
    return null;
  };

  const currentSet = getCurrentSet();
  const currentSetIndex = currentSet ? currentExercise.sets.indexOf(currentSet) : -1;

  // Calcular progresso
  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0
  );
  const progressPercentage = Math.round((completedSets / totalSets) * 100);

  // CORREÇÃO: Função completeSet melhorada
  const completeSet = (exerciseIndex, setIndex) => {
    setWorkout(prev => {
      const newWorkout = { ...prev };
      
      // Verificar se o índice é válido
      if (!newWorkout.exercises[exerciseIndex] || !newWorkout.exercises[exerciseIndex].sets[setIndex]) {
        console.error('Índice de série inválido:', { exerciseIndex, setIndex });
        return prev;
      }
      
      // Marcar a série como completada
      newWorkout.exercises[exerciseIndex].sets[setIndex].completed = true;
      
      const exercise = newWorkout.exercises[exerciseIndex];
      const allSetsCompleted = exercise.sets.every(set => set.completed);
      
      if (allSetsCompleted) {
        // Exercício completado
        exercise.completed = true;
        
        // Procurar próximo exercício não completado
        const nextExerciseIndex = newWorkout.exercises.findIndex((ex, idx) => 
          idx > exerciseIndex && !ex.completed
        );
        
        if (nextExerciseIndex !== -1) {
          setCurrentExerciseIndex(nextExerciseIndex);
        } else {
          // Todos os exercícios completados
          setShowCompletionModal(true);
        }
      } else {
        // Encontrar próxima série não completada
        const nextIncompleteIndex = exercise.sets.findIndex(set => !set.completed);
        if (nextIncompleteIndex !== -1) {
          exercise.currentSet = nextIncompleteIndex;
        }
        
        // Iniciar descanso se houver
        const completedSet = exercise.sets[setIndex];
        if (completedSet.rest && completedSet.rest > 0) {
          startRest(completedSet.rest);
        }
      }
      
      // Atualizar o treino no contexto
      updateWorkout(newWorkout);
      
      return newWorkout;
    });
  };

  // Atualizar peso de uma série
  const updateSetWeight = (exerciseIndex, setIndex, weight) => {
    setWorkout(prev => {
      const newWorkout = { ...prev };
      if (newWorkout.exercises[exerciseIndex] && newWorkout.exercises[exerciseIndex].sets[setIndex]) {
        newWorkout.exercises[exerciseIndex].sets[setIndex].weight = weight;
        updateWorkout(newWorkout);
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

  // Adicionar tempo ao descanso
  const addRestTime = () => {
    setRestTimeLeft(prev => prev + 30);
    setRestTotalTime(prev => prev + 30);
  };

  // Subtrair tempo do descanso
  const subtractRestTime = () => {
    setRestTimeLeft(prev => Math.max(10, prev - 30));
    setRestTotalTime(prev => Math.max(10, prev - 30));
  };

  // Resetar progresso
  const resetProgress = () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso?')) {
      setWorkout(prev => {
        const resetWorkout = {
          ...prev,
          exercises: prev.exercises.map(ex => ({
            ...ex,
            completed: false,
            currentSet: 0,
            sets: ex.sets.map(set => ({ ...set, completed: false, weight: 0 }))
          }))
        };
        
        // Atualizar o treino no contexto
        updateWorkout(resetWorkout);
        
        return resetWorkout;
      });
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
      ...workout,
      duration: timer,
      calories,
      completedSets,
      totalSets,
      completedAt: new Date().toISOString(),
      completed: true
    };
    
    // Atualizar o treino no contexto
    updateWorkout(workoutData);
    
    // Voltar para a lista de treinos
    navigate('/workouts');
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
            onClick={() => navigate('/workouts')}
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
          <Card className="p-3 text-center bg-white dark:bg-gray-800">
            <div className="text-xs text-gray-400">Séries</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {completedSets}/{totalSets}
            </div>
          </Card>
          
          <Card className="p-3 text-center bg-white dark:bg-gray-800">
            <div className="text-xs text-gray-400">Tempo</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.floor(timer / 60)}min
            </div>
          </Card>
          
          <Card className="p-3 text-center bg-white dark:bg-gray-800">
            <div className="text-xs text-gray-400">Calorias</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center">
              <FaFire className="mr-1 text-purple-500" />
              {calories}
            </div>
          </Card>
        </div>

        {/* Barra de progresso */}
        <Card className="p-4 mb-6 bg-white dark:bg-gray-800">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Progresso do treino</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </Card>

        {/* CORREÇÃO: Exercício atual - condição melhorada */}
        {currentExercise && !isResting && (
          <Card className="p-6 mb-6 border-2 border-purple-500 bg-white dark:bg-gray-800 shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-1 font-medium">EXERCÍCIO ATUAL</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentExercise.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
                </div>
              </div>
              
              <button
                onClick={() => setShowExerciseInstructions(true)}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all hover:scale-105"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* CORREÇÃO: Série atual - sempre mostrar se houver série não completada */}
            {currentSet && currentSetIndex !== -1 && (
              <div className="mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                  Série Atual ({currentSetIndex + 1} de {currentExercise.sets.length}):
                </div>
                <EnhancedSetCard
                  set={currentSet}
                  index={currentSetIndex}
                  isActive={true}
                  isCompleted={currentSet.completed}
                  onComplete={() => completeSet(currentExerciseIndex, currentSetIndex)}
                  onWeightChange={(setIndex, weight) => updateSetWeight(currentExerciseIndex, currentSetIndex, weight)}
                  exerciseName={currentExercise.name}
                />
              </div>
            )}

            {/* Mensagem quando todas as séries estão completadas */}
            {!currentSet && currentExercise.completed && (
              <div className="mb-6">
                <div className="text-center py-4 px-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                  <div className="text-green-800 dark:text-green-300 font-medium">
                    Exercício Completado!
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-sm">
                    Todas as séries foram finalizadas
                  </div>
                </div>
              </div>
            )}

            {/* Todas as séries */}
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Todas as séries:</div>
              {currentExercise.sets.map((set, setIndex) => (
                <EnhancedSetCard
                  key={setIndex}
                  set={set}
                  index={setIndex}
                  isActive={setIndex === currentSetIndex}
                  isCompleted={set.completed}
                  onComplete={() => completeSet(currentExerciseIndex, setIndex)}
                  onWeightChange={(index, weight) => updateSetWeight(currentExerciseIndex, index, weight)}
                  exerciseName={currentExercise.name}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Lista de exercícios */}
        <Card className="p-4 mb-6 bg-white dark:bg-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-gray-300 mb-3">Lista de exercícios</h3>
          
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-2 transition-all ${
                  exercise.completed 
                    ? 'bg-white dark:bg-purple-900/30 border-purple-600' 
                    : index === currentExerciseIndex
                      ? 'bg-white dark:bg-purple-900/30 border-purple-600'
                      : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                      exercise.completed 
                        ? 'bg-purple-600 text-white' 
                        : index === currentExerciseIndex
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {exercise.completed ? (
                        <FaCheck size={14} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {exercise.sets.length} séries • {exercise.sets.filter(s => s.completed).length} concluídas
                      </div>
                    </div>
                  </div>
                  
                  {index === currentExerciseIndex && !exercise.completed && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
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
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all hover:scale-105"
          >
            <FaFlag className="mr-2" /> Finalizar
          </button>
          
          <button
            onClick={resetProgress}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all hover:scale-105"
          >
            <FaUndo className="mr-2" /> Resetar
          </button>
          
          <button
            onClick={() => navigate('/workouts')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Timer de descanso em tela cheia */}
      {isResting && (
        <FullscreenRestTimer
          timeLeft={restTimeLeft}
          totalTime={restTotalTime}
          onSkip={skipRest}
          onAddTime={addRestTime}
          onSubtractTime={subtractRestTime}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        />
      )}

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
                  {currentExercise.instructions?.map((instruction, index) => (
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
          <Card className="max-w-md w-full bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Treino Concluído!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Parabéns! Você completou todos os exercícios do treino.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tempo Total</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{Math.floor(timer / 60)}min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Calorias</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{calories}</div>
                  </div>
                </div>
                <button
                  onClick={finishWorkout}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Finalizar Treino
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
