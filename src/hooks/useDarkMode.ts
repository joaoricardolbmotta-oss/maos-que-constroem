/**
 * Dark Mode Hook
 * Fase 32: Dark Mode System
 */

'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load saved theme
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // Check system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
      applyTheme('system');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;

    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
      systemDark ? html.classList.add('dark') : html.classList.remove('dark');
    } else {
      const dark = newTheme === 'dark';
      setIsDark(dark);
      dark ? html.classList.add('dark') : html.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const setToLight = () => {
    setTheme('light');
    localStorage.setItem('theme', 'light');
    applyTheme('light');
  };

  const setToDark = () => {
    setTheme('dark');
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');
  };

  const setToSystem = () => {
    setTheme('system');
    localStorage.removeItem('theme');
    applyTheme('system');
  };

  return {
    theme,
    isDark,
    mounted,
    toggleTheme,
    setToLight,
    setToDark,
    setToSystem,
  };
}
