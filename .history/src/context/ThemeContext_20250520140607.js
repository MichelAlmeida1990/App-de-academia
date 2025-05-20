// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * Contexto para gerenciamento de tema da aplicação
 * Fornece funcionalidades para:
 * - Alternar entre temas claro e escuro
 * - Personalizar cores de destaque
 * - Gerenciar preferências de aparência
 */
export const ThemeContext = createContext();

/**
 * Hook personalizado para acessar o ThemeContext
 * @returns {Object} Objeto contendo estado e funções do tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

// Cores de destaque disponíveis na aplicação
const AVAILABLE_ACCENT_COLORS = ['blue', 'purple', 'green', 'red', 'orange', 'pink'];

// Configurações padrão do tema
const DEFAULT_THEME_SETTINGS = {
  darkMode: false,
  accentColor: 'blue',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium', // 'small', 'medium', 'large'
};

export const ThemeProvider = ({ children }) => {
  // Carrega as configurações salvas ou usa as configurações do sistema
  const loadSavedSettings = () => {
    try {
      const savedSettings = localStorage.getItem('themeSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
      
      // Se não houver configurações salvas, verifica preferências do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      return {
        ...DEFAULT_THEME_SETTINGS,
        darkMode: prefersDark,
        reducedMotion: prefersReducedMotion,
      };
    } catch (error) {
      console.error('Erro ao carregar configurações de tema:', error);
      return DEFAULT_THEME_SETTINGS;
    }
  };

  // Estado para armazenar todas as configurações de tema
  const [themeSettings, setThemeSettings] = useState(loadSavedSettings);
  
  // Extrai configurações individuais para facilitar o uso
  const { darkMode, accentColor, reducedMotion, highContrast, fontSize } = themeSettings;

  // Salva as configurações quando elas mudam
  useEffect(() => {
    try {
      localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
      
      // Para compatibilidade com código existente
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      localStorage.setItem('accentColor', accentColor);
      
      // Aplica ou remove a classe 'dark' no elemento HTML
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Define a cor do tema na meta tag
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          darkMode ? "#111827" : "#ffffff"
        );
      }
      
      // Aplica configurações de acessibilidade
      if (reducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
      
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      // Aplica tamanho de fonte
      // src/context/ThemeContext.js (continuação)
      document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
      
      switch (fontSize) {
        case 'small':
          document.documentElement.classList.add('text-sm');
          break;
        case 'large':
          document.documentElement.classList.add('text-lg');
          break;
        default:
          document.documentElement.classList.add('text-base');
      }
      
    } catch (error) {
      console.error('Erro ao salvar configurações de tema:', error);
    }
  }, [themeSettings]);

  // Monitora mudanças nas preferências do sistema
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleDarkModeChange = (e) => {
      setThemeSettings(prev => ({
        ...prev,
        darkMode: e.matches
      }));
    };
    
    const handleReducedMotionChange = (e) => {
      setThemeSettings(prev => ({
        ...prev,
        reducedMotion: e.matches
      }));
    };
    
    // Adiciona listeners para mudanças nas preferências do sistema
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    reducedMotionMediaQuery.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
      reducedMotionMediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  /**
   * Alterna entre modo claro e escuro
   */
  const toggleDarkMode = () => {
    setThemeSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  /**
   * Alias para toggleDarkMode para compatibilidade com código existente
   */
  const toggleTheme = toggleDarkMode;

  /**
   * Altera a cor de destaque do tema
   * @param {string} color - Nova cor de destaque
   */
  const changeAccentColor = (color) => {
    if (AVAILABLE_ACCENT_COLORS.includes(color)) {
      setThemeSettings(prev => ({
        ...prev,
        accentColor: color
      }));
    } else {
      console.warn(`Cor de destaque inválida: ${color}. Opções disponíveis: ${AVAILABLE_ACCENT_COLORS.join(', ')}`);
    }
  };

  /**
   * Atualiza uma configuração específica do tema
   * @param {string} setting - Nome da configuração
   * @param {any} value - Novo valor
   */
  const updateSetting = (setting, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  /**
   * Restaura todas as configurações para os valores padrão
   */
  const resetToDefaults = () => {
    setThemeSettings(DEFAULT_THEME_SETTINGS);
  };

  /**
   * Verifica se a animação deve ser aplicada com base nas preferências
   * @returns {boolean} True se animações devem ser aplicadas
   */
  const shouldAnimate = !reducedMotion;

  // Valores e funções expostos pelo contexto
  const contextValue = {
    // Configurações individuais
    darkMode,
    accentColor,
    reducedMotion,
    highContrast,
    fontSize,
    
    // Funções para manipular o tema
    toggleDarkMode,
    toggleTheme, // Alias para compatibilidade
    changeAccentColor,
    updateSetting,
    resetToDefaults,
    
    // Helpers
    shouldAnimate,
    
    // Constantes
    AVAILABLE_ACCENT_COLORS,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

