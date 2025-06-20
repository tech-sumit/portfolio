import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { GradientProvider } from './src/context/GradientContext';
import "./src/styles/global.css"



/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

export const wrapRootElement = ({ element }) => {
  return (
    <GradientProvider>
      <ThemeProvider>{element}</ThemeProvider>
    </GradientProvider>
  );
};

// You can delete this file if you're not using it
