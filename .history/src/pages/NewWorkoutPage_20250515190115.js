// src/pages/NewWorkoutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const { addWorkout } = useContext(WorkoutContext);
  
  const [workoutData, setWorkoutData] = useState({
    name: '',
    type: 'hipertrofia',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: 3,
    reps: 12,
    rest: 60
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExercise = () => {
    if (!currentExercise.name) return;
    
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...currentExercise }]
    }));
    
    setCurrentExercise({
      name: '',
      sets: 3,
      reps: 12,
      rest: 60
    });
  };

  const removeExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!workoutData.name) {
      alert('Por favor, dê um nome ao seu treino');
      return;
    }
    
    if (workoutData.exercises.length === 0) {
      alert('Adicione pelo menos um exercício ao treino');
      return;
    }
    
    const newWorkout = {
      ...workoutData,
      id: Date.now(), // ID temporário, normalmente seria gerado pelo backend
      created: new Date().toISOString()
    };
    
    addWorkout(newWorkout);
    navigate(`/workout/${newWorkout.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/workouts')}
          className="mr-4 text-blue-500 hover:text-blue-700"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Novo Treino</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Nome do Treino
          </label>
          <input
            type="text"
            name="name"
            value={workoutData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Ex: Treino A - Peito e Tríceps"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Tipo de Treino
            </label>
            <select
              name="type"
              value={workoutData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="hipertrofia">Hipertrofia</option>
              <option value="força">Força</option>
              <option value="resistência">Resistência</option>
              <option value="cardio">Cardio</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={workoutData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={workoutData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            rows="3"
            placeholder="Descrição opcional do treino"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Duração Estimada (minutos)
          </label>
          <input
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            min="1"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Exercícios</h2>
          
          {workoutData.exercises.length > 0 ? (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-2">Exercício</th>
                    <th className="text-center py-2">Séries</th>
                    <th className="text-center py-2">Repetições</th>
                    <th className="text-center py-2">Descanso</th>
                    <th className="text-center py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutData.exercises.map((exercise, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
                      <td className="py-3 font-medium">{exercise.name}</td>
                      <td className="py-3 text-center">{exercise.sets}</td>
                      <td className="py-3 text-center">{exercise.reps}</td>
                      <td className="py-3 text-center">{exercise.rest}s</td>
                      <td className="py-3 text-center">
                        <button 
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">Nenhum exercício adicionado</p>
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Adicionar Exercício</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Nome do Exercício</label>
                <input
                  type="text"
                  name="name"
                  value={currentExercise.name}
                  onChange={handleExerciseChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Ex: Supino Reto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Séries</label>
                <input
                  type="number"
                  name="sets"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Repetições</label>
                <input
                  type="number"
                  name="reps"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  min="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Descanso (segundos)</label>
                <input
                  type="number"
                  name="rest"
                  value={currentExercise.rest}
                  onChange={handleExerciseChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  min="0"
                  step="5"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addExercise}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                  disabled={!currentExercise.name}
                >
                  Adicionar Exercício
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg flex items-center transition"
          >
            <FiSave className="mr-2" />
            Salvar Treino
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWorkoutPage;
