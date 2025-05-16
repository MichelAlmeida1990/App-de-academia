// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutProvider } from './context/WorkoutContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // Adicione esta importação

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Adicione o AuthProvider aqui */}
      <ThemeProvider>
        <WorkoutProvider>
          <App />
        </WorkoutProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
