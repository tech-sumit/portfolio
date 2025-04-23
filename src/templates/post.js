import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout"; // Import Layout
// import Seo from "../components/seo"; // Optional: Import SEO component

// Basic Layout component (assuming you have one or will create one)
// import Layout from "../components/layout"; 

const PostTemplate = ({ data }) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  return (
    <Layout> {/* Wrap with Layout */}
      {/* Optional: <Seo title={frontmatter.title} description={markdownRemark.excerpt} /> */}
      <h1>{frontmatter.title}</h1>
      {/* Display date or other meta if available in frontmatter */}
      {frontmatter.date && <p style={{color: 'var(--text-dark)', fontSize: '0.9em', marginTop: '-0.25rem', marginBottom: '1rem'}}>{frontmatter.date}</p>}
      <div
        className="post-content" // Keep or add specific class if needed
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  );
};

export default PostTemplate;

// GraphQL query to fetch markdown data for the current post by slug
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      # excerpt(pruneLength: 160) # Optional: for SEO description
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY") # Format the date
        # Add other frontmatter fields like tags, category
        # date(formatString: "MMMM DD, YYYY") 
      }
    }
  }
`; 