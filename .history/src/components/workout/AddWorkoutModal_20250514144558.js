// src/components/workout/AddWorkoutModal.js
import React, { useState, useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import { workoutTemplates } from '../../data/workoutData';
import { ThemeContext } from '../../context/ThemeContext';

const AddWorkoutModal = ({ isOpen, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { addWorkout } = useContext(WorkoutContext);
  const { darkMode } = useContext(ThemeContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) return;
    
    const template = workoutTemplates.find(t => t.id === selectedTemplate);
    
    if (template) {
      addWorkout({
        id: Date.now().toString(),
        name: template.name,
        date: new Date().toISOString(),
        exercises: template.exercises.map(ex => ({
          ...ex,
          completed: false,
          sets: Array(ex.sets).fill().map(() => ({ weight: 0, reps: 0, completed: false }))
        })),
        completed: false
      });
      
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Adicionar Treino</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Selecione um treino:</label>
            <select 
              className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              required
            >
              <option value="">Selecione um treino</option>
              {workoutTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
