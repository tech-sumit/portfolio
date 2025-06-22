---
title: "Building a Modern Portfolio Website with Gatsby & AI Tools: A Complete Tutorial"
date: 2024-01-15T10:00:00.000Z
description: "Learn how to create a professional portfolio website using Gatsby, AI tools, and deploy it on GitHub Pages with automated CI/CD. This comprehensive guide covers everything from project structure to deployment."
tags:
  - gatsby
  - portfolio
  - ai-tools
  - github-pages
  - ci-cd
  - tutorial
---

Creating a professional portfolio website has never been easier with modern tools and AI assistance. This tutorial will guide you through building a complete portfolio website using Gatsby, integrating AI-powered features, and deploying it automatically to GitHub Pages.

## 🚀 Quick Start: Fork and Customize

The easiest way to get started is to fork this repository and customize it for your needs:

1. **Fork the Repository**: Click the "Fork" button on the GitHub repository
2. **Clone Your Fork**: `git clone https://github.com/YOUR_USERNAME/portfolio-gatsby.git`
3. **Install Dependencies**: `npm install`
4. **Start Development**: `npm run develop`
5. **Visit**: `http://localhost:8000`

## 📁 Project Directory Structure

Understanding the project structure is crucial for customization:

```
portfolio-gatsby/
├── .github/
│   └── workflows/
│       └── main.yml                 # GitHub Actions CI/CD workflow
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── ChatbotWidget.js         # AI-powered chatbot component
│   │   ├── Footer.js                # Site footer
│   │   ├── Header.js                # Navigation header
│   │   ├── HeroSection.js           # Landing page hero section
│   │   ├── Layout.js                # Main layout wrapper
│   │   └── ThemeToggle.js           # Dark/light theme switcher
│   ├── config/
│   │   └── blog.js                  # Blog configuration (Medium integration)
│   ├── content/                     # Markdown content files
│   │   ├── pages/                   # Static page content
│   │   │   ├── about.md
│   │   │   └── projects.md
│   │   ├── posts/                   # Blog posts
│   │   └── resume/                  # Resume sections
│   │       ├── skills.md
│   │       ├── experience.md
│   │       ├── education.md
│   │       └── achievements.md
│   ├── hooks/                       # Custom React hooks
│   │   ├── useMediumPosts.js        # Medium blog integration
│   │   └── useScrollHeader.js       # Header scroll effects
│   ├── pages/                       # Gatsby page components
│   │   ├── index.js                 # Homepage
│   │   ├── about.js                 # About page
│   │   ├── blog.js                  # Blog listing
│   │   ├── projects.js              # Projects showcase
│   │   └── skills.js                # Skills visualization
│   ├── styles/                      # CSS modules and global styles
│   └── templates/                   # Dynamic page templates
├── gatsby-config.js                 # Gatsby configuration
├── gatsby-node.js                   # Build-time Node.js APIs
└── package.json                     # Dependencies and scripts
```

## 🛠️ Key Technologies & Features

### Core Technologies
- **Gatsby**: Static site generator with React
- **React**: Component-based UI library
- **GraphQL**: Data querying layer
- **CSS Modules**: Scoped styling

### AI-Powered Features
- **Chatbot Widget**: Google Gemini AI integration for interactive assistance
- **Medium Blog Integration**: Automated blog post fetching with fallback
- **Smart Content Processing**: Automated skill categorization and parsing

### Modern Development Features
- **Dark/Light Theme**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Progressive Web App**: Offline capability and app-like experience

## 🧠 Understanding gatsby-node.js

The `gatsby-node.js` file is the heart of your Gatsby build process. It runs during the build phase and handles:

### 1. Environment Variables Configuration
```javascript
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.DefinePlugin({
        'process.env.GOOGLE_AI_API_KEY': JSON.stringify(process.env.GOOGLE_AI_API_KEY),
        'process.env.MEDIUM_USERNAME': JSON.stringify(process.env.MEDIUM_USERNAME),
      }),
    ],
  })
}
```

**Purpose**: Makes environment variables available in the browser during build time. Essential for GitHub Pages deployment where environment variables are injected via GitHub Secrets.

### 2. Dynamic Content Processing
```javascript
exports.onCreateNode = ({ node, actions, getNode }) => {
  // Creates slugs for markdown files
  // Processes skills data from markdown
  // Categorizes content by source
}
```

**Purpose**: Transforms markdown content into structured data, creates URL slugs, and processes specialized content like skills categorization.

### 3. Dynamic Page Generation
```javascript
exports.createPages = async ({ graphql, actions, reporter }) => {
  // Queries all markdown content
  // Creates pages based on content type
  // Routes to appropriate templates
}
```

**Purpose**: Automatically generates pages from markdown files, routing them to appropriate templates based on content type (blog posts, resume sections, static pages).

### Key Features Implemented in gatsby-node.js:

1. **Smart Routing**: Automatically routes content to appropriate page templates
2. **Skills Parser**: Extracts and structures skills data from markdown HTML
3. **Multi-source Content**: Handles different content types (posts, pages, resume)
4. **Environment Integration**: Makes secrets available for AI features

## 🎨 Customizing Your Portfolio

### 1. Personal Information
Update `gatsby-config.js` with your details:

