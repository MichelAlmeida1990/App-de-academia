// src/components/layout/Footer.js
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative py-16 px-4 mt-auto border-t border-white/20">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Botão de voltar ao topo */}
      <motion.button
        onClick={scrollToTop}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn-gradient rounded-full p-4 shadow-2xl"
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        <FaArrowUp className="text-white" />
      </motion.button>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={shouldAnimate ? containerVariants : {}}
          initial={shouldAnimate ? "hidden" : "visible"}
          whileInView={shouldAnimate ? "visible" : "visible"}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Coluna 1 - Logo e descrição */}
          <motion.div 
            className="flex flex-col space-y-6"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🏋️</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Fitness<span className="text-gradient-light">Tracker</span>
              </span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Acompanhe seus treinos, monitore seu progresso e alcance seus objetivos fitness com facilidade.
              Nossa plataforma foi desenvolvida para ajudar você a manter o foco e a consistência.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaInstagram size={20} />, url: 'https://instagram.com', label: 'Instagram' },
                { icon: <FaTwitter size={20} />, url: 'https://twitter.com', label: 'Twitter' },
                { icon: <FaYoutube size={20} />, url: 'https://youtube.com', label: 'YouTube' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
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
          <motion.div 
            className="space-y-6"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-white/80 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna 3 - Recursos */}
          <motion.div 
            className="space-y-6"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">📚</span>
              Recursos
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-white/80 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="card-glass p-4 rounded-xl border border-white/20">
              <p className="text-white/90 text-sm font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">📱</span>
                <strong>Novo!</strong> App Móvel
              </p>
              <p className="text-white/70 text-xs mb-4">
                Baixe nosso aplicativo para acompanhar seus treinos em qualquer lugar.
              </p>
              <div className="flex gap-2">
                <motion.a 
                  href="#" 
                  className="btn-gradient text-xs px-3 py-2 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  App Store
                </motion.a>
                <motion.a 
                  href="#" 
                  className="btn-gradient text-xs px-3 py-2 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Google Play
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Coluna 4 - Newsletter */}
          <motion.div 
            className="space-y-6"
            variants={shouldAnimate ? itemVariants : {}}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">✉️</span>
              Newsletter
            </h3>
            <p className="text-white/80 text-sm">
              Inscreva-se para receber dicas de treino, novidades e atualizações exclusivas.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  aria-label="Endereço de e-mail"
                />
              </div>
              <motion.button 
                type="submit"
                className="btn-gradient w-full py-3 rounded-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Inscrever-se
              </motion.button>
              <p className="text-white/60 text-xs">
                Ao se inscrever, você concorda com nossa Política de Privacidade.
              </p>
            </form>
            
            <div className="card-glass p-4 rounded-xl border border-white/20">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                <span className="text-lg">🆘</span>
                Precisa de ajuda?
              </h4>
              <p className="text-white/70 text-xs mb-3">
                Nossa equipe de suporte está disponível 24/7 para ajudar você.
              </p>
              <motion.a 
                href="mailto:suporte@fitnesstracker.com" 
                className="inline-flex items-center gap-2 text-xs font-medium text-white hover:text-purple-300 transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <span>💬</span>
                Contatar Suporte →
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Rodapé com copyright e links legais */}
        <motion.div 
          className="mt-16 pt-8 border-t border-white/20"
          variants={shouldAnimate ? itemVariants : {}}
          initial={shouldAnimate ? "hidden" : "visible"}
          whileInView={shouldAnimate ? "visible" : "visible"}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-white/80 text-sm">
                © {year} FitnessTracker. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
                  Privacidade
                </Link>
                <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
                  Termos
                </Link>
                <Link to="/cookies" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
                  Cookies
                </Link>
              </div>
            </div>
            <motion.p 
              className="flex items-center gap-2 text-white/80 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span>Feito com</span>
              <FaHeart className="text-red-400 animate-pulse" size={12} />
              <span>para atletas de todos os níveis</span>
              <span className="text-lg">💪</span>
            </motion.p>
          </div>
        </motion.div>

        {/* Estatísticas do rodapé */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={shouldAnimate ? containerVariants : {}}
          initial={shouldAnimate ? "hidden" : "visible"}
          whileInView={shouldAnimate ? "visible" : "visible"}
          viewport={{ once: true }}
        >
          <motion.div 
            className="card-glass text-center p-6 rounded-xl border border-white/20"
            variants={shouldAnimate ? itemVariants : {}}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-gradient-light mb-2">1000+</div>
            <div className="text-white/80 text-sm flex items-center justify-center gap-2">
              <span>👥</span> Usuários Ativos
            </div>
          </motion.div>
          <motion.div 
            className="card-glass text-center p-6 rounded-xl border border-white/20"
            variants={shouldAnimate ? itemVariants : {}}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-gradient-light mb-2">50+</div>
            <div className="text-white/80 text-sm flex items-center justify-center gap-2">
              <span>💪</span> Exercícios
            </div>
          </motion.div>
          <motion.div 
            className="card-glass text-center p-6 rounded-xl border border-white/20"
            variants={shouldAnimate ? itemVariants : {}}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-gradient-light mb-2">24/7</div>
            <div className="text-white/80 text-sm flex items-center justify-center gap-2">
              <span>🌍</span> Disponível
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
