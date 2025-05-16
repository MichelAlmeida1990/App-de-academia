// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { ExerciseProvider } from './context/ExerciseContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import StatsPage from './pages/StatsPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import ActiveWorkout from './components/workout/ActiveWorkout';

// Componente interno para usar o hook useNavigate
const AppRoutes = () => {
  const navigate = useNavigate();
  
  return (
    <WorkoutProvider navigate={navigate}>
      <ExerciseProvider>
        <Routes>
          {/* Página inicial sem o layout */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rotas com o layout compartilhado */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="stats" element={<StatsPage />} />
            {/* Rotas para exercícios */}
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="exercise/:id" element={<ExerciseDetailPage />} />
          </Route>
          
          <Route path="/active-workout" element={<ActiveWorkout />} />
        </Routes>
      </ExerciseProvider>
    </WorkoutProvider>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
