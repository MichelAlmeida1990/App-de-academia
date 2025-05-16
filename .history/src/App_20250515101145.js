import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext'; // Adicionar esta importação
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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WorkoutProvider> {/* Adicionar o WorkoutProvider aqui */}
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
                {/* Outras rotas... */}
              </Route>
              
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
