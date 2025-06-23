import React, { useState, useEffect } from 'react';
import {
  FaWeight,
  FaRuler,
  FaCalculator,
  FaInfoCircle,
  FaSave,
  FaHistory,
  FaVenus,
  FaMars
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const BodyFatCalculator = ({ onSave, savedData }) => {
  const { currentUser } = useAuth();
  const [method, setMethod] = useState('navy'); // navy, army, jackson-pollock
  const [gender, setGender] = useState(savedData?.gender || 'male');
  const [age, setAge] = useState(savedData?.age || '');
  const [height, setHeight] = useState(savedData?.height || '');
  const [weight, setWeight] = useState(savedData?.weight || '');
  
  // Medidas para método Navy
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState(''); // apenas para mulheres

  // Medidas para método Army
  const [abdomen, setAbdomen] = useState('');
  
  // Dobras cutâneas para Jackson-Pollock (3 pontos)
  const [chest, setChest] = useState(''); // homens
  const [tricep, setTricep] = useState('');
  const [thigh, setThigh] = useState('');
  const [suprailiac, setSuprailiac] = useState(''); // mulheres
  const [abdominal, setAbdominal] = useState(''); // homens

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
      const savedHistory = localStorage.getItem(`bodyfat-history-${currentUser.uid}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [currentUser]);

  // Método Navy (US Navy)
  const calculateNavyMethod = () => {
    if (!height || !waist || !neck || (gender === 'female' && !hip)) return null;
    
    const heightCm = parseFloat(height);
    const waistCm = parseFloat(waist);
    const neckCm = parseFloat(neck);
    const hipCm = gender === 'female' ? parseFloat(hip) : 0;

    let bodyFat;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }
    
    return Math.max(0, bodyFat);
  };

  // Método Army (US Army)
  const calculateArmyMethod = () => {
    if (!height || !abdomen || !neck || (gender === 'female' && !hip)) return null;
    
    const heightCm = parseFloat(height);
    const abdomenCm = parseFloat(abdomen);
    const neckCm = parseFloat(neck);
    const hipCm = gender === 'female' ? parseFloat(hip) : 0;

    let bodyFat;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(abdomenCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(abdomenCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }
    
    return Math.max(0, bodyFat);
  };

  // Método Jackson-Pollock (3 dobras)
  const calculateJacksonPollock = () => {
    if (gender === 'male') {
      if (!chest || !abdominal || !thigh || !age) return null;
      const sum = parseFloat(chest) + parseFloat(abdominal) + parseFloat(thigh);
      const ageNum = parseFloat(age);
      const density = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * ageNum);
      return (495 / density) - 450;
    } else {
      if (!tricep || !suprailiac || !thigh || !age) return null;
      const sum = parseFloat(tricep) + parseFloat(suprailiac) + parseFloat(thigh);
      const ageNum = parseFloat(age);
      const density = 1.0994921 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * ageNum);
      return (495 / density) - 450;
    }
  };

  const calculateBodyFat = () => {
    let bodyFat;
    
    switch (method) {
      case 'navy':
        bodyFat = calculateNavyMethod();
        break;
      case 'army':
        bodyFat = calculateArmyMethod();
        break;
      case 'jackson-pollock':
        bodyFat = calculateJacksonPollock();
        break;
      default:
        return;
    }

    if (bodyFat === null || isNaN(bodyFat)) return;

    const category = getBodyFatCategory(bodyFat, gender);
    const newResult = {
      bodyFat: bodyFat.toFixed(1),
      category,
      method,
      gender,
      date: new Date().toISOString(),
      weight: parseFloat(weight) || null,
      leanMass: weight ? ((100 - bodyFat) / 100 * parseFloat(weight)).toFixed(1) : null,
      fatMass: weight ? (bodyFat / 100 * parseFloat(weight)).toFixed(1) : null
    };

    setResult(newResult);

    // Salvar no histórico
    const newHistory = [newResult, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('bodyfit-history', JSON.stringify(newHistory));

    // Callback para salvar no perfil
    if (onSave) {
      onSave({
        bodyFat: parseFloat(bodyFat.toFixed(1)),
        category,
        method,
        leanMass: newResult.leanMass ? parseFloat(newResult.leanMass) : null,
        fatMass: newResult.fatMass ? parseFloat(newResult.fatMass) : null
      });
    }
  };

  const getBodyFatCategory = (bodyFat, gender) => {
    if (gender === 'male') {
      if (bodyFat < 6) return { name: 'Essencial', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (bodyFat < 14) return { name: 'Atlético', color: 'text-green-600', bg: 'bg-green-100' };
      if (bodyFat < 18) return { name: 'Fitness', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      if (bodyFat < 25) return { name: 'Aceitável', color: 'text-orange-600', bg: 'bg-orange-100' };
      return { name: 'Obesidade', color: 'text-red-600', bg: 'bg-red-100' };
    } else {
      if (bodyFat < 16) return { name: 'Essencial', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (bodyFat < 21) return { name: 'Atlético', color: 'text-green-600', bg: 'bg-green-100' };
      if (bodyFat < 25) return { name: 'Fitness', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      if (bodyFat < 32) return { name: 'Aceitável', color: 'text-orange-600', bg: 'bg-orange-100' };
      return { name: 'Obesidade', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const getMethodInfo = () => {
    switch (method) {
      case 'navy':
        return 'Método US Navy: Usa circunferências do pescoço, cintura e quadril (mulheres). Precisão: ±3-4%';
      case 'army':
        return 'Método US Army: Similar ao Navy, mas usa abdômen em vez de cintura. Precisão: ±3-4%';
      case 'jackson-pollock':
        return 'Jackson-Pollock 3 dobras: Usa dobras cutâneas em 3 pontos específicos. Precisão: ±3.5%';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <FaWeight className="text-2xl text-orange-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calculadora de Gordura Corporal
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Método de Cálculo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Método de Cálculo
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="navy">US Navy (Circunferências)</option>
              <option value="army">US Army (Circunferências)</option>
              <option value="jackson-pollock">Jackson-Pollock (Dobras Cutâneas)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <FaInfoCircle className="inline mr-1" />
              {getMethodInfo()}
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

            {method === 'jackson-pollock' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: 25"
                />
              </div>
            )}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 175"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Peso (kg) - Opcional
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 70"
              />
            </div>
          </div>

          {/* Medidas específicas por método */}
          {method === 'navy' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Circunferências (cm)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pescoço
                  </label>
                  <input
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: 38"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cintura
                  </label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: 85"
                  />
                </div>

                {gender === 'female' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quadril
                    </label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 95"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {method === 'army' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Circunferências (cm)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pescoço
                  </label>
                  <input
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: 38"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Abdômen
                  </label>
                  <input
                    type="number"
                    value={abdomen}
                    onChange={(e) => setAbdomen(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: 85"
                  />
                </div>

                {gender === 'female' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quadril
                    </label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 95"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {method === 'jackson-pollock' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Dobras Cutâneas (mm)</h4>
              {gender === 'male' ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Peitoral
                    </label>
                    <input
                      type="number"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Abdominal
                    </label>
                    <input
                      type="number"
                      value={abdominal}
                      onChange={(e) => setAbdominal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Coxa
                    </label>
                    <input
                      type="number"
                      value={thigh}
                      onChange={(e) => setThigh(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 12"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tríceps
                    </label>
                    <input
                      type="number"
                      value={tricep}
                      onChange={(e) => setTricep(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 18"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Suprailíaca
                    </label>
                    <input
                      type="number"
                      value={suprailiac}
                      onChange={(e) => setSuprailiac(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Coxa
                    </label>
                    <input
                      type="number"
                      value={thigh}
                      onChange={(e) => setThigh(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: 25"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={calculateBodyFat}
            className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            <FaCalculator className="mr-2" />
            Calcular Gordura Corporal
          </button>
        </div>

        <div className="space-y-6">
          {/* Resultado */}
          {result && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resultado
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {result.bodyFat}%
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${result.category.bg} ${result.category.color}`}>
                  {result.category.name}
                </div>
              </div>

              {result.leanMass && result.fatMass && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Massa Magra</div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {result.leanMass} kg
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Massa Gorda</div>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {result.fatMass} kg
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Método: {result.method === 'navy' ? 'US Navy' : result.method === 'army' ? 'US Army' : 'Jackson-Pollock'}
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
                        {entry.bodyFat}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${entry.category.bg} ${entry.category.color}`}>
                      {entry.category.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações sobre categorias */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Categorias de Gordura Corporal
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-400">Essencial:</span>
                <span className="text-blue-600 dark:text-blue-300">
                  {gender === 'male' ? '2-5%' : '10-13%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-400">Atlético:</span>
                <span className="text-green-600 dark:text-green-300">
                  {gender === 'male' ? '6-13%' : '14-20%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-800 dark:text-yellow-400">Fitness:</span>
                <span className="text-yellow-600 dark:text-yellow-300">
                  {gender === 'male' ? '14-17%' : '21-24%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-800 dark:text-orange-400">Aceitável:</span>
                <span className="text-orange-600 dark:text-orange-300">
                  {gender === 'male' ? '18-24%' : '25-31%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800 dark:text-red-400">Obesidade:</span>
                <span className="text-red-600 dark:text-red-300">
                  {gender === 'male' ? '25%+' : '32%+'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFatCalculator; 