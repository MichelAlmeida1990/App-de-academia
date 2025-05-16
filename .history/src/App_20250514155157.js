// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { ExerciseProvider } from './context/ExerciseContext'; // Adicionar o ExerciseProvider
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import StatsPage from './pages/StatsPage';
import ActiveWorkout from './components/workout/ActiveWorkout';
import ExercisesPage from './pages/ExercisesPage'; // Nova página de exercícios
import ExerciseDetailPage from './pages/ExerciseDetailPage'; // Nova página de detalhes do exercício

// Wrapper para passar o navigate para os Providers
const AppWithProvider = () => {
  const navigate = useNavigate();
  
  return (
    <ThemeProvider>
      <ExerciseProvider> {/* Adicionar o ExerciseProvider */}
        <WorkoutProvider navigate={navigate}>
          <Routes>
            {/* Página inicial sem o layout */}
            <Route path="/" element={<HomePage />} />
            
            {/* Rotas com o layout compartilhado */}
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="workouts" element={<WorkoutsPage />} />
              <Route path="stats" element={<StatsPage />} />
              {/* Novas rotas para exercícios */}
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="exercise/:id" element={<ExerciseDetailPage />} />
            </Route>
            
            <Route path="/active-workout" element={<ActiveWorkout />} />
          </Routes>
        </WorkoutProvider>
      </ExerciseProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AppWithProvider />
    </Router>
  );
}

export default App;
