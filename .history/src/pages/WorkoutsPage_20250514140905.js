// src/pages/WorkoutsPage.js
import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutCard from '../components/workout/WorkoutCard';
import { FaFilter, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WorkoutsPage = () => {
  const { workouts, completedWorkouts, getWorkoutTypes, selectWorkoutForDay, loading } = useWorkout();
  const [filter, setFilter] = useState('all');
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const workoutTypes = getWorkoutTypes();
  
  const filteredWorkouts = filter === 'all' 
    ? workouts 
    : filter === 'completed' 
      ? workouts.filter(workout => completedWorkouts[workout.id]) 
      : workouts.filter(workout => !completedWorkouts[workout.id]);
  
  const handleAddWorkout = (typeId) => {
    selectWorkoutForDay(selectedDate, typeId);
    setShowAddWorkout(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Treinos</h1>
        <button 
          onClick={() => setShowAddWorkout(true)}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          <FaPlus />
        </button>
      </div>
      
      {/* Filtros */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Todos
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === 'pending' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Pendentes
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            filter === 'completed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Completados
        </button>
      </div>
      
      {/* Lista de treinos */}
      <div className="space-y-4">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              isCompleted={completedWorkouts[workout.id]} 
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum treino encontrado com os filtros atuais.
            </p>
          </div>
        )}
      </div>
      
      {/* Modal para adicionar treino */}
      {showAddWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Adicionar Novo Treino</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Data</label>
              <div className="flex items-center border rounded-lg overflow-hidden dark:border-gray-600">
                <div className="p-2 bg-gray-100 dark:bg-gray-700">
                  <FaCalendarAlt />
                </div>
                <input 
                  type="date" 
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="flex-1 p-2 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tipo de Treino</label>
              <div className="space-y-2">
                {workoutTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleAddWorkout(type.id)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAddWorkout(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
