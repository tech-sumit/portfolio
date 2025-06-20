import React, { createContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // State to hold the current theme name ('light' or 'dark')
  const [theme, setTheme] = useState(() => {
    // Check localStorage first only on client-side
    if (typeof window !== 'undefined') {
      const localTheme = window.localStorage.getItem('theme');
      if (localTheme) {
        return localTheme;
      }
      // Check system preference if no localStorage value
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    // Default theme during SSR/build time (won't affect client initial render)
    return 'dark';
  });

  // Effect to update body class and localStorage when theme changes
  useEffect(() => {
    // This effect runs only on the client
    const root = window.document.body; // Apply class to body
    
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