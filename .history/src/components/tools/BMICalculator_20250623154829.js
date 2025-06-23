import React, { useState, useEffect } from 'react';
import {
  FaWeight,
  FaRuler,
  FaCalculator,
  FaInfoCircle,
  FaSave,
  FaHistory
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const BMICalculator = ({ onSave, savedData }) => {
  const { currentUser } = useAuth();
  const [height, setHeight] = useState(savedData?.height || '');
  const [weight, setWeight] = useState(savedData?.weight || '');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [history, setHistory] = useState([]);

  // Carregar histórico do localStorage com isolamento por usuário
  useEffect(() => {
    if (currentUser?.uid) {
      const savedHistory = localStorage.getItem(`bmi-history-${currentUser.uid}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [currentUser]);

  // Calcular IMC
  const calculateBMI = () => {
    if (height && weight && height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBMI);
      
      // Determinar categoria
      let cat = '';
      let color = '';
      
      if (calculatedBMI < 18.5) {
        cat = 'Abaixo do peso';
        color = 'text-blue-600';
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        cat = 'Peso normal';
        color = 'text-green-600';
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        cat = 'Sobrepeso';
        color = 'text-yellow-600';
      } else if (calculatedBMI >= 30 && calculatedBMI < 35) {
        cat = 'Obesidade grau I';
        color = 'text-orange-600';
      } else if (calculatedBMI >= 35 && calculatedBMI < 40) {
        cat = 'Obesidade grau II';
        color = 'text-red-600';
      } else {
        cat = 'Obesidade grau III';
        color = 'text-red-800';
      }
      
      setCategory(cat);
      setCategoryColor(color);
      
      return { bmi: calculatedBMI, category: cat };
    }
    return null;
  };

  // Salvar no histórico
  const saveToHistory = () => {
    const result = calculateBMI();
    if (result) {
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: result.bmi,
        category: result.category
      };
      
      const updatedHistory = [newEntry, ...history].slice(0, 10); // Manter apenas os 10 mais recentes
      setHistory(updatedHistory);
      localStorage.setItem('bmi-history', JSON.stringify(updatedHistory));
      
      // Callback para salvar no perfil do usuário
      if (onSave) {
        onSave({
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: result.bmi,
          category: result.category
        });
      }
    }
  };

  // Auto-calcular quando altura ou peso mudam
  useEffect(() => {
    calculateBMI();
  }, [height, weight]);

  const getBMIColor = (bmiValue) => {
    if (bmiValue < 18.5) return 'bg-blue-500';
    if (bmiValue < 25) return 'bg-green-500';
    if (bmiValue < 30) return 'bg-yellow-500';
    if (bmiValue < 35) return 'bg-orange-500';
    if (bmiValue < 40) return 'bg-red-500';
    return 'bg-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Calculadora Principal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <FaCalculator className="text-2xl text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calculadora de IMC
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaRuler className="inline mr-2" />
                Altura (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 175"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaWeight className="inline mr-2" />
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 70.5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
              />
            </div>

            <button
              onClick={saveToHistory}
              disabled={!bmi}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              Salvar Resultado
            </button>
          </div>

          {/* Resultado */}
          <div className="space-y-4">
            {bmi && (
              <>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Seu IMC
                  </h3>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {bmi.toFixed(1)}
                  </div>
                  <div className={`text-lg font-medium ${categoryColor}`}>
                    {category}
                  </div>
                </div>

                {/* Escala Visual */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Escala IMC:
                  </h4>
                  <div className="relative">
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div className="bg-blue-500 flex-1"></div>
                      <div className="bg-green-500 flex-1"></div>
                      <div className="bg-yellow-500 flex-1"></div>
                      <div className="bg-orange-500 flex-1"></div>
                      <div className="bg-red-500 flex-1"></div>
                      <div className="bg-red-800 flex-1"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>35</span>
                      <span>40</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Informações sobre IMC */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-2">Sobre o IMC:</p>
              <ul className="space-y-1 text-xs">
                <li><strong>Abaixo de 18,5:</strong> Abaixo do peso</li>
                <li><strong>18,5 - 24,9:</strong> Peso normal</li>
                <li><strong>25,0 - 29,9:</strong> Sobrepeso</li>
                <li><strong>30,0 - 34,9:</strong> Obesidade grau I</li>
                <li><strong>35,0 - 39,9:</strong> Obesidade grau II</li>
                <li><strong>Acima de 40:</strong> Obesidade grau III</li>
              </ul>
              <p className="mt-2 text-xs italic">
                * O IMC é uma medida geral. Consulte um profissional de saúde para avaliação completa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <FaHistory className="text-xl text-purple-500 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Histórico de IMC
            </h3>
          </div>

          <div className="space-y-3">
            {history.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getBMIColor(entry.bmi)}`}></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      IMC: {entry.bmi.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.height}cm • {entry.weight}kg
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.category}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(entry.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator; 