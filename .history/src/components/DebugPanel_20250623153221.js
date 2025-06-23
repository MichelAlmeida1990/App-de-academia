import React, { useState } from 'react';
import { AuthDebugUtils } from '../utils/authDebug';
import { DataFixer } from '../utils/dataFixer';
import { EmergencyCleanup } from '../utils/emergencyCleanup';
import { useAuth } from '../context/AuthContext';

const DebugPanel = () => {
  const [debugOutput, setDebugOutput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const runDebug = (debugFunction, name) => {
    console.log(`\n🔍 === EXECUTANDO: ${name} ===\n`);
    const originalLog = console.log;
    const originalError = console.error;
    
    let output = `\n=== ${name} ===\n`;
    
    // Interceptar console.log temporariamente
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };
    
    console.error = (...args) => {
      output += 'ERROR: ' + args.join(' ') + '\n';
      originalError(...args);
    };
    
    try {
      const result = debugFunction();
      if (result) {
        output += 'Resultado: ' + JSON.stringify(result, null, 2) + '\n';
      }
    } catch (error) {
      output += 'ERRO: ' + error.message + '\n';
    }
    
    // Restaurar console original
    console.log = originalLog;
    console.error = originalError;
    
    setDebugOutput(prev => prev + output + '\n');
  };

  const clearOutput = () => {
    setDebugOutput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 z-50"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-auto">
      <div className="min-h-screen p-4">
        <div className="bg-gray-900 text-white rounded-lg p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-400">🐛 Debug Panel</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Fechar
            </button>
          </div>

          <div className="mb-4">
            <p className="text-green-400">
              Usuário atual: {currentUser ? `${currentUser.displayName || currentUser.email} (${currentUser.uid})` : 'Nenhum'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => runDebug(AuthDebugUtils.listAllUsersWithWorkouts, 'Listar Usuários')}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
            >
              Listar Usuários
            </button>
            
            <button
              onClick={() => runDebug(AuthDebugUtils.checkDataIsolation, 'Verificar Isolamento')}
              className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm"
            >
              Verificar Isolamento
            </button>
            
            <button
              onClick={() => runDebug(DataFixer.cleanupOrphanedWorkouts, '🧹 Limpar Órfãos')}
              className="bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-sm"
            >
              🧹 Limpar Órfãos
            </button>
            
            <button
              onClick={() => runDebug(DataFixer.runFullCleanup, '🚀 Limpeza Completa')}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
            >
              🚀 Limpeza Completa
            </button>
            
            <button
              onClick={() => runDebug(DataFixer.createBackup, '💾 Criar Backup')}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm"
            >
              💾 Criar Backup
            </button>
            
            <button
              onClick={() => runDebug(() => {
                if (currentUser) {
                  return AuthDebugUtils.checkWorkoutsByUser(currentUser.uid);
                }
                return 'Nenhum usuário logado';
              }, 'Treinos do Usuário Atual')}
              className="bg-cyan-600 hover:bg-cyan-700 px-3 py-2 rounded text-sm"
            >
              Treinos Atuais
            </button>
            
            <button
              onClick={() => runDebug(AuthDebugUtils.generateReport, 'Relatório Completo')}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
            >
              Relatório Completo
            </button>
            
            <button
              onClick={clearOutput}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm"
            >
              Limpar Log
            </button>
          </div>

          <div className="bg-black rounded p-4 h-96 overflow-auto">
            <pre className="text-green-400 text-xs whitespace-pre-wrap">
              {debugOutput || 'Clique em um botão para executar debug...'}
            </pre>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p>🛠️ Painel de debug temporário - use apenas em desenvolvimento</p>
            <p>📋 Resultados também são logados no console do navegador</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel; 