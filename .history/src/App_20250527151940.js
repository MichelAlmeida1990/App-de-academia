// src/App.js - VERSÃO FINAL CORRIGIDA
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext'; // Renomeado para evitar conflito com MUI ThemeProvider
import { WorkoutProvider } from './context/WorkoutContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

// MUI Imports
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getMuiTheme from './theme/muiTheme'; // Importa seu tema MUI personalizado

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import ProgressPage from './pages/ProgressPage';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Components
import ActiveWorkout from './components/workout/ActiveWorkout';

// Componente para página de treino ativo
const ActiveWorkoutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ActiveWorkout />
    </div>
  );
};

// Componente para página de edição de treino (mantido o placeholder se ainda não implementado)
const EditWorkoutPage = () => {
  // **IMPORTANTE**: Se você já tem a lógica de edição em `src/pages/EditWorkoutPage.js`,
  // importe-a e renderize-a aqui ou use a rota direta para ela.
  // Este é o placeholder que você tinha no App.js.
  // Se `src/pages/EditWorkoutPage.js` já está completa, importe-a e use-a:
  // import ActualEditWorkoutPage from './pages/EditWorkoutPage';
  // return <ActualEditWorkoutPage />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Treino</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Funcionalidade de edição em desenvolvimento...
        </p>
      </div>
    </div>
  );
};

// 🎯 COMPONENTE DE REDIRECIONAMENTO INTELIGENTE
const SmartRedirect = () => {
  const { isAuthenticated } = useAuth();
  
  // Se autenticado, redireciona para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se não autenticado, mostra HomePage
  return <HomePage />;
};

// Componente que consome o ThemeContext e aplica o Material-UI ThemeProvider
const ThemedAppContent = () => {
  const { darkMode } = useTheme(); // Pega o darkMode do seu ThemeContext
  const muiTheme = getMuiTheme(darkMode); // Cria o tema MUI baseado no darkMode

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* Normaliza o CSS do navegador e aplica as cores do tema MUI */}
      {/* Removido o bg-gray-50 dark:bg-gray-900 para permitir que o body.css atue */}
      <div className="min-h-screen transition-colors duration-200"> 
        <Router>
          <Routes>
            {/* 🚀 ROTA RAIZ CORRIGIDA - Redirecionamento inteligente */}
            <Route path="/" element={<SmartRedirect />} />
            
            {/* Rotas públicas de autenticação */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Rotas protegidas com layout */}
            <Route element={<Layout />}>
              {/* Dashboard - página principal após login */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas de treinos */}
              <Route
                path="/workouts"
                element={
                  <ProtectedRoute>
                    <WorkoutsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/new"
                element={
                  <ProtectedRoute>
                    <NewWorkoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/:id"
                element={
                  <ProtectedRoute>
                    <WorkoutDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditWorkoutPage /> {/* Use a página de edição correta aqui */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout/:id/active"
                element={
                  <ProtectedRoute>
                    <ActiveWorkoutPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas de exercícios */}
              <Route
                path="/exercises"
                element={
                  <ProtectedRoute>
                    <ExercisesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exercise/:id"
                element={
                  <ProtectedRoute>
                    <ExerciseDetailPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas de perfil e configurações */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas de estatísticas e progresso */}
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <StatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <ProgressPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Rota de fallback - redireciona para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Componentes globais */}
          <ConnectionStatus />
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppThemeProvider> {/* Seu ThemeContext */}
        <ToastProvider>
          <WorkoutProvider>
            <ExerciseProvider>
              <ThemedAppContent /> {/* Renderiza o novo componente aqui */}
            </ExerciseProvider>
          </WorkoutProvider>
        </ToastProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}

export default App;