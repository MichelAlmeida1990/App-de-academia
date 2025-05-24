// src/components/exercises/ExerciseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaShare, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { useExercise } from '../../context/ExerciseContext';
import ExerciseVideo from './ExerciseVideo';

const ExerciseHeader = ({ exercise, isSaved, onSave, onShare }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 dark:text-blue-400 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-1" /> Voltar
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
          {exercise.name}
        </h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={onSave}
            className={`flex items-center px-3 py-1 rounded-md ${
              isSaved 
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <FaBookmark className="mr-1" />
            {isSaved ? 'Salvo' : 'Salvar'}
          </button>
          
          <button 
            onClick={onShare}
            className="flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <FaShare className="mr-1" />
            Compartilhar
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
          {exercise.bodyPart}
        </span>
        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          {exercise.target}
        </span>
        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          {exercise.equipment}
        </span>
      </div>
    </div>
  );
};

const ExerciseInstructions = ({ instructions }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Como Fazer
      </h2>
      
      <ol className="list-decimal pl-5 space-y-3">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {instruction}
          </li>
        ))}
      </ol>
    </div>
  );
};

const MuscleHighlight = ({ primaryMuscle, secondaryMuscles }) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Músculos Trabalhados
      </h2>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
          Músculo Principal:
        </h3>
        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          {primaryMuscle}
        </span>
      </div>
      
      {secondaryMuscles && secondaryMuscles.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
            Músculos Secundários:
          </h3>
          <div className="flex flex-wrap gap-2">
            {secondaryMuscles.map((muscle, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SimilarExercises = ({ targetExercises, equipmentExercises }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Exercícios Similares
      </h2>
      
      {targetExercises && targetExercises.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">
            Mesmo Músculo Alvo
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {targetExercises.map((ex) => (
              <div 
                key={ex.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/exercise/${ex.id}`)}
              >
                <img 
                  src={ex.gifUrl || 'https://via.placeholder.com/300x200?text=Exercise'} 
                  alt={ex.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <p className="font-medium text-gray-800 dark:text-white line-clamp-1">
                    {ex.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ex.equipment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {equipmentExercises && equipmentExercises.length > 0 && (
        <div>
          <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">
            Mesmo Equipamento
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {equipmentExercises.map((ex) => (
              <div 
                key={ex.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/exercise/${ex.id}`)}
              >
                <img 
                  src={ex.gifUrl || 'https://via.placeholder.com/300x200?text=Exercise'} 
                  alt={ex.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <p className="font-medium text-gray-800 dark:text-white line-clamp-1">
                    {ex.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ex.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExerciseDetail = ({ id: propId }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  
  const { exercises, savedExercises, toggleSavedExercise, addRecentlyViewed } = useExercise();
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarTargetExercises, setSimilarTargetExercises] = useState([]);
  const [similarEquipmentExercises, setSimilarEquipmentExercises] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  
  useEffect(() => {
    const fetchExerciseDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulando um atraso de carregamento para demonstrar os estados de loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Encontrar o exercício pelo ID
        const foundExercise = exercises.find(ex => ex.id === id);
        
        if (!foundExercise) {
          throw new Error('Exercício não encontrado');
        }
        
        setExercise(foundExercise);
        
        // Adicionar aos visualizados recentemente
        addRecentlyViewed(foundExercise.id);
        
        // Encontrar exercícios similares
        const targetMuscleExercises = exercises
          .filter(ex => ex.target === foundExercise.target && ex.id !== id)
          .slice(0, 4);
          
        const equipmentExercises = exercises
          .filter(ex => ex.equipment === foundExercise.equipment && ex.id !== id)
          .slice(0, 4);
          
        setSimilarTargetExercises(targetMuscleExercises);
        setSimilarEquipmentExercises(equipmentExercises);
        
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar detalhes do exercício:', err);
      } finally {
        // Simulando carregamento completo após 1 segundo
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    
    fetchExerciseDetails();
  }, [id, exercises, addRecentlyViewed]);
  
  const handleSaveExercise = () => {
    if (exercise) {
      toggleSavedExercise(exercise.id);
    }
  };
  
  const handleShareExercise = () => {
    setShowShareModal(true);
    
    // Implementação real compartilharia via API Web Share se disponível
    if (navigator.share) {
      navigator.share({
        title: `Exercício: ${exercise.name}`,
        text: `Confira este exercício: ${exercise.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Compartilhado com sucesso'))
      .catch((error) => console.log('Erro ao compartilhar', error));
    }
  };
  
 // src/components/exercises/ExerciseDetail.js (continuação)
 if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
            Erro ao carregar exercício
          </h2>
          <p className="text-red-600 dark:text-red-200 mb-4">
            {error}
          </p>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      {isLoading ? (
        // Esqueleto de carregamento
        <div>
          <div className="h-36 bg-gray-200 dark:bg-gray-700 animate-pulse mb-6 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse mb-6 rounded-lg"></div>
          <div className="h-72 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
      ) : (
        exercise && (
          <>
            <ExerciseHeader 
              exercise={exercise}
              isSaved={savedExercises.includes(exercise.id)}
              onSave={handleSaveExercise}
              onShare={handleShareExercise}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ExerciseVideo 
                videoUrl={exercise.videoUrl || `https://www.youtube.com/embed/search?q=${encodeURIComponent(exercise.name + ' exercise')}`}
                title={exercise.name}
              />
              
              <div>
                <ExerciseInstructions 
                  instructions={exercise.instructions || [
                    "Posicione-se corretamente conforme mostrado no vídeo.",
                    "Mantenha a forma adequada durante todo o movimento.",
                    "Respire de forma controlada durante o exercício.",
                    "Execute o movimento completo com controle."
                  ]}
                />
                
                <MuscleHighlight 
                  primaryMuscle={exercise.target}
                  secondaryMuscles={exercise.secondaryMuscles || []}
                />
              </div>
            </div>
            
            <SimilarExercises 
              targetExercises={similarTargetExercises}
              equipmentExercises={similarEquipmentExercises}
            />
            
            {/* Modal de compartilhamento */}
            {showShareModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    Compartilhar Exercício
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Compartilhe este exercício com seus amigos:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4 overflow-x-auto">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      {window.location.href}
                    </code>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copiado!");
                        setShowShareModal(false);
                      }}
                    >
                      Copiar Link
                    </button>
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => setShowShareModal(false)}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default ExerciseDetail;

