import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../hooks/useWorkout';
import { FaDumbbell, FaChartLine, FaClipboardList, FaRunning } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { workouts = [], refreshWorkouts } = useWorkout(); // Adicionei refreshWorkouts
  const [loading, setLoading] = useState(true);

  // Garantir que os dados estejam atualizados ao carregar o dashboard
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await refreshWorkouts(); // Força uma atualização dos treinos
      } catch (error) {
        console.error("Erro ao carregar treinos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshWorkouts]);

  // Dados para o dashboard
  const totalWorkouts = workouts.length;
  
  // Filtrando treinos que foram marcados como completados
  const completedWorkouts = workouts.filter(w => w.completed).length;
  
  // Ordenando treinos completados por data (mais recente primeiro)
  const sortedCompletedWorkouts = [...workouts]
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Obtendo o último treino completado
  const lastCompletedWorkout = sortedCompletedWorkouts.length > 0 ? sortedCompletedWorkouts[0] : null;
  
  // Filtrando treinos futuros (não completados e com data futura)
  const upcomingWorkouts = workouts
    .filter(w => !w.completed && new Date(w.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3); // Limita aos 3 próximos

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-white">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Bem-vindo, {currentUser ? currentUser.displayName || currentUser.email : 'Usuário'}!
      </h1>

      {/* Seção de Resumo/Estatísticas - Grid de 3 colunas */}
      <div className="dashboard-grid-3 mb-8">
        {/* Card 1: Total de Treinos */}
        <div className="glassmorphism-card p-6">
          <div className="flex items-center mb-4">
            <FaDumbbell className="text-4xl text-purple-400 mr-4" />
            <h2 className="text-xl font-semibold text-white">Treinos Registrados</h2>
          </div>
          <p className="text-4xl font-bold text-white">{totalWorkouts}</p>
          <p className="text-gray-300">Total de treinos criados</p>
        </div>

        {/* Card 2: Treinos Concluídos */}
        <div className="glassmorphism-card p-6">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-4xl text-teal-400 mr-4" />
            <h2 className="text-xl font-semibold text-white">Treinos Completados</h2>
          </div>
          <p className="text-4xl font-bold text-white">{completedWorkouts}</p>
          <p className="text-gray-300">Total de treinos finalizados</p>
        </div>

        {/* Card 3: Veja seu Progresso */}
        <Link to="/progress" className="block h-full">
          <div className="glassmorphism-card p-6 flex flex-col items-center justify-center h-full">
            <FaChartLine className="text-5xl text-blue-400 mb-2" />
            <h2 className="text-xl font-semibold text-white mb-2">Seu Progresso</h2>
            <p className="text-gray-300 text-center">Acompanhe suas métricas e recordes pessoais.</p>
          </div>
        </Link>
      </div>

      {/* Seção de Atividade Recente / Próximos Treinos - Grid de 2 colunas */}
      <div className="dashboard-grid-2">
        {/* Card: Último Treino Completo */}
        <div className="glassmorphism-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Último Treino Completo</h2>
          {lastCompletedWorkout ? (
            <div>
              <p className="text-2xl font-bold text-purple-400 mb-2">{lastCompletedWorkout.name}</p>
              <p className="text-gray-300">
                Concluído em: {new Date(lastCompletedWorkout.date).toLocaleDateString('pt-BR')}
              </p>
              <Link to={`/workout/${lastCompletedWorkout.id}`} className="mt-4 inline-block text-blue-400 hover:underline">
                Ver detalhes
              </Link>
            </div>
          ) : (
            <p className="text-gray-300">Nenhum treino completo ainda.</p>
          )}
        </div>

        {/* Card: Próximos Treinos */}
        <div className="glassmorphism-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Próximos Treinos</h2>
          {upcomingWorkouts.length > 0 ? (
            <ul>
              {upcomingWorkouts.map(workout => (
                <li key={workout.id} className="mb-2 pb-2 border-b border-gray-700 last:border-b-0">
                  <Link to={`/workout/${workout.id}`} className="text-lg font-medium text-white hover:text-blue-400">
                    {workout.name}
                  </Link>
                  <p className="text-sm text-gray-400">
                    {new Date(workout.date).toLocaleDateString('pt-BR')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">Nenhum treino agendado.</p>
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

export default Dashboard;
