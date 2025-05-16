// src/components/workout/WorkoutList.js
import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaClock, 
  FaPlay, 
  FaCheck, 
  FaEllipsisH,
  FaPlus
} from 'react-icons/fa';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WorkoutList = () => {
  const { 
    workouts, 
    completedWorkouts, 
    startWorkout, 
    getWorkoutTypes, 
    selectWorkoutForDay,
    loading 
  } = useWorkout();
  
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');

  const handleStartWorkout = (workoutId) => {
    startWorkout(workoutId);
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Hoje';
    } else if (isTomorrow(date)) {
      return 'Amanhã';
    } else {
      return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
    }
  };

  const handleAddWorkout = () => {
    if (selectedWorkoutType) {
      selectWorkoutForDay(selectedDate, selectedWorkoutType);
      setShowAddWorkout(false);
      setSelectedWorkoutType('');
    }
  };

  // Agrupar treinos por data
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    if (!acc[workout.date]) {
      acc[workout.date] = [];
    }
    acc[workout.date].push(workout);
    return acc;
  }, {});

  // Ordenar datas
  const sortedDates = Object.keys(groupedWorkouts).sort();

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Meus Treinos</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Meus Treinos</h2>
        <button 
          onClick={() => setShowAddWorkout(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
        >
          <FaPlus />
        </button>
      </div>

      {showAddWorkout && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Adicionar Treino</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Data</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tipo de Treino</label>
            <select 
              value={selectedWorkoutType}
              onChange={(e) => setSelectedWorkoutType(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Selecione um tipo</option>
              {getWorkoutTypes().map(type => (
                <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setShowAddWorkout(false)}
              className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300"
            >
              Cancelar
            </button>
            <button 
              onClick={handleAddWorkout}
              disabled={!selectedWorkoutType}
              className={`px-4 py-2 rounded text-white ${
                selectedWorkoutType ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {sortedDates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <FaDumbbell className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhum treino programado</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Adicione seu primeiro treino para começar
          </p>
          <button 
            onClick={() => setShowAddWorkout(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Adicionar Treino
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">{formatDate(date)}</h3>
                </div>
              </div>
              
              <div className="divide-y dark:divide-gray-700">
                {groupedWorkouts[date].map(workout => {
                  const isCompleted = completedWorkouts[workout.id];
                  const isPastWorkout = isPast(parseISO(date)) && !isToday(parseISO(date));
                  
                  return (
                    <div key={workout.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">{workout.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FaClock className="mr-1" />
                          <span>{workout.duration} min</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {workout.exercises.length} exercícios
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center text-green-500">
                            <FaCheck className="mr-1" /> Concluído
                          </span>
                        ) : isPastWorkout ? (
                          <span className="inline-flex items-center text-red-500">
                            Não realizado
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStartWorkout(workout.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            <FaPlay className="mr-1" /> Iniciar
                          </button>
                        )}
                        
                        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
