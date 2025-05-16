import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ProfilePage from './pages/ProfilePage';
import ToastNotification from './components/ui/ToastNotification';
import { ToastProvider } from './context/ToastContext';

// Componente para animação de transição de página
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300);
    }
  }, [location, displayLocation]);

  return (
    <div className={`transition-opacity duration-300 ${transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
};

// Componente principal
function AppContent() {
  return (
    <Layout>
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workout/:id" element={<WorkoutDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </PageTransition>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
        <ToastNotification />
      </ToastProvider>
    </Router>
  );
}

export default App;
