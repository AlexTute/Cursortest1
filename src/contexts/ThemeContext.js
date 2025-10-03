"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#e11d2b');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    const savedAccentColor = localStorage.getItem('accentColor');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Also set it on the html element for immediate effect
    document.documentElement.className = theme;
    
    console.log('Theme changed to:', theme);
    console.log('HTML element classes:', document.documentElement.className);
    console.log('HTML data-theme:', document.documentElement.getAttribute('data-theme'));
  }, [theme]);

  useEffect(() => {
    // Apply accent color to CSS custom properties
    document.documentElement.style.setProperty('--accent', accentColor);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const changeAccentColor = (newColor) => {
    setAccentColor(newColor);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      accentColor,
      changeTheme,
      changeAccentColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
