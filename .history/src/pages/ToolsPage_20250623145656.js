import React, { useState, useEffect } from 'react';
import {
  FaCalculator,
  FaWeight,
  FaRuler,
  FaHeartbeat,
  FaStopwatch,
  FaChartLine,
  FaFire,
  FaDumbbell,
  FaUser,
  FaDownload
} from 'react-icons/fa';
import BMICalculator from '../components/tools/BMICalculator';
import BodyFatCalculator from '../components/tools/BodyFatCalculator';
import CalorieCalculator from '../components/tools/CalorieCalculator';
import OneRMCalculator from '../components/tools/OneRMCalculator';
import UserDataService from '../services/UserDataService';
import { useAuth } from '../context/AuthContext';

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [userData, setUserData] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    // Migrar dados antigos se existirem
    UserDataService.migrateOldData();
    
    // Carregar dados do usuário atual
    const profileData = UserDataService.getUserProfile();
    setUserData(profileData);
  }, [currentUser]);

  const handleSaveBMI = (bmiData) => {
    try {
      const savedData = UserDataService.saveBMIData(bmiData);
      setUserData(prev => ({ ...prev, ...savedData }));
    } catch (error) {
      console.error('Erro ao salvar dados de IMC:', error);
    }
  };

  const handleSaveBodyFat = (bodyFatData) => {
    try {
      const savedData = UserDataService.saveBodyFatData(bodyFatData);
      setUserData(prev => ({ ...prev, ...savedData }));
    } catch (error) {
      console.error('Erro ao salvar dados de gordura corporal:', error);
    }
  };

  const handleSaveCalories = (calorieData) => {
    try {
      const savedData = UserDataService.saveCalorieData(calorieData);
      setUserData(prev => ({ ...prev, ...savedData }));
    } catch (error) {
      console.error('Erro ao salvar dados de calorias:', error);
    }
  };

  const handleSaveOneRM = (oneRMData) => {
    try {
      const savedData = UserDataService.saveOneRMData(oneRMData);
      setUserData(prev => ({ ...prev, ...savedData }));
    } catch (error) {
      console.error('Erro ao salvar dados de 1RM:', error);
    }
  };

  const handleExportData = () => {
    try {
      // Importar a função de exportação PDF dinamicamente
      import('../utils/pdfExport').then(({ exportToolsDataToPDF }) => {
        exportToolsDataToPDF(userData, currentUser);
      }).catch(error => {
        console.error('Erro ao carregar módulo PDF:', error);
        // Fallback para JSON se houver erro
        const exportData = UserDataService.exportUserData();
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `fitness_data_${currentUser?.email || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const tools = [
    {
      id: 'bmi',
      name: 'Calculadora de IMC',
      icon: <FaCalculator />,
      description: 'Calcule seu Índice de Massa Corporal',
      component: (
        <BMICalculator 
          onSave={handleSaveBMI}
          savedData={userData}
        />
      )
    },
    {
      id: 'body-fat',
      name: 'Calculadora de Gordura Corporal',
      icon: <FaWeight />,
      description: 'Estime seu percentual de gordura corporal',
      component: (
        <BodyFatCalculator 
          onSave={handleSaveBodyFat}
          savedData={userData}
        />
      )
    },
    {
      id: 'calories',
      name: 'Calculadora de Calorias',
      icon: <FaFire />,
      description: 'Calcule suas necessidades calóricas diárias',
      component: (
        <CalorieCalculator 
          onSave={handleSaveCalories}
          savedData={userData}
        />
      )
    },
    {
      id: 'rep-max',
      name: 'Calculadora 1RM',
      icon: <FaDumbbell />,
      description: 'Calcule sua repetição máxima',
      component: (
        <OneRMCalculator 
          onSave={handleSaveOneRM}
          savedData={userData}
        />
      )
    }
  ];

  const currentTool = tools.find(tool => tool.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ferramentas de Fitness
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Utilize nossas calculadoras e ferramentas para acompanhar seu progresso
            </p>
            {currentUser && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                <FaUser className="inline mr-1" />
                Logado como: {currentUser.displayName || currentUser.email}
              </p>
            )}
          </div>
          
          {/* Botão de exportar dados */}
          {Object.keys(userData).length > 0 && (
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaDownload />
              <span>Exportar Relatório PDF</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com lista de ferramentas */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ferramentas Disponíveis
              </h2>
              
              <div className="space-y-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === tool.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {tool.icon}
                      </div>
                      <div>
                        <div className="font-medium">
                          {tool.name}
                        </div>
                        <div className="text-xs opacity-75">
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo do perfil se houver dados */}
            {(userData.bmi || userData.bodyFat || userData.tdee) && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Seus Dados
                </h3>
                
                <div className="space-y-3">
                  {userData.height && userData.weight && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Altura:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {userData.height} cm
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Peso:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {userData.weight} kg
                        </span>
                      </div>
                    </>
                  )}
                  
                  {userData.bmi && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">IMC:</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          {userData.bmi.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Categoria:</span>
                        <span className="font-medium text-gray-900 dark:text-white text-xs">
                          {userData.category}
                        </span>
                      </div>
                    </>
                  )}

                  {userData.bodyFat && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gordura:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {userData.bodyFat.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {userData.tdee && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">TDEE:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {Math.round(userData.tdee)} kcal
                      </span>
                    </div>
                  )}
                </div>

                {userData.lastUpdated && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Última atualização: {new Date(userData.lastUpdated).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3">
            {currentTool && currentTool.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage; 