import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/layout/Navbar';

const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Estados para as configurações
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: {
      workoutReminders: true,
      achievementAlerts: true,
      weeklyReports: false,
      appUpdates: true
    },
    privacy: {
      showProfileToOthers: true,
      shareWorkoutProgress: true,
      allowDataCollection: true
    },
    workout: {
      countdownTimer: 30,
      autoPlayVideos: true,
      showMetrics: true,
      units: 'metric' // metric ou imperial
    },
    accessibility: {
      highContrast: false,
      largerText: false,
      reducedMotion: false
    }
  });

  // Simula o carregamento das configurações do usuário
  useEffect(() => {
    // Em uma aplicação real, você buscaria essas configurações da API
    const loadSettings = async () => {
      // Simulação de delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Em uma aplicação real, estas configurações viriam do backend
      // Mantemos as configurações padrão para esta demonstração
    };

    loadSettings();
  }, []);

  // Função para atualizar configurações
  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  // Função para atualizar tema diretamente (não está em uma subcategoria)
  const handleThemeChange = (value) => {
    setSettings(prev => ({
      ...prev,
      theme: value
    }));
  };

  // Função para salvar todas as configurações
  const handleSaveSettings = async () => {
    try {
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Em uma aplicação real, você enviaria as configurações para o backend
      showToast('Sucesso', 'Configurações salvas com sucesso!', 'success');
      
      // Aplicar tema (em uma aplicação real, isso seria feito com um hook de tema)
      document.documentElement.className = settings.theme === 'dark' 
        ? 'dark' 
        : settings.theme === 'light' 
          ? 'light' 
          : '';
          
    } catch (error) {
      showToast('Erro', 'Não foi possível salvar as configurações.', 'error');
    }
  };

  // Função para redefinir todas as configurações
  const handleResetSettings = () => {
    if (window.confirm('Tem certeza que deseja redefinir todas as configurações para os valores padrão?')) {
      setSettings({
        theme: 'system',
        notifications: {
          workoutReminders: true,
          achievementAlerts: true,
          weeklyReports: false,
          appUpdates: true
        },
        privacy: {
          showProfileToOthers: true,
          shareWorkoutProgress: true,
          allowDataCollection: true
        },
        workout: {
          countdownTimer: 30,
          autoPlayVideos: true,
          showMetrics: true,
          units: 'metric'
        },
        accessibility: {
          highContrast: false,
          largerText: false,
          reducedMotion: false
        }
      });
      showToast('Info', 'Configurações redefinidas para os valores padrão.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Configurações</h1>
            <div className="space-x-2">
              <button 
                onClick={handleResetSettings}
                className="btn-secondary"
              >
                Redefinir
              </button>
              <button 
                onClick={handleSaveSettings}
                className="btn-primary"
              >
                Salvar alterações
              </button>
            </div>
          </div>

          {/* Seção de Aparência */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Aparência</h2>
            
            <div className="mb-4">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema
              </label>
              <select
                id="theme"
                className="form-select"
                value={settings.theme}
                onChange={(e) => handleThemeChange(e.target.value)}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema (automático)</option>
              </select>
            </div>
          </div>

          {/* Seção de Notificações */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Notificações</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="workoutReminders" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="workoutReminders" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.notifications.workoutReminders}
                      onChange={(e) => handleSettingChange('notifications', 'workoutReminders', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.notifications.workoutReminders ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Lembretes de treino
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="achievementAlerts" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="achievementAlerts" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.notifications.achievementAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'achievementAlerts', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.notifications.achievementAlerts ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Alertas de conquistas
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="weeklyReports" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="weeklyReports" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.notifications.weeklyReports ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Relatórios semanais por email
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="appUpdates" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="appUpdates" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.notifications.appUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'appUpdates', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.notifications.appUpdates ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Atualizações do aplicativo
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Seção de Privacidade */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Privacidade</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="showProfileToOthers" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="showProfileToOthers" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.privacy.showProfileToOthers}
                      onChange={(e) => handleSettingChange('privacy', 'showProfileToOthers', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.privacy.showProfileToOthers ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Mostrar perfil para outros usuários
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="shareWorkoutProgress" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="shareWorkoutProgress" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.privacy.shareWorkoutProgress}
                      onChange={(e) => handleSettingChange('privacy', 'shareWorkoutProgress', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.privacy.shareWorkoutProgress ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Compartilhar progresso de treinos
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="allowDataCollection" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="allowDataCollection" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.privacy.allowDataCollection}
                      onChange={(e) => handleSettingChange('privacy', 'allowDataCollection', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.privacy.allowDataCollection ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Permitir coleta de dados para melhorar o aplicativo
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Seção de Treinos */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Configurações de Treino</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="countdownTimer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temporizador de contagem regressiva (segundos)
                </label>
                <input
                  type="number"
                  id="countdownTimer"
                  min="5"
                  max="120"
                  className="form-input"
                  value={settings.workout.countdownTimer}
                  onChange={(e) => handleSettingChange('workout', 'countdownTimer', parseInt(e.target.value) || 30)}
                />
              </div>

              <div>
                <label htmlFor="autoPlayVideos" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="autoPlayVideos" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.workout.autoPlayVideos}
                      onChange={(e) => handleSettingChange('workout', 'autoPlayVideos', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.workout.autoPlayVideos ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Reproduzir vídeos automaticamente
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="showMetrics" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="showMetrics" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.workout.showMetrics}
                      onChange={(e) => handleSettingChange('workout', 'showMetrics', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.workout.showMetrics ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Mostrar métricas durante o treino
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="units" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unidades de medida
                </label>
                <select
                  id="units"
                  className="form-select"
                  value={settings.workout.units}
                  onChange={(e) => handleSettingChange('workout', 'units', e.target.value)}
                >
                  <option value="metric">Métrico (kg, cm)</option>
                  <option value="imperial">Imperial (lb, in)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção de Acessibilidade */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Acessibilidade</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="highContrast" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="highContrast" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.accessibility.highContrast}
                      onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.accessibility.highContrast ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Alto contraste
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="largerText" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="largerText" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.accessibility.largerText}
                      onChange={(e) => handleSettingChange('accessibility', 'largerText', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.accessibility.largerText ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Texto maior
                  </div>
                </label>
              </div>

              <div>
                <label htmlFor="reducedMotion" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="reducedMotion" 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.accessibility.reducedMotion}
                      onChange={(e) => handleSettingChange('accessibility', 'reducedMotion', e.target.checked)}
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.accessibility.reducedMotion ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    Reduzir movimento
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Botões de ação no final da página */}
          <div className="flex justify-between items-center mt-8">
            <button 
              className="btn-danger"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
                  showToast('Info', 'Esta funcionalidade seria implementada em um app real.', 'info');
                }
              }}
            >
              Excluir minha conta
            </button>
            
            <div className="space-x-2">
              <button 
                onClick={handleResetSettings}
                className="btn-secondary"
              >
                Redefinir
              </button>
              <button 
                onClick={handleSaveSettings}
                className="btn-primary"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
