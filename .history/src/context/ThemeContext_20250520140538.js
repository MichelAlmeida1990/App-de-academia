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
      document.documentElement.classList.remove('text-sm', '
