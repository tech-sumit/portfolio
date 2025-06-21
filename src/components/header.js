import React from "react";
import { Link } from "gatsby";
import * as styles from './Header.module.css'; // We'll create this CSS Module next
import ThemeToggle from './ThemeToggle'; // Import the toggle
import { useGradient } from '../context/GradientContext';
import { useScrollHeader } from '../hooks/useScrollHeader';
import logoImage from '../images/logo.png'; // Direct import

const Header = ({ siteTitle }) => {
  const { selectedGradient, isLoading } = useGradient();
  const isScrolled = useScrollHeader();

  const getHeaderClass = () => {
    if (isScrolled) return `${styles.header} ${styles.headerScrolled}`;
    return `${styles.header} ${styles.headerBottom}`;
  };

  if (isLoading) {
    return (
      <header className={getHeaderClass()}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.titleLink}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={logoImage}
                alt="Logo"
                style={{ 
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover'
                }}
              />
              <span className="gradient-text">{siteTitle || `Portfolio`}</span>
            </div>
          </Link>
          <div className={styles.navContainer}>
            <nav className={styles.nav}>
              <Link to="/projects" activeClassName={styles.activeLink}>Projects</Link>
              <Link to="/skills" activeClassName={styles.activeLink}>Skills</Link>
              <Link to="/experience" activeClassName={styles.activeLink}>Experience</Link>
              <Link to="/blog" activeClassName={styles.activeLink}>Blog</Link>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link 
                to="/about" 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
              >
                About Me
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={getHeaderClass()}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.titleLink}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={logoImage}
              alt="Logo"
              style={{ 
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                objectFit: 'cover'
              }}
            />
                         <span style={{
               background: selectedGradient?.textGradient || 'var(--gradient-text)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               backgroundClip: 'text'
             }}>{siteTitle || `Portfolio`}</span>
          </div>
        </Link>
        <div className={styles.navContainer}>
          <nav className={styles.nav}>
            <Link to="/projects" activeClassName={styles.activeLink}>Projects</Link>
            <Link to="/skills" activeClassName={styles.activeLink}>Skills</Link>
            <Link to="/experience" activeClassName={styles.activeLink}>Experience</Link>
            <Link to="/blog" activeClassName={styles.activeLink}>Blog</Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link 
              to="/about" 
              style={{
                background: selectedGradient?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '10px 20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
              }}
            >
              About Me
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
