// src/components/workout/WorkoutList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaClock, 
  FaPlay, 
  FaCheck, 
  FaEllipsisH,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '../../context/ToastContext';

const WorkoutList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { 
    workouts, 
    loading, 
    error,
    addWorkout,
    deleteWorkout
  } = useContext(WorkoutContext);
  
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [workoutTypes, setWorkoutTypes] = useState([]);

  // Simulação de tipos de treino (substitua por dados reais)
  useEffect(() => {
    setWorkoutTypes([
      { id: 'fullbody', title: 'Treino Completo' },
      { id: 'upper', title: 'Parte Superior' },
      { id: 'lower', title: 'Parte Inferior' },
      { id: 'push', title: 'Empurrar' },
      { id: 'pull', title: 'Puxar' },
      { id: 'core', title: 'Core' }
    ]);

    // Identificar treinos completos
    const completed = {};
    workouts.forEach(workout => {
      if (workout.progress === 100 || workout.completedAt) {
        completed[workout.id] = true;
      }
    });
    setCompletedWorkouts(completed);
  }, [workouts]);

  const handleStartWorkout = (workoutId) => {
    navigate(`/workout/${workoutId}/active`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return 'Hoje';
      } else if (isTomorrow(date)) {
        return 'Amanhã';
      } else {
        return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const handleAddWorkout = () => {
    if (selectedWorkoutType) {
      const selectedType = workoutTypes.find(type => type.id === selectedWorkoutType);
      
      // Criar um novo treino baseado no tipo selecionado
      const newWorkout = {
        title: selectedType.title,
        date: selectedDate,
        duration: 45, // Valor padrão
        exercises: [],
        progress: 0
      };
      
      addWorkout(newWorkout)
        .then(workout => {
          showToast('Treino adicionado com sucesso!', 'success');
          navigate(`/workout/${workout.id}`);
        })
        .catch(err => {
          showToast('Erro ao adicionar treino', 'error');
        });
      
      setShowAddWorkout(false);
      setSelectedWorkoutType('');
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      deleteWorkout(workoutId)
        .then(() => {
          showToast('Treino excluído com sucesso!', 'success');
        })
        .catch(err => {
          showToast('Erro ao excluir treino', 'error');
        });
    }
    setShowActionMenu(null);
  };

  // Função para obter tipos de treino
  const getWorkoutTypes = () => workoutTypes;

  // Agrupar treinos por data
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    if (!workout.date) return acc;
    
    if (!acc[workout.date]) {
      acc[workout.date] = [];
    }
    acc[workout.date].push(workout);
    return acc;
  }, {});

  // Ordenar datas
  const sortedDates = Object.keys(groupedWorkouts).sort();

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Meus Treinos</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Meus Treinos</h2>
        <button 
          onClick={() => setShowAddWorkout(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
        >
          <FaPlus />
        </button>
      </div>

      {showAddWorkout && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Adicionar Treino</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Data</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tipo de Treino</label>
            <select 
              value={selectedWorkoutType}
              onChange={(e) => setSelectedWorkoutType(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Selecione um tipo</option>
              {getWorkoutTypes().map(type => (
                <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setShowAddWorkout(false)}
              className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300"
            >
              Cancelar
            </button>
            <button 
              onClick={handleAddWorkout}
              disabled={!selectedWorkoutType}
              className={`px-4 py-2 rounded text-white ${
                selectedWorkoutType ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {sortedDates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <FaDumbbell className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhum treino programado</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Adicione seu primeiro treino para começar
          </p>
          <button 
            onClick={() => setShowAddWorkout(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Adicionar Treino
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">{formatDate(date)}</h3>
                </div>
              </div>
              
              <div className="divide-y dark:divide-gray-700">
                {groupedWorkouts[date].map(workout => {
                  const isCompleted = completedWorkouts[workout.id];
                  const isPastWorkout = date && isPast(parseISO(date)) && !isToday(parseISO(date));
                  
                  return (
                    <div key={workout.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">{workout.title || workout.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FaClock className="mr-1" />
                          <span>{workout.duration || '45'} min</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {workout.exercises?.length || 0} exercícios
                        </p>
                        
                        {/* Barra de progresso */}
                        {(workout.progress > 0) && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progresso</span>
                              <span>{workout.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  workout.progress === 100 
                                    ? 'bg-green-500' 
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${workout.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center text-green-500">
                            <FaCheck className="mr-1" /> Concluído
                          </span>
                        ) : isPastWorkout ? (
                          <span className="inline-flex items-center text-red-500">
                            Não realizado
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStartWorkout(workout.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            <FaPlay className="mr-1" /> Iniciar
                          </button>
                        )}
                        
                        <div className="relative">
                          <button 
                            onClick={() => setShowActionMenu(showActionMenu === workout.id ? null : workout.id)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <FaEllipsisH />
                          </button>
                          
                          {showActionMenu === workout.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    navigate(`/workout/${workout.id}`);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                >
                                  <FaEye className="mr-2" /> Ver detalhes
                                </button>
                                <button
                                  onClick={() => {
                                    navigate(`/workout/${workout.id}/edit`);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                >
                                  <FaEdit className="mr-2" /> Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteWorkout(workout.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                >
                                  <FaTrash className="mr-2" /> Excluir
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
