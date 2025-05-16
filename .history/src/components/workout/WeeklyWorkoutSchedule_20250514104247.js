import React from 'react';
import { useWorkout } from '../../context/WorkoutContext';

const WeeklyWorkoutSchedule = () => {
  const { workouts, completedWorkouts } = useWorkout();
  
  // Definição dos treinos por dia da semana
  const weeklySchedule = [
    { day: 'Segunda', muscles: 'Peito e Tríceps', id: 1, completed: false },
    { day: 'Terça', muscles: 'Costas e Bíceps', id: 2, completed: false },
    { day: 'Quarta', muscles: 'Pernas e Glúteos', id: 3, completed: true },
    { day: 'Quinta', muscles: 'Ombros e Bíceps', id: 4, completed: false },
    { day: 'Sexta', muscles: 'Pernas e Abdômen', id: 5, completed: true },
    { day: 'Sábado', muscles: 'Treino Completo', id: 6, completed: false },
    { day: 'Domingo', muscles: 'Descanso', id: 7, completed: false }
  ];
  
  // Atualizar o status de conclusão com base nos treinos concluídos
  const updatedSchedule = weeklySchedule.map(day => {
    if (completedWorkouts && completedWorkouts[day.id]) {
      return { ...day, completed: true };
    }
    return day;
  });
  
  // Obter o dia atual da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
  const today = new Date().getDay();
  // Converter para nosso formato (0 = Segunda, ..., 6 = Domingo)
  const adjustedToday = today === 0 ? 6 : today - 1;
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Programação Semanal</h3>
      
      <div className="space-y-3">
        {updatedSchedule.map((day, index) => (
          <div 
            key={day.day}
            className={`p-3 rounded-lg border ${
              index === adjustedToday 
                ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30' 
                : 'border-gray-200 dark:border-gray-700'
            } ${
              day.completed 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  index === adjustedToday 
                    ? 'bg-blue-500' 
                    : day.completed 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}></div>
                <span className="font-medium">{day.day}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{day.muscles}</span>
                {day.completed && (
                  <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWorkoutSchedule;
