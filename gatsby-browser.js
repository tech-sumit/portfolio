import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { GradientProvider } from './src/context/GradientContext';
import "./src/styles/global.css"

// Prism.js core library (must be imported before language components)
import "prismjs"
// Prism.js syntax highlighting theme
import "prismjs/themes/prism-tomorrow.css"
// Additional language support
import "prismjs/components/prism-bash"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-python"
import "prismjs/components/prism-go"
import "prismjs/components/prism-docker"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-c"
import "prismjs/components/prism-swift"



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

// Reload Twitter widgets on route change for tweet embeds
export const onRouteUpdate = () => {
  if (typeof window !== 'undefined' && window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load();
  }
};
