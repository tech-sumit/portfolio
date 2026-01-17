import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from "gatsby-plugin-image";
import Layout from '../components/layout';
import Seo from '../components/seo';
import HeroSection from '../components/HeroSection';
import { useGradient } from '../context/GradientContext';
import * as styles from '../styles/content-page.module.css';

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


const ProjectsPage = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fields: { slug: { eq: "projects" } }) {
        html
        frontmatter {
          title
        }
      }
    }
  `);
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const [parsedContent, setParsedContent] = useState({ introHtml: '', projects: [] });
  const { selectedGradient, isLoading } = useGradient();

  useEffect(() => {
    if (typeof window !== 'undefined' && html) {
      setParsedContent(parseProjectsHtml(html));
    }
  }, [html]);

  if (isLoading || !selectedGradient) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <HeroSection 
        imageComponent={
          <StaticImage
            src="../images/projects.webp"
            alt="My Projects"
            placeholder="blurred"
            layout="constrained"
            width={550}
            height={550}
            style={{ 
              borderRadius: '20px'
            }}
          />
        }
        subtitle="Portfolio"
        title={frontmatter.title}
        description="Explore my portfolio of innovative projects"
        additionalDescription="Discover the technical achievements, solutions built, and technologies used in my projects."
      />

      {/* Projects Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 2rem 4rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {parsedContent.projects.length > 0 ? (
          parsedContent.projects.map((project) => (
            <section key={project.id} className={styles.contentCard} id={project.id} style={{
              marginBottom: '3rem',
              padding: '2.5rem',
              background: 'var(--background-secondary)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease'
            }}>
              {/* Render Title/Role Line */}
              {project.titleLine && (
                <div className={styles.projectHeader} style={{
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: selectedGradient?.colors?.[0] || '#667eea'
                  }} dangerouslySetInnerHTML={{ __html: project.titleLine }} />
                </div>
              )}
              
              {/* Render Main Details */}
              {project.detailsHtml && (
                <div className={styles.projectDetails} style={{
                  marginBottom: '2rem',
                  fontSize: '1.1rem',
                  lineHeight: '1.7',
                  color: 'var(--text-primary)'
                }} dangerouslySetInnerHTML={{ __html: project.detailsHtml }} />
              )}

              {/* Render Technologies as Skill-like Buttons */}
              {project.technologiesArray && project.technologiesArray.length > 0 && (
                                  <div className={styles.projectTechnologiesContainer}>
                  <h4 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    Technologies:
                  </h4>
                  <div className={styles.techBadgeContainer} style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.8rem'
                  }}>
                    {project.technologiesArray.map((tech, index) => {
                      // Create a URL-friendly hash
                      const skillHash = encodeURIComponent(tech.toLowerCase().replace(/\s+/g, '-'));
                      return (
                        <a key={index} href={`/skills#${skillHash}`} className={styles.techBadge} style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          background: `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}20, ${selectedGradient?.colors?.[1] || '#764ba2'}20)`,
                          border: `2px solid ${selectedGradient?.colors?.[0] || '#667eea'}40`,
                          borderRadius: '25px',
                          color: selectedGradient?.colors?.[0] || '#667eea',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}>
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
           parsedContent.introHtml ? null : (
             <div style={{
               textAlign: 'center',
               padding: '4rem 2rem',
               color: 'var(--text-secondary)'
             }}>
               <p style={{ fontSize: '1.2rem' }}>Loading projects or content structure issue...</p>
             </div>
           )
        )}
      </div>

      {/* Dynamic styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .${styles.contentCard}:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .${styles.techBadge}:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}40, ${selectedGradient?.colors?.[1] || '#764ba2'}40) !important;
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1rem !important;
            min-height: 100vh !important;
            gap: 2rem !important;
          }
          .image-container {
            flex: none !important;
            margin-bottom: 2rem !important;
          }
          .content-container {
            padding-left: 0 !important;
          }
          .content-container h1 {
            font-size: 2.5rem !important;
            text-align: center !important;
            margin-bottom: 1.5rem !important;
          }
          .content-container p {
            text-align: center !important;
            font-size: 1.2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .content-container h1 {
            font-size: 2rem !important;
          }
          .content-container p {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ProjectsPage;

// Gatsby Head API for SEO
export const Head = () => (
  <Seo
    title="Projects"
    description="Discover Sumit Agrawal's portfolio of projects including web applications, cloud solutions, and innovative software products."
    pathname="/projects"
  />
); 