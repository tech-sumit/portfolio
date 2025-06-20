import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
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

const ExperiencePage = ({ data }) => {
  const { markdownRemark } = data; // data.markdownRemark holds page data
  const { frontmatter, html } = markdownRemark;
  const [jobs, setJobs] = useState([]);

  // Parse the HTML into job sections
  useEffect(() => {
    // Parsing relies on client-side execution
    if (typeof window !== 'undefined' && html) {
      setJobs(parseExperienceHtml(html));
    }
  }, [html]);

  return (
    <Layout>
      {/* <Seo title={frontmatter.title} /> */}
      <h1>{frontmatter.title}</h1>

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <section key={job.id} className={styles.contentCard} id={job.id}>
            <div className={styles.jobHeaderContainer}>
              {job.company && <h3 className={styles.jobCompany}>{job.company}</h3>}
              {job.title && <p className={styles.jobTitle}>{job.title}</p>}
              <div className={styles.jobMeta}>
                 {job.location && <span className={styles.jobLocation}>{job.location}</span>}
                 {job.dates && <span className={styles.jobDate}>{job.dates}</span>}
              </div>
            </div>

            {job.responsibilities.length > 0 && (
                <div className={styles.jobResponsibilities}>
                    {/* Removed the h4 title for Responsibilities for cleaner look */}
                    <ul>
                        {job.responsibilities.map((resp, index) => (
                           <li key={index} dangerouslySetInnerHTML={{ __html: resp }} />
                        ))}
                    </ul>
                </div>
            )}

            {/* Render Technologies as Skill-like Buttons */}
            {job.technologiesArray && job.technologiesArray.length > 0 && (
                <div className={styles.jobTechnologies}>
                   <h4>Technologies:</h4>
                   <div className={styles.techBadgeContainer}>
                        {job.technologiesArray.map((tech, index) => {
                            // Create a URL-friendly hash
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
        // Fallback if parsing fails or no jobs found
        // We might want a loading state here instead
        <p>Loading experience or content structure issue...</p> // Placeholder
        // Or render raw HTML as before, but it won't be styled per job
        // <section dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </Layout>
  );
};

export default ExperiencePage;

// Update GraphQL query if needed, ensure 'html' and 'frontmatter.title' are fetched
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        # Add other frontmatter fields if needed
      }
      # Add other fields if needed, e.g., fields { slug }
    }
  }
`; 