// src/App.js (modificado)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Mudado de ThemeProvider para ThemeContext
import ProtectedRoute from './components/auth/ProtectedRoute'; // Mudado de PrivateRoute para ProtectedRoute
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

// Páginas
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage'; // Usando AuthPage em vez de LoginPage/RegisterPage
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage'; // Adicionando página existente

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/" element={<Layout />}>
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
                path="/workouts/:workoutId" 
                element={
                  <ProtectedRoute>
                    <WorkoutDetailPage />
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
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Indicador de status de conexão */}
          <ConnectionStatus />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
