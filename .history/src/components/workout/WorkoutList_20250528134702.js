// src/components/workout/WorkoutList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { accentColor, darkMode } = useTheme();
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

  // Simulação de tipos de treino (substitua por dados reais se necessário)
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
        color: 'blue'
      },
      { 
        id: 'lower', 
        title: 'Parte Inferior',
        icon: <FaDumbbell />,
        color: 'green'
      },
      { 
        id: 'push', 
        title: 'Empurrar',
        icon: <FaDumbbell />,
        color: 'orange'
      },
      { 
        id: 'pull', 
        title: 'Puxar',
        icon: <FaDumbbell />,
        color: 'red'
      },
      { 
        id: 'core', 
        title: 'Core',
        icon: <FaDumbbell />,
        color: 'pink'
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

  // Mapeamento de cores para Tailwind (evita problemas com classes dinâmicas)
  const getColorClass = (color, element, variant = null) => {
    const colorMap = {
      purple: {
        bg: variant === 'light' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-purple-500',
        text: 'text-purple-500 dark:text-purple-400',
        border: 'border-purple-500',
        gradient: 'from-purple-500 to-indigo-600'
      },
      blue: {
        bg: variant === 'light' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-blue-500',
        text: 'text-blue-500 dark:text-blue-400',
        border: 'border-blue-500',
        gradient: 'from-blue-500 to-cyan-600'
      },
      green: {
        bg: variant === 'light' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-green-500',
        text: 'text-green-500 dark:text-green-400',
        border: 'border-green-500',
        gradient: 'from-green-500 to-emerald-600'
      },
      orange: {
        bg: variant === 'light' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-orange-500',
        text: 'text-orange-500 dark:text-orange-400',
        border: 'border-orange-500',
        gradient: 'from-orange-500 to-amber-600'
      },
      red: {
        bg: variant === 'light' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-red-500',
        text: 'text-red-500 dark:text-red-400',
        border: 'border-red-500',
        gradient: 'from-red-500 to-pink-600'
      },
      pink: {
        bg: variant === 'light' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-pink-500',
        text: 'text-pink-500 dark:text-pink-400',
        border: 'border-pink-500',
        gradient: 'from-pink-500 to-purple-600'
      },
      accent: {
        bg: variant === 'light' ? `bg-${accentColor}-100 dark:bg-${accentColor}-900/30` : `bg-${accentColor}-500`,
        text: `text-${accentColor}-500 dark:text-${accentColor}-400`,
        border: `border-${accentColor}-500`,
        gradient: `from-${accentColor}-500 to-${accentColor}-600`
      }
    };

    // Retorna a classe apropriada para o elemento e cor
    const colorObj = colorMap[color] || colorMap.accent;
    return colorObj[element];
  };

  // Renderizar o estado de carregamento
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Meus Treinos</h2>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-filter backdrop-blur-lg animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-white/5 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-white/5 rounded w-full"></div>
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
        <div className="bg-red-500/10 backdrop-filter backdrop-blur-lg border-l-4 border-red-500 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Erro ao carregar treinos</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm inline-flex items-center"
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
        <h2 className="text-2xl font-bold text-white">Meus Treinos</h2>
        <motion.button 
          id="add-workout-button"
          onClick={() => setShowAddWorkout(!showAddWorkout)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-gradient-to-r from-purple-500 to-pink-600 backdrop-filter backdrop-blur-lg"
          whileHover={{ scale: 1.1, rotate: showAddWorkout ? 90 : 0 }}
          whileTap={{ scale: 0.9 }}
        >
          {showAddWorkout ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
        </motion.button>
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <motion.div 
          className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl p-4 text-white shadow-lg border border-white/20 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-75">Treinos Concluídos</p>
              <h3 className="text-2xl font-bold mt-1">{workoutStats.completed}</h3>
              <p className="text-xs mt-1 opacity-75">
                {Math.round((workoutStats.completed / (workoutStats.total || 1)) * 100)}% do total
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FaCheck className="text-xl" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl p-4 text-white shadow-lg border border-white/20 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-75">Sequência Atual</p>
              <h3 className="text-2xl font-bold mt-1">{workoutStats.streak} {workoutStats.streak === 1 ? 'dia' : 'dias'}</h3>
              <p className="text-xs mt-1 opacity-75">
                {workoutStats.thisWeek} treinos esta semana
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FaFire className="text-xl" />
            </div>
          </div>
        </motion.div>

        {/* Novo Card de Estatística: Duração Média */}
        <motion.div 
          className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl p-4 text-white shadow-lg border border-white/20 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-75">Duração Média</p>
              <h3 className="text-2xl font-bold mt-1">{workoutStats.averageDuration} min</h3>
              <p className="text-xs mt-1 opacity-75">
                Por treino concluído
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FaChartLine className="text-xl" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Barra de pesquisa e filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Buscar treinos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
          />
        </div>
        
        <div className="relative z-10" ref={filterMenuRef}>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 backdrop-filter backdrop-blur-lg border border-white/20 ${
              filterType !== 'all' 
                ? 'bg-purple-500/20 text-white' 
                : 'bg-white/10 text-white'
            } transition-colors duration-200`}
            whileTap={{ scale: 0.97 }}
          >
            <FaFilter className="text-white/70" />
            <span>{filterType === 'all' ? 'Filtros' : (
              filterType === 'today' ? 'Hoje' : 
              filterType === 'week' ? 'Esta semana' :
              filterType === 'completed' ? 'Concluídos' : 'Pendentes'
            )}</span>
          </motion.button>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg z-20 border border-white/20"
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
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2 ${
                        filterType === option.id 
                          ? 'bg-purple-500/20 text-white' 
                          : 'text-white hover:bg-white/5'
                      }`}
                      onClick={() => {
                        setFilterType(option.id);
                        setShowFilters(false);
                      }}
                    >
                      <span className={filterType === option.id ? 'text-purple-300' : 'text-white/70'}>
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
              className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-5 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">Adicionar Novo Treino</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white/80">Data do Treino</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-white/80">Tipo de Treino</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {workoutTypes.map(type => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedWorkoutType(type.id)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1 text-center transition-all duration-200 ${
                        selectedWorkoutType === type.id
                          ? `bg-${type.color}-500/20 border-2 border-${type.color}-500 text-white`
                          : 'bg-white/5 border-2 border-transparent text-white hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${getColorClass(