```javascript
siteMetadata: {
  title: `Your Name {.dev}`,
  description: `Your portfolio description`,
  author: `Your Name`,
  siteUrl: `https://yourdomain.com`,
  social: {
    linkedin: "your-linkedin-url",
    github: "your-github-url",
    instagram: "your-instagram-url",
  }
}
```

### 2. Content Customization
- **About Page**: Edit `src/content/pages/about.md`
- **Projects**: Edit `src/content/pages/projects.md`
- **Resume Sections**: Update files in `src/content/resume/`
- **Blog Posts**: Add new posts to `src/content/posts/`

### 3. Styling & Theming
- **Global Styles**: `src/styles/global.css`
- **Component Styles**: Individual `.module.css` files
- **Theme Colors**: Update CSS custom properties in global styles

### 4. AI Features Configuration
Update `src/config/blog.js` for Medium integration:

```javascript
export const blogConfig = {
  mediumUsername: 'your-medium-username',
  showMediumPosts: true,  // Enable/disable Medium integration
  showLocalPosts: true,   // Show local markdown posts
  // ... other config options
};
```

## 🔄 CI/CD Pipeline & GitHub Pages Deployment

### Automated Deployment Workflow

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/main.yml`) that:

1. **Triggers**: Automatically runs on push to master branch
2. **Build Process**: 
   - Sets up Node.js environment
   - Installs dependencies with `npm ci`
   - Builds the Gatsby site with environment variables
3. **Deployment**: Deploys to GitHub Pages using official GitHub actions

### Key Workflow Features:

```yaml
name: Build & Deploy Gatsby Site to GitHub Pages

on:
  push:
    branches: [ "master" ]
  workflow_dispatch:  # Manual trigger option

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Build Gatsby site
      run: npm run build
      env:
        GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
        MEDIUM_USERNAME: ${{ secrets.MEDIUM_USERNAME }}
```

### Setting Up Deployment:

1. **Enable GitHub Pages**: 
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as source

2. **Configure Secrets**:
   - Navigate to Settings → Secrets and Variables → Actions
   - Add `GOOGLE_AI_API_KEY` for chatbot functionality
   - Add `MEDIUM_USERNAME` for blog integration

3. **Custom Domain** (Optional):
   - Add `CNAME` file to `static/` folder
   - Update `siteUrl` in `gatsby-config.js`

### Environment Variables in Build Process:

The workflow passes environment variables during build time, making them available to the Gatsby build process. This is crucial because:

- **GitHub Pages Limitation**: No server-side environment variables
- **Build-time Injection**: Variables are embedded during build
- **Security**: Sensitive keys are stored as GitHub Secrets

## 🚀 Deployment Process

### Automatic Deployment (Recommended):
1. Push changes to master branch
2. GitHub Actions automatically builds and deploys
3. Site is live at `https://username.github.io/repository-name`

### Manual Deployment:
```bash
npm run build
npm run deploy  # If using gh-pages package
```

## 🔧 Advanced Features

### Medium Blog Integration
The portfolio includes dual-mode blog functionality:
- **RSS Feed Integration**: Fetches latest Medium posts
- **Local Markdown**: Supports local blog posts
- **Fallback System**: Gracefully handles API failures
- **Configurable**: Enable/disable via configuration

### AI Chatbot Integration
- **Google Gemini AI**: Powered by Google's latest AI model
- **Context Aware**: Understands your portfolio content
- **Customizable**: Easy to modify responses and behavior
- **Privacy Focused**: No data persistence

### Performance Optimizations
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Automatic bundle optimization
- **Static Generation**: Pre-rendered for maximum performance
- **PWA Features**: Offline capability and caching

## 📈 Best Practices for AI-Assisted Development

### 1. Prompt Engineering
When using AI tools to modify this portfolio:

```
"Update the skills section to include [specific skills] with appropriate categorization and modern styling that matches the existing design system."
```

### 2. Iterative Development
- Start with small, focused changes
- Test locally before deploying
- Use AI for code generation, human review for quality

### 3. Content Strategy
- Use AI to generate initial content drafts
- Always review and personalize AI-generated content
- Maintain authenticity in personal sections

## 🔍 Troubleshooting Common Issues

### Build Failures
1. **Environment Variables**: Ensure all required secrets are set in GitHub
2. **Dependencies**: Run `npm install` to update dependencies
3. **GraphQL Queries**: Check for syntax errors in page queries

### Deployment Issues
1. **GitHub Pages Settings**: Verify Pages source is set to "GitHub Actions"
2. **Branch Protection**: Ensure master branch allows force pushes from Actions
3. **Custom Domain**: Verify DNS settings if using custom domain

### AI Feature Issues
1. **API Keys**: Confirm `GOOGLE_AI_API_KEY` is valid and has appropriate permissions
2. **Rate Limits**: Implement request throttling for production use
3. **Fallback Handling**: Ensure graceful degradation when AI services are unavailable

## 🎯 Next Steps

1. **Customize Content**: Replace placeholder content with your information
2. **Add Projects**: Showcase your work in the projects section
3. **Configure AI Features**: Set up API keys for chatbot functionality
4. **Deploy**: Push to GitHub and watch your portfolio go live
5. **Iterate**: Use AI tools to continuously improve and expand features

## 🤝 Contributing & Community

This portfolio template is designed to be:
- **Fork-friendly**: Easy to customize and make your own
- **AI-assisted**: Optimized for AI-powered development workflows
- **Community-driven**: Open to contributions and improvements

Ready to build your dream portfolio? Fork this repository and start customizing! 🚀

---

*Built with ❤️ using Gatsby, React, and AI assistance. Star the repository if this tutorial helped you!* 