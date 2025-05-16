// src/context/WorkoutContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const WorkoutContext = createContext();

// Componente Provider que usa o hook useNavigate
export const WorkoutProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });
  
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  const [personalRecords, setPersonalRecords] = useState(() => {
    const savedRecords = localStorage.getItem('personalRecords');
    return savedRecords ? JSON.parse(savedRecords) : {};
  });
  
  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : {
      firstWorkout: false,
      tenWorkouts: false,
      twentyFiveWorkouts: false,
      fiftyWorkouts: false,
      hundredWorkouts: false,
      firstRecord: false,
      fiveRecords: false,
      tenRecords: false,
      threeConsecutiveDays: false,
      sevenConsecutiveDays: false,
      fourteenConsecutiveDays: false,
      thirtyConsecutiveDays: false,
    };
  });
  
  // Salvar workouts no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  
  // Salvar recordes pessoais no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('personalRecords', JSON.stringify(personalRecords));
  }, [personalRecords]);
  
  // Salvar conquistas no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  // Verificar conquistas quando workouts mudar
  useEffect(() => {
    checkWorkoutAchievements();
    checkStreakAchievements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workouts]);
  
  // Usando useCallback para funções que são passadas para o contexto
  const addWorkout = useCallback((workout) => {
    setWorkouts(prevWorkouts => [...prevWorkouts, workout]);
  }, []);
  
  const startWorkout = useCallback((workoutId) => {
    setWorkouts(prevWorkouts => {
      const workout = prevWorkouts.find(w => w.id === workoutId);
      if (workout) {
        setActiveWorkout({
          ...workout,
          startTime: new Date().toISOString()
        });
        navigate('/active-workout');
      }
      return prevWorkouts;
    });
  }, [navigate]);
  
  const completeSet = useCallback((exerciseIndex, setIndex, weight, reps) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      const newWorkout = { ...prev };
      newWorkout.exercises[exerciseIndex].sets[setIndex] = {
        weight,
        reps,
        completed: true
      };
      return newWorkout;
    });
    
    // Verificar se é um novo recorde pessoal
    checkForPersonalRecord(activeWorkout.exercises[exerciseIndex].name, weight);
  }, [activeWorkout]);
  
  // Função para verificar se um novo recorde pessoal foi alcançado
  const checkForPersonalRecord = useCallback((exerciseName, weight) => {
    const currentRecord = personalRecords[exerciseName] || 0;
    
    if (weight > currentRecord) {
      // Atualizar recorde pessoal
      setPersonalRecords(prev => ({
        ...prev,
        [exerciseName]: weight
      }));
      
      // Verificar conquistas relacionadas a recordes
      const recordCount = Object.keys(personalRecords).length;
      
      if (!achievements.firstRecord) {
        setAchievements(prev => ({ ...prev, firstRecord: true }));
        showAchievementNotification('Primeiro Recorde Pessoal!');
      }
      
      if (recordCount >= 5 && !achievements.fiveRecords) {
        setAchievements(prev => ({ ...prev, fiveRecords: true }));
        showAchievementNotification('5 Recordes Pessoais!');
      }
      
      if (recordCount >= 10 && !achievements.tenRecords) {
        setAchievements(prev => ({ ...prev, tenRecords: true }));
        showAchievementNotification('10 Recordes Pessoais!');
      }
      
      return true; // Indica que um novo recorde foi estabelecido
    }
    
    return false;
  }, [personalRecords, achievements]);
  
  const completeWorkout = useCallback(() => {
    if (!activeWorkout) return;
    
    const endTime = new Date().toISOString();
    const duration = new Date(endTime) - new Date(activeWorkout.startTime);
    
    // Atualizar o treino com os dados de conclusão
    const completedWorkout = {
      ...activeWorkout,
      completed: true,
      endTime,
      duration
    };
    
    setWorkouts(prev => 
      prev.map(w => 
        w.id === activeWorkout.id ? completedWorkout : w
      )
    );
    
    setActiveWorkout(null);
    navigate('/dashboard');
    
    // Verificar conquistas após completar um treino
    checkWorkoutAchievements();
  }, [activeWorkout, navigate]);
  
  const cancelWorkout = useCallback(() => {
    setActiveWorkout(null);
    navigate('/dashboard');
  }, [navigate]);
  
  const getWeeklyWorkouts = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek;
    });
  }, [workouts]);
  
  const getTotalTrainingMinutes = useCallback(() => {
    return workouts
      .filter(w => w.completed && w.duration)
      .reduce((total, workout) => total + (workout.duration / (1000 * 60)), 0);
  }, [workouts]);
  
  // Função para verificar conquistas relacionadas ao número de treinos
  const checkWorkoutAchievements = useCallback(() => {
    const completedWorkouts = workouts.filter(w => w.completed).length;
    
    if (completedWorkouts >= 1 && !achievements.firstWorkout) {
      setAchievements(prev => ({ ...prev, firstWorkout: true }));
      showAchievementNotification('Primeiro Treino Concluído!');
    }
    
    if (completedWorkouts >= 10 && !achievements.tenWorkouts) {
      setAchievements(prev => ({ ...prev, tenWorkouts: true }));
      showAchievementNotification('10 Treinos Concluídos!');
    }
    
    if (completedWorkouts >= 25 && !achievements.twentyFiveWorkouts) {
      setAchievements(prev => ({ ...prev, twentyFiveWorkouts: true }));
      showAchievementNotification('25 Treinos Concluídos!');
    }
    
    if (completedWorkouts >= 50 && !achievements.fiftyWorkouts) {
      setAchievements(prev => ({ ...prev, fiftyWorkouts: true }));
      showAchievementNotification('50 Treinos Concluídos!');
    }
    
    if (completedWorkouts >= 100 && !achievements.hundredWorkouts) {
      setAchievements(prev => ({ ...prev, hundredWorkouts: true }));
      showAchievementNotification('100 Treinos Concluídos!');
    }
  }, [workouts, achievements]);
  
  // Função para verificar conquistas relacionadas à sequência de treinos
  const checkStreakAchievements = useCallback(() => {
    const streak = calculateCurrentStreak();
    
    if (streak >= 3 && !achievements.threeConsecutiveDays) {
      setAchievements(prev => ({ ...prev, threeConsecutiveDays: true }));
      showAchievementNotification('3 Dias Consecutivos!');
    }
    
    if (streak >= 7 && !achievements.sevenConsecutiveDays) {
      setAchievements(prev => ({ ...prev, sevenConsecutiveDays: true }));
      showAchievementNotification('7 Dias Consecutivos!');
    }
    
    if (streak >= 14 && !achievements.fourteenConsecutiveDays) {
      setAchievements(prev => ({ ...prev, fourteenConsecutiveDays: true }));
      showAchievementNotification('14 Dias Consecutivos!');
    }
    
    if (streak >= 30 && !achievements.thirtyConsecutiveDays) {
      setAchievements(prev => ({ ...prev, thirtyConsecutiveDays: true }));
      showAchievementNotification('30 Dias Consecutivos!');
    }
  }, [achievements]);
  
  // Função para calcular a sequência atual de treinos
  const calculateCurrentStreak = useCallback(() => {
    const completedWorkouts = workouts
      .filter(w => w.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (completedWorkouts.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date(completedWorkouts[0].date);
    currentDate.setHours(0, 0, 0, 0);
    
    // Verificar se o treino mais recente foi hoje ou ontem
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (currentDate < yesterday) {
      // Se o último treino foi antes de ontem, a sequência foi quebrada
      return 0;
    }
    
    // Contar dias consecutivos
    for (let i = 1; i < completedWorkouts.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      const workoutDate = new Date(completedWorkouts[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      
      if (workoutDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    
    return streak;
  }, [workouts]);
  
  // Função para mostrar notificação de conquista (implementar integração com sistema de toast)
  const showAchievementNotification = (message) => {
    console.log(`Conquista desbloqueada: ${message}`);
    // Aqui você pode integrar com seu sistema de notificações/toast
  };
  
  // Função para obter o histórico de progressão de um exercício específico
  const getExerciseProgressHistory = useCallback((exerciseName) => {
    const history = [];
    
    workouts
      .filter(w => w.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(workout => {
        workout.exercises.forEach(exercise => {
          if (exercise.name === exerciseName) {
            // Encontrar o maior peso usado neste treino para este exercício
            const maxWeight = exercise.sets.reduce((max, set) => {
              return set.completed && set.weight > max ? set.weight : max;
            }, 0);
            
            if (maxWeight > 0) {
              history.push({
                date: workout.date,
                weight: maxWeight
              });
            }
          }
        });
      });
    
    return history;
  }, [workouts]);
  
  // Função para obter todos os exercícios únicos que o usuário já fez
  const getAllExercises = useCallback(() => {
    const exerciseSet = new Set();
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseSet.add(exercise.name);
      });
    });
    
    return Array.from(exerciseSet);
  }, [workouts]);
  
  return (
    <WorkoutContext.Provider value={{
      workouts,
      activeWorkout,
      personalRecords,
      achievements,
      addWorkout,
      startWorkout,
      completeSet,
      completeWorkout,
      cancelWorkout,
      getWeeklyWorkouts,
      getTotalTrainingMinutes,
      getExerciseProgressHistory,
      getAllExercises,
      calculateCurrentStreak
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Não precisamos mais deste componente, pois o useNavigate já está sendo usado corretamente no WorkoutProvider
// export const WorkoutProviderWithRouter = ({ children }) => {
//   return (
//     <WorkoutProvider>
//       {children}
//     </WorkoutProvider>
//   );
// };
