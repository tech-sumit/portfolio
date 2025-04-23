import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import "./src/styles/global.css"

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>;
};

// You can delete this file if you're not using it
