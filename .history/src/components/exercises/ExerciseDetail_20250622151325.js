// src/components/exercises/ExerciseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaShare, FaArrowLeft, FaExclamationTriangle, FaPlay, FaPause, FaDumbbell, FaInfoCircle } from 'react-icons/fa';
import Card from '../common/Card';
import ExerciseVisual from './ExerciseVisual';

// Componente de Vídeo/GIF do Exercício
const ExerciseVideo = ({ gifUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
            <div className="text-center text-white p-4">
              <FaDumbbell className="text-6xl mb-4 mx-auto opacity-80" />
              <p className="text-xl font-bold mb-2">Vídeo Indisponível</p>
              <p className="text-sm opacity-90">Demonstração não disponível</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={gifUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            
            {/* Controles de reprodução simulados */}
            <div className="absolute bottom-4 left-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-black bg-opacity-60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-80 transition-all"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

// Componente de Instruções do Exercício
const ExerciseInstructions = ({ instructions = [], tips = [], level }) => {
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-white';
      case 'expert':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLevelText = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'expert':
        return 'Avançado';
      default:
        return 'Nível não definido';
    }
  };

  return (
    <Card>
      <div className="p-6">
        {/* Nível */}
        {level && (
          <div className="mb-6">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getLevelColor(level)}`}>
              {getLevelText(level)}
            </span>
          </div>
        )}

        {/* Instruções */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <FaInfoCircle className="mr-2 text-purple-500" />
            Como Executar
          </h3>
          <ol className="space-y-3">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-300">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Dicas */}
        {tips && tips.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <FaDumbbell className="mr-2 text-purple-500" />
              Dicas Importantes
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

// Componente do Header
const ExerciseHeader = ({ exercise, isSaved, onSave, onShare }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-400 mb-4 hover:text-purple-300 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold text-white mb-2 md:mb-0">
          {exercise.name}
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={onSave}
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${
              isSaved
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
            }`}
          >
            <FaBookmark className="mr-2" />
            {isSaved ? 'Salvo' : 'Salvar'}
          </button>

          <button
            onClick={onShare}
            className="flex items-center px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white transition-all"
          >
            <FaShare className="mr-2" />
            Compartilhar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {exercise.bodyPart && (
          <span className="px-3 py-1 text-sm rounded-full bg-purple-900 text-purple-100">
            {exercise.bodyPart}
          </span>
        )}
        {exercise.target && (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-900 text-blue-100">
            {exercise.target}
          </span>
        )}
        {exercise.equipment && (
          <span className="px-3 py-1 text-sm rounded-full bg-green-900 text-green-100">
            {exercise.equipment}
          </span>
        )}
      </div>
    </div>
  );
};

// Componente Principal
const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular carregamento de dados do exercício
    const loadExercise = async () => {
      try {
        setLoading(true);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados mockados do exercício
        const mockExercise = {
          id: id,
          name: `Exercício ${id}`,
          bodyPart: 'Peito',
          target: 'Peitoral maior',
          equipment: 'Halteres',
          level: 'intermediate',
          gifUrl: `https://via.placeholder.com/400x300/6366f1/ffffff?text=Exercício+${id}`,
          instructions: [
            "Posicione-se corretamente conforme mostrado no vídeo.",
            "Mantenha a forma adequada durante todo o movimento.",
            "Respire de forma controlada durante o exercício.",
            "Execute o movimento completo com controle.",
            "Mantenha o core contraído durante todo o exercício."
          ],
          tips: [
            "Mantenha os ombros estabilizados",
            "Não use peso excessivo",
            "Foque na contração muscular",
            "Mantenha o movimento controlado"
          ],
          secondaryMuscles: ['Tríceps', 'Deltoides anterior', 'Core']
        };
        
        setExercise(mockExercise);
      } catch (err) {
        setError('Erro ao carregar o exercício');
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Implementar lógica de salvamento
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: exercise.name,
          text: `Confira este exercício: ${exercise.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando exercício...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Exercício não encontrado</h2>
          <p className="text-gray-400 mb-4">O exercício que você está procurando não foi encontrado.</p>
          <button
            onClick={() => navigate('/exercises')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ver todos os exercícios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ExerciseHeader
          exercise={exercise}
          isSaved={isSaved}
          onSave={handleSave}
          onShare={handleShare}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ExerciseVideo
              gifUrl={exercise.gifUrl}
              title={exercise.name}
            />
          </div>

          <div>
            <ExerciseInstructions
              instructions={exercise.instructions}
              tips={exercise.tips}
              level={exercise.level}
            />
          </div>
        </div>

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div className="mt-8">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Músculos Secundários
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map((muscle, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;
