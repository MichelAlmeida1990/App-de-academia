// src/App.js
import React from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './components/workout/ActiveWorkout';

// Componente para gerenciar a exibição condicional
const AppContent = () => {
  const { activeWorkout } = useWorkout();
  
  // Se houver um treino ativo, mostrar a tela de treino
  if (activeWorkout) {
    return <ActiveWorkout />;
  }
  
  // Caso contrário, mostrar o dashboard normal
  return <Dashboard />;
};

function App() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AppContent />
      </div>
    </WorkoutProvider>
  );
}

export default App;
