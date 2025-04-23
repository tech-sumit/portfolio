import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
// import Seo from "../components/seo"; // Optional: Import SEO component if you have one

const IndexPage = () => {
  return (
    <Layout>
      {/* Optional: Add SEO component here <Seo title="Home" /> */}
      <h1>Welcome to Sumit Agrawal's Portfolio</h1>
      <p>Building innovative digital solutions.</p>
      <p>Explore my work and get in touch.</p>
      {/* Add links or call-to-action buttons */}
      <nav>
        <Link to="/about">About Me</Link> |
        <Link to="/projects">Projects</Link> |
        <Link to="/skills">Skills</Link> |
        <Link to="/experience">Experience</Link> |
        <Link to="/blog">Blog</Link>
      </nav>
    </Layout>
  );
};

export default IndexPage;

// Optional: If you want to keep the Head API for SEO
// export const Head = () => <Seo title="Home" />
