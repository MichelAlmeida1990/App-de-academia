// src/components/workout/WorkoutList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion'; // Removido useMotionValue, useTransform se não usados
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
  FaChartLine // Adicionado ícone para estatísticas
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
    averageDuration: 0 // Nova estatística
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
      averageDuration: workoutsWithDurationCount > 0 ? Math.round(totalDuration / workoutsWithDurationCount) : 0 // Calcula duração média
    });
  }, [workouts]); // Dependência atualizada para `workouts`

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
  const tailwindColorMap = {
    purple: 'purple',
    blue: 'blue',
    green: 'green',
    orange: 'orange',
    red: 'red',
    pink: 'pink',
    // Adicione outras cores que você usa em workoutTypes
    accent: accentColor // Usa o accentColor para classes dinâmicas (requer safelist no tailwind.config.js)
  };

  const getWorkoutTypeColorClass = (typeId) => {
    const type = workoutTypes.find(t => t.id === typeId);
    return tailwindColorMap[type?.color] || tailwindColorMap.accent; // Retorna o nome da cor para a classe Tailwind
  };


  // Renderizar o estado de carregamento
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meus Treinos</h2>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
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
        <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg">
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Treinos</h2>
        <motion.button 
          id="add-workout-button"
          onClick={() => setShowAddWorkout(!showAddWorkout)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600 transition-all duration-300 ease-in-out`}
          whileHover={{ scale: 1.1, rotate: showAddWorkout ? 90 : 0 }} // Adiciona rotação ao hover e fechar
          whileTap={{ scale: 0.9 }}
        >
          {showAddWorkout ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
        </motion.button>
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"> {/* Alterado para 3 colunas em lg */}
        <motion.div 
          className={`bg-gradient-to-br from-${accentColor}-500 to-${accentColor}-600 rounded-xl p-4 text-white shadow-lg flex items-center`}
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
          className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg flex items-center`}
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
          className={`bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg flex items-center`}
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
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar treinos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="relative z-10" ref={filterMenuRef}> {/* Adicionado z-10 para garantir que o menu de filtro apareça acima */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg border flex items-center space-x-2 ${
              filterType !== 'all' 
                ? `bg-${accentColor}-500 text-white border-${accentColor}-600` 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            } transition-colors duration-200`}
            whileTap={{ scale: 0.97 }}
          >
            <FaFilter className={filterType !== 'all' ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
            <span>{filterType === 'all' ? 'Filtros' : (
              filterType === 'today' ? 'Hoje' : 
              filterType === 'week' ? 'Esta semana' :
              filterType === 'completed' ? 'Concluídos' : 'Pendentes'
            )}</span>
          </motion.button>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border dark:border-gray-700" // Aumentado z-index
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
                          ? `bg-${accentColor}-50 dark:bg-${accentColor}-900/20 text-${accentColor}-600 dark:text-${accentColor}-400` 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        setFilterType(option.id);
                        setShowFilters(false);
                      }}
                    >
                      <span className={filterType === option.id ? `text-${accentColor}-500` : 'text-gray-500 dark:text-gray-400'}>
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Adicionar Novo Treino</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data do Treino</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo de Treino</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"> {/* Layout mais responsivo para tipos */}
                  {workoutTypes.map(type => {
                    const typeColor = getWorkoutTypeColorClass(type.id); // Usando a função para obter a classe de cor
                    return (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedWorkoutType(type.id)}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1 text-center transition-all duration-200 ${
                          selectedWorkoutType === type.id
                            ? `bg-${typeColor}-100 dark:bg-${typeColor}-900/20 border-2 border-${typeColor}-500 text-${typeColor}-700 dark:text-${typeColor}-400`
                            : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-${typeColor}-500 flex items-center justify-center text-white text-lg`}>
                          {type.icon}
                        </div>
                        <span className="font-medium text-sm mt-1">{type.title}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      ? `bg-${accentColor}-500 hover:bg-${accentColor}-600` 
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700"
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <FaDumbbell className="text-4xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Nenhum treino encontrado</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
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
            className={`px-6 py-3 bg-${accentColor}-500 hover:bg-${accentColor}-600 text-white rounded-lg inline-flex items-center font-medium shadow-md`}
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
            const groupedWorkoutsForDate = getGroupedWorkouts()[date]; // Obtenha os treinos para esta data
            if (!groupedWorkoutsForDate || groupedWorkoutsForDate.length === 0) {
              return null; // Não renderiza o grupo de data se não houver treinos
            }
            return (
              <motion.div 
                key={date} 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-4 ${date === 'noDate' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20'}`}>
                  <div className="flex items-center">
                    <FaCalendarAlt className={`${date === 'noDate' ? 'text-gray-500 dark:text-gray-400' : `text-${accentColor}-500`} mr-3`} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {date === 'noDate' ? 'Sem data definida' : formatDate(date)}
                    </h3>
                  </div>
                </div>
                
                <div className="divide-y dark:divide-gray-700">
                  {groupedWorkoutsForDate.map(workout => {
                    const isCompleted = completedWorkouts[workout.id];
                    const isPastWorkout = workout.date && isPast(parseISO(workout.date)) && !isToday(parseISO(workout.date));
                    const workoutColor = getWorkoutTypeColorClass(workout.type); // Usa a função de cor
                    
                    return (
                      <div key={workout.id} className="p-4 relative"> {/* Adicionado relative para o menu de ação */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center flex-grow"> {/* Adicionado flex-grow para o conteúdo principal */}
                            <div className={`w-10 h-10 rounded-lg bg-${workoutColor}-100 dark:bg-${workoutColor}-900/30 flex items-center justify-center mr-3 flex-shrink-0`}> {/* flex-shrink-0 para o ícone não diminuir */}
                              <FaDumbbell className={`text-${workoutColor}-500 dark:text-${workoutColor}-400 text-xl`} />
                            </div>
                            <div className="flex-grow min-w-0"> {/* min-w-0 para permitir truncamento */}
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">{workout.title || workout.name || 'Treino sem nome'}</h4>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                <FaClock className="mr-1.5 text-base" /> {/* Ajuste de tamanho */}
                                <span>{workout.duration || '45'} min</span>
                                <span className="mx-2">•</span>
                                <span>{workout.exercises?.length || 0} exercícios</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative z-10" ref={showActionMenu === workout.id ? actionMenuRef : null}> {/* Adicionado z-10 para o menu de ação */}
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowActionMenu(showActionMenu === workout.id ? null : workout.id)}
                              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FaEllipsisH />
                            </motion.button>
                            
                            <AnimatePresence>
                              {showActionMenu === workout.id && (
                                <motion.div 
                                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-200 dark:border-gray-700"
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="py-1">
                                    <motion.button
                                      whileHover={{ backgroundColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 1)' }}
                                      onClick={() => {
                                        navigate(`/workout/${workout.id}`);
                                        setShowActionMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      <FaEye className="mr-2.5 text-gray-500 dark:text-gray-400" /> 
                                      <span>Ver detalhes</span>
                                    </motion.button>
                                    
                                    <motion.button
                                      whileHover={{ backgroundColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 1)' }}
                                      onClick={() => {
                                        navigate(`/workout/${workout.id}/edit`);
                                        setShowActionMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      <FaEdit className="mr-2.5 text-gray-500 dark:text-gray-400" /> 
                                      <span>Editar treino</span>
                                    </motion.button>
                                    
                                    <motion.button
                                      whileHover={{ backgroundColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 1)' }}
                                      onClick={() => handleDeleteWorkout(workout.id)}
                                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 flex items-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Progresso</span>
                                            <span className={`font-medium ${isCompleted ? 'text-green-500' : `text-${workoutColor}-500`}`}>
                                                {isCompleted ? '100%' : `${workout.progress || 0}%`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${isCompleted ? 100 : (workout.progress || 0)}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-2 rounded-full ${
                                                    isCompleted 
                                                        ? 'bg-green-500' 
                                                        : `bg-${workoutColor}-500`
                                                }`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="flex justify-between items-center mt-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                              <FaCheck className="mr-1.5" /> Concluído
                            </span>
                          ) : isPastWorkout ? (
                            <span className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
                              Não realizado
                            </span>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStartWorkout(workout.id)}
                              className={`inline-flex items-center px-4 py-2 bg-${workoutColor}-500 hover:bg-${workoutColor}-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors`}
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
