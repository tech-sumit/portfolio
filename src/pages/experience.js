import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from '../components/layout';
import { useGradient } from '../context/GradientContext';
// import Seo from '../components/seo'; // Optional
import * as styles from '../styles/content-page.module.css'; // Create this CSS module

// Updated helper function to parse experience markdown structure more granularly
function parseExperienceHtml(html) {
  const jobs = [];
  if (!html) return jobs;

  // Use DOMParser for more robust parsing of list items etc.
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html'); // Wrap in div for easier selection
  const potentialJobNodes = doc.body.firstChild.children; // Get direct children (likely <p><strong>... or <h2>)

  // Filter out the initial H2 "Work Experience" if present
  const jobNodes = Array.from(potentialJobNodes).filter(node => !(node.tagName === 'H2' && node.textContent.includes('Work Experience')));

  let currentJob = null;

  jobNodes.forEach(node => {
      // Check if the node contains the strong tag marking a job header
      const headerStrong = node.querySelector('strong');
      const isHeaderLine = headerStrong && node.innerHTML.includes('|'); // Basic check for header format

      if (isHeaderLine) {
        // Start a new job entry
        currentJob = {
          id: `job-${jobs.length}`,
          company: '',
          title: '',
          location: '',
          dates: '',
          responsibilities: [],
          technologies: '', // Keep raw string for now
          technologiesArray: [], // Add array for badges
        };
        jobs.push(currentJob);

        // Parse the header line (e.g., **Company** | Title | Location | Dates)
        currentJob.company = headerStrong.textContent.trim();
        const headerTextAfterCompany = node.textContent.substring(headerStrong.textContent.length).trim();
        // Splitting with a leading '|' results in an empty first element
        const headerParts = headerTextAfterCompany.split('|').map(s => s.trim());

        // Assign parts based on expected order, checking length
        // CORRECTED INDICES: Title=1, Location=2, Dates=3
        currentJob.title = headerParts.length > 1 ? headerParts[1] : ''; 
        currentJob.location = headerParts.length > 2 ? headerParts[2] : ''; 
        currentJob.dates = headerParts.length > 3 ? headerParts[3] : ''; 

        // Adjust length check - expect 4 parts total (empty, title, loc, date)
        if (headerParts.length < 4) { 
             console.warn("Could not fully parse job header, check delimiters:", node.textContent);
        }

      } else if (currentJob && node.tagName === 'UL') {
        // Parse the list items for responsibilities and technologies
        const listItems = node.querySelectorAll('li');
        listItems.forEach(li => {
          const em = li.querySelector('em');
          // Check specifically for 'Technologies:' prefix within em tag
          if (em && em.textContent.trim().toLowerCase().startsWith('technologies:')) {
            // Extract text after 'Technologies:'
            const techString = em.textContent.substring('technologies:'.length).trim();
            currentJob.technologies = techString; // Store raw string
            // Split into array for badges
            currentJob.technologiesArray = techString.split(/[,/]+\s*/g)
                .map(tech => tech.trim())
                .filter(tech => tech);
          } else {
            // Add the innerHTML of the li to keep formatting like links
            currentJob.responsibilities.push(li.innerHTML);
          }
        });
      } else if (currentJob) {
          // Handle other potential content nodes between header and list if necessary
          // For now, we primarily expect the UL directly after the header paragraph
          console.log("Found unexpected node type after job header:", node.tagName);
      }
  });


  return jobs.filter(job => job.company || job.responsibilities.length > 0 || job.technologiesArray.length > 0); // Update filter condition
}

const ExperiencePage = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fields: { slug: { eq: "experience" } }) {
        html
        frontmatter {
          title
        }
      }
    }
  `);
  const { markdownRemark } = data; // data.markdownRemark holds page data
  const { frontmatter, html } = markdownRemark;
  const [jobs, setJobs] = useState([]);
  const { selectedGradient, isLoading } = useGradient();

  // Parse the HTML into job sections
  useEffect(() => {
    // Parsing relies on client-side execution
    if (typeof window !== 'undefined' && html) {
      setJobs(parseExperienceHtml(html));
    }
  }, [html]);

  if (isLoading || !selectedGradient) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      {/* Page Header with consistent styling */}
      <div style={{ 
        padding: '4rem 2rem 2rem',
        textAlign: 'center',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          marginBottom: '1rem',
          background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: selectedGradient?.colors?.[0] || '#667eea'
        }}>
          {frontmatter.title}
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          My professional journey and career highlights
        </p>
      </div>

      {/* Experience Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem 4rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <section key={job.id} className={styles.contentCard} id={job.id} style={{
              marginBottom: '3rem',
              padding: '2.5rem',
              background: 'var(--background-secondary)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease'
            }}>
              <div className={styles.jobHeaderContainer} style={{
                marginBottom: '2rem'
              }}>
                {job.company && (
                  <h3 className={styles.jobCompany} style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: selectedGradient?.colors?.[0] || '#667eea'
                  }}>
                    {job.company}
                  </h3>
                )}
                {job.title && (
                  <p className={styles.jobTitle} style={{
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem'
                  }}>
                    {job.title}
                  </p>
                )}
                <div className={styles.jobMeta} style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                   {job.location && (
                     <span className={styles.jobLocation} style={{
                       fontSize: '1.1rem',
                       color: 'var(--text-secondary)',
                       fontWeight: '500'
                     }}>
                       📍 {job.location}
                     </span>
                   )}
                   {job.dates && (
                     <span className={styles.jobDate} style={{
                       fontSize: '1.1rem',
                       color: 'var(--text-secondary)',
                       fontWeight: '500'
                     }}>
                       📅 {job.dates}
                     </span>
                   )}
                </div>
              </div>

              {job.responsibilities.length > 0 && (
                  <div className={styles.jobResponsibilities} style={{
                    marginBottom: '2rem'
                  }}>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'grid',
                        gap: '0.8rem'
                      }}>
                          {job.responsibilities.map((resp, index) => (
                             <li key={index} style={{
                               fontSize: '1.1rem',
                               lineHeight: '1.6',
                               color: 'var(--text-primary)',
                               paddingLeft: '0'
                             }}>
                               <span dangerouslySetInnerHTML={{ __html: resp }} />
                             </li>
                          ))}
                      </ul>
                  </div>
              )}

              {/* Render Technologies as Skill-like Buttons */}
              {job.technologiesArray && job.technologiesArray.length > 0 && (
                  <div className={styles.jobTechnologies}>
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
                          {job.technologiesArray.map((tech, index) => {
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
          // Fallback if parsing fails or no jobs found
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontSize: '1.2rem' }}>Loading experience or content structure issue...</p>
          </div>
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
      `}</style>
    </Layout>
  );
};

export default ExperiencePage; 