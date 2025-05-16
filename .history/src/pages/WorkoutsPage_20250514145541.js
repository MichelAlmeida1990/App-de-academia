// src/pages/WorkoutsPage.js
import React, { useState, useEffect } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import WorkoutCard from '../components/workout/WorkoutCard';
import AddWorkoutModal from '../components/workout/AddWorkoutModal';

const WorkoutsPage = () => {
  const { workouts } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [groupedWorkouts, setGroupedWorkouts] = useState({});
  
  useEffect(() => {
    const grouped = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(workout);
      return acc;
    }, {});
    
    // Sort dates in descending order
    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]))
    );
    
    setGroupedWorkouts(sortedGrouped);
  }, [workouts]);
  
  const filteredWorkouts = () => {
    if (filter === 'completed') {
      return Object.fromEntries(
        Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => [
          date,
          dateWorkouts.filter(w => w.completed)
        ]).filter(([_, dateWorkouts]) => dateWorkouts.length > 0)
      );
    } else if (filter === 'pending') {
      return Object.fromEntries(
        Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => [
          date,
          dateWorkouts.filter(w => !w.completed)
        ]).filter(([_, dateWorkouts]) => dateWorkouts.length > 0)
      );
    }
    return groupedWorkouts;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Treinos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FaPlus />
        </button>
      </div>
      
      <div className="flex overflow-x-auto space-x-2 py-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filter === 'pending'
              ? 'bg-blue-500 text-white'
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filter === 'completed'
              ? 'bg-blue-500 text-white'
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          Concluídos
        </button>
      </div>
      
      <div className="space-y-8">
        {Object.entries(filteredWorkouts()).map(([date, dateWorkouts]) => (
          dateWorkouts.length > 0 && (
            <div key={date} className="space-y-4">
              <div className="flex items-center">
                <FaCalendarAlt className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <h2 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatDate(date)}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dateWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            </div>
          )
        ))}
        
        {Object.keys(filteredWorkouts()).length === 0 && (
          <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-gray-500 mb-4">Nenhum treino encontrado.</p>
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

export default WorkoutsPage;
