// src/components/workout/WorkoutDetail.js
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../../hooks/useWorkout';
import { FaArrowLeft, FaPlay, FaEdit, FaTrash, FaDumbbell, FaCalendarAlt, FaClock, FaCheck, FaChartLine } from 'react-icons/fa';

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const { workout, loading, error, removeWorkout } = useWorkout(workoutId);
  const navigate = useNavigate();

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <p className="text-gray-700 font-medium">Carregando treino...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md border border-red-200 rounded-xl p-8 shadow-lg max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="text-2xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/workouts')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
          >
            Voltar aos Treinos
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-8 shadow-lg max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaDumbbell className="text-2xl text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Treino não encontrado</h3>
          <p className="text-gray-600 mb-6">O treino que você está procurando não existe ou foi removido.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/workouts')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
          >
            Voltar aos Treinos
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      const success = await removeWorkout();
      if (success) {
        navigate('/workouts');
      }
    }
  };

  const handleStartWorkout = () => {
    navigate(`/workouts/${workoutId}/active`);
  };

  // Calcular progresso se existir
  const progressPercentage = workout.progress || 0;
  const hasProgress = progressPercentage > 0;
  const isCompleted = progressPercentage === 100 || workout.completedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/workouts')}
            className="mr-4 p-2 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-100 transition-colors"
          >
            <FaArrowLeft size={24} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{workout.name}</h1>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <FaClock className="mr-1.5" />
              <span>{workout.duration || '45'} min</span>
              <span className="mx-2">•</span>
              <span>{workout.exercises?.length || 0} exercícios</span>
            </div>
          </div>
        </motion.div>

        {/* Barra de progresso (se houver progresso) */}
        <AnimatePresence>
          {hasProgress && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg p-6 overflow-hidden"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FaChartLine className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Progresso do Treino</h3>
                  <p className="text-sm text-gray-600">
                    {isCompleted ? 'Treino concluído!' : `${progressPercentage}% concluído`}
                  </p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Progresso</span>
                  <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-purple-600'}`}>
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-3 rounded-full ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : 'bg-gradient-to-r from-purple-400 to-purple-500'
                    }`}
                  />
                </div>
              </div>
              
              {workout.completedAt && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 rounded-lg p-3">
                  <FaCheck className="mr-2" />
                  <span>Concluído em: {new Date(workout.completedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informações do treino */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Treino</h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Descrição:</label>
              <p className="text-gray-600 mt-1">
                {workout.description || 'Sem descrição disponível'}
              </p>
            </div>
            
            {workout.date && (
              <div className="flex items-center">
                <FaCalendarAlt className="text-purple-500 mr-2" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Data programada:</label>
                  <p className="text-gray-600">
                    {new Date(workout.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
            
            {workout.category && (
              <div>
                <label className="text-sm font-medium text-gray-700">Categoria:</label>
                <span className="ml-2 inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                  {workout.category}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lista de exercícios */}
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaDumbbell className="mr-2 text-purple-600" />
            Exercícios ({workout.exercises?.length || 0})
          </h2>
          
          <div className="space-y-3">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    exercise.completed 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : 'bg-purple-50 border-purple-100 hover:border-purple-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        exercise.completed ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <FaDumbbell className={`text-sm ${
                          exercise.completed ? 'text-green-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {exercise.sets && exercise.sets.length > 0 
                            ? `${exercise.sets.length} séries • ${exercise.reps || 'N/A'} repetições` 
                            : 'Detalhes não disponíveis'}
                        </div>
                      </div>
                    </div>
                    
                    {exercise.completed && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        <FaCheck className="mr-1" />
                        Concluído
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaDumbbell className="text-2xl text-purple-500" />
                </div>
                <p className="text-gray-600">Nenhum exercício adicionado ainda</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Botões de ação */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartWorkout}
            className="col-span-1 md:col-span-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold flex items-center justify-center shadow-lg transition-all duration-300"
          >
            <FaPlay className="mr-2" /> 
            {hasProgress ? 'Continuar Treino' : 'Iniciar Treino'}
          </motion.button>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/workouts/${workoutId}/edit`)}
              className="bg-white/80 backdrop-blur-md border border-purple-200 hover:border-purple-300 text-purple-600 hover:text-purple-700 py-4 rounded-xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaEdit />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="bg-white/80 backdrop-blur-md border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 py-4 rounded-xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaTrash />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkoutDetail;
