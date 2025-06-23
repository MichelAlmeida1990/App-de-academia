import React, { useState, useEffect } from 'react';
import {
  FaDumbbell,
  FaCalculator,
  FaInfoCircle,
  FaSave,
  FaHistory
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import UserDataService from '../../services/UserDataService';

const OneRMCalculator = ({ onSave, savedData }) => {
  const { currentUser } = useAuth();
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [exercise, setExercise] = useState('Supino');
  const [formula, setFormula] = useState('brzycki');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Carregar histórico usando UserDataService (que já tem isolamento correto)
  useEffect(() => {
    if (currentUser?.uid) {
      const oneRMHistory = UserDataService.getOneRMHistory();
      setHistory(oneRMHistory);
    }
  }, [currentUser]);

  // Fórmulas de 1RM
  const calculateOneRM = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    
    if (!w || !r || r < 1 || r > 20) return null;

    let oneRM;
    
    switch (formula) {
      case 'brzycki':
        oneRM = w * (36 / (37 - r));
        break;
      case 'epley':
        oneRM = w * (1 + r / 30);
        break;
      case 'lander':
        oneRM = w / (1.013 - 0.0267123 * r);
        break;
      case 'lombardi':
        oneRM = w * Math.pow(r, 0.10);
        break;
      default:
        oneRM = w * (36 / (37 - r)); // Brzycki como padrão
    }

    return oneRM;
  };

  const handleCalculate = () => {
    const oneRM = calculateOneRM();
    if (!oneRM) return;

    const newResult = {
      exercise,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      oneRM: oneRM.toFixed(1),
      formula,
      date: new Date().toISOString()
    };

    setResult(newResult);

    // Salvar usando UserDataService (que já tem isolamento correto)
    if (currentUser?.uid) {
      const savedData = UserDataService.saveOneRMData(newResult);
      const updatedHistory = UserDataService.getOneRMHistory();
      setHistory(updatedHistory);
      
      // Callback para salvar no perfil
      if (onSave) {
        onSave(savedData);
      }
    }
  };

  const getFormulaInfo = () => {
    switch (formula) {
      case 'brzycki':
        return 'Brzycki: Mais precisa para 2-10 repetições';
      case 'epley':
        return 'Epley: Boa para 1-10 repetições';
      case 'lander':
        return 'Lander: Precisa para 2-10 repetições';
      case 'lombardi':
        return 'Lombardi: Para qualquer número de repetições';
      default:
        return '';
    }
  };

  const exercises = [
    'Supino', 'Agachamento', 'Levantamento Terra', 'Desenvolvimento',
    'Rosca Direta', 'Tríceps Francês', 'Remada', 'Leg Press'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <FaDumbbell className="text-2xl text-green-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calculadora 1RM
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exercício
            </label>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {exercises.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 80"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repetições
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Ex: 8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fórmula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="brzycki">Brzycki</option>
              <option value="epley">Epley</option>
              <option value="lander">Lander</option>
              <option value="lombardi">Lombardi</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <FaInfoCircle className="inline mr-1" />
              {getFormulaInfo()}
            </p>
          </div>

          <button
            onClick={handleCalculate}
            disabled={!weight || !reps}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <FaCalculator className="mr-2" />
            Calcular 1RM
          </button>
        </div>

        <div className="space-y-4">
          {result && (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {result.exercise}
              </h3>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {result.oneRM} kg
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                1RM estimado ({result.formula})
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaHistory className="mr-2" />
                Histórico
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(0, 10).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {entry.exercise}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.weight}kg × {entry.reps} reps
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {entry.oneRM}kg
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-2">Sobre o 1RM:</p>
            <ul className="space-y-1 text-xs">
              <li><strong>1RM:</strong> Uma Repetição Máxima - o maior peso que você consegue levantar uma vez</li>
              <li><strong>Uso:</strong> Para planejar cargas de treino (70-85% do 1RM para hipertrofia)</li>
              <li><strong>Precisão:</strong> Melhor entre 2-10 repetições, menos preciso acima de 15 reps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneRMCalculator; 