import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWorkout } from '../hooks/useWorkout';
import Navbar from '../components/layout/Navbar';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const { 
    getWorkoutStats, 
    personalRecords, 
    getExerciseProgressHistory, 
    getAllExercises, 
    getUnlockedAchievements,
    calculateCurrentStreak
  } = useWorkout();
  
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    streak: 0,
    averageRating: 0
  });
  const [achievementsList, setAchievementsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mapeamento de chaves de conquistas para descrições amigáveis
  const achievementDescriptions = {
    firstWorkout: "Primeiro Treino",
    tenWorkouts: "10 Treinos Concluídos",
    twentyFiveWorkouts: "25 Treinos Concluídos",
    fiftyWorkouts: "50 Treinos Concluídos",
    hundredWorkouts: "100 Treinos Concluídos",
    firstRecord: "Primeiro Recorde Pessoal",
    fiveRecords: "5 Recordes Pessoais",
    tenRecords: "10 Recordes Pessoais",
    threeConsecutiveDays: "3 Dias Consecutivos",
    sevenConsecutiveDays: "7 Dias Consecutivos",
    fourteenConsecutiveDays: "14 Dias Consecutivos",
    thirtyConsecutiveDays: "30 Dias Consecutivos"
  };

  // Ícones para diferentes tipos de conquistas
  const getAchievementIcon = (key) => {
    if (key.includes('Workout')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      );
    }
    if (key.includes('Record')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    if (key.includes('Days')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar estatísticas do usuário
        const workoutStats = getWorkoutStats();
        setStats({
          totalWorkouts: workoutStats.totalWorkouts,
          completedWorkouts: workoutStats.completedWorkouts,
          streak: calculateCurrentStreak(),
          averageRating: 4.2
        });
        
        // Carregar conquistas desbloqueadas
        const unlockedAchievements = getUnlockedAchievements();
        setAchievementsList(unlockedAchievements.map(key => ({
          key,
          description: achievementDescriptions[key] || key
        })));
        
        // Se o usuário já tem uma foto, use-a como preview
        if (user?.avatar) {
          setPreviewImage(user.avatar);
        }
        
        // Carregar lista de exercícios
        const exercises = getAllExercises();
        if (exercises.length > 0) {
          setSelectedExercise(exercises[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro', 'Não foi possível carregar os dados do perfil.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.avatar]);

  // Efeito para carregar dados de progresso quando o exercício selecionado mudar
  useEffect(() => {
    if (selectedExercise) {
      try {
        const history = getExerciseProgressHistory(selectedExercise);
        
        if (history.length > 0) {
          const chartData = {
            labels: history.map(entry => {
              const date = new Date(entry.date);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }),
            datasets: [
              {
                label: 'Peso (kg)',
                data: history.map(entry => entry.weight),
                borderColor: 'rgb(147, 51, 234)', // purple-600
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                tension: 0.1,
                fill: true
              }
            ]
          };
          
          setProgressData(chartData);
        } else {
          setProgressData(null);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setProgressData(null);
      }
    }
  }, [selectedExercise]);

  // Função para calcular a porcentagem de treinos concluídos
  const getCompletionRate = () => {
    if (stats.totalWorkouts === 0) return 0;
    return Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100);
  };

  // Função para obter o número de treinos concluídos
  const getCompletedCount = () => {
    return stats.completedWorkouts;
  };

  // Função para abrir o seletor de arquivo
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Função para processar a imagem selecionada
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar o tipo e tamanho do arquivo
    if (!file.type.match('image.*')) {
      showToast('Erro', 'Por favor, selecione uma imagem válida.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('Erro', 'A imagem deve ter menos de 5MB.', 'error');
      return;
    }

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreview = e.target.result;
      setPreviewImage(imagePreview);
      
      // Só fazer upload depois que o preview estiver definido
      handleUploadPhoto(file, imagePreview);
    };
    reader.readAsDataURL(file);
  };

  // Função para fazer upload da foto
  const handleUploadPhoto = async (file, imagePreview) => {
    setIsUploading(true);
    try {
      // Simulação de upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um app real, você enviaria o arquivo para o servidor e receberia a URL
      await updateProfile({ 
        ...user, 
        avatar: imagePreview || URL.createObjectURL(file) 
      });
      
      showToast('Sucesso', 'Foto de perfil atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      showToast('Erro', 'Não foi possível atualizar sua foto de perfil.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Opções para o gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(107, 114, 128)' // gray-500
        }
      },
      title: {
        display: true,
        text: `Progresso de ${selectedExercise}`,
        color: 'rgb(107, 114, 128)'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      },
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Meu Perfil</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Foto de perfil" 
                      className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer transition-opacity group-hover:opacity-75"
                      onClick={handlePhotoClick}
                    />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 cursor-pointer transition-transform group-hover:scale-105"
                      onClick={handlePhotoClick}
                    >
                      <span className="text-2xl text-white font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className="absolute bottom-3 right-0 bg-purple-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-purple-700 transition-colors"
                    onClick={handlePhotoClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                
                {/* Input de arquivo oculto */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'Usuário'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {user?.email || 'email@exemplo.com'}
                </p>
                
                <button 
                  className="btn-secondary" 
                  disabled={isUploading}
                >
                  {isUploading ? 'Processando...' : 'Editar perfil'}
                </button>
              </div>
            </div>
            
            <div className="card col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Estatísticas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de treinos</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalWorkouts}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Treinos concluídos</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{getCompletedCount()}</p>
                  <p className="text-sm text-green-500 dark:text-green-400">{getCompletionRate()}% de conclusão</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Sequência atual</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.streak} dias</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Recordes pessoais</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Object.keys(personalRecords).length}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seção: Progresso de Exercícios */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Histórico de Progressão
            </h3>
            
            <div className="mb-4">
              <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecione um exercício
              </label>
              <select 
                id="exercise-select" 
                className="form-select w-full md:w-auto"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                {getAllExercises().map((exercise) => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-4">
              {progressData ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div style={{ height: '300px' }}>
                    <Line options={chartOptions} data={progressData} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Nenhum dado disponível para este exercício.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Complete alguns treinos para ver seu progresso aqui.
                  </p>
                </div>
              )}
            </div>
            
            {personalRecords[selectedExercise] && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Seu recorde pessoal: {personalRecords[selectedExercise]} kg
                    </span>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Continue treinando para superar este marco!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Seção: Conquistas */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Conquistas
            </h3>
            
            {achievementsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {achievementsList.map((achievement) => (
                  <div 
                    key={achievement.key} 
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-transform hover:scale-105"
                  >
                    <div className="bg-blue-500 text-white p-3 rounded-full mr-4 flex-shrink-0">
                      {getAchievementIcon(achievement.key)}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        {achievement.description}
                      </span>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Conquista desbloqueada!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 mb-6">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Você ainda não desbloqueou nenhuma conquista.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Continue treinando para desbloquear suas primeiras conquistas!
                </p>
              </div>
            )}
            
            {/* Conquistas bloqueadas */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                Próximas conquistas
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(achievementDescriptions)
                  .filter(([key]) => !getUnlockedAchievements().includes(key))
                  .slice(0, 4)
                  .map(([key, description]) => (
                    <div 
                      key={key} 
                      className="flex items-center p-4 bg-gray-50 
