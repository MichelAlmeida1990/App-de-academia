import React, { useState, useContext, useEffect } from 'react';
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaWeight,
  FaRuler,
  FaBirthdayCake,
  FaVenus,
  FaMars,
  FaBullseye,
  FaDumbbell,
  FaFire,
  FaClock,
  FaChartLine,
  FaCog,
  FaBell,
  FaLock,
  FaTrash,
  FaDownload,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaCalculator
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import userDataService from '../services/UserDataService';

const ProfilePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { currentUser } = useAuth();
  const { 
    workouts, 
    getCompletedWorkouts, 
    getGeneralStats 
  } = useWorkout();
  
  // Estados para edição do perfil
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [originalUserData, setOriginalUserData] = useState(null); // Para cancelar edição
  
  // Estados para dados do usuário - agora serão carregados do localStorage
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    experience: '',
    avatar: null
  });

  // Estados para estatísticas reais
  const [userStats, setUserStats] = useState({
    totalWorkouts: 0,
    totalTime: 0,
    totalCalories: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageWorkoutTime: 0,
    favoriteExercise: 'Nenhum ainda',
    memberSince: new Date().toISOString().split('T')[0]
  });

  // Estados para configurações
  const [settings, setSettings] = useState({
    notifications: {
      workoutReminders: true,
      progressUpdates: true,
      achievements: true,
      weeklyReport: false
    },
    privacy: {
      profileVisible: true,
      statsVisible: false,
      workoutsVisible: true
    },
    preferences: {
      autoSave: true,
      darkMode: darkMode,
      language: 'pt-BR',
      units: 'metric'
    }
  });

  // Carregar configurações salvas
  useEffect(() => {
    const loadUserSettings = () => {
      try {
        const savedProfile = userDataService.getUserProfile();
        
        if (savedProfile && savedProfile.settings) {
          setSettings(prev => ({
            ...prev,
            ...savedProfile.settings
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do usuário:', error);
      }
    };

    loadUserSettings();
  }, [currentUser]);

  // Estados para alteração de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Carregar dados do usuário salvos
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        console.log('=== CARREGANDO PERFIL DO USUÁRIO ===');
        console.log('Current User UID:', currentUser?.uid);
        console.log('Current User displayName:', currentUser?.displayName);
        console.log('Current User email:', currentUser?.email);
        
        const savedProfile = userDataService.getUserProfile();
        console.log('Perfil retornado pelo UserDataService:', savedProfile);
        
        // Se há dados salvos, usar eles completamente
        if (savedProfile && Object.keys(savedProfile).length > 0 && savedProfile.name) {
          console.log('✅ Carregando dados salvos:', savedProfile);
          const loadedData = {
            name: savedProfile.name || '',
            email: savedProfile.email || '',
            phone: savedProfile.phone || '',
            birthDate: savedProfile.birthDate || '',
            gender: savedProfile.gender || '',
            height: savedProfile.height || '',
            weight: savedProfile.weight || '',
            goal: savedProfile.goal || '',
            experience: savedProfile.experience || '',
            avatar: savedProfile.avatar || null
          };
          setUserData(loadedData);
          setOriginalUserData(loadedData);
        } else {
          // Se não há dados salvos, usar apenas nome e email do currentUser, resto em branco
          console.log('❌ Nenhum dado salvo encontrado, usando dados básicos do usuário');
          console.log('Condição falhou porque:');
          console.log('- savedProfile existe?', !!savedProfile);
          console.log('- savedProfile tem chaves?', savedProfile ? Object.keys(savedProfile).length : 0);
          console.log('- savedProfile tem name?', savedProfile?.name);
          const defaultData = {
            name: currentUser?.displayName || '',
            email: currentUser?.email || '',
            phone: '',
            birthDate: '',
            gender: '',
            height: '',
            weight: '',
            goal: '',
            experience: '',
            avatar: null
          };
          setUserData(defaultData);
          setOriginalUserData(defaultData);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        // Em caso de erro, usar apenas dados básicos
        const fallbackData = {
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          phone: '',
          birthDate: '',
          gender: '',
          height: '',
          weight: '',
          goal: '',
          experience: '',
          avatar: null
        };
        setUserData(fallbackData);
        setOriginalUserData(fallbackData);
      }
    };

    if (currentUser) {
      loadUserProfile();
    } else {
      console.log('Usuário não autenticado ainda');
    }
  }, [currentUser]);

  // Debug para verificar se o userDataService está funcionando
  useEffect(() => {
    console.log('UserDataService disponível:', userDataService);
    console.log('Método getUserProfile disponível:', typeof userDataService.getUserProfile);
    console.log('Método saveUserProfile disponível:', typeof userDataService.saveUserProfile);
    
    // Debug do localStorage
    console.log('LocalStorage keys:', Object.keys(localStorage));
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      allKeys.push(localStorage.key(i));
    }
    console.log('Todas as chaves do localStorage:', allKeys);
  }, []);

  // Carregar estatísticas reais
  useEffect(() => {
    if (workouts) {
      const completed = getCompletedWorkouts();
      const generalStats = getGeneralStats('all');
      
      // Calcular sequência atual
      const calculateStreak = () => {
        const completedDates = completed
          .filter(w => w.completedAt)
          .map(w => new Date(w.completedAt).toDateString())
          .sort()
          .reverse();
        
        if (completedDates.length === 0) return 0;
        
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (completedDates[0] === today || completedDates[0] === yesterday) {
          currentStreak = 1;
          tempStreak = 1;
          for (let i = 1; i < completedDates.length; i++) {
            const currentDate = new Date(completedDates[i-1]);
            const previousDate = new Date(completedDates[i]);
            const dayDiff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
            
            if (dayDiff === 1) {
              currentStreak++;
              tempStreak++;
            } else {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);
        }
        
        return { currentStreak, longestStreak };
      };

      // Encontrar exercício mais frequente
      const findFavoriteExercise = () => {
        const exerciseCount = {};
        completed.forEach(workout => {
          workout.exercises?.forEach(exercise => {
            exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
          });
        });
        
        return Object.keys(exerciseCount).length > 0 
          ? Object.keys(exerciseCount).reduce((a, b) => exerciseCount[a] > exerciseCount[b] ? a : b)
          : 'Nenhum ainda';
      };

      const { currentStreak, longestStreak } = calculateStreak();
      const estimatedCalories = completed.reduce((total, workout) => {
        const duration = workout.duration || (workout.exercises?.length * 5) || 30;
        return total + (duration * 10);
      }, 0);

      setUserStats({
        totalWorkouts: completed.length,
        totalTime: generalStats.totalMinutes,
        totalCalories: estimatedCalories,
        currentStreak,
        longestStreak,
        averageWorkoutTime: generalStats.averageMinutes,
        favoriteExercise: findFavoriteExercise(),
        memberSince: '2023-03-15' // Você pode salvar isso no localStorage também
      });
    }
  }, [workouts, getCompletedWorkouts, getGeneralStats]);

  // Função para salvar alterações do perfil
  const handleSaveProfile = async () => {
    try {
      // Validação básica
      if (!userData.name.trim()) {
        alert('O nome é obrigatório!');
        return;
      }

      console.log('Salvando dados do perfil:', userData);
      
      // Salvar no UserDataService (localStorage)
      const savedData = userDataService.saveUserProfile(userData);
      console.log('Perfil salvo com sucesso no localStorage:', savedData);
      
      // Atualizar os dados originais
      setOriginalUserData({ ...userData });
      setIsEditing(false);
      
      // Mostrar feedback visual
      alert('Perfil atualizado com sucesso!');
      
      // Verificar se foi realmente salvo
      const verification = userDataService.getUserProfile();
      console.log('Verificação dos dados salvos:', verification);
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    // Restaurar dados originais
    if (originalUserData) {
      setUserData({ ...originalUserData });
    }
    setIsEditing(false);
  };

  // Função para upload de avatar
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({ ...userData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para alterar configurações
  const handleSettingChange = async (category, setting, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    
    setSettings(newSettings);
    
    // Salvar configurações automaticamente se autoSave estiver ativado
    if (settings.preferences?.autoSave) {
      try {
        await userDataService.saveUserProfile({ settings: newSettings });
        console.log('Configuração salva automaticamente');
      } catch (error) {
        console.error('Erro ao salvar configuração:', error);
      }
    }
  };

  // Função para salvar configurações manualmente
  const handleSaveSettings = async () => {
    try {
      await userDataService.saveUserProfile({ settings });
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  // Função para alterar senha
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    // Aqui você implementaria a lógica para alterar a senha
    console.log('Alterando senha...');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    alert('Senha alterada com sucesso!');
  };

  // Função para exportar dados
  const handleExportData = () => {
    const dataToExport = {
      profile: userData,
      stats: userStats,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <FaUser /> },
    { id: 'stats', label: 'Estatísticas', icon: <FaChartLine /> },
    { id: 'settings', label: 'Configurações', icon: <FaCog /> },
    { id: 'security', label: 'Segurança', icon: <FaLock /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Informações Pessoais
              </h2>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaSave />
                      <span>Salvar</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FaTimes />
                      <span>Cancelar</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <FaEdit />
                    <span>Editar</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                      {userData.avatar ? (
                        <img
                          src={userData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-4xl text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                        <FaCamera />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {userData.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                </div>
              </div>

              {/* Informações */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        placeholder="Digite seu nome completo"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.name || <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        placeholder="Digite seu email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.email || <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.phone || <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Nascimento
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={userData.birthDate}
                        onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.birthDate ? 
                          new Date(userData.birthDate).toLocaleDateString('pt-BR') : 
                          <span className="text-gray-400 italic">Não informado</span>
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gênero
                    </label>
                    {isEditing ? (
                      <select
                        value={userData.gender}
                        onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Selecione seu gênero</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white capitalize">
                        {userData.gender || <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Altura (cm)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={userData.height}
                        onChange={(e) => setUserData({ ...userData, height: e.target.value ? parseInt(e.target.value) : '' })}
                        placeholder="Ex: 175"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.height ? `${userData.height} cm` : <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Peso (kg)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={userData.weight}
                        onChange={(e) => setUserData({ ...userData, weight: e.target.value ? parseInt(e.target.value) : '' })}
                        placeholder="Ex: 75"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.weight ? `${userData.weight} kg` : <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objetivo
                    </label>
                    {isEditing ? (
                      <select
                        value={userData.goal}
                        onChange={(e) => setUserData({ ...userData, goal: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Selecione seu objetivo</option>
                        <option value="Perda de peso">Perda de peso</option>
                        <option value="Ganho de massa muscular">Ganho de massa muscular</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Resistência">Resistência</option>
                        <option value="Força">Força</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {userData.goal || <span className="text-gray-400 italic">Não informado</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Resumo das Estatísticas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Suas Estatísticas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg mb-3">
                    <FaDumbbell className="text-3xl text-purple-500 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total de Treinos</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {userStats.totalWorkouts}
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg mb-3">
                    <FaClock className="text-3xl text-blue-500 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tempo Total</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(userStats.totalTime / 60)}h {userStats.totalTime % 60}m
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg mb-3">
                    <FaFire className="text-3xl text-orange-500 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calorias Queimadas</h3>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {userStats.totalCalories.toLocaleString()}
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-3">
                    <FaBullseye className="text-3xl text-green-500 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sequência Atual</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {userStats.currentStreak} dias
                  </p>
                </div>
              </div>
            </div>

            {/* Dados Corporais e IMC */}
            {(() => {
              const profileData = UserDataService.getUserProfile();
              
              return (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Dados Corporais
                    </h3>
                    <Link 
                      to="/tools" 
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center"
                    >
                      <FaCalculator className="mr-1" />
                      Calculadora IMC
                    </Link>
                  </div>
                  
                  {profileData && (profileData.bmi || profileData.height || profileData.weight) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {profileData.height && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaRuler className="text-2xl text-blue-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Altura</h4>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {profileData.height} cm
                          </p>
                        </div>
                      )}
                      
                      {profileData.weight && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaWeight className="text-2xl text-green-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso</h4>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {profileData.weight} kg
                          </p>
                        </div>
                      )}
                      
                      {profileData.bmi && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaCalculator className="text-2xl text-purple-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">IMC</h4>
                          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {profileData.bmi.toFixed(1)}
                          </p>
                        </div>
                      )}
                      
                      {profileData.category && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaBullseye className="text-2xl text-orange-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Categoria IMC</h4>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {profileData.category}
                          </p>
                        </div>
                      )}

                      {profileData.bodyFat && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaWeight className="text-2xl text-yellow-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Gordura Corporal</h4>
                          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            {profileData.bodyFat.toFixed(1)}%
                          </p>
                        </div>
                      )}

                      {profileData.tdee && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaFire className="text-2xl text-red-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">TDEE</h4>
                          <p className="text-xl font-bold text-red-600 dark:text-red-400">
                            {Math.round(profileData.tdee)} kcal
                          </p>
                        </div>
                      )}

                      {profileData.bmr && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaClock className="text-2xl text-indigo-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">TMB</h4>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {Math.round(profileData.bmr)} kcal
                          </p>
                        </div>
                      )}

                      {profileData.targetCalories && (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <FaBullseye className="text-2xl text-teal-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Meta Calórica</h4>
                          <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                            {Math.round(profileData.targetCalories)} kcal
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaCalculator className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Dados corporais não encontrados
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Use nossa calculadora de IMC para registrar seus dados corporais
                      </p>
                      <Link 
                        to="/tools" 
                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <FaCalculator className="mr-2" />
                        Calcular IMC
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Estatísticas Detalhadas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Estatísticas de Treino
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Maior sequência:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userStats.longestStreak} dias
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Tempo médio por treino:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userStats.averageWorkoutTime} min
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Exercício favorito:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userStats.favoriteExercise}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Membro desde:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(userStats.memberSince).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Nível de experiência:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userData.experience}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Última atualização:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Notificações */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaBell className="mr-2" />
                Notificações
              </h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => {
                  const labels = {
                    workoutReminders: 'Lembretes de treino',
                    progressUpdates: 'Atualizações de progresso',
                    achievements: 'Conquistas e marcos',
                    weeklyReport: 'Relatório semanal'
                  };
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{labels[key]}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacidade */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaEye className="mr-2" />
                Privacidade
              </h3>
              
              <div className="space-y-4">
                {Object.entries(settings.privacy).map(([key, value]) => {
                  const labels = {
                    profileVisible: 'Perfil visível para outros usuários',
                    statsVisible: 'Estatísticas públicas',
                    workoutsVisible: 'Treinos visíveis'
                  };
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{labels[key]}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dados */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Gerenciar Dados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaDownload />
                  <span>Exportar Dados</span>
                </button>
                
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <FaUpload />
                  <span>Importar Dados</span>
                </button>
              </div>

              {/* Botão para salvar configurações */}
              {!settings.preferences?.autoSave && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <FaSave />
                    <span>Salvar Preferências</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Alterar Senha */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaLock className="mr-2" />
                Alterar Senha
              </h3>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Confirme sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Alterar Senha
                </button>
              </div>
            </div>

            {/* Sessões Ativas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Sessões Ativas
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Sessão Atual</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Chrome no Windows • São Paulo, Brasil
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Última atividade: Agora
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Ativo
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Mobile App</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      iPhone • São Paulo, Brasil
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Última atividade: 2 horas atrás
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full hover:bg-red-200 transition-colors">
                    Encerrar
                  </button>
                </div>
              </div>
            </div>

            {/* Zona de Perigo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-6">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
                <FaTrash className="mr-2" />
                Zona de Perigo
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                    Excluir Conta
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                    Esta ação é irreversível. Todos os seus dados, incluindo treinos, estatísticas e configurações serão permanentemente excluídos.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Excluir Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

