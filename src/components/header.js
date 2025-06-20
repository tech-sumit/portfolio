import React from "react";
import { Link } from "gatsby";
import * as styles from './Header.module.css'; // We'll create this CSS Module next
import ThemeToggle from './ThemeToggle'; // Import the toggle
import logoImage from '../images/logo.png'; // Direct import

const Header = ({ siteTitle }) => (
  <header className={styles.header}>
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
          <span>{siteTitle || `Portfolio`}</span>
        </div>
      </Link>
      {/* Wrap nav and toggle for better layout control */}
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <Link to="/about" activeClassName={styles.activeLink}>About</Link>
          <Link to="/projects" activeClassName={styles.activeLink}>Projects</Link>
          <Link to="/skills" activeClassName={styles.activeLink}>Skills</Link>
          <Link to="/experience" activeClassName={styles.activeLink}>Experience</Link>
          <Link to="/blog" activeClassName={styles.activeLink}>Blog</Link>
          {/* Add other links (e.g., achievements, education) if desired */}
        </nav>
        <ThemeToggle /> {/* Add the toggle button */}
      </div>
    </div>
  </header>
);

export default Header;
