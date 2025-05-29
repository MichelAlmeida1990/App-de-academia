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
    <div className="p-4">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Meus Treinos</h2>
        <motion.button 
          id="add-workout-button"
          onClick={() => setShowAddWorkout(!showAddWorkout)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: showAddWorkout ? 90 : 0 }}
          whileTap={{ scale: 0.9 }}
        >
          {showAddWorkout ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
        </motion.button>
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <motion.div 
          className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 text-gray-900 shadow-lg flex items-center hover:shadow-xl hover:border-purple-200 transition-all duration-300"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">Treinos Concluídos</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{workoutStats.completed}</h3>
              <p className="text-xs mt-1 text-gray-600">
                {Math.round((workoutStats.completed / (workoutStats.total || 1)) * 100)}% do total
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FaCheck className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 text-gray-900 shadow-lg flex items-center hover:shadow-xl hover:border-purple-200 transition-all duration-300"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">Sequência Atual</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{workoutStats.streak} {workoutStats.streak === 1 ? 'dia' : 'dias'}</h3>
              <p className="text-xs mt-1 text-gray-600">
                {workoutStats.thisWeek} treinos esta semana
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FaFire className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl p-4 text-gray-900 shadow-lg flex items-center hover:shadow-xl hover:border-purple-200 transition-all duration-300"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">Duração Média</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{workoutStats.averageDuration} min</h3>
              <p className="text-xs mt-1 text-gray-600">
                Por treino concluído
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FaChartLine className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Barra de pesquisa e filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar treinos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/80 backdrop-blur-md border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-200 text-gray-900 placeholder-gray-500 transition-all duration-300"
          />
        </div>
        
        <div className="relative z-10" ref={filterMenuRef}>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 bg-white/80 backdrop-blur-md border transition-all duration-300 ${
              filterType !== 'all' 
                ? 'border-purple-200 text-purple-700 bg-purple-50/80' 
                : 'border-purple-100 text-gray-700 hover:border-purple-200'
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <FaFilter className="text-purple-600" />
            <span>{filterType === 'all' ? 'Filtros' : (
              filterType === 'today' ? 'Hoje' : 
              filterType === 'week' ? 'Esta semana' :
              filterType === 'completed' ? 'Concluídos' : 'Pendentes'
            )}</span>
          </motion.button>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl z-20 border border-purple-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-1">
                  {[
                    { id: 'all', label: 'Todos os treinos', icon: <FaDumbbell /> },
                    { id: 'today', label: 'Hoje', icon: <FaCalendarAlt /> },
                    { id: 'week', label: 'Esta semana', icon: <FaRegCalendarAlt /> },
                    { id: 'completed', label: 'Concluídos', icon: <FaCheck /> },
                    { id: 'pending', label: 'Pendentes', icon: <FaClock /> }
                  ].map(option => (
                    <button
                      key={option.id}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2 transition-colors ${
                        filterType === option.id 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'text-gray-700 hover:bg-purple-50'
                      }`}
                      onClick={() => {
                        setFilterType(option.id);
                        setShowFilters(false);
                      }}
                    >
                      <span className={filterType === option.id ? 'text-purple-600' : 'text-gray-500'}>
                        {option.icon}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Formulário de adição de treino */}
      <AnimatePresence>
        {showAddWorkout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div 
              ref={addFormRef}
              className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg p-5"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Adicionar Novo Treino</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Data do Treino</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/80 backdrop-blur-md border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-200 text-gray-900 transition-all duration-300"
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">Tipo de Treino</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {workoutTypes.map(type => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedWorkoutType(type.id)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1 text-center transition-all duration-200 ${
                        selectedWorkoutType === type.id
                          ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                          : 'bg-white/60 border-2 border-purple-100 text-gray-700 hover:bg-purple-50 hover:border-purple-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        selectedWorkoutType === type.id ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {type.icon}
                      </div>
                      <span className="font-medium text-sm mt-1">{type.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 rounded-lg border border-purple-200 text-gray-700 font-medium hover:bg-purple-50 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddWorkout}
                  disabled={!selectedWorkoutType}
                  className={`px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                    selectedWorkoutType 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Adicionar Treino
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lista de treinos */}
      {getSortedDates().length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <FaDumbbell className="text-4xl text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Nenhum treino encontrado</h3>
                   <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== 'all' 
              ? 'Nenhum treino corresponde aos filtros selecionados. Tente ajustar seus critérios de busca.'
              : 'Você ainda não tem nenhum treino programado. Adicione seu primeiro treino para começar.'}
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setShowAddWorkout(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg inline-flex items-center font-medium shadow-lg transition-all duration-300"
          >
            <FaPlus className="mr-2" /> Adicionar Treino
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {getSortedDates().map(date => {
            const groupedWorkoutsForDate = getGroupedWorkouts()[date];
            if (!groupedWorkoutsForDate || groupedWorkoutsForDate.length === 0) {
              return null;
            }
            return (
              <motion.div 
                key={date} 
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300"
              >
                <div className={`p-4 ${date === 'noDate' ? 'bg-purple-50/80' : 'bg-gradient-to-r from-purple-100/80 to-purple-200/80'}`}>
                  <div className="flex items-center">
                    <FaCalendarAlt className={`${date === 'noDate' ? 'text-gray-500' : 'text-purple-600'} mr-3`} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {date === 'noDate' ? 'Sem data definida' : formatDate(date)}
                    </h3>
                  </div>
                </div>
                
                <div className="divide-y divide-purple-100">
                  {groupedWorkoutsForDate.map(workout => {
                    const isCompleted = completedWorkouts[workout.id];
                    const isPastWorkout = workout.date && isPast(parseISO(workout.date)) && !isToday(parseISO(workout.date));
                    
                    return (
                      <div key={workout.id} className="p-4 relative hover:bg-purple-50/50 transition-colors duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center flex-grow">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <FaDumbbell className="text-purple-600" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-lg font-medium text-gray-900 truncate">{workout.title || workout.name || 'Treino sem nome'}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-0.5">
                                <FaClock className="mr-1.5 text-base" />
                                <span>{workout.duration || '45'} min</span>
                                <span className="mx-2">•</span>
                                <span>{workout.exercises?.length || 0} exercícios</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative z-10" ref={showActionMenu === workout.id ? actionMenuRef : null}>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowActionMenu(showActionMenu === workout.id ? null : workout.id)}
                              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-purple-100 transition-colors"
                            >
                              <FaEllipsisH />
                            </motion.button>
                            
                            <AnimatePresence>
                              {showActionMenu === workout.id && (
                                <motion.div 
                                  className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl z-20 border border-purple-100"
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="py-1">
                                    <motion.button
                                      whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                                      onClick={() => {
                                        navigate(`/workout/${workout.id}`);
                                        setShowActionMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 flex items-center hover:bg-purple-50 transition-colors"
                                    >
                                      <FaEye className="mr-2.5 text-purple-600" /> 
                                      <span>Ver detalhes</span>
                                    </motion.button>
                                    
                                    <motion.button
                                      whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                                      onClick={() => {
                                        navigate(`/workout/${workout.id}/edit`);
                                        setShowActionMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 flex items-center hover:bg-purple-50 transition-colors"
                                    >
                                      <FaEdit className="mr-2.5 text-purple-600" /> 
                                      <span>Editar treino</span>
                                    </motion.button>
                                    
                                    <motion.button
                                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                      onClick={() => handleDeleteWorkout(workout.id)}
                                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 flex items-center hover:bg-red-50 transition-colors"
                                    >
                                      <FaTrash className="mr-2.5" /> 
                                      <span>Excluir</span>
                                    </motion.button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        {/* Barra de progresso */}
                        <AnimatePresence>
                            {(workout.progress > 0 || isCompleted) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 mb-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-600">Progresso</span>
                                            <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-purple-600'}`}>
                                                {isCompleted ? '100%' : `${workout.progress || 0}%`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-purple-100 rounded-full h-2">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${isCompleted ? 100 : (workout.progress || 0)}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-2 rounded-full ${
                                                    isCompleted 
                                                        ? 'bg-green-500' 
                                                        : 'bg-purple-500'
                                                }`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="flex justify-between items-center mt-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                              <FaCheck className="mr-1.5" /> Concluído
                            </span>
                          ) : isPastWorkout ? (
                            <span className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                              Não realizado
                            </span>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStartWorkout(workout.id)}
                              className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                              <FaPlay className="mr-1.5" /> Iniciar Treino
                            </motion.button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default WorkoutList;

