// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import StatsPage from './pages/StatsPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import ActiveWorkout from './components/workout/ActiveWorkout';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
