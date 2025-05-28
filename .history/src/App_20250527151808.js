// src/App.js (Parte relevante para o ThemeProvider do MUI)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'; // Renomeado para evitar conflito
import CssBaseline from '@mui/material/CssBaseline'; // Para estilos CSS base do MUI
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext'; // Seu ThemeContext
import getMuiTheme from './theme/muiTheme'; // Importa seu tema MUI personalizado

import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import EditWorkoutPage from './pages/EditWorkoutPage';
import ProgressPage from './pages/ProgressPage'; // Importe sua ProgressPage
import NotFoundPage from './pages/NotFoundPage'; // Exemplo de página
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/auth/PrivateRoute'; // Se tiver rotas privadas
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import NewWorkoutPage from './pages/NewWorkoutPage'; // Se tiver uma página de criação de treino
import WorkoutDetailsPage from './pages/WorkoutDetailsPage'; // Se tiver detalhes do treino
import WorkoutListPage from './pages/WorkoutListPage'; // Se tiver uma lista de treinos


function AppContent() {
  const { darkMode } = useTheme();
  const muiTheme = getMuiTheme(darkMode);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* Normaliza o CSS do navegador e aplica as cores do tema */}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="workouts" element={<PrivateRoute><WorkoutListPage /></PrivateRoute>} />
            <Route path="workout/new" element={<PrivateRoute><NewWorkoutPage /></PrivateRoute>} />
            <Route path="workout/:id" element={<PrivateRoute><WorkoutDetailsPage /></PrivateRoute>} />
            <Route path="edit-workout/:id" element={<PrivateRoute><EditWorkoutPage /></PrivateRoute>} />
            <Route path="progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} /> {/* Sua ProgressPage */}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <AppThemeProvider>
          <AppContent />
        </AppThemeProvider>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;