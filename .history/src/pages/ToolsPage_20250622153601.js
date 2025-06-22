import React, { useState } from 'react';
import {
  FaCalculator,
  FaWeight,
  FaRuler,
  FaHeartbeat,
  FaStopwatch,
  FaChartLine
} from 'react-icons/fa';
import BMICalculator from '../components/tools/BMICalculator';

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('user-profile');
    return saved ? JSON.parse(saved) : {};
  });

  const handleSaveBMI = (bmiData) => {
    const updatedUserData = {
      ...userData,
      ...bmiData,
      lastBMIUpdate: new Date().toISOString()
    };
    setUserData(updatedUserData);
    localStorage.setItem('user-profile', JSON.stringify(updatedUserData));
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <FaWeight className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Em Desenvolvimento
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Calculadora de gordura corporal será adicionada em breve.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'calories',
      name: 'Calculadora de Calorias',
      icon: <FaHeartbeat />,
      description: 'Calcule suas necessidades calóricas diárias',
      component: (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <FaHeartbeat className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Em Desenvolvimento
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Calculadora de calorias será adicionada em breve.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'rep-max',
      name: 'Calculadora 1RM',
      icon: <FaChartLine />,
      description: 'Calcule sua repetição máxima',
      component: (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <FaChartLine className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Em Desenvolvimento
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Calculadora de 1RM será adicionada em breve.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentTool = tools.find(tool => tool.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ferramentas de Fitness
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Utilize nossas calculadoras e ferramentas para acompanhar seu progresso
          </p>
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

            {/* Resumo do perfil se houver dados de IMC */}
            {userData.bmi && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Seus Dados
                </h3>
                
                <div className="space-y-3">
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
                </div>
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