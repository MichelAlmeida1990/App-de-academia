// src/App.js - VERSÃO FINAL CORRIGIDA
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

// Limpeza automática de dados antigos sem isolamento
import './utils/cleanupToolsHistory';

// MUI Imports (se estiver usando Material-UI)
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
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import ProgressPage from './pages/ProgressPage';
import ToolsPage from './pages/ToolsPage';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';

/**
 * Componente placeholder para a página de edição de treino.
 * Substitua este placeholder pela sua implementação real de EditWorkoutPage
 * se você tiver um arquivo `src/pages/EditWorkoutPage.js` completo.
 */
const EditWorkoutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Editar Treino</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Funcionalidade de edição em desenvolvimento...
        </p>
      </div>
    </div>
  );
};

/**
 * Componente de redirecionamento inteligente.
 * Redireciona para o dashboard se o usuário estiver autenticado,
 * caso contrário, exibe a HomePage.
 */
const SmartRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />;
};

/**
 * Componente que consome o ThemeContext e aplica o Material-UI ThemeProvider.
 * Isso garante que o tema do Material-UI seja sincronizado com o tema personalizado.
 */
const ThemedAppContent = () => {
  const { darkMode } = useTheme();
  const muiTheme = getMuiTheme(darkMode);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <div className="min-h-screen transition-colors duration-200">
          <Routes>
            {/* ROTA RAIZ CORRIGIDA - Redirecionamento inteligente */}
            <Route path="/" element={<SmartRedirect />} />

            {/* Rotas públicas de autenticação */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Rota do treino ativo - fora do Layout para evitar problemas de renderização */}
            <Route
              path="/workout/:id/active"
              element={
                <ProtectedRoute>
                  <ActiveWorkoutPage />
                </ProtectedRoute>
              }
            />

            {/* Rotas protegidas que usam o Layout (Header, Footer, etc.) */}
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
                    <EditWorkoutPage />
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

              {/* Rotas de configurações */}
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
              <Route
                path="/tools"
                element={
                  <ProtectedRoute>
                    <ToolsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Rota de fallback - redireciona para a home se nenhuma rota corresponder */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Componentes globais que aparecem em todas as páginas */}
                  <ConnectionStatus />
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

/**
 * Componente principal da aplicação.
 * Envolve toda a aplicação com os provedores de contexto necessários.
 */
function App() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <SettingsProvider>
          <ToastProvider>
            <WorkoutProvider>
              <ExerciseProvider>
                <ThemedAppContent />
              </ExerciseProvider>
            </WorkoutProvider>
          </ToastProvider>
        </SettingsProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}

export default App;