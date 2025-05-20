// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

// Hook personalizado para usar o ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Verifica preferência do sistema ou configuração salva
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme());
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || 'blue');

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
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
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    
    // Aqui você poderia adicionar lógica para aplicar a cor de destaque
    // aos elementos da UI dinamicamente
  }, [accentColor]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      accentColor, 
      changeAccentColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
