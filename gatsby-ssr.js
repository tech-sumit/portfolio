const React = require('react');
const { ThemeProvider } = require('./src/context/ThemeContext');

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` })
}

/**
 * @type {import('gatsby').GatsbySSR['wrapRootElement']}
 */
exports.wrapRootElement = ({ element }) => {
  return React.createElement(ThemeProvider, null, element);
  // Or alternatively: return <ThemeProvider>{element}</ThemeProvider>; requires JSX transform setup, require might be safer.
};
