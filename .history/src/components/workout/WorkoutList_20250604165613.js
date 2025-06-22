// src/components/workout/WorkoutList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaTrash,
  FaTimes,
  FaFilter,
  FaSearch,
  FaFire,
  FaRegCalendarAlt,
  FaChartLine
} from 'react-icons/fa';
import { format, parseISO, isToday, isTomorrow, isPast, isThisWeek, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '../../context/ToastContext';
import { useClickAway } from 'react-use';
import WorkoutCard from './WorkoutCard';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'today', 'week', 'completed', 'pending'
  const [showFilters, setShowFilters] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({ 
    completed: 0, 
    pending: 0, 
    total: 0,
    thisWeek: 0,
    streak: 0,
    averageDuration: 0
  });
  
  const actionMenuRef = useRef(null);
  const filterMenuRef = useRef(null);
  const addFormRef = useRef(null);
  
  // Fechar menus quando clicar fora
  useClickAway(actionMenuRef, () => {
    setShowActionMenu(null);
  });
  
  useClickAway(filterMenuRef, () => {
    if (showFilters) setShowFilters(false);
  });
  
  useClickAway(addFormRef, (e) => {
    // Verificar se o clique não foi no botão de adicionar
    const addButton = document.getElementById('add-workout-button');
    if (showAddWorkout && !addButton?.contains(e.target)) {
      setShowAddWorkout(false);
    }
  });

  // Tipos de treino com tema roxo unificado
  useEffect(() => {
    setWorkoutTypes([
      { 
        id: 'hipertrofia', 
        title: 'Hipertrofia',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'forca', 
        title: 'Força',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'resistencia', 
        title: 'Resistência',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'cardio', 
        title: 'Cardio',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'funcional', 
        title: 'Funcional',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'personalizado', 
        title: 'Personalizado',
        icon: <FaDumbbell />,
        color: 'purple'
      }
    ]);

    // Identificar treinos completos e calcular estatísticas
    const completed = {};
    let completedCount = 0;
    let pendingCount = 0;
    let thisWeekCount = 0;
    let totalDuration = 0;
    let workoutsWithDurationCount = 0;
    
    // Certifique-se de que `workouts` é um array antes de iterar
    const safeWorkouts = Array.isArray(workouts) ? workouts : [];

    let streakCount = calculateStreak(safeWorkouts); // Passa safeWorkouts

    safeWorkouts.forEach(workout => {
      if (workout.progress === 100 || workout.completedAt) {
        completed[workout.id] = true;
        completedCount++;
      } else {
        pendingCount++;
      }
      
      if (workout.date && isThisWeek(parseISO(workout.date), { weekStartsOn: 1 })) {
        thisWeekCount++;
      }
      if (workout.duration && typeof workout.duration === 'number') {
        totalDuration += workout.duration;
        workoutsWithDurationCount++;
      }
    });
    
    setCompletedWorkouts(completed);
    setWorkoutStats({
      completed: completedCount,
      pending: pendingCount,
      total: safeWorkouts.length,
      thisWeek: thisWeekCount,
      streak: streakCount,
      averageDuration: workoutsWithDurationCount > 0 ? Math.round(totalDuration / workoutsWithDurationCount) : 0
    });
  }, [workouts]);

  // Calcular streak de treinos
  const calculateStreak = (workouts) => {
    if (!Array.isArray(workouts)) return 0;
    
    const completedDates = workouts
      .filter(w => w.progress === 100 || w.completedAt)
      .map(w => {
        try {
          return w.completedAt ? format(parseISO(w.completedAt), 'yyyy-MM-dd') : format(parseISO(w.date), 'yyyy-MM-dd');
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean)
      .sort();
    
    if (completedDates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Zera a hora para comparação de datas

    // Verifica se houve um treino completo hoje
    const latestCompletedDate = completedDates[completedDates.length - 1];
    if (format(currentDate, 'yyyy-MM-dd') === latestCompletedDate) {
      streak = 1;
      currentDate = addDays(currentDate, -1);
    } else if (format(addDays(currentDate, -1), 'yyyy-MM-dd') === latestCompletedDate) {
      // Se o último treino foi ontem, a sequência começa em 1, e verificamos para trás a partir de anteontem
      streak = 1;
      currentDate = addDays(currentDate, -2);
    } else {
      return 0; // Se não houve treino hoje nem ontem, a sequência é 0
    }
    
    for (let i = completedDates.length - 2; i >= 0; i--) {
      try {
        const workoutDate = parseISO(completedDates[i]);
        
        if (format(workoutDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')) {
          streak++;
          currentDate = addDays(currentDate, -1);
        } else if (format(workoutDate, 'yyyy-MM-dd') === format(addDays(currentDate, 1), 'yyyy-MM-dd')) {
          // Ignorar se o treino foi no mesmo dia da iteração anterior (duplicata ou treinos no mesmo dia)
          continue;
        } else {
          break;
        }
      } catch (error) {
        console.error('Erro ao processar data:', error);
        break;
      }
    }
    
    return streak;
  };

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
      
      const newWorkout = {
        title: selectedType.title,
        type: selectedWorkoutType,
        date: selectedDate,
        duration: 45, // Valor padrão
        exercises: [],
        progress: 0,
        color: selectedType.color
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

  // Filtrar treinos
  const getFilteredWorkouts = () => {
    let filtered = Array.isArray(workouts) ? [...workouts] : []; // Garante que é um array
    
    // Aplicar filtro de pesquisa
    if (searchTerm.trim()) {
      filtered = filtered.filter(workout => {
        const title = workout.title || workout.name || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Aplicar filtro de tipo
    switch (filterType) {
      case 'today':
        filtered = filtered.filter(workout => {
          try {
            return workout.date && isToday(parseISO(workout.date));
          } catch (error) {
            return false;
          }
        });
        break;
      case 'week':
        filtered = filtered.filter(workout => {
          try {
            return workout.date && isThisWeek(parseISO(workout.date), { weekStartsOn: 1 });
          } catch (error) {
            return false;
          }
        });
        break;
      case 'completed':
        filtered = filtered.filter(workout => 
          completedWorkouts[workout.id]
        );
        break;
            case 'pending':
        filtered = filtered.filter(workout => {
          try {
            return !completedWorkouts[workout.id] && 
              workout.date && 
              !isPast(parseISO(workout.date));
          } catch (error) {
            return false;
          }
        });
        break;
      default:
        // 'all' - não filtra
        break;
    }
    
    // Ordenar os treinos filtrados (garante que os mais recentes aparecem primeiro para stats)
    filtered.sort((a, b) => {
      try {
        const dateA = a.date ? parseISO(a.date).getTime() : 0;
        const dateB = b.date ? parseISO(b.date).getTime() : 0;
        return dateB - dateA; // Mais recente primeiro
      } catch (error) {
        return 0;
      }
    });

    return filtered;
  };

  // Agrupar treinos por data
  const getGroupedWorkouts = () => {
    const filtered = getFilteredWorkouts();
    
    const grouped = filtered.reduce((acc, workout) => {
      if (!workout.date) {
        if (!acc['noDate']) {
          acc['noDate'] = [];
        }
        acc['noDate'].push(workout);
        return acc;
      }
      
      if (!acc[workout.date]) {
        acc[workout.date] = [];
      }
      acc[workout.date].push(workout);
      return acc;
    }, {});
    
    return grouped;
  };

  // Ordenar datas
  const getSortedDates = () => {
    const grouped = getGroupedWorkouts();
    return Object.keys(grouped).sort((a, b) => {
      if (a === 'noDate' && b !== 'noDate') return 1;
      if (b === 'noDate' && a !== 'noDate') return -1;
      if (a === 'noDate' && b === 'noDate') return 0; // Ambas sem data, ordem não importa
      try {
        return new Date(a) - new Date(b); // Datas ascendente
      } catch (error) {
        return 0;
      }
    });
  };

  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Renderizar o estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Meus Treinos</h2>
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-purple-100 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg p-4 animate-pulse">
                <div className="h-6 bg-purple-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-purple-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar estado de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
        <div className="container mx-auto">
          <div className="bg-white/80 backdrop-blur-md border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
            <p className="font-medium">Erro ao carregar treinos</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm inline-flex items-center transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar conteúdo principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
          <button
            id="add-workout-button"
            onClick={() => setShowAddWorkout(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm flex items-center transition-all duration-300 shadow-lg"
          >
            <FaPlus className="mr-2" />
            Novo Treino
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Treinos</p>
                <p className="text-2xl font-bold text-gray-900">{workoutStats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaDumbbell className="text-xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Treinos Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{workoutStats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheck className="text-xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sequência</p>
                <p className="text-2xl font-bold text-gray-900">{workoutStats.streak} dias</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaFire className="text-xl text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Média de Duração</p>
                <p className="text-2xl font-bold text-gray-900">{workoutStats.averageDuration} min</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaClock className="text-xl text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar treinos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-md border border-purple-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/80 backdrop-blur-md border border-purple-200 rounded-lg text-gray-900 flex items-center hover:bg-white/90 transition-colors"
            >
              <FaFilter className="mr-2" />
              Filtrar
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-purple-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 ${filterType === 'all' ? 'text-purple-600 bg-purple-50' : 'text-gray-900'}`}
                  >
                    Todos os Treinos
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('today');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 ${filterType === 'today' ? 'text-purple-600 bg-purple-50' : 'text-gray-900'}`}
                  >
                    Hoje
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('week');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 ${filterType === 'week' ? 'text-purple-600 bg-purple-50' : 'text-gray-900'}`}
                  >
                    Esta Semana
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('completed');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 ${filterType === 'completed' ? 'text-purple-600 bg-purple-50' : 'text-gray-900'}`}
                  >
                    Concluídos
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('pending');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-purple-50 ${filterType === 'pending' ? 'text-purple-600 bg-purple-50' : 'text-gray-900'}`}
                  >
                    Pendentes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Treinos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {getFilteredWorkouts().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDumbbell className="text-2xl text-purple-500" />
              </div>
              <p className="text-gray-600 text-lg mb-2">Nenhum treino encontrado</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterType !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Comece criando seu primeiro treino!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredWorkouts().map(workout => (
                <motion.div key={workout.id} variants={itemVariants}>
                  <WorkoutCard workout={workout} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Modal de Adicionar Treino */}
        <AnimatePresence>
          {showAddWorkout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 backdrop-blur-md border border-purple-200 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                ref={addFormRef}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Novo Treino</h2>
                  <button
                    onClick={() => setShowAddWorkout(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Treino
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {workoutTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedWorkoutType(type.id)}
                          className={`p-3 rounded-lg flex items-center justify-center text-sm ${
                            selectedWorkoutType === type.id
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                          } transition-all duration-200`}
                        >
                          <span className="mr-2">{type.icon}</span>
                          {type.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data do Treino
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white/80 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleAddWorkout}
                    disabled={!selectedWorkoutType}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedWorkoutType
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Criar Treino
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkoutList;

