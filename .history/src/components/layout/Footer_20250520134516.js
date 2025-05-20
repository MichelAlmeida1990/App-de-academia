// src/components/layout/Footer.js (Versão Atualizada)
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { FaInstagram, FaTwitter, FaYoutube, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const year = new Date().getFullYear();

  return (
    <footer className={`py-8 px-4 mt-auto border-t transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 border-gray-800 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-600'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1 - Logo e descrição */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center">
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Fitness<span className="text-blue-500">Tracker</span>
              </span>
            </Link>
            <p className="text-sm">
              Acompanhe seus treinos, monitore seu progresso e alcance seus objetivos fitness com facilidade.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links rápidos */}
          <div>
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {['Treinos', 'Exercícios', 'Estatísticas', 'Perfil', 'Configurações'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className={`text-sm hover:underline ${
                      darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
                    }`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 - Contato/Newsletter */}
          <div>
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Receba Novidades
            </h3>
            <p className="text-sm mb-4">
              Inscreva-se para receber dicas de treino e atualizações.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className={`text-sm px-3 py-2 rounded-l-md w-full focus:outline-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-100 border-gray-200 text-gray-900'
                }`}
              />
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p>© {year} FitnessTracker. Todos os direitos reservados.</p>
          <p className="flex items-center">
            Feito com <FaHeart className="text-red-500 mx-1" size={12} /> para atletas de todos os níveis
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
