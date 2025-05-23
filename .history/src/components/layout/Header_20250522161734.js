// src/components/layout/Header.js (Parte do menu mobile corrigida)

{/* Menu Mobile - CORRIGIDO */}
<AnimatePresence>
  {isMobileMenuOpen && (
    <>
      {/* Overlay de fundo escuro */}
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Painel lateral do menu */}
      <motion.div
        className={`fixed inset-y-0 right-0 w-4/5 max-w-sm h-full z-50 flex flex-col ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        } shadow-xl`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      >
        {/* Cabeçalho do menu */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Menu
            </span>
            <motion.button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fechar menu"
            >
              <FaTimes />
            </motion.button>
          </div>
        </div>
        
        {/* Conteúdo do menu */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          <nav className="space-y-1">
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTachometerAlt className="mr-3" />
                  <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                  to="/workouts" 
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaDumbbell className="mr-3" />
                  <span>Treinos</span>
                </NavLink>
                
                <NavLink 
                  to="/stats" 
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaChartLine className="mr-3" />
                  <span>Estatísticas</span>
                </NavLink>
                
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="mr-3" />
                  <span>Perfil</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="mr-3" />
                  <span>Entrar</span>
                </NavLink>
                
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="mr-3" />
                  <span>Registrar</span>
                </NavLink>
              </>
            )}
            
            <div className={`my-2 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            
            <NavLink 
              to="/faq" 
              className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                isActive 
                  ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                  : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaQuestionCircle className="mr-3" />
              <span>FAQ</span>
            </NavLink>
            
            <NavLink 
              to="/support" 
              className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${
                isActive 
                  ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400` 
                  : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHeadset className="mr-3" />
              <span>Suporte</span>
            </NavLink>
          </nav>
        </div>
        
        {/* Rodapé do menu com botão de logout */}
        {isAuthenticated && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center p-3 rounded-lg text-center font-medium ${
                darkMode 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
              }`}
            >
              Sair
            </button>
          </div>
        )}
      </motion.div>
    </>
  )}
</AnimatePresence>
