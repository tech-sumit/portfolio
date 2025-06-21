/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";
import Footer from "./Footer";
import ChatbotWidget from "./ChatbotWidget";
import { useScrollHeader } from '../hooks/useScrollHeader';
import * as styles from './Layout.module.css'; // CSS Module for Layout

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const isScrolled = useScrollHeader();

  const getMainContentClass = () => {
    if (isScrolled) return `${styles.mainContent} ${styles.scrolledContent}`;
    return `${styles.mainContent} ${styles.floatingHeaderContent}`;
  };

  return (
    <div className={styles.layoutContainer}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <main className={getMainContentClass()}>{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
