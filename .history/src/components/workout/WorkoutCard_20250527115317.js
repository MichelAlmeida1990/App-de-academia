// src/components/workout/WorkoutCard.js
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaPlay, FaCheck, FaClock, FaDumbbell, FaFire, FaCalendarAlt } from 'react-icons/fa';
import { useWorkout } from '../../hooks/useWorkout';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Função para determinar cor e gradiente com base no tipo de treino
const getWorkoutStyles = (type) => {
  const styles = {
    'Força': {
      gradient: 'from-blue-500 to-blue-700',
      color: 'blue',
      icon: <FaDumbbell className="mr-2" />
    },
    'Cardio': {
      gradient: 'from-red-500 to-red-700',
      color: 'red',
      icon: <FaFire className="mr-2" />
    },
    'Flexibilidade': {
      gradient: 'from-green-500 to-green-700',
      color: 'green',
      icon: <FaFire className="mr-2" />
    },
    'HIIT': {
      gradient: 'from-orange-500 to-orange-700',
      color: 'orange',
      icon: <FaFire className="mr-2" />
    },
    'default': {
      gradient: 'from-blue-500 to-blue-700',
      color: 'blue',
      icon: <FaDumbbell className="mr-2" />
    }
  };
  
  return styles[type] || styles.default;
};

const WorkoutCard = ({ workout }) => {
  const { startWorkout } = useWorkout();
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const formattedDate = format(new Date(workout.date), "dd 'de' MMMM", { locale: ptBR });
  const workoutStyles = getWorkoutStyles(workout.type);
  
  const getTotalSets = () => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };
  
  const getCompletedSets = () => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(set => set.completed).length;
    }, 0);
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
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg transition-all cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className={`bg-gradient-to-r ${workout.completed ? 'from-green-500 to-green-700' : workoutStyles.gradient} text-white p-5`}>
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-1 bg-white bg-opacity-20 rounded-md text-xs font-medium">
            {workout.type || 'Treino'}
          </span>
          {workout.completed && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white bg-opacity-20 p-1 rounded-full"
            >
              <FaCheck />
            </motion.div>
          )}
        </div>
        
        <h3 className="font-bold text-xl mb-1">{workout.name}</h3>
        
        <div className="flex items-center text-sm opacity-90">
          <FaCalendarAlt className="mr-1.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between mb-3">
          <div className="flex items-center text-sm font-medium">
            {workoutStyles.icon}
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {workout.exercises.length} exercícios
            </span>
          </div>
          
          <div className="flex items-center text-sm font-medium">
            <FaClock className="mr-1.5 text-gray-500" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {formatDuration(workout.duration)}
            </span>
          </div>
        </div>
        
        {!workout.completed ? (
          <>
            <div className="flex justify-between text-xs mb-1">
              <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Progresso
              </span>
              <span className={`font-medium text-${workoutStyles.color}-500`}>
                {Math.round(getProgress())}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`bg-${workoutStyles.color}-500 h-2.5 rounded-full`}
              ></motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                startWorkout(workout.id);
              }}
              className={`w-full py-2.5 bg-${workoutStyles.color}-500 text-white rounded-lg hover:bg-${workoutStyles.color}-600 flex items-center justify-center font-medium shadow-sm`}
            >
              <FaPlay className="mr-2" />
              Iniciar Treino
            </motion.button>
          </>
        ) : (
          <div className="mt-1">
            <div className="flex items-center justify-center py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
              <FaCheck className="mr-2" />
              <span className="font-medium">Treino concluído</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WorkoutCard;
