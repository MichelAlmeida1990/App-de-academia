// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage'; // Renomeado de HomePage
import WorkoutsPage from './pages/WorkoutsPage';
import StatsPage from './pages/StatsPage';
import ActiveWorkout from './components/workout/ActiveWorkout';

// Wrapper para passar o navigate para o WorkoutProvider
const AppWithProvider = () => {
  const navigate = useNavigate();
  
  return (
    <WorkoutProvider navigate={navigate}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} /> {/* Renomeado de HomePage */}
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>
        <Route path="/active-workout" element={<ActiveWorkout />} />
      </Routes>
    </WorkoutProvider>
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
