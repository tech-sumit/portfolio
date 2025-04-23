import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import * as styles from '../styles/content-page.module.css'; // Reuse the same CSS module

// Updated helper function to parse the specific projects markdown structure
function parseProjectsHtml(html) {
  const projects = [];
  if (!html) return { introHtml: '', projects };

  // Split by <hr>, potentially surrounded by whitespace/newlines
  const parts = html.split(/\s*<hr\s*\/?>\s*/g);
  let introHtml = '';

  // Assume anything before the first HR is intro, regardless of content
  if (parts.length > 0) {
    introHtml = parts.shift().trim();
  }

  parts.forEach((block, index) => {
    if (block.trim() === '') return;

    const project = {
        id: `project-${index}`,
        titleLine: '',
        technologiesArray: [], // Array for badges/links
        detailsHtml: '',
    };

    // Use DOMParser to handle HTML structure within the block
    const parser = new DOMParser();
    // Wrap in div to ensure proper parsing even if block is just text
    const doc = parser.parseFromString(`<div>${block.trim()}</div>`, 'text/html');
    const container = doc.body.firstChild;

    let detailsAccumulator = '';

    if (container && container.childNodes.length > 0) {
        Array.from(container.childNodes).forEach(node => {
            const nodeText = node.textContent?.trim() || '';

            if (node.nodeName === 'P' && node.querySelector('strong') && nodeText.toLowerCase().startsWith('role:')) {
                project.titleLine = node.outerHTML;
            }
            else if (node.nodeName === 'P' && nodeText.toLowerCase().startsWith('technologies:')) {
                const techString = nodeText.substring('technologies:'.length).trim();
                project.technologiesArray = techString.split(/[,/]+\s*/g)
                    .map(tech => tech.trim())
                    .filter(tech => tech);
                // Exclude this node from detailsHtml
            }
            // Accumulate other relevant nodes
            else if (node.nodeName === 'P' || node.nodeName === 'UL' || node.nodeName === 'OL') {
                detailsAccumulator += node.outerHTML;
            } else if (node.nodeType === Node.TEXT_NODE && nodeText !== '') {
                detailsAccumulator += `<p>${node.outerHTML}</p>`;
            } else if (node.nodeName !== '#text') {
                 detailsAccumulator += node.outerHTML;
            }
        });
        project.detailsHtml = detailsAccumulator.trim();
    }

    // Only add project if it has some content
    if (project.titleLine || project.detailsHtml || project.technologiesArray.length > 0) {
      projects.push(project);
    }
  });

  return { introHtml, projects };
}


const ProjectsPage = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const [parsedContent, setParsedContent] = useState({ introHtml: '', projects: [] });

  useEffect(() => {
    if (typeof window !== 'undefined' && html) {
      setParsedContent(parseProjectsHtml(html));
    }
  }, [html]);

  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      {parsedContent.introHtml && (
         <div className={styles.pageIntro} dangerouslySetInnerHTML={{ __html: parsedContent.introHtml }} />
      )}

      {parsedContent.projects.length > 0 ? (
        parsedContent.projects.map((project) => (
          <section key={project.id} className={styles.contentCard} id={project.id}>
            {/* Render Title/Role Line */}
            {project.titleLine && (
              <div className={styles.projectHeader} dangerouslySetInnerHTML={{ __html: project.titleLine }} />
            )}
            {/* Render Main Details */}
            {project.detailsHtml && (
              <div className={styles.projectDetails} dangerouslySetInnerHTML={{ __html: project.detailsHtml }} />
            )}

            {/* Render Technologies as Linked Badges */}
            {project.technologiesArray && project.technologiesArray.length > 0 && (
                <div className={styles.projectTechnologiesContainer}> {/* Container for the whole tech section */}
                   <h4>Technologies Used:</h4>
                   <div className={styles.techBadgeContainer}> {/* Flex container for just the badges */}
                        {project.technologiesArray.map((tech, index) => {
                            // Create a URL-friendly hash (lowercase, replace space with -, encode)
                            const skillHash = encodeURIComponent(tech.toLowerCase().replace(/\s+/g, '-'));
                            return (
                                <a key={index} href={`/skills#${skillHash}`} className={styles.techBadge}>
                                    {tech}
                                </a>
                            );
                        })}
                   </div>
                </div>
            )}
          </section>
        ))
      ) : (
         parsedContent.introHtml ? null : <p>Loading projects or content structure issue...</p>
      )}
    </Layout>
  );
};

export default ProjectsPage;

// Query remains the same
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`; 