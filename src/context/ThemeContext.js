import React, { createContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // State to hold the current theme name ('light' or 'dark')
  const [theme, setTheme] = useState(() => {
    // During SSR, we can't access localStorage, so return undefined to avoid hydration mismatch
    if (typeof window === 'undefined') {
      return 'dark'; // This will be overridden during hydration
    }
    
    // On client-side, get the theme that was already set by our SSR script
    const localTheme = window.localStorage.getItem('theme');
    if (localTheme) {
      return localTheme;
    }
    
    // Check system preference if no localStorage value
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Effect to sync with the theme class that was set by SSR script
  useEffect(() => {
    // This effect runs only on the client after hydration
    const root = window.document.body;
    const hasLightTheme = root.classList.contains('light-theme');
    const currentTheme = hasLightTheme ? 'light' : 'dark';
    
    // If the theme state doesn't match what's already on the body, update it
    if (theme !== currentTheme) {
      setTheme(currentTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - intentionally excluding 'theme' to avoid infinite loop

  // Effect to update body class and localStorage when theme changes
  useEffect(() => {
    // This effect runs only on the client
    if (typeof window === 'undefined') return;
    
    const root = window.document.body;
    
    // Remove both classes first
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add the appropriate class (dark is default, so only add light-theme when needed)
    if (theme === 'light') {
      root.classList.add('light-theme');
    }

    // Save preference to localStorage
    window.localStorage.setItem('theme', theme);

  }, [theme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme: () => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    },
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider }; 