// src/components/workout/WeeklyWorkoutSchedule.js
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaDumbbell, FaPlay } from 'react-icons/fa';

const WeeklyWorkoutSchedule = () => {
  const { workouts, completedWorkouts, loading, startWorkout } = useWorkout();
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    // Gerar os dias da semana atual
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      
      days.push({
        name: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
        fullName: format(date, 'EEEE', { locale: ptBR }),
        date: date,
        dateString: date.toISOString().split('T')[0],
        isToday: i === currentDay
      });
    }
    
    setWeekDays(days);
  }, []);

  // Função para obter treinos de um dia específico
  const getWorkoutsForDay = (dateString) => {
    if (!workouts) return [];
    return workouts.filter(workout => workout.date === dateString);
  };

  // Verificar se um treino está completo
  const isWorkoutCompleted = (workoutId) => {
    return completedWorkouts && completedWorkouts[workoutId] === true;
  };

  const handleStartWorkout = (workoutId) => {
    startWorkout(workoutId);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Programação Semanal</h3>
        <div className="animate-pulse flex flex-col space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Programação Semanal</h3>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((day) => (
          <div 
            key={day.name}
            className={`text-xs font-medium ${day.isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}
          >
            {day.name}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day.dateString);
          const hasWorkout = dayWorkouts.length > 0;
          const allCompleted = hasWorkout && dayWorkouts.every(w => isWorkoutCompleted(w.id));
          
          return (
            <div 
              key={day.dateString}
              className={`
                h-8 text-center text-xs rounded-full flex items-center justify-center relative
                ${day.isToday ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}
                ${allCompleted ? 'border-2 border-green-500' : ''}
              `}
            >
              {day.date.getDate()}
              {hasWorkout && !allCompleted && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
              )}
              {allCompleted && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="space-y-3">
        {weekDays.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day.dateString);
          
          if (dayWorkouts.length === 0) return null;
          
          return (
            <div key={day.dateString} className="text-sm">
              <div className="font-medium mb-1">
                {day.fullName} ({day.date.getDate()}/{day.date.getMonth() + 1})
              </div>
              
              {dayWorkouts.map((workout) => {
                const isCompleted = isWorkoutCompleted(workout.id);
                const isPastWorkout = isPast(parseISO(day.dateString)) && !isToday(parseISO(day.dateString));
                
                return (
                  <div 
                    key={workout.id}
                    className={`
                      p-3 rounded border-l-4 mb-1
                      ${isCompleted 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{workout.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {workout.exercises.length} exercícios • {workout.duration} min
                        </div>
                      </div>
                      
                      {!isCompleted && !isPastWorkout && (
                        <button
                          onClick={() => handleStartWorkout(workout.id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                        >
                          <FaPlay size={12} />
                        </button>
                      )}
                      
                      {isCompleted && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          Concluído
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        
        {!weekDays.some(day => getWorkoutsForDay(day.dateString).length > 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6 flex flex-col items-center">
            <FaDumbbell className="text-3xl mb-2 opacity-30" />
            <p>Nenhum treino programado para esta semana</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyWorkoutSchedule;
