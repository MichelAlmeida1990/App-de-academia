import React, { useState, useContext } from 'react';
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
  FaEyeSlash
} from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const ProfilePage = () => {
  const { darkMode } = useContext(ThemeContext);
  
  // Estados para edição do perfil
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Estados para dados do usuário
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    gender: 'masculino',
    height: 175,
    weight: 75,
    goal: 'Ganho de massa muscular',
    experience: 'Intermediário',
    avatar: null
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

  // Dados de estatísticas do usuário
  const userStats = {
    totalWorkouts: 127,
    totalTime: 8540, // em minutos
    totalCalories: 25680,
    currentStreak: 12,
    longestStreak: 28,
    averageWorkoutTime: 67,
    favoriteExercise: 'Supino Reto',
    memberSince: '2023-03-15'
  };

  // Função para salvar alterações do perfil
  const handleSaveProfile = () => {
    // Aqui você implementaria a lógica para salvar no backend
    console.log('Salvando perfil:', userData);
    setIsEditing(false);
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Resetar dados para o estado original se necessário
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
  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.name}</p>
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.email}</p>
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.phone}</p>
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
                        {new Date(userData.birthDate).toLocaleDateString('pt-BR')}
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
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white capitalize">{userData.gender}</p>
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
                        onChange={(e) => setUserData({ ...userData, height: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.height} cm</p>
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
                        onChange={(e) => setUserData({ ...userData, weight: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.weight} kg</p>
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
                        <option value="Perda de peso">Perda de peso</option>
                        <option value="Ganho de massa muscular">Ganho de massa muscular</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Resistência">Resistência</option>
                        <option value="Força">Força</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.goal}</p>
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

            {/* Estatísticas Detalhadas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Estatísticas Detalhadas
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
                    <span className="text-gray-600 dark:text-gray-400">IMC atual:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {(userData.weight / ((userData.height / 100) ** 2)).toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Nível de experiência:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userData.experience}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        )}<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Alterar Senha */}
            
