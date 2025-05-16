import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

// Páginas
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import ProgressPage from './pages/ProgressPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WorkoutProvider>
          <Router>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Rotas protegidas dentro do Layout */}
              <Route element={<Layout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workouts"
                  element={
                    <ProtectedRoute>
                      <WorkoutsPage />
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
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <ProgressPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <ProtectedRoute>
                      <StatsPage />
                    </ProtectedRoute>
                  }
                />
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
              </Route>

              {/* Rota de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ConnectionStatus />
          </Router>
        </WorkoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
