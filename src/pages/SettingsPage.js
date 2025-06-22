import React from 'react';
import { FaCog, FaImage, FaEyeSlash, FaPalette, FaClock, FaBook, FaIcons, FaTh, FaBorderAll, FaTags } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/layout/Navbar';
import ExerciseVisual from '../components/exercises/ExerciseVisual';

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const handleToggleSetting = (settingKey) => {
    const newValue = !settings[settingKey];
    updateSettings({ [settingKey]: newValue });
    
    if (settingKey === 'showExerciseImages') {
      showToast(
        'Sucesso',
        newValue ? 'Imagens dos exercícios ativadas' : 'Imagens dos exercícios desativadas',
        'success'
      );
    }
  };

  const handleDisplayModeChange = (mode) => {
    updateSettings({ exerciseDisplayMode: mode });
    showToast(
      'Sucesso',
      `Modo de exibição alterado para ${getDisplayModeName(mode)}`,
      'success'
    );
  };

  const getDisplayModeName = (mode) => {
    const names = {
      'images': 'Imagens',
      'icons': 'Ícones',
      'gradients': 'Gradientes',
      'minimal': 'Minimalista',
      'badges': 'Badges'
    };
    return names[mode] || mode;
  };

  const SettingItem = ({ icon, title, description, settingKey, onToggle }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {description}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggle(settingKey)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings[settingKey]
              ? 'bg-purple-600'
              : 'bg-gray-200 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings[settingKey] ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalize sua experiência no app de academia
          </p>
        </div>

        <div className="space-y-6">
          {/* Seção de Exercícios */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaCog className="mr-2 text-purple-600" />
              Exercícios
            </h2>
            <div className="space-y-4">
              <SettingItem
                icon={<FaImage className="text-purple-600" />}
                title="Mostrar Imagens dos Exercícios"
                description="Exibe imagens demonstrativas dos exercícios. Desative se as imagens estiverem incorretas ou para economizar dados."
                settingKey="showExerciseImages"
                onToggle={handleToggleSetting}
              />

              {/* Selector de modo de exibição */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FaPalette className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Estilo Visual dos Exercícios
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Escolha como os exercícios serão exibidos visualmente. Perfeito para quando as imagens estão incorretas!
                    </p>
                  </div>
                </div>

                {/* Opções de modo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { 
                      mode: 'images', 
                      icon: FaImage, 
                      title: 'Imagens', 
                      description: 'Fotos reais dos exercícios' 
                    },
                    { 
                      mode: 'icons', 
                      icon: FaIcons, 
                      title: 'Ícones Coloridos', 
                      description: 'Ícones por grupo muscular' 
                    },
                    { 
                      mode: 'gradients', 
                      icon: FaTh, 
                      title: 'Gradientes', 
                      description: 'Fundos coloridos com ícones' 
                    },
                    { 
                      mode: 'minimal', 
                      icon: FaBorderAll, 
                      title: 'Minimalista', 
                      description: 'Design limpo e simples' 
                    },
                    { 
                      mode: 'badges', 
                      icon: FaTags, 
                      title: 'Badges', 
                      description: 'Etiquetas por tipo de exercício' 
                    }
                  ].map(({ mode, icon: Icon, title, description }) => (
                    <button
                      key={mode}
                      onClick={() => handleDisplayModeChange(mode)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        settings.exerciseDisplayMode === mode
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className={`mr-2 ${
                          settings.exerciseDisplayMode === mode ? 'text-purple-600' : 'text-gray-500'
                        }`} />
                        <span className={`font-medium text-sm ${
                          settings.exerciseDisplayMode === mode 
                            ? 'text-purple-700 dark:text-purple-300' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Preview */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preview - {getDisplayModeName(settings.exerciseDisplayMode)}:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Supino Reto', 'Agachamento', 'Remada Curvada', 'Rosca Direta'].map((exerciseName) => (
                      <div key={exerciseName} className="h-24">
                        <ExerciseVisual exercise={exerciseName} className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <SettingItem
                icon={<FaBook className="text-purple-600" />}
                title="Mostrar Instruções"
                description="Exibe instruções detalhadas sobre como executar os exercícios."
                settingKey="showExerciseInstructions"
                onToggle={handleToggleSetting}
              />
            </div>
          </div>

          {/* Seção de Interface */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaPalette className="mr-2 text-purple-600" />
              Interface
            </h2>
            <div className="space-y-4">
              <SettingItem
                icon={<FaClock className="text-purple-600" />}
                title="Iniciar Timer Automaticamente"
                description="Inicia automaticamente o cronômetro de descanso após completar uma série."
                settingKey="autoStartTimer"
                onToggle={handleToggleSetting}
              />
            </div>
          </div>

          {/* Informações sobre as configurações */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <FaEyeSlash className="text-blue-600 dark:text-blue-400 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Sobre as Imagens dos Exercícios
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Se você está vendo imagens incorretas para os exercícios (por exemplo, imagens de ombros em exercícios de pernas), 
                  desative a opção "Mostrar Imagens dos Exercícios". Todas as informações dos treinos (nome, séries, repetições) 
                  continuarão sendo exibidas normalmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
