import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
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
  }, []);

  // Função para calcular a porcentagem de treinos concluídos
  const getCompletionRate = () => {
    if (stats.totalWorkouts === 0) return 0;
    return Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100);
  };

  // Função para obter o número de treinos concluídos
  const getCompletedCount = () => {
    return stats.completedWorkouts;
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
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Foto de perfil" 
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                    <span className="text-2xl text-gray-600">{user?.name?.charAt(0) || '?'}</span>
                  </div>
                )}
                <h2 className="text-xl font-semibold">{user?.name || 'Usuário'}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email || 'email@exemplo.com'}</p>
                
                <button className="btn-secondary mt-4">Editar perfil</button>
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
