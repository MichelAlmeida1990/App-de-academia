// src/pages/ExerciseDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaDumbbell, 
  FaPlay, 
  FaClock, 
  FaFire, 
  FaUser,
  FaExclamationTriangle,
  FaLightbulb,
  FaListOl,
  FaHeart,
  FaShare
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useExercise } from '../context/ExerciseContext';
import { useToast } from '../context/ToastContext';
import ExerciseVideo from '../components/exercises/ExerciseVideo';
import ExerciseInstructions from '../components/exercises/ExerciseInstructions';
import ExerciseTips from '../components/exercises/ExerciseTips';
import Badge from '../components/ui/Badge';
import logger from '../utils/logger';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExerciseById, getSimilarExercises } = useExercise();
  const { addToast } = useToast();

  const [exercise, setExercise] = useState(null);
  const [similarExercises, setSimilarExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar exercício principal
        const exerciseData = await getExerciseById(id);
        if (!exerciseData) {
          setError('Exercício não encontrado');
          return;
        }

        setExercise(exerciseData);

        // Carregar exercícios similares
        const similar = await getSimilarExercises(id);
        setSimilarExercises(similar.slice(0, 4)); // Limitar a 4 exercícios

        // Verificar se é favorito (localStorage)
        const favorites = JSON.parse(localStorage.getItem('favoriteExercises') || '[]');
        setIsFavorite(favorites.includes(id));

      } catch (err) {
        logger.error('Erro ao carregar exercício:', err);
        setError('Erro ao carregar exercício');
        addToast('Erro ao carregar exercício', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadExercise();
    }
  }, [id, getExerciseById, getSimilarExercises, addToast]);

  const handleFavoriteToggle = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteExercises') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav !== id);
      localStorage.setItem('favoriteExercises', JSON.stringify(newFavorites));
      setIsFavorite(false);
      addToast('Removido dos favoritos', 'info');
    } else {
      const newFavorites = [...favorites, id];
      localStorage.setItem('favoriteExercises', JSON.stringify(newFavorites));
      setIsFavorite(true);
      addToast('Adicionado aos favoritos', 'success');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: exercise.name,
        text: `Confira este exercício: ${exercise.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copiado para a área de transferência', 'success');
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
      case 'iniciante':
        return 'success';
      case 'intermediate':
      case 'intermediário':
        return 'warning';
      case 'advanced':
      case 'avançado':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getLevelText = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return level || 'Não especificado';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-8 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mb-4"
            />
            <p className="text-gray-700 font-medium">Carregando exercício...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border border-red-200 rounded-xl p-8 shadow-lg text-center"
        >
          <FaExclamationTriangle className="text-5xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exercício não encontrado</h2>
          <p className="text-gray-600 mb-6">{error || 'O exercício solicitado não existe.'}</p>
          <button
            onClick={() => navigate('/exercises')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Ver todos os exercícios
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Voltar
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleFavoriteToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isFavorite
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaHeart className={isFavorite ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              <FaShare />
            </button>
          </div>
        </motion.div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Coluna esquerda - Vídeo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-6 shadow-lg">
              <ExerciseVideo exercise={exercise} showControls={true} />
            </div>
          </motion.div>

          {/* Coluna direita - Informações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Título e badges */}
            <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{exercise.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="primary">{exercise.bodyPart}</Badge>
                <Badge variant="info">{exercise.target}</Badge>
                <Badge variant={getLevelColor(exercise.level)}>
                  {getLevelText(exercise.level)}
                </Badge>
                {exercise.equipment && (
                  <Badge variant="default">{exercise.equipment}</Badge>
                )}
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4">
                {exercise.duration && (
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-purple-600" />
                    <span className="text-sm">{exercise.duration}</span>
                  </div>
                )}
                
                {exercise.calories && (
                  <div className="flex items-center text-gray-600">
                    <FaFire className="mr-2 text-orange-500" />
                    <span className="text-sm">{exercise.calories} cal</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2 text-green-500" />
                  <span className="text-sm">{getLevelText(exercise.level)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaDumbbell className="mr-2 text-purple-600" />
                  <span className="text-sm">{exercise.equipment || 'Peso corporal'}</span>
                </div>
              </div>
            </div>

            {/* Músculos secundários */}
            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Músculos Secundários</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map((muscle, index) => (
                    <Badge key={index} variant="default" size="small">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Instruções e Dicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Instruções */}
          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <FaListOl className="text-2xl text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Como Executar</h2>
            </div>
            <ExerciseInstructions 
              instructions={exercise.instructions} 
              tips={exercise.tips}
              level={exercise.level}
            />
          </div>

          {/* Dicas */}
          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-2xl text-yellow-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Dicas Importantes</h2>
            </div>
            <ExerciseTips tips={exercise.tips} />
          </div>
        </motion.div>

        {/* Exercícios Similares */}
        {similarExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Exercícios Similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarExercises.map((similarExercise) => (
                <motion.div
                  key={similarExercise.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200"
                  onClick={() => navigate(`/exercise/${similarExercise.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-3 flex items-center justify-center">
                    <FaDumbbell className="text-2xl text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
                    {similarExercise.name}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{similarExercise.bodyPart}</span>
                    <Badge variant="default" size="small">
                      {getLevelText(similarExercise.level)}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
