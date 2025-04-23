import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import * as styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Avoid rendering button potentially mismatched during hydration
  // The button logic relies on client-side state and context
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !theme) {
    // Render placeholder or null during SSR / initial mount
    return <div className={styles.placeholder} />;
  }

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'} {/* Example icons */}
    </button>
  );
};

export default ThemeToggle; 