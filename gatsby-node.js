const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import Google AI

// Explicitly load .env.development first for gatsby develop
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.development' });
} else {
  // You might want to load .env.production or just .env for production builds
  require('dotenv').config({ path: '.env.production' }); // Or just .env
}

// Original dotenv config commented out:
// require('dotenv').config({
//   path: `.env.${process.env.NODE_ENV}`,
// });

// Log API Key presence *after* attempting to load
console.log(`NODE_ENV is: ${process.env.NODE_ENV}`);
console.log("Attempted to load .env file. GOOGLE_AI_API_KEY present:", !!process.env.GOOGLE_AI_API_KEY);

// Initialize Google AI Client
const genAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;
console.log("Google AI Client (genAI) initialized:", !!genAI);

if (!genAI) {
  console.warn(`
    ---------------------------------------------------------------
    Google AI API Key not found. Skipping skill explanations.
    Make sure GOOGLE_AI_API_KEY is set in your .env file.
    ---------------------------------------------------------------
  `);
}

// Updated function to extract H3 headings with optional leading image tag
function extractHeadings(markdown) {
  const headings = [];
  // Regex to find <h3> tags and capture the text content after any potential <img> tag
  // It looks for <h3>, optionally matches an <img> tag, captures everything up to </h3>
  const headingRegex = /<h3(?:\s*.*?)?>(?:<img[^>]*>\s*)?([^<]+)<\/h3>/gi;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    // match[1] contains the captured group (the text content)
    if (match[1]) {
      headings.push(match[1].trim());
    }
  }
  return headings;
}

// Function to get explanations from Gemini API
async function getExplanations(categories) {
  if (!genAI || categories.length === 0) {
    return {};
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const explanations = {};

  console.log(`Fetching explanations for ${categories.length} skill categories...`);

  // Rate limiting: Process categories sequentially with a small delay
  // to avoid hitting API rate limits, especially during development builds.
  // Adjust delay as needed (e.g., 1000ms = 1 second).
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const rateLimitDelay = 1000; // 1 second delay between API calls

  for (const category of categories) {
    const prompt = `Explain the importance of "${category}" in software development in one or two concise sentences. Focus on its practical relevance.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      explanations[category] = text.trim();
      console.log(`  - Got explanation for: ${category}`);
    } catch (error) {
      console.error(`  - Error fetching explanation for "${category}":`, error.message || error);
      explanations[category] = "Could not fetch explanation."; // Provide fallback
    }
    await delay(rateLimitDelay); // Wait before the next call
  }

  console.log("Finished fetching skill explanations.");
  return explanations;
}

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

// Create slugs from filenames for markdown files
// Based on Pelican's SLUGIFY_SOURCE = 'basename'
exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent);
    const slug = path.basename(fileNode.relativePath, path.extname(fileNode.relativePath));
    const sourceInstanceName = fileNode.sourceInstanceName;

    // Log processed markdown node
    console.log(`Processing MD node: slug='${slug}', source='${sourceInstanceName}', path='${fileNode.relativePath}'`);

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

    // --- Add Skill Explanation Logic ---
    // Log check for skills node
    console.log(`Checking if node is skills: source='${sourceInstanceName}', slug='${slug}'`);
    if (sourceInstanceName === 'resume' && slug === 'skills') {
      console.log("MATCHED skills node!"); // Log match
      if (genAI) {
        console.log(`Processing skills file content...`);
        const categories = extractHeadings(node.rawMarkdownBody);
        console.log("Extracted categories:", categories); // Log extracted categories
        if (categories.length > 0) {
          console.log("Attempting to get explanations...");
          const explanations = await getExplanations(categories);
          console.log("Got explanations object:", explanations);
          console.log("Attempting to create skillCategoryExplanations field...");
          createNodeField({
            node,
            name: 'skillCategoryExplanations',
            value: JSON.stringify(explanations),
          });
          console.log("SUCCESS: Added skillCategoryExplanations field to skills node.");
        } else {
          console.log('No skill categories found in skills.md. Field not added.');
          createNodeField({
            node,
            name: 'skillCategoryExplanations',
            value: JSON.stringify({}),
          });
        }
      } else {
         console.log('Google AI not configured. Attempting to add empty field...');
         createNodeField({
           node,
           name: 'skillCategoryExplanations',
           value: JSON.stringify({}),
         });
         console.log('Added EMPTY skillCategoryExplanations field.');
      }
    } else {
      // Explicitly log why it didn't match
      if (node.internal.type === `MarkdownRemark`) { // Only log for markdown
        console.log(`Node is NOT the skills node (slug='${slug}', source='${sourceInstanceName}'). Skipping explanation logic.`);
      }
    }
    // --- End Skill Explanation Logic ---
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
  // Add the new About template path
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
      let context = { slug: slug }; // Default context

      reporter.info(`Processing node: slug=${slug}, source=${sourceInstanceName}`);

      // Determine path and template based on source
      if (sourceInstanceName === 'pages') {
          pagePath = slug === 'index' ? '/' : `/${slug}`;
          if (slug === 'projects') {
              component = projectsPageComponent;
              reporter.info(`  -> Matched 'pages/projects'. Using specific component: ${component}. Path: ${pagePath}`);
          // --- Add case for /about --- 
          } else if (slug === 'about') {
              component = aboutPageComponent; // Use the About template
              reporter.info(`  -> Matched 'pages/about'. Using specific component: ${component}. Path: ${pagePath}`);
          } else {
              component = pageTemplate; // Use generic for any other pages
              reporter.info(`  -> Matched 'pages' (generic). Path: ${pagePath}`);
          }
          // --- End pages logic ---
      } else if (sourceInstanceName === 'resume') {
          pagePath = `/${slug}`;
          if (slug === 'skills') {
             component = skillsPageComponent;
             reporter.info(`  -> Matched 'resume/skills'. Using specific component: ${component}. Path: ${pagePath}`);
          // --- Add case for /experience --- 
          } else if (slug === 'experience') {
             component = experiencePageComponent; // Use the Experience template
             reporter.info(`  -> Matched 'resume/experience'. Using specific component: ${component}. Path: ${pagePath}`);
          } else {
             component = pageTemplate; // Use generic template for other resume pages (e.g., education, achievements)
             reporter.info(`  -> Matched 'resume' (generic). Path: ${pagePath}`);
          }
          // --- End resume logic ---
      } else if (sourceInstanceName === 'posts') {
          pagePath = `/blog/${slug}`;
          component = postTemplate;
           reporter.info(`  -> Matched 'posts'. Path: ${pagePath}`);
      } else if (sourceInstanceName === 'architectures') {
          pagePath = `/architectures/${slug}`;
          component = pageTemplate; // Use page template for now
           reporter.info(`  -> Matched 'architectures'. Path: ${pagePath}`);
      } else {
          reporter.warn(`  -> Skipping node with unknown source instance name: ${sourceInstanceName} (slug: ${slug})`);
          return; // Changed back to return as continue might hide later errors in loop
      }

       // Check if template path is valid before creating page
       try {
        require.resolve(component);
      } catch (e) {
        reporter.panicOnBuild(`  -> Could not resolve template component ${component} for page ${pagePath}`, e);
        return; // Changed back to return
      }

      // Explicit log before creating page
      reporter.info(`  --> Attempting createPage for path: ${pagePath} with component: ${component}`);

      createPage({
        path: pagePath,
        component: `${component}?__contentFilePath=${node.internal.contentFilePath}`,
        context: context, // Pass context
      });
    });
  } else {
      reporter.info(`No markdown nodes found to create pages.`);
  }
};
