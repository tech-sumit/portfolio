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
exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
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
  
  setHeadComponents([
    React.createElement('style', {
      key: 'initial-gradient',
      dangerouslySetInnerHTML: { __html: initialGradientCSS }
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
