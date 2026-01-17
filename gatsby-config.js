/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Sumit Agrawal {.dev}`,
    description: `Software Engineer & Technical Writer | Building innovative digital solutions with expertise in full-stack development, cloud architecture, and AI integration.`,
    author: `Sumit Agrawal`,
    siteUrl: `https://sumitagrawal.dev`,
    keywords: [
      `software engineer`,
      `full-stack developer`,
      `cloud architecture`,
      `technical blog`,
      `web development`,
      `portfolio`,
      `Sumit Agrawal`,
    ],
    social: {
      linkedin: `https://www.linkedin.com/in/agrawal-sumit/`,
      github: `https://github.com/tech-sumit`,
      instagram: `https://www.instagram.com/mr.sumitagrawal/`,
      twitter: `@tech_sumit`, // Add your Twitter handle for better social cards
    },
    image: `/og-image.svg`, // Default OG image (convert to PNG for best compatibility)
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/content/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `resume`,
        path: `${__dirname}/src/content/resume`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `architectures`,
        path: `${__dirname}/src/content/architectures`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `avif`],
          placeholder: `blurred`,
          quality: 85,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
        }
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sumit Agrawal's Portfolio`,
        short_name: `Portfolio`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo-favicon.webp`,
      },
    },
    // SEO: Sitemap generation
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark(filter: { fields: { sourceInstanceName: { eq: "posts" } } }) {
              nodes {
                fields {
                  slug
                }
                frontmatter {
                  date
                }
              }
            }
          }
        `,
        resolveSiteUrl: () => `https://sumitagrawal.dev`,
        resolvePages: ({ allSitePage, allMarkdownRemark }) => {
          const blogPostsBySlug = allMarkdownRemark.nodes.reduce((acc, node) => {
            acc[`/blog/${node.fields.slug}`] = node.frontmatter;
            return acc;
          }, {});

          return allSitePage.nodes.map(page => {
            return { ...page, ...blogPostsBySlug[page.path] };
          });
        },
        serialize: ({ path, date }) => {
          return {
            url: path,
            lastmod: date || new Date().toISOString(),
            changefreq: path.includes('/blog/') ? 'weekly' : 'monthly',
            priority: path === '/' ? 1.0 : path.includes('/blog/') ? 0.8 : 0.7,
          };
        },
      },
    },
    // SEO: Robots.txt generation
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://sumitagrawal.dev`,
        sitemap: `https://sumitagrawal.dev/sitemap-index.xml`,
        policy: [
          { 
            userAgent: `*`, 
            allow: `/`,
            disallow: [`/404`, `/404.html`],
          },
        ],
      },
    },
    // SEO: RSS Feed for blog
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.frontmatter.description || node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + `/blog/` + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + `/blog/` + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  filter: { fields: { sourceInstanceName: { eq: "posts" } } }
                  sort: { frontmatter: { date: DESC } }
                ) {
                  nodes {
                    excerpt(pruneLength: 200)
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                      description
                      tags
                    }
                  }
                }
              }
            `,
            output: `/rss.xml`,
            title: `Sumit Agrawal's Technical Blog`,
            description: `Insights, tutorials, and thoughts on software engineering, cloud architecture, and modern web development.`,
            language: `en`,
          },
        ],
      },
    },
  ],
}
