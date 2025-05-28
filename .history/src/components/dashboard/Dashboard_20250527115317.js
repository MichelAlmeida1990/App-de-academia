// src/pages/EditWorkoutPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutForm from '../components/workout/WorkoutForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BackButton from '../components/ui/BackButton';

const EditWorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workouts, updateWorkout, loading } = useWorkout();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workouts.length > 0) {
      const foundWorkout = workouts.find(w => w.id === id);
      if (foundWorkout) {
        setWorkout(foundWorkout);
      } else {
        setError('Treino não encontrado');
      }
    }
  }, [id, workouts]);

  const handleSubmit = async (updatedWorkout) => {
    try {
      await updateWorkout(id, updatedWorkout);
      navigate(`/workouts/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      setError('Não foi possível atualizar o treino. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
          <p>Carregando treino...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Editar Treino</h1>
      <WorkoutForm 
        initialData={workout} 
        onSubmit={handleSubmit} 
        isEditing={true} 
      />
    </div>
  );
};

export default EditWorkoutPage;
