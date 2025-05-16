// src/pages/DashboardPage.js
import React, { useContext, useState } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaCalendarAlt, FaFire } from 'react-icons/fa';
import AddWorkoutModal from '../components/workout/AddWorkoutModal';

const DashboardPage = () => {
  const { getWeeklyWorkouts, getTotalTrainingMinutes, startWorkout, workouts } = useContext(WorkoutContext);
  const { darkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Verificar se as funções existem antes de chamá-las
  const weeklyWorkouts = getWeeklyWorkouts ? getWeeklyWorkouts() : [];
  const totalMinutes = getTotalTrainingMinutes ? Math.round(getTotalTrainingMinutes()) : 0;
  
  // Encontrar o treino de hoje (se existir)
  const today = new Date().toISOString().split('T')[0];
  const todaysWorkout = weeklyWorkouts.find(workout => 
    workout.date.split('T')[0] === today && !workout.completed
  );
  
  const handleStartWorkout = (workoutId) => {
    if (startWorkout) {
      startWorkout(workoutId);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bem-vindo ao FitnessTracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg flex justify-between items-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white'}`}>
          <div>
            <p className="text-sm">Treinos esta semana</p>
            <p className="text-3xl font-bold">{weeklyWorkouts.length}</p>
          </div>
          <FaCalendarAlt className="text-3xl opacity-80" />
        </div>
        
        <div className={`p-4 rounded-lg flex justify-between items-center ${darkMode ? 'bg-green-600' : 'bg-green-500 text-white'}`}>
          <div>
            <p className="text-sm">Minutos treinados</p>
            <p className="text-3xl font-bold">{totalMinutes}</p>
          </div>
          <FaFire className="text-3xl opacity-80" />
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Treino de Hoje</h2>
        
        {todaysWorkout ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-medium">{todaysWorkout.name}</h3>
              <p className="text-sm text-gray-500">{todaysWorkout.exercises.length} exercícios</p>
            </div>
            
            <button
              onClick={() => handleStartWorkout(todaysWorkout.id)}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Iniciar Treino
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum treino programado para hoje.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Adicionar Treino
            </button>
          </div>
        )}
      </div>
      
      <AddWorkoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
