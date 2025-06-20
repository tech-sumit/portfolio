import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Layout from '../components/layout';
import Modal from '../components/Modal'; // Import the external Modal component
import { useGradient } from '../context/GradientContext';
import * as styles from '../styles/skills.module.css';
// Import specific icons
import {
  FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaAws, FaDocker, FaPython, FaJava, FaGitAlt, FaLinux
} from 'react-icons/fa';
import {
  SiGatsby, SiNextdotjs, SiTypescript, SiKubernetes, SiGooglecloud,
  SiMongodb, SiPostgresql, SiRedis, SiTerraform, SiJenkins, SiSolidity, SiRust, SiFlask, SiDjango
  // Add more Si icons as needed
} from 'react-icons/si';

const SkillsPage = () => {
  const data = useStaticQuery(graphql`
    query {
      skillsMd: markdownRemark(fields: { slug: { eq: "skills" } }) {
        html
        frontmatter {
          title
        }
        fields {
          skillCategoryExplanations
        }
      }
      experienceMd: markdownRemark(fields: { slug: { eq: "experience" } }) {
        html
      }
      projectsMd: markdownRemark(fields: { slug: { eq: "projects" } }) {
        html
      }
      allBlogPosts: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/posts/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            tags
          }
        }
      }
    }
  `);
  
  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null); // Skill name for modal
  const [relatedContent, setRelatedContent] = useState({ posts: [], experiences: [], projects: [] });
  const { selectedGradient, isLoading } = useGradient();

  const skillsHtml = data.skillsMd?.html;
  const experienceHtml = data.experienceMd?.html;
  const projectsHtml = data.projectsMd?.html;
  const pageTitle = data.skillsMd?.frontmatter?.title || "Skills";

  // Parse the JSON string from the field
  const skillCategoryExplanations = useMemo(() => {
    try {
      return JSON.parse(data.skillsMd?.fields?.skillCategoryExplanations || '{}');
    } catch (e) {
      console.error("Error parsing skill explanations:", e);
      return {}; // Return empty object on error
    }
  }, [data.skillsMd?.fields?.skillCategoryExplanations]);

  // 1. Parse Skill Categories
  useEffect(() => {
    if (typeof window !== 'undefined' && skillsHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(skillsHtml, 'text/html');
      const categories = [];
      const headings = doc.querySelectorAll('h2, h3');
      headings.forEach(heading => {
        const categoryName = heading.textContent?.trim();
        const skillsList = [];
        let nextElement = heading.nextElementSibling;
        while (nextElement && nextElement.tagName !== 'UL') {
          nextElement = nextElement.nextElementSibling;
        }
        if (nextElement && nextElement.tagName === 'UL') {
          nextElement.querySelectorAll('li').forEach(li => {
            skillsList.push(li.textContent.trim());
          });
        }
        if (categoryName && skillsList.length > 0) {
          categories.push({ name: categoryName, skills: skillsList });
        }
      });
      setSkillCategories(categories);
    }
  }, [skillsHtml]);

  // 2. Process connections
  const skillConnections = useMemo(() => {
    // Define allPosts INSIDE the useMemo hook
    const allPosts = data.allBlogPosts?.nodes || [];

    const connections = {
      postsBySkill: {},
      experiencesBySkill: {},
      projectsBySkill: {},
    };
    // Check allPosts inside the hook
    if (!experienceHtml || !projectsHtml || allPosts.length === 0 || skillCategories.length === 0) {
      return connections;
    }
    const allSkillNames = skillCategories.flatMap(cat => cat.skills);
    allPosts.forEach(post => {
      const postTags = (post.frontmatter?.tags || []).map(tag => tag.toLowerCase());
      allSkillNames.forEach(skillName => {
        const lowerSkill = skillName.toLowerCase();
        if (postTags.includes(lowerSkill)) {
          if (!connections.postsBySkill[skillName]) {
            connections.postsBySkill[skillName] = [];
          }
          connections.postsBySkill[skillName].push({
            slug: post.fields.slug,
            title: post.frontmatter.title,
          });
        }
      });
    });
    if (typeof window !== 'undefined') {
        const parser = new DOMParser();
        const expDoc = parser.parseFromString(experienceHtml, 'text/html');
        const expHeadings = expDoc.querySelectorAll('h2, h3');
        expHeadings.forEach(heading => {
           const experienceTitle = heading.textContent?.trim();
           const headingId = heading.id;
           let currentElement = heading.nextElementSibling;
           let sectionText = '';
           while(currentElement && !['H2', 'H3'].includes(currentElement.tagName)){
               sectionText += currentElement.textContent + ' ';
               currentElement = currentElement.nextElementSibling;
           }
           const lowerSectionText = sectionText.toLowerCase();
           allSkillNames.forEach(skillName => {
               const lowerSkill = skillName.toLowerCase();
               if (lowerSectionText.includes(lowerSkill)) {
                   if (!connections.experiencesBySkill[skillName]) {
                       connections.experiencesBySkill[skillName] = [];
                   }
                   if (experienceTitle && !connections.experiencesBySkill[skillName].some(exp => exp.title === experienceTitle)) {
                       connections.experiencesBySkill[skillName].push({ title: experienceTitle, id: headingId });
                   }
               }
           });
        });

        const projDoc = parser.parseFromString(projectsHtml, 'text/html');
        const projHeadings = projDoc.querySelectorAll('h2, h3');
        projHeadings.forEach(heading => {
            const projectTitle = heading.textContent?.trim();
            const headingId = heading.id;

            let currentElement = heading.nextElementSibling;
            let sectionText = '';
            while(currentElement && !['H2', 'H3'].includes(currentElement.tagName)){
                sectionText += currentElement.textContent + ' ';
                currentElement = currentElement.nextElementSibling;
            }
            const lowerSectionText = sectionText.toLowerCase();

            allSkillNames.forEach(skillName => {
                const lowerSkill = skillName.toLowerCase();
                if (lowerSectionText.includes(lowerSkill)) {
                    if (!connections.projectsBySkill[skillName]) {
                        connections.projectsBySkill[skillName] = [];
                    }
                    if (projectTitle && !connections.projectsBySkill[skillName].some(proj => proj.title === projectTitle)) {
                        connections.projectsBySkill[skillName].push({ title: projectTitle, id: headingId });
                    }
                }
            });
        });
    }
    return connections;
  }, [skillCategories, experienceHtml, projectsHtml, data.allBlogPosts?.nodes]);

  // --- Event Handlers ---
  const handleSkillClick = useCallback((skillName) => {
    setSelectedSkill(skillName);
    setRelatedContent({
      posts: skillConnections.postsBySkill[skillName] || [],
      experiences: skillConnections.experiencesBySkill[skillName] || [],
      projects: skillConnections.projectsBySkill[skillName] || [],
    });
  }, [skillConnections]);

  const closeModal = () => {
    setSelectedSkill(null);
  };

  // --- Updated Icon Mapping --- 
  const getIconForSkill = (skillName) => {
    const lowerSkill = skillName.toLowerCase().replace(/\s+/g, '').replace(/[().+]/g, ''); // Normalize name more aggressively

    // Frontend
    if (lowerSkill.includes('html')) return <FaHtml5 title="HTML5" />;
    if (lowerSkill.includes('css') || lowerSkill.includes('scss') || lowerSkill.includes('sass')) return <FaCss3Alt title="CSS3/SCSS" />;
    if (lowerSkill.includes('javascript') || lowerSkill.includes('ecmascript') || lowerSkill === 'js') return <FaJsSquare title="JavaScript (ES6+)" />;
    if (lowerSkill.includes('typescript') || lowerSkill === 'ts') return <SiTypescript title="TypeScript" />;
    if (lowerSkill.includes('react')) return <FaReact title="React" />;
    if (lowerSkill.includes('nextjs')) return <SiNextdotjs title="Next.js" />;
    if (lowerSkill.includes('gatsby')) return <SiGatsby title="Gatsby" />;

    // Backend
    if (lowerSkill.includes('nodejs')) return <FaNodeJs title="Node.js" />;
    if (lowerSkill.includes('python')) return <FaPython title="Python" />;
    if (lowerSkill.includes('java')) return <FaJava title="Java" />;
    if (lowerSkill.includes('flask')) return <SiFlask title="Flask" />;
    if (lowerSkill.includes('django')) return <SiDjango title="Django" />;
    if (lowerSkill.includes('solidity')) return <SiSolidity title="Solidity" />;
    if (lowerSkill.includes('rust')) return <SiRust title="Rust" />;

    // Cloud & DevOps
    if (lowerSkill.includes('aws') || lowerSkill.includes('amazonwebservices')) return <FaAws title="AWS" />;
    if (lowerSkill.includes('gcp') || lowerSkill.includes('googlecloud')) return <SiGooglecloud title="GCP" />;
    // Azure icon not available in current react-icons version
    // if (lowerSkill.includes('azure') || lowerSkill.includes('microsoftazure')) return <SiAzure title="Azure" />;
    if (lowerSkill.includes('docker')) return <FaDocker title="Docker" />;
    if (lowerSkill.includes('kubernetes') || lowerSkill === 'k8s') return <SiKubernetes title="Kubernetes" />;
    if (lowerSkill.includes('terraform')) return <SiTerraform title="Terraform" />;
    if (lowerSkill.includes('jenkins')) return <SiJenkins title="Jenkins" />;
    if (lowerSkill.includes('linux')) return <FaLinux title="Linux" />;
    if (lowerSkill.includes('git')) return <FaGitAlt title="Git" />;

    // Databases
    if (lowerSkill.includes('mongodb')) return <SiMongodb title="MongoDB" />;
    if (lowerSkill.includes('postgresql') || lowerSkill.includes('postgres')) return <SiPostgresql title="PostgreSQL" />;
    if (lowerSkill.includes('redis')) return <SiRedis title="Redis" />;

    // Add more mappings based on your skills...

    return null; // Default no icon
  };

  // 3. Handle incoming hash links (NEW useEffect)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && skillCategories.length > 0 && skillConnections) {
      // Check if skillCategories AND skillConnections are loaded
      const hash = window.location.hash.substring(1); // Remove '#'
      try {
        const decodedHash = decodeURIComponent(hash);

        // Normalize the hash to match skill names (lowercase, remove non-alphanumeric)
        const normalizedHash = decodedHash.toLowerCase().replace(/[^a-z0-9]/gi, '');

        // Find the skill name that matches the hash
        let targetSkill = null;
        for (const category of skillCategories) {
          for (const skill of category.skills) {
            const normalizedSkill = skill.toLowerCase().replace(/[^a-z0-9]/gi, '');
            if (normalizedSkill === normalizedHash) {
              targetSkill = skill;
              break;
            }
          }
          if (targetSkill) break;
        }

        // If a matching skill is found, trigger the click handler
        if (targetSkill && skillConnections.postsBySkill) { // Ensure connections are ready
          // Use a timeout to ensure the initial render is complete
          // and the modal can be opened correctly.
          const timer = setTimeout(() => {
            handleSkillClick(targetSkill);
          }, 100); // Small delay (e.g., 100ms)
          return () => clearTimeout(timer); // Cleanup timeout on unmount/re-run
        }
      } catch (e) {
        console.error("Error decoding or handling URL hash:", e);
      }
    }
    // Depend on skillCategories and skillConnections being populated
  }, [skillCategories, skillConnections, handleSkillClick]);

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
          {pageTitle}
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Discover my technical expertise and explore related projects and experience
        </p>
      </div>

      {skillCategories.length === 0 && !skillsHtml && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '1.2rem' }}>Loading skills...</p>
        </div>
      )}
      
      {skillCategories.length === 0 && skillsHtml && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '1.2rem' }}>Could not parse skills from Markdown. Check format in src/content/resume/skills.md (e.g., use H2/H3 for categories followed by a UL list).</p>
        </div>
      )}

      {/* Skills Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem 4rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {skillCategories.map(category => (
            <section key={category.name} className={styles.categorySection} style={{
              marginBottom: '3rem',
              padding: '2.5rem',
              background: 'var(--background-secondary)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: selectedGradient?.colors?.[0] || '#667eea'
              }}>
                {category.name}
              </h2>
              
              {/* Display the explanation if available */}
              {skillCategoryExplanations[category.name] && (
                <p className={styles.categoryExplanation} style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}>
                  {skillCategoryExplanations[category.name]}
                </p>
              )}
              
              <div className={styles.skillsGrid} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {category.skills.map(skill => (
                  <button
                    key={skill}
                    className={styles.skillBadge}
                    onClick={() => handleSkillClick(skill)}
                    title={`Show related content for ${skill}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.8rem 1.2rem',
                      background: `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}10, ${selectedGradient?.colors?.[1] || '#764ba2'}10)`,
                      border: `2px solid ${selectedGradient?.colors?.[0] || '#667eea'}30`,
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{
                      color: selectedGradient?.colors?.[0] || '#667eea',
                      fontSize: '1.3rem'
                    }}>
                      {getIconForSkill(skill)}
                    </span>
                    <span>{skill}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
      </div>

      {/* --- Modal --- */}
      {selectedSkill && (
        <Modal 
          title={`Related to: ${selectedSkill}`} 
          onClose={closeModal} 
          styles={styles} // Pass the CSS module styles as a prop
        >
          <div style={{
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
          }}>
            {relatedContent.posts.length > 0 && (
              <div className={styles.modalSection} style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: selectedGradient?.colors?.[0] || '#667eea'
                }}>
                  Blog Posts:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {relatedContent.posts.map(post => (
                    <li key={post.slug} style={{ marginBottom: '0.5rem' }}>
                      <Link to={`/blog/${post.slug}`} style={{
                        color: selectedGradient?.colors?.[0] || '#667eea',
                        textDecoration: 'none',
                        fontSize: '1.1rem'
                      }}>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedContent.experiences.length > 0 && (
              <div className={styles.modalSection} style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: selectedGradient?.colors?.[0] || '#667eea'
                }}>
                  Experience:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {relatedContent.experiences.map(exp => (
                     <li key={exp.id || exp.title} style={{ marginBottom: '0.5rem' }}>
                       {exp.id ? (
                         <Link to={`/experience#${exp.id}`} style={{
                           color: selectedGradient?.colors?.[0] || '#667eea',
                           textDecoration: 'none',
                           fontSize: '1.1rem'
                         }}>
                           {exp.title}
                         </Link>
                       ) : (
                         <span style={{ fontSize: '1.1rem' }}>{exp.title} (No ID found)</span>
                       )}
                     </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedContent.projects.length > 0 && (
              <div className={styles.modalSection} style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: selectedGradient?.colors?.[0] || '#667eea'
                }}>
                  Projects:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {relatedContent.projects.map(proj => (
                     <li key={proj.id || proj.title} style={{ marginBottom: '0.5rem' }}>
                       {proj.id ? (
                         <Link to={`/projects#${proj.id}`} style={{
                           color: selectedGradient?.colors?.[0] || '#667eea',
                           textDecoration: 'none',
                           fontSize: '1.1rem'
                         }}>
                           {proj.title}
                         </Link>
                       ) : (
                         <span style={{ fontSize: '1.1rem' }}>{proj.title} (No ID found)</span>
                       )}
                     </li>
                  ))}
                </ul>
              </div>
            )}
             {(relatedContent.posts.length === 0 && relatedContent.experiences.length === 0 && relatedContent.projects.length === 0) && (
                 <p style={{
                   fontSize: '1.1rem',
                   color: 'var(--text-secondary)',
                   textAlign: 'center',
                   padding: '2rem'
                 }}>
                   No specific blog posts, experience sections, or project sections found mentioning this skill (based on current parsing).
                 </p>
             )}
          </div>
        </Modal>
      )}

      {/* Dynamic styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .${styles.skillBadge}:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}20, ${selectedGradient?.colors?.[1] || '#764ba2'}20) !important;
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .${styles.categorySection}:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </Layout>
  );
};

export default SkillsPage; 