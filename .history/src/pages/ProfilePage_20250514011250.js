import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/layout/Navbar';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth(); // Removido 'loading' que não estava sendo usado
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Renomeado para 'isUploading' para melhor semântica
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    streak: 0,
    averageRating: 0
  });

  useEffect(() => {
    // Em uma aplicação real, você buscaria esses dados de uma API
    // Simulando dados do usuário
    const fetchUserStats = async () => {
      // Simulação de busca de dados
      setTimeout(() => {
        setStats({
          totalWorkouts: 42,
          completedWorkouts: 38,
          streak: 7,
          averageRating: 4.2
        });
      }, 500);
    };

    fetchUserStats();
    
    // Se o usuário já tem uma foto, use-a como preview
    if (user?.avatar) {
      setPreviewImage(user.avatar);
    }
  }, [user?.avatar]);

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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avaliação média</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">{stats.averageRating}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-4 h-4 ${star <= Math.round(stats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Preferências</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="notification" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input id="notification" type="checkbox" className="sr-only" defaultChecked />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Notificações de treino
                  </div>
                </label>
              </div>
              
              <div>
                <label htmlFor="weekly-summary" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input id="weekly-summary" type="checkbox" className="sr-only" />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Resumo semanal por email
                  </div>
                </label>
              </div>
              
              <div className="mt-6">
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tema
                </label>
                <select 
                  id="theme" 
                  className="form-select"
                  defaultValue="system"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn-primary">Salvar preferências</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
