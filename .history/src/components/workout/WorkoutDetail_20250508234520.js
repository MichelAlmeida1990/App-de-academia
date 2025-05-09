import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const WorkoutDetail = ({ workoutId }) => {
  const { workouts, updateWorkoutProgress } = useWorkout();
  const [completedSets, setCompletedSets] = useState({});
  
  // Encontrar o treino pelo ID
  const workout = workouts.find(w => w.id === workoutId);
  
  if (!workout) {
    return <div className="p-4 text-center">Treino não encontrado</div>;
  }
  
  const handleSetComplete = (exerciseId, setIndex, completed) => {
    const key = `${exerciseId}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: completed
    }));
  };
  
  const handleSaveProgress = () => {
    // Calcular progresso para cada exercício
    const exerciseProgress = {};
    
    workout.exercises.forEach(exercise => {
      let completedCount = 0;
      
      for (let i = 0; i < exercise.sets; i++) {
        const key = `${exercise.id}-${i}`;
        if (completedSets[key]) {
          completedCount++;
        }
      }
      
      const progressPercentage = Math.round((completedCount / exercise.sets) * 100);
      exerciseProgress[exercise.id] = progressPercentage;
    });
    
    // Atualizar progresso no contexto
    updateWorkoutProgress(workoutId, exerciseProgress);
    
    // Feedback visual (pode ser melhorado com um toast/notification)
    alert('Progresso salvo com sucesso!');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{workout.name}</h2>
        <Badge variant="primary">{workout.level}</Badge>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">{workout.description}</p>
      
      <div className="space-y-4">
        {workout.exercises.map(exercise => (
          <Card key={exercise.id} className="overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-semibold">{exercise.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{exercise.description}</p>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm font-medium">Séries:</span>
                  <span className="ml-2">{exercise.sets}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Repetições:</span>
                  <span className="ml-2">{exercise.reps}</span>
                </div>
                {exercise.weight && (
                  <div>
                    <span className="text-sm font-medium">Peso:</span>
                    <span className="ml-2">{exercise.weight}</span>
                  </div>
                )}
                {exercise.rest && (
                  <div>
                    <span className="text-sm font-medium">Descanso:</span>
                    <span className="ml-2">{exercise.rest}s</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4">
              <h4 className="text-sm font-medium mb-2">Controle de séries:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: exercise.sets }).map((_, index) => {
                  const key = `${exercise.id}-${index}`;
                  const isCompleted = completedSets[key] || false;
                  
                  return (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => handleSetComplete(exercise.id, index, !isCompleted)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button variant="primary" onClick={handleSaveProgress}>
          Salvar Progresso
        </Button>
      </div>
    </div>
  );
};

export default WorkoutDetail;
