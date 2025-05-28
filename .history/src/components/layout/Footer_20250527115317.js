// src/components/layout/Footer.js (Versão Aprimorada)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaYoutube, FaHeart, FaArrowUp, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { darkMode, accentColor, shouldAnimate } = useTheme();
  const year = new Date().getFullYear();

  // Links rápidos com rotas
  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Treinos', path: '/workouts' },
    { name: 'Exercícios', path: '/exercises' },
    { name: 'Estatísticas', path: '/stats' },
    { name: 'Perfil', path: '/profile' },
    { name: 'Configurações', path: '/settings' },
  ];

  // Links de recursos
  const resourceLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Tutoriais', path: '/tutorials' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Suporte', path: '/support' },
  ];

  // Função para rolar para o topo suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className={`py-10 px-4 mt-auto border-t transition-colors duration-300 relative ${
      darkMode 
        ? 'bg-gray-900 border-gray-800 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-600'
    }`}>
      {/* Botão de voltar ao topo */}
      <motion.button
        onClick={scrollToTop}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg ${
          darkMode 
            ? `bg-${accentColor}-600 text-white hover:bg-${accentColor}-700` 
            : `bg-${accentColor}-500 text-white hover:bg-${accentColor}-600`
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        <FaArrowUp />
      </motion.button>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={shouldAnimate ? containerVariants : {}}
          initial={shouldAnimate ? "hidden" : "visible"}
          whileInView={shouldAnimate ? "visible" : "visible"}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Coluna 1 - Logo e descrição */}
          <motion.div 
            className="flex flex-col space-y-4"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <Link to="/" className="flex items-center">
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Fitness<span className={`text-${accentColor}-500`}>Tracker</span>
              </span>
            </Link>
            <p className="text-sm">
              Acompanhe seus treinos, monitore seu progresso e alcance seus objetivos fitness com facilidade.
              Nossa plataforma foi desenvolvida para ajudar você a manter o foco e a consistência.
            </p>
            <div className="flex space-x-4 mt-4">
              {[
                { icon: <FaInstagram size={18} />, url: 'https://instagram.com', label: 'Instagram' },
                { icon: <FaTwitter size={18} />, url: 'https://twitter.com', label: 'Twitter' },
                { icon: <FaYoutube size={18} />, url: 'https://youtube.com', label: 'YouTube' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
                    darkMode 
                      ? `bg-gray-800 text-${accentColor}-400 hover:bg-${accentColor}-600 hover:text-white` 
                      : `bg-gray-100 text-${accentColor}-500 hover:bg-${accentColor}-500 hover:text-white`
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Coluna 2 - Links rápidos */}
          <motion.div variants={shouldAnimate ? itemVariants : {}}>
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`text-sm hover:underline transition-colors ${
                      darkMode ? `hover:text-${accentColor}-400` : `hover:text-${accentColor}-600`
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna 3 - Recursos */}
          <motion.div variants={shouldAnimate ? itemVariants : {}}>
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Recursos
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`text-sm hover:underline transition-colors ${
                      darkMode ? `hover:text-${accentColor}-400` : `hover:text-${accentColor}-600`
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={`mt-6 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className="text-xs">
                <strong>Novo!</strong> Baixe nosso aplicativo móvel para acompanhar seus treinos em qualquer lugar.
              </p>
              <div className="mt-2 flex space-x-2">
                <motion.a 
                  href="#" 
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    darkMode 
                      ? `bg-${accentColor}-600/60 text-white hover:bg-${accentColor}-600` 
                      : `bg-${accentColor}-500 text-white hover:bg-${accentColor}-600`
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  App Store
                </motion.a>
                <motion.a 
                  href="#" 
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    darkMode 
                      ? `bg-${accentColor}-600/60 text-white hover:bg-${accentColor}-600` 
                      : `bg-${accentColor}-500 text-white hover:bg-${accentColor}-600`
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Google Play
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Coluna 4 - Contato/Newsletter */}
          <motion.div variants={shouldAnimate ? itemVariants : {}}>
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Receba Novidades
            </h3>
            <p className="text-sm mb-4">
              Inscreva-se para receber dicas de treino, novidades e atualizações exclusivas.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div className="flex">
                <div className={`flex-grow relative`}>
                  <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className={`text-sm pl-10 pr-3 py-2.5 rounded-l-md w-full focus:outline-none transition-colors ${
                      darkMode 
                        ? `bg-gray-800 border-gray-700 text-white focus:border-${accentColor}-500` 
                        : `bg-gray-100 border-gray-200 text-gray-900 focus:border-${accentColor}-500`
                    }`}
                    aria-label="Endereço de e-mail"
                  />
                </div>
                <motion.button 
                  type="submit"
                  className={`bg-${accentColor}-500 hover:bg-${accentColor}-600 text-white px-4 py-2.5 rounded-r-md text-sm transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enviar
                </motion.button>
              </div>
              <p className="text-xs opacity-70">
                Ao se inscrever, você concorda com nossa Política de Privacidade.
              </p>
            </form>
            
            <div className={`mt-6 p-4 rounded-lg border ${
              darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className={`font-medium text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Precisa de ajuda?
              </h4>
              <p className="text-xs mb-2">
                Nossa equipe de suporte está disponível 24/7 para ajudar você.
              </p>
              <motion.a 
                href="mailto:suporte@fitnesstracker.com" 
                className={`inline-block text-xs font-medium ${
                  darkMode ? `text-${accentColor}-400` : `text-${accentColor}-600`
                }`}
                whileHover={{ x: 2 }}
              >
                Contatar Suporte →
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Rodapé com copyright e links legais */}
        <div className="mt-10 pt-6 border-t text-xs flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p>© {year} FitnessTracker. Todos os direitos reservados.</p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="hover:underline">Privacidade</Link>
              <Link to="/terms" className="hover:underline">Termos</Link>
              <Link to="/cookies" className="hover:underline">Cookies</Link>
            </div>
          </div>
          <motion.p 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            Feito com <FaHeart className={`text-${accentColor}-500 mx-1`} size={10} /> para atletas de todos os níveis
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
