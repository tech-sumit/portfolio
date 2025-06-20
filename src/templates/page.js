import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout"; // Import Layout
// import Seo from "../components/seo"; // Optional: Import SEO component

// Basic Layout component (assuming you have one or will create one)
// import Layout from "../components/layout"; 

const PageTemplate = ({ data }) => {
  const { markdownRemark } = data; // data.markdownRemark holds your page data
  const { frontmatter, html } = markdownRemark;

  return (
    <Layout> {/* Wrap with Layout */}
      {/* Optional: <Seo title={frontmatter.title} /> */}
      <h1>{frontmatter.title}</h1>
      <div
        className="page-content" // Keep or add specific class if needed
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  );
};

export default PageTemplate;

// GraphQL query to fetch markdown data for the current page by slug
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        # Add other frontmatter fields you need, e.g., date
      }
    }
  }
`; 