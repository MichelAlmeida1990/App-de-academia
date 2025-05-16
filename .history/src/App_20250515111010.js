// App.js ou arquivo de rotas principal (versão corrigida)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import WorkoutFormPage from './pages/WorkoutFormPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WorkoutProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Rotas privadas */}
                <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/workouts" element={<PrivateRoute><WorkoutsPage /></PrivateRoute>} />
                
                {/* Importante: a rota /workout/new deve vir ANTES de /workout/:id */}
                <Route path="/workout/new" element={<PrivateRoute><WorkoutFormPage /></PrivateRoute>} />
                <Route path="/workout/edit/:id" element={<PrivateRoute><WorkoutFormPage /></PrivateRoute>} />
                <Route path="/workout/:id" element={<PrivateRoute><WorkoutDetailPage /></PrivateRoute>} />
                
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </WorkoutProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
