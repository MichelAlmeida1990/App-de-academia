// App.js ou arquivo de rotas
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
// import WorkoutDetailPage from './pages/WorkoutDetail/WorkoutDetailPage'; // Comentado
import TempDetailPage from './pages/TempDetail/TempDetailPage'; // Novo componente
import ProfilePage from './pages/Profile/ProfilePage';
import { WorkoutProvider } from './context/WorkoutContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workout/:id" element={<TempDetailPage />} /> {/* Substituído */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;
