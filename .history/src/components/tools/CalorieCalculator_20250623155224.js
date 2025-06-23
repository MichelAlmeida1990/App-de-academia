import React, { useState, useEffect } from 'react';
import {
  FaFire,
  FaCalculator,
  FaInfoCircle,
  FaSave,
  FaHistory,
  FaVenus,
  FaMars,
  FaRunning,
  FaBed,
  FaUtensils
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const CalorieCalculator = ({ onSave, savedData }) => {
  const { currentUser } = useAuth();
  const [formula, setFormula] = useState('mifflin'); // mifflin, harris, katch
  const [gender, setGender] = useState(savedData?.gender || 'male');
  const [age, setAge] = useState(savedData?.age || '');
  const [height, setHeight] = useState(savedData?.height || '');
  const [weight, setWeight] = useState(savedData?.weight || '');
  const [bodyFat, setBodyFat] = useState(savedData?.bodyFat || ''); // para Katch-McArdle
  const [activityLevel, setActivityLevel] = useState('1.375'); // fator de atividade
  const [goal, setGoal] = useState('maintain'); // lose, maintain, gain

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
      const savedHistory = localStorage.getItem(`calorie-history-${currentUser.uid}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [currentUser]);

  // Fórmula Mifflin-St Jeor (mais precisa)
  const calculateMifflin = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender === 'male') {
      return (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      return (10 * w) + (6.25 * h) - (5 * a) - 161;
    }
  };

  // Fórmula Harris-Benedict (revisada)
  const calculateHarris = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender === 'male') {
      return 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      return 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }
  };

  // Fórmula Katch-McArdle (usa % de gordura corporal)
  const calculateKatch = () => {
    const w = parseFloat(weight);
    const bf = parseFloat(bodyFat);
    const leanMass = w * (1 - bf / 100);
    
    return 370 + (21.6 * leanMass);
  };

  const calculateCalories = () => {
    if (!weight || !height || !age) return;
    if (formula === 'katch' && !bodyFat) return;

    let bmr;
    switch (formula) {
      case 'mifflin':
        bmr = calculateMifflin();
        break;
      case 'harris':
        bmr = calculateHarris();
        break;
      case 'katch':
        bmr = calculateKatch();
        break;
      default:
        return;
    }

    const tdee = bmr * parseFloat(activityLevel);
    
    // Calorias baseadas no objetivo
    let targetCalories;
    let deficit = 0;
    let surplus = 0;

    switch (goal) {
      case 'lose':
        deficit = 500; // 0.5kg por semana
        targetCalories = tdee - deficit;
        break;
      case 'maintain':
        targetCalories = tdee;
        break;
      case 'gain':
        surplus = 300; // ganho controlado
        targetCalories = tdee + surplus;
        break;
      default:
        targetCalories = tdee;
    }

    // Distribuição de macronutrientes (exemplo padrão)
    const protein = Math.round((targetCalories * 0.25) / 4); // 25% proteína
    const carbs = Math.round((targetCalories * 0.45) / 4); // 45% carboidratos
    const fat = Math.round((targetCalories * 0.30) / 9); // 30% gorduras

    const newResult = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      deficit,
      surplus,
      macros: { protein, carbs, fat },
      formula,
      goal,
      activityLevel: parseFloat(activityLevel),
      date: new Date().toISOString()
    };

    setResult(newResult);

    // Salvar no histórico
    const newHistory = [newResult, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('calorie-history', JSON.stringify(newHistory));

    // Callback para salvar no perfil
    if (onSave) {
      onSave({
        bmr: newResult.bmr,
        tdee: newResult.tdee,
        targetCalories: newResult.targetCalories,
        goal,
        macros: newResult.macros
      });
    }
  };

  const getActivityLevelLabel = (level) => {
    const levels = {
      '1.2': 'Sedentário (sem exercício)',
      '1.375': 'Levemente ativo (1-3x/semana)',
      '1.55': 'Moderadamente ativo (3-5x/semana)',
      '1.725': 'Muito ativo (6-7x/semana)',
      '1.9': 'Extremamente ativo (2x/dia)'
    };
    return levels[level] || '';
  };

  const getGoalLabel = (goalType) => {
    const goals = {
      'lose': 'Perder peso (-0.5kg/semana)',
      'maintain': 'Manter peso atual',
      'gain': 'Ganhar peso (+0.3kg/semana)'
    };
    return goals[goalType] || '';
  };

  const getFormulaInfo = () => {
    switch (formula) {
      case 'mifflin':
        return 'Mifflin-St Jeor: Mais precisa para a maioria das pessoas. Não considera composição corporal.';
      case 'harris':
        return 'Harris-Benedict: Fórmula clássica, pode superestimar em pessoas com sobrepeso.';
      case 'katch':
        return 'Katch-McArdle: Mais precisa para atletas. Requer % de gordura corporal.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <FaFire className="text-2xl text-red-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calculadora de Calorias
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Fórmula de Cálculo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fórmula de Cálculo
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="mifflin">Mifflin-St Jeor (Recomendada)</option>
              <option value="harris">Harris-Benedict</option>
              <option value="katch">Katch-McArdle (Atletas)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <FaInfoCircle className="inline mr-1" />
              {getFormulaInfo()}
            </p>
          </div>

          {/* Dados Básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sexo
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  <FaMars className="text-blue-500 mr-1" />
                  Masculino
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  <FaVenus className="text-pink-500 mr-1" />
                  Feminino
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idade (anos)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 25"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 175"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 70"
              />
            </div>
          </div>

          {formula === 'katch' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gordura Corporal (%)
              </label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 15"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use nossa calculadora de gordura corporal se não souber
              </p>
            </div>
          )}

          {/* Nível de Atividade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nível de Atividade Física
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="1.2">Sedentário (sem exercício)</option>
              <option value="1.375">Levemente ativo (1-3x/semana)</option>
              <option value="1.55">Moderadamente ativo (3-5x/semana)</option>
              <option value="1.725">Muito ativo (6-7x/semana)</option>
              <option value="1.9">Extremamente ativo (2x/dia)</option>
            </select>
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Objetivo
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="lose">Perder peso (-0.5kg/semana)</option>
              <option value="maintain">Manter peso atual</option>
              <option value="gain">Ganhar peso (+0.3kg/semana)</option>
            </select>
          </div>

          <button
            onClick={calculateCalories}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <FaCalculator className="mr-2" />
            Calcular Calorias
          </button>
        </div>

        <div className="space-y-6">
          {/* Resultado */}
          {result && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resultado
              </h3>
              
              <div className="space-y-4">
                {/* TMB */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="flex items-center">
                    <FaBed className="text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      TMB (Taxa Metabólica Basal)
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {result.bmr} cal
                  </span>
                </div>

                {/* TDEE */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="flex items-center">
                    <FaRunning className="text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      TDEE (Gasto Total Diário)
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {result.tdee} cal
                  </span>
                </div>

                {/* Calorias Alvo */}
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center">
                    <FaUtensils className="text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      Calorias para seu Objetivo
                    </span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    {result.targetCalories} cal
                  </span>
                </div>

                {(result.deficit > 0 || result.surplus > 0) && (
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {result.deficit > 0 && `Déficit de ${result.deficit} cal/dia`}
                    {result.surplus > 0 && `Superávit de ${result.surplus} cal/dia`}
                  </div>
                )}
              </div>

              {/* Macronutrientes */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Distribuição de Macronutrientes
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">PROTEÍNA</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {result.macros.protein}g
                    </div>
                    <div className="text-xs text-blue-500 dark:text-blue-400">25%</div>
                  </div>
                  
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">CARBOIDRATOS</div>
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                      {result.macros.carbs}g
                    </div>
                    <div className="text-xs text-yellow-500 dark:text-yellow-400">45%</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">GORDURAS</div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                      {result.macros.fat}g
                    </div>
                    <div className="text-xs text-green-500 dark:text-green-400">30%</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Fórmula: {result.formula === 'mifflin' ? 'Mifflin-St Jeor' : result.formula === 'harris' ? 'Harris-Benedict' : 'Katch-McArdle'}
                {' • '}
                Atividade: {getActivityLevelLabel(result.activityLevel.toString())}
              </div>
            </div>
          )}

          {/* Histórico */}
          {history.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaHistory className="mr-2" />
                Histórico
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {entry.targetCalories} cal/dia
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getGoalLabel(entry.goal)} • {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        TMB: {entry.bmr}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        TDEE: {entry.tdee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
              💡 Dicas Importantes
            </h4>
            <div className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
              <p>• TMB é o mínimo de calorias que seu corpo precisa em repouso</p>
              <p>• TDEE inclui suas atividades físicas diárias</p>
              <p>• Para perder 1kg de gordura, você precisa de um déficit de ~7700 cal</p>
              <p>• Ajuste as calorias baseado nos seus resultados reais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator; 