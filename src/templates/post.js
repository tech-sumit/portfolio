import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout"; 
import { useGradient } from '../context/GradientContext';
import * as styles from '../styles/post.module.css';

const PostTemplate = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, html, timeToRead } = markdownRemark;
  const { selectedGradient } = useGradient();

  return (
    <Layout>
      <article className={styles.postContainer}>
        {/* Back to Blog Link */}
        <Link to="/blog" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Blog
        </Link>

        {/* Post Header */}
        <header className={styles.postHeader}>
          <h1 
            className={styles.postTitle}
            style={{
              background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {frontmatter.title}
          </h1>
          
          <div className={styles.postMeta}>
            {frontmatter.date && (
              <span className={styles.postDate}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {frontmatter.date}
              </span>
            )}
            {timeToRead && (
              <span className={styles.readTime}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {timeToRead} min read
              </span>
            )}
          </div>

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className={styles.postTags}>
              {frontmatter.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className={styles.tag}
                  style={{
                    background: `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}15, ${selectedGradient?.colors?.[1] || '#764ba2'}15)`,
                    border: `1px solid ${selectedGradient?.colors?.[0] || '#667eea'}30`,
                    color: selectedGradient?.colors?.[0] || '#667eea'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div 
          className={styles.divider}
          style={{
            background: `linear-gradient(90deg, ${selectedGradient?.colors?.[0] || '#667eea'}40, ${selectedGradient?.colors?.[1] || '#764ba2'}40, transparent)`
          }}
        />

        {/* Post Content */}
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer Navigation */}
        <footer className={styles.postFooter}>
          <Link 
            to="/blog" 
            className={styles.footerLink}
            style={{
              borderColor: `${selectedGradient?.colors?.[0] || '#667eea'}40`
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            View All Posts
          </Link>
        </footer>
      </article>
    </Layout>
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
        description
      }
    }
  }
`; 