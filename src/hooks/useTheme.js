import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light');

  useEffect(() => {
    // Apply theme to the document level
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};