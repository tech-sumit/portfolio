import React from "react";
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { useGradient } from '../context/GradientContext';
import * as styles from './Footer.module.css'; // CSS Module for Footer

const Footer = () => {
  const { selectedGradient, isLoading } = useGradient();

  if (isLoading) {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerText}>
            © {new Date().getFullYear()} <span style={{ color: '#667eea' }}>Sumit Agrawal</span>. Built with
            {` `}
            <a href="https://www.gatsbyjs.com" style={{ color: '#667eea' }}>Gatsby</a>
          </div>
          <div className={styles.socialLinks}>
            <a href="https://www.linkedin.com/in/agrawal-sumit/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaLinkedin className={styles.socialIcon} />
              LinkedIn
            </a>
            <a href="https://github.com/tech-sumit" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub className={styles.socialIcon} />
              GitHub
            </a>
            <a href="https://www.instagram.com/mr.sumitagrawal/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaInstagram className={styles.socialIcon} />
              Instagram
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerText}>
          © {new Date().getFullYear()} <span style={{
            background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '600'
          }}>Sumit Agrawal</span>. Built with
          {` `}
          <a href="https://www.gatsbyjs.com" style={{
            background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '500',
            textDecoration: 'none'
          }}>Gatsby</a>
        </div>
        <div className={styles.socialLinks}>
          <a 
            href="https://www.linkedin.com/in/agrawal-sumit/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            style={{
              color: selectedGradient?.colors?.[0] || '#667eea'
            }}
          >
            <FaLinkedin className={styles.socialIcon} />
            LinkedIn
          </a>
          <a 
            href="https://github.com/tech-sumit" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            style={{
              color: selectedGradient?.colors?.[1] || '#f093fb'
            }}
          >
            <FaGithub className={styles.socialIcon} />
            GitHub
          </a>
          <a 
            href="https://www.instagram.com/mr.sumitagrawal/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            style={{
              color: selectedGradient?.colors?.[0] || '#667eea'
            }}
          >
            <FaInstagram className={styles.socialIcon} />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 