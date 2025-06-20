import React from "react";
import * as styles from './Footer.module.css'; // CSS Module for Footer

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      © {new Date().getFullYear()} Sumit Agrawal. Built with
      {` `}
      <a href="https://www.gatsbyjs.com">Gatsby</a>
      {/* Add links to social profiles if desired */}
      <div className={styles.socialLinks}>
         <a href="https://www.linkedin.com/in/agrawal-sumit/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
         <a href="https://github.com/tech-sumit" target="_blank" rel="noopener noreferrer">GitHub</a>
         <a href="https://www.instagram.com/mr.sumitagrawal/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
  </footer>
);

export default Footer; 