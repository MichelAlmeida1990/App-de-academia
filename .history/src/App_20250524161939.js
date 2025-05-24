// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

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

// Componente para página de edição de treino
const EditWorkoutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Treino</h1>
      {/* Formulário de edição será implementado aqui */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Funcionalidade de edição em desenvolvimento...
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <WorkoutProvider>
            <ExerciseProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <Routes>
                    {/* Rotas públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    
                    {/* Rotas protegidas com layout */}
                    <Route element={<Layout />}>
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
                      
                      {/* Rotas de estatísticas */}
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
                    
                    {/* Rota de fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  
                  {/* Componentes globais */}
                  <ConnectionStatus />
                </div>
              </Router>
            </ExerciseProvider>
          </WorkoutProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
