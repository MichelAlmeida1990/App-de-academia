// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeProvider';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import ConnectionStatus from './components/ui/ConnectionStatus';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import CreateWorkoutPage from './pages/CreateWorkoutPage';
import EditWorkoutPage from './pages/EditWorkoutPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            <Route path="/" element={<Layout />}>
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/workouts" 
                element={
                  <PrivateRoute>
                    <WorkoutsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/workouts/:workoutId" 
                element={
                  <PrivateRoute>
                    <WorkoutDetailPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/workouts/new" 
                element={
                  <PrivateRoute>
                    <CreateWorkoutPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/workouts/:workoutId/edit" 
                element={
                  <PrivateRoute>
                    <EditWorkoutPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
            </Route>
            
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          
          {/* Indicador de status de conexão */}
          <ConnectionStatus />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
