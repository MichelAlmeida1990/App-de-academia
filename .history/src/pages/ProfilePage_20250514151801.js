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

  useEffect(() => {
    // Carregar estatísticas do usuário
    const workoutStats = getWorkoutStats();
    setStats({
      totalWorkouts: workoutStats.totalWorkouts,
      completedWorkouts: workoutStats.completedWorkouts,
      streak: calculateCurrentStreak(),
      averageRating: 4.2 // Valor fictício, poderia vir de uma API real
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
  }, [user?.avatar]);

  // Efeito para carregar dados de progresso quando o exercício selecionado mudar
  useEffect(() => {
    if (selectedExercise) {
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
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1
            }
          ]
        };
        
        setProgressData(chartData);
      } else {
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
    fileInputRef.current.click();
  };

  // Função para processar a imagem selecionada
  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Progresso de ${selectedExercise}`
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Perfil</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Foto de perfil" 
                      className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer"
                      onClick={handlePhotoClick}
                    />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 cursor-pointer"
                      onClick={handlePhotoClick}
                    >
                      <span className="text-2xl text-gray-600">{user?.name?.charAt(0) || '?'}</span>
                    </div>
                  )}
                  
                  <div 
                    className="absolute bottom-3 right-0 bg-primary text-white rounded-full p-1 cursor-pointer shadow-md"
                    onClick={handlePhotoClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Input de arquivo oculto */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <h2 className="text-xl font-semibold">{user?.name || 'Usuário'}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email || 'email@exemplo.com'}</p>
                
                <button className="btn-secondary mt-4" disabled={isUploading}>
                  {isUploading ? 'Processando...' : 'Editar perfil'}
                </button>
              </div>
            </div>
            
            <div className="card col-span-2">
              <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total de treinos</p>
                  <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Treinos concluídos</p>
                  <p className="text-2xl font-bold">{getCompletedCount()}</p>
                  <p className="text-sm text-gray-500">{getCompletionRate()}% de conclusão</p>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sequência atual</p>
                  <p className="text-2xl font-bold">{stats.streak} dias</p>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recordes pessoais</p>
                  <p className="text-2xl font-bold">{Object.keys(personalRecords).length}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nova seção: Progresso de Exercícios */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4">Histórico de Progressão</h3>
            
            <div className="mb-4">
              <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecione um exercício
              </label>
              <select 
                id="exercise-select" 
                className="form-select"
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <Line options={chartOptions} data={progressData} height={200} />
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Nenhum dado disponível para este exercício.
                </p>
              )}
            </div>
            
            {personalRecords[selectedExercise] && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div
