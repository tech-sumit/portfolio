const React = require('react');
const { ThemeProvider } = require('./src/context/ThemeContext');
const { GradientProvider } = require('./src/context/GradientContext');

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents, setPreBodyComponents }) => {
  setHtmlAttributes({ lang: `en` })
  
  // Set initial gradient CSS variables for SSR
  const initialGradientCSS = `
      :root {
        --gradient-primary: #dd83ad !important;
        --gradient-secondary: #c3e1fc !important;
        --gradient-bg: linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%) !important;
        --gradient-text: linear-gradient(45deg, #dd83ad, #c3e1fc) !important;
      }
  `
  
  // Theme initialization script to prevent flash
  const themeScript = `
    (function() {
      function getInitialTheme() {
        const persistedTheme = window.localStorage.getItem('theme');
        const hasPersistedTheme = typeof persistedTheme === 'string';
        
        if (hasPersistedTheme) {
          return persistedTheme;
        }
        
        const mql = window.matchMedia('(prefers-color-scheme: light)');
        const hasMediaQueryPreference = typeof mql.matches === 'boolean';
        
        if (hasMediaQueryPreference) {
          return mql.matches ? 'light' : 'dark';
        }
        
        return 'dark';
      }
      
      const theme = getInitialTheme();
      const root = document.body;
      
      // Add preload class to prevent transitions during theme setup
      root.classList.add('preload');
      
      root.classList.remove('light-theme', 'dark-theme');
      if (theme === 'light') {
        root.classList.add('light-theme');
      }
      
      // Remove preload class after a brief delay to allow transitions
      setTimeout(() => {
        root.classList.remove('preload');
      }, 100);
    })();
  `
  
  setHeadComponents([
    React.createElement('style', {
      key: 'initial-gradient',
      dangerouslySetInnerHTML: { __html: initialGradientCSS }
    }),
    // Google AdSense
    React.createElement('script', {
      key: 'google-adsense',
      async: true,
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9953784416776334',
      crossOrigin: 'anonymous'
    })
  ])
  
  setPreBodyComponents([
    React.createElement('script', {
      key: 'theme-script',
      dangerouslySetInnerHTML: { __html: themeScript }
    })
  ])
}

/**
 * @type {import('gatsby').GatsbySSR['wrapRootElement']}
 */
exports.wrapRootElement = ({ element }) => {
  return React.createElement(
    GradientProvider, 
    null, 
    React.createElement(ThemeProvider, null, element)
  );
};
