import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout"; 

const PostTemplate = ({ data }) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      {frontmatter.date && <p style={{color: 'var(--text-dark)', fontSize: '0.9em', marginTop: '-0.25rem', marginBottom: '1rem'}}>{frontmatter.date}</p>}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`; 