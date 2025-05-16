import React from 'react';
import { useToast } from '../context/ToastContext';

const ExampleComponent = () => {
  const { addToast } = useToast();

  const handleAction = () => {
    // Executar alguma ação
    addToast('Operação realizada com sucesso!', 'success');
  };

  const handleError = () => {
    // Lidar com erro
    addToast('Erro ao processar solicitação', 'error');
  };

  const handleWarning = () => {
    // Mostrar um aviso
    addToast('Atenção! Esta ação pode ter consequências', 'warning');
  };

  const handleInfo = () => {
    // Mostrar uma informação
    addToast('Nova atualização disponível', 'info');
  };

  return (
    <div className="card max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Sistema de Notificações</h2>
      
      <div className="space-y-3">
        <div>
          <button 
            onClick={handleAction}
            className="btn w-full"
          >
            Notificação de Sucesso
          </button>
        </div>
        
        <div>
          <button 
            onClick={handleError}
            className="btn-danger w-full"
          >
            Notificação de Erro
          </button>
        </div>
        
        <div>
          <button 
            onClick={handleWarning}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 font-medium rounded-lg w-full
                     transition-colors active:scale-95 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            Notificação de Aviso
          </button>
        </div>
        
        <div>
          <button 
            onClick={handleInfo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 font-medium rounded-lg w-full
                     transition-colors active:scale-95 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Notificação de Informação
          </button>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Clique nos botões acima para ver os diferentes tipos de notificações.
      </p>
    </div>
  );
};

export default ExampleComponent;
