// src/components/dashboard/Dashboard.js - NOVO CONTEÚDO PROPOSTO
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho se necessário
import { useWorkout } from '../../hooks/useWorkout'; // Ajuste o caminho se necessário
import { FaDumbbell, FaChartLine, FaClipboardList, FaRunning } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { workouts = [] } = useWorkout(); // Obtenha seus treinos aqui

  // Dados simulados para o dashboard
  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(w => w.completed).length;
  // Filtrando treinos que ainda não foram completados e têm data futura
  const upcomingWorkouts = workouts
    .filter(w => !w.completed && new Date(w.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordena por data mais próxima
    .slice(0, 3); // Limita aos 3 próximos

  const lastCompletedWorkout = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Último completo

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Bem-vindo, {currentUser ? currentUser.displayName || currentUser.email : 'Usuário'}!
      </h1>

      {/* Seção de Resumo/Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total de Treinos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105 duration-200 glassmorphism-card">
          <div className="flex items-center mb-4">
            <FaDumbbell className="text-4xl text-purple-600 dark:text-purple-400 mr-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Treinos Registrados</h2>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
          <p className="text-gray-600 dark:text-gray-400">Total de treinos criados</p>
        </div>

        {/* Card 2: Treinos Concluídos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105 duration-200 glassmorphism-card">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-4xl text-teal-600 dark:text-teal-400 mr-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Treinos Completados</h2>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{completedWorkouts}</p>
          <p className="text-gray-600 dark:text-gray-400">Total de treinos finalizados</p>
        </div>

        {/* Card 3: Veja seu Progresso */}
        <Link to="/progress" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center justify-center h-full transition-transform transform hover:scale-105 duration-200 cursor-pointer glassmorphism-card">
            <FaChartLine className="text-5xl text-blue-600 dark:text-blue-400 mb-2" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Seu Progresso</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">Acompanhe suas métricas e recordes pessoais.</p>
          </div>
        </Link>
      </div>

      {/* Seção de Atividade Recente / Próximos Treinos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Último Treino Completo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 glassmorphism-card">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Último Treino Completo</h2>
          {lastCompletedWorkout ? (
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">{lastCompletedWorkout.name}</p>
              <p className="text-gray-600 dark:text-gray-400">
                Concluído em: {new Date(lastCompletedWorkout.date).toLocaleDateString()}
              </p>
              <Link to={`/workout/${lastCompletedWorkout.id}`} className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                Ver detalhes
              </Link>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Nenhum treino completo ainda.</p>
          )}
        </div>

        {/* Card: Próximos Treinos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 glassmorphism-card">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Próximos Treinos</h2>
          {upcomingWorkouts.length > 0 ? (
            <ul>
              {upcomingWorkouts.map(workout => (
                <li key={workout.id} className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <Link to={`/workout/${workout.id}`} className="text-lg font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    {workout.name}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Nenhum treino agendado.</p>
          )}
        </div>
      </div>

      {/* Botão para criar novo treino */}
      <div className="mt-8 text-center">
        <Link 
          to="/workout/new" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
        >
          <FaRunning className="mr-2 -ml-1 text-xl" />
          Criar Novo Treino
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; // Exporta como 'Dashboard'
