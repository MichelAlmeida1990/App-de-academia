// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProviderWithRouter } from './context/WorkoutContext'; // Importando o provider do WorkoutContext
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import StatsPage from './pages/StatsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <WorkoutProviderWithRouter> {/* Adicionando o WorkoutProvider aqui */}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="workouts" element={
                  <ProtectedRoute>
                    <WorkoutsPage />
                  </ProtectedRoute>
                } />
                <Route path="stats" element={
                  <ProtectedRoute>
                    <StatsPage />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </WorkoutProviderWithRouter>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
