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
import AIVisitorBanner from "./AIVisitorBanner";
import { useAnalytics } from "../hooks/useAnalytics";
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
  
  // Initialize comprehensive analytics tracking
  useAnalytics();

  const getMainContentClass = () => {
    if (isScrolled) return `${styles.mainContent} ${styles.scrolledContent}`;
    return `${styles.mainContent} ${styles.floatingHeaderContent}`;
  };

  return (
    <div className={styles.layoutContainer}>
      <AIVisitorBanner />
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
