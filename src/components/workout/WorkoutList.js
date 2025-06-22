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
        id: 'fullbody', 
        title: 'Treino Completo',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'upper', 
        title: 'Parte Superior',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'lower', 
        title: 'Parte Inferior',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'push', 
        title: 'Empurrar',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'pull', 
        title: 'Puxar',
        icon: <FaDumbbell />,
        color: 'purple'
      },
      { 
        id: 'core', 
        title: 'Core',
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
    const completedDates = workouts
      .filter(w => w.progress === 100 || w.completedAt)
      .map(w => w.completedAt ? format(parseISO(w.completedAt), 'yyyy-MM-dd') : format(parseISO(w.date), 'yyyy-MM-dd'))
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
          showToast('Sucesso', 'Treino adicionado com sucesso!', 'success');
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
      filtered = filtered.filter(workout => 
        workout.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) // Mantém a busca em 'name' também
      );
    }
    
    // Aplicar filtro de tipo
    switch (filterType) {
      case 'today':
        filtered = filtered.filter(workout => 
          workout.date && isToday(parseISO(workout.date))
        );
        break;
      case 'week':
        filtered = filtered.filter(workout => 
          workout.date && isThisWeek(parseISO(workout.date), { weekStartsOn: 1 })
        );
        break;
      case 'completed':
        filtered = filtered.filter(workout => 
          completedWorkouts[workout.id]
        );
        break;
      case 'pending':
        filtered = filtered.filter(workout => 
          !completedWorkouts[workout.id] && 
          workout.date && 
          !isPast(parseISO(workout.date)) // Filtra apenas treinos futuros ou de hoje não concluídos
        );
        break;
      default:
        // 'all' - não filtra
        break;
    }
    
    // Ordenar os treinos filtrados (garante que os mais recentes aparecem primeiro para stats)
    filtered.sort((a, b) => {
      const dateA = a.date ? parseISO(a.date).getTime() : 0;
      const dateB = b.date ? parseISO(b.date).getTime() : 0;
      return dateB - dateA; // Mais recente primeiro
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
      return new Date(a) - new Date(b); // Datas ascendente
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
      <div className="p-4">
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
    );
  }

  // Renderizar estado de erro
  if (error) {
    return (
      <div className="p-4">
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
    );
  }

  // Renderizar conteúdo principal
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Meus Treinos</h1>
        <button
          id="add-workout-button"
          onClick={() => setShowAddWorkout(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          Novo Treino
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Treinos</p>
              <p className="text-2xl font-bold text-white">{workoutStats.total}</p>
            </div>
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <FaDumbbell className="text-xl text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Treinos Concluídos</p>
              <p className="text-2xl font-bold text-white">{workoutStats.completed}</p>
            </div>
            <div className="p-3 bg-green-600/20 rounded-lg">
              <FaCheck className="text-xl text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sequência</p>
              <p className="text-2xl font-bold text-white">{workoutStats.streak} dias</p>
            </div>
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <FaFire className="text-xl text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Média de Duração</p>
              <p className="text-2xl font-bold text-white">{workoutStats.averageDuration} min</p>
            </div>
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <FaClock className="text-xl text-blue-500" />
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
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="relative" ref={filterMenuRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg text-white flex items-center hover:bg-white/20 transition-colors"
          >
            <FaFilter className="mr-2" />
            Filtrar
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${filterType === 'all' ? 'text-purple-500' : 'text-white'}`}
                >
                  Todos os Treinos
                </button>
                <button
                  onClick={() => setFilterType('today')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${filterType === 'today' ? 'text-purple-500' : 'text-white'}`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setFilterType('week')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${filterType === 'week' ? 'text-purple-500' : 'text-white'}`}
                >
                  Esta Semana
                </button>
                <button
                  onClick={() => setFilterType('completed')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${filterType === 'completed' ? 'text-purple-500' : 'text-white'}`}
                >
                  Concluídos
                </button>
                <button
                  onClick={() => setFilterType('pending')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${filterType === 'pending' ? 'text-purple-500' : 'text-white'}`}
                >
                  Pendentes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Treinos */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : getFilteredWorkouts().length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhum treino encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredWorkouts().map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
            />
          ))}
        </div>
      )}

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
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              ref={addFormRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Novo Treino</h2>
                <button
                  onClick={() => setShowAddWorkout(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Tipo de Treino
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {workoutTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedWorkoutType(type.id)}
                        className={`p-3 rounded-lg flex items-center justify-center ${
                          selectedWorkoutType === type.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } transition-colors`}
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Data do Treino
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleAddWorkout}
                  disabled={!selectedWorkoutType}
                  className={`w-full py-3 rounded-lg font-medium ${
                    selectedWorkoutType
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                >
                  Criar Treino
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutList;

