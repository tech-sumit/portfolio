const path = require('path');



/**
 * Parse skills from markdown content
 */
const parseSkillsFromMarkdown = (markdownContent) => {
  const skillCategories = [];
  const lines = markdownContent.split('\n');
  
  let currentCategory = null;
  let inSkillsList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for category headers (h3 tags)
    if (line.match(/^<h3[^>]*>.*<\/h3>$/)) {
      // Extract category name, removing HTML tags and img tags
      let categoryName = line
        .replace(/<h3[^>]*>/g, '')
        .replace(/<\/h3>/g, '')
        .replace(/<img[^>]*>/g, '') // Remove img tags
        .trim();
      
      if (categoryName) {
        currentCategory = {
          name: categoryName,
          skills: []
        };
        skillCategories.push(currentCategory);
        inSkillsList = false;
      }
    }
    // Check for start of skills list
    else if (line === '<ul>' || line.match(/^\s*<ul>/)) {
      inSkillsList = true;
    }
    // Check for end of skills list
    else if (line === '</ul>' || line.match(/^\s*<\/ul>/)) {
      inSkillsList = false;
    }
    // Parse skill items
    else if (inSkillsList && currentCategory && line.match(/^\s*<li[^>]*>/)) {
      // Extract skill name, removing HTML tags
      let skillName = line
        .replace(/<li[^>]*>/g, '')
        .replace(/<\/li>/g, '')
        .replace(/<img[^>]*>/g, '') // Remove img tags
        .trim();
      
      if (skillName) {
        currentCategory.skills.push({
          name: skillName
        });
      }
    }
  }
  
  return skillCategories;
};

/**
 * Implement Gatsby's Node APIs in this file.
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
     
    createNodeField({
      node,
      name: `sourceInstanceName`,
      value: sourceInstanceName,
    });

    // Process skills markdown and extract skill structure
    if (sourceInstanceName === 'resume' && slug === 'skills') {
      try {
        const markdownContent = node.rawMarkdownBody || '';
        const skillCategories = parseSkillsFromMarkdown(markdownContent);
        
        // Create skills data field
        createNodeField({
          node,
          name: 'skillsData',
          value: JSON.stringify(skillCategories),
        });
      } catch (error) {
        console.warn('Error processing skills data:', error);
        createNodeField({
          node,
          name: 'skillsData',
          value: JSON.stringify([]),
        });
      }
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

  if (result.errors) {
    reporter.panicOnBuild(`Error loading markdown content`, result.errors);
    return;
  }

  const contentNodes = result.data.allMarkdownRemark.nodes;

  if (contentNodes.length > 0) {
    contentNodes.forEach((node) => {
      const slug = node.fields.slug;
      const sourceInstanceName = node.fields.sourceInstanceName;
      let pagePath;
      let component;
      let context = { slug: slug };

      reporter.info(`Processing node: slug=${slug}, source=${sourceInstanceName}`);

      if (sourceInstanceName === 'pages') {
          pagePath = slug === 'index' ? '/' : `/${slug}`;
          if (slug === 'projects') {
              component = projectsPageComponent;
          } else if (slug === 'about') {
              component = aboutPageComponent;
          } else {
              component = pageTemplate;
          }
      } else if (sourceInstanceName === 'resume') {
          pagePath = `/${slug}`;
          if (slug === 'skills') {
             component = skillsPageComponent;
          } else if (slug === 'experience') {
             component = experiencePageComponent;
          } else {
             component = pageTemplate;
          }
      } else if (sourceInstanceName === 'posts') {
          pagePath = `/blog/${slug}`;
          component = postTemplate;
      } else {
          pagePath = `/${slug}`;
          component = pageTemplate;
      }

      createPage({
        path: pagePath,
        component: component,
        context: context,
      });
    });
  }
};
