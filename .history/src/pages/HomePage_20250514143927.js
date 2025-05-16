// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao FitnessTracker</h1>
      <p className="text-xl mb-8">Seu assistente pessoal para acompanhar seu progresso fitness</p>
      <Link 
        to="/dashboard" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
      >
        Entrar no App
      </Link>
    </div>
  );
};

export default HomePage;
