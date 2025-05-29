// src/components/workout/WorkoutCard.js
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaPlay, FaCheck, FaClock, FaDumbbell, FaFire, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

// Função para determinar cor e gradiente com base no tipo de treino
const getWorkoutStyles = (type) => {
  const styles = {
    'Força': {
      gradient: 'from-purple-100 to-purple-50',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      textColor: 'text-purple-700',
      progressColor: 'bg-purple-500',
      icon: <FaDumbbell className="mr-2" />
    },
    'Cardio': {
      gradient: 'from-red-100 to-red-50',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      textColor: 'text-red-700',
      progressColor: 'bg-red-500',
      icon: <FaFire className="mr-2" />
    },
    'Flexibilidade': {
      gradient: 'from-green-100 to-green-50',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      textColor: 'text-green-700',
      progressColor: 'bg-green-500',
      icon: <FaFire className="mr-2" />
    },
    'HIIT': {
      gradient: 'from-orange-100 to-orange-50',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      textColor: 'text-orange-700',
      progressColor: 'bg-orange-500',
      icon: <FaFire className="mr-2" />
    },
    'default': {
      gradient: 'from-purple-100 to-purple-50',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      textColor: 'text-purple-700',
      progressColor: 'bg-purple-500',
      icon: <FaDumbbell className="mr-2" />
    }
  };
  
  return styles[type] || styles.default;
};

const WorkoutCard = ({ workout }) => {
  const navigate = useNavigate();
  
  const formattedDate = format(new Date(workout.date), "dd 'de' MMMM", { locale: ptBR });
  const workoutStyles = getWorkoutStyles(workout.type);
  
  const getTotalSets = () => {
    return workout.exercises?.reduce((total, exercise) => total + (exercise.sets?.length || 0), 0) || 0;
  };
  
  const getCompletedSets = () => {
    return workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.filter(set => set.completed).length || 0);
    }, 0) || 0;
  };
  
  const getProgress = () => {
    const totalSets = getTotalSets();
    const completedSets = getCompletedSets();
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };
  
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return '--';
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return `${minutes} min`;
  };
  
  const handleCardClick = () => {
    navigate(`/workout/${workout.id}`);
  };

  const handleStartWorkout = (e) => {
    e.stopPropagation();
    navigate(`/workout/${workout.id}/active`);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Cabeçalho do Card */}
      <div className={`p-4 ${workoutStyles.bgColor} border-b border-gray-200`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {workout.name}
          </h3>
          <span className={`text-sm font-medium ${workoutStyles.textColor} flex items-center`}>
            {workoutStyles.icon}
            {workout.type}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaCalendarAlt className="mr-1.5" />
          {formattedDate}
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <FaDumbbell className="mr-1.5" />
            {workout.exercises?.length || 0} exercícios
          </div>
          
          <div className="flex items-center text-sm font-medium text-gray-700">
            <FaClock className="mr-1.5" />
            {formatDuration(workout.duration)}
          </div>
        </div>
        
        {!workout.completed ? (
          <>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-600">
                Progresso
              </span>
              <span className={`font-medium ${workoutStyles.textColor}`}>
                {Math.round(getProgress())}%
              </span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`${workoutStyles.progressColor} h-2.5 rounded-full`}
              ></motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartWorkout}
              className={`w-full py-2.5 ${workoutStyles.bgColor} text-gray-800 rounded-lg ${workoutStyles.hoverColor} flex items-center justify-center font-medium shadow-sm transition-colors duration-200`}
            >
              <FaPlay className="mr-2" />
              Iniciar Treino
            </motion.button>
          </>
        ) : (
          <div className="flex items-center justify-center py-2 text-green-600">
            <FaCheck className="mr-2" />
            <span className="font-medium">Treino Concluído</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WorkoutCard;
