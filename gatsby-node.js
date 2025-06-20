const path = require('path');

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent);
    const slug = path.basename(fileNode.relativePath, path.extname(fileNode.relativePath));
    const sourceInstanceName = fileNode.sourceInstanceName;

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
     
    // Add sourceInstanceName to fields for easier querying in createPages
    createNodeField({
      node,
      name: `sourceInstanceName`,
      value: sourceInstanceName,
    });

    // Add empty skill category explanations field for backward compatibility
    if (sourceInstanceName === 'resume' && slug === 'skills') {
      createNodeField({
        node,
        name: 'skillCategoryExplanations',
        value: JSON.stringify({}),
      });
    }
  }
};

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Define template paths
  const pageTemplate = path.resolve(`./src/templates/page.js`);
  const postTemplate = path.resolve(`./src/templates/post.js`);
  const skillsPageComponent = path.resolve(`./src/pages/skills.js`);
  const experiencePageComponent = path.resolve(`./src/pages/experience.js`);
  const projectsPageComponent = path.resolve(`./src/pages/projects.js`);
  const aboutPageComponent = path.resolve(`./src/pages/about.js`);

  // Query for markdown nodes
  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        nodes {
          fields {
            slug
            sourceInstanceName
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error loading markdown content`, result.errors);
    return;
  }

  const contentNodes = result.data.allMarkdownRemark.nodes;

  // Create pages for each markdown file.
  if (contentNodes.length > 0) {
    contentNodes.forEach((node) => {
      const slug = node.fields.slug;
      const sourceInstanceName = node.fields.sourceInstanceName;
      let pagePath;
      let component;
      let context = { slug: slug };

      reporter.info(`Processing node: slug=${slug}, source=${sourceInstanceName}`);

      // Determine path and template based on source
      if (sourceInstanceName === 'pages') {
          pagePath = slug === 'index' ? '/' : `/${slug}`;
          if (slug === 'projects') {
              component = projectsPageComponent;
              reporter.info(`  -> Matched 'pages/projects'. Using specific component: ${component}. Path: ${pagePath}`);
          } else if (slug === 'about') {
              component = aboutPageComponent;
              reporter.info(`  -> Matched 'pages/about'. Using specific component: ${component}. Path: ${pagePath}`);
          } else {
              component = pageTemplate;
              reporter.info(`  -> Matched 'pages' (generic). Path: ${pagePath}`);
          }
      } else if (sourceInstanceName === 'resume') {
          pagePath = `/${slug}`;
          if (slug === 'skills') {
             component = skillsPageComponent;
             reporter.info(`  -> Matched 'resume/skills'. Using specific component: ${component}. Path: ${pagePath}`);
          } else if (slug === 'experience') {
             component = experiencePageComponent;
             reporter.info(`  -> Matched 'resume/experience'. Using specific component: ${component}. Path: ${pagePath}`);
          } else {
             component = pageTemplate;
             reporter.info(`  -> Matched 'resume' (generic). Path: ${pagePath}`);
          }
      } else if (sourceInstanceName === 'posts') {
          pagePath = `/blog/${slug}`;
          component = postTemplate;
          reporter.info(`  -> Matched 'posts'. Path: ${pagePath}`);
      } else {
          // Generic fallback
          pagePath = `/${slug}`;
          component = pageTemplate;
          reporter.info(`  -> Generic fallback. Path: ${pagePath}`);
      }

      reporter.info(`  --> Attempting createPage for path: ${pagePath} with component: ${component}`);

      createPage({
        path: pagePath,
        component: component,
        context: context,
      });
    });
  }
};
