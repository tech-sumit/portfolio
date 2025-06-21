import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from "gatsby-plugin-image";
import Layout from '../components/layout';
import HeroSection from '../components/HeroSection';
import GradientText from '../components/GradientText';
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
    const skillLower = skillName.toLowerCase();
    
    // Frontend / Languages
    if (skillLower.includes('html')) return <FaHtml5 style={{ color: '#E34F26' }} />;
    if (skillLower.includes('css')) return <FaCss3Alt style={{ color: '#1572B6' }} />;
    if (skillLower.includes('javascript') || skillLower.includes('js')) return <FaJsSquare style={{ color: '#F7DF1E' }} />;
    if (skillLower.includes('typescript') || skillLower.includes('ts')) return <SiTypescript style={{ color: '#007ACC' }} />;
    if (skillLower.includes('react')) return <FaReact style={{ color: '#61DAFB' }} />;
    if (skillLower.includes('gatsby')) return <SiGatsby style={{ color: '#663399' }} />;
    if (skillLower.includes('next')) return <SiNextdotjs style={{ color: '#000000' }} />;
    
    // Backend
    if (skillLower.includes('node')) return <FaNodeJs style={{ color: '#339933' }} />;
    if (skillLower.includes('python')) return <FaPython style={{ color: '#3776AB' }} />;
    if (skillLower.includes('java')) return <FaJava style={{ color: '#007396' }} />;
    if (skillLower.includes('flask')) return <SiFlask style={{ color: '#000000' }} />;
    if (skillLower.includes('django')) return <SiDjango style={{ color: '#092E20' }} />;
    
    // DevOps / Cloud / Infrastructure
    if (skillLower.includes('aws')) return <FaAws style={{ color: '#FF9900' }} />;
    if (skillLower.includes('docker')) return <FaDocker style={{ color: '#2496ED' }} />;
    if (skillLower.includes('kubernetes') || skillLower.includes('k8s')) return <SiKubernetes style={{ color: '#326CE5' }} />;
    if (skillLower.includes('google cloud') || skillLower.includes('gcp')) return <SiGooglecloud style={{ color: '#4285F4' }} />;
    if (skillLower.includes('terraform')) return <SiTerraform style={{ color: '#623CE4' }} />;
    if (skillLower.includes('jenkins')) return <SiJenkins style={{ color: '#D24939' }} />;
    
    // Databases
    if (skillLower.includes('mongodb') || skillLower.includes('mongo')) return <SiMongodb style={{ color: '#47A248' }} />;
    if (skillLower.includes('postgresql') || skillLower.includes('postgres')) return <SiPostgresql style={{ color: '#336791' }} />;
    if (skillLower.includes('redis')) return <SiRedis style={{ color: '#DC382D' }} />;
    
    // Tools / Other
    if (skillLower.includes('git')) return <FaGitAlt style={{ color: '#F05032' }} />;
    if (skillLower.includes('linux')) return <FaLinux style={{ color: '#FCC624' }} />;
    if (skillLower.includes('solidity')) return <SiSolidity style={{ color: '#363636' }} />;
    if (skillLower.includes('rust')) return <SiRust style={{ color: '#000000' }} />;
    
    // Default: No icon or a generic one
    return null;
  };

  if (isLoading || !selectedGradient) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <HeroSection 
        imageComponent={
          <StaticImage
            src="../images/skills.png"
            alt="My Skills"
            placeholder="blurred"
            layout="constrained"
            width={550}
            height={550}
            style={{ 
              borderRadius: '20px'
            }}
          />
        }
        subtitle="Technical Expertise"
        title={pageTitle}
        description="Explore my technical skills and expertise"
        additionalDescription="Click on any skill to discover related projects, experiences, and blog posts."
      />

      {/* Skills Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 2rem 4rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {skillCategories.length > 0 ? (
          skillCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className={styles.skillCategorySection} style={{
              marginBottom: '4rem',
              padding: '2.5rem',
              background: 'var(--background-secondary)',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-color)'
            }}>
              <GradientText as="h2">
                {category.name}
              </GradientText>
              
              {/* Category explanation */}
              {skillCategoryExplanations[category.name] && (
                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  marginBottom: '2.5rem',
                  lineHeight: '1.6',
                  maxWidth: '800px',
                  margin: '0 auto 2.5rem'
                }}>
                  {skillCategoryExplanations[category.name]}
                </p>
              )}
              
              <div className={styles.skillGrid} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem',
                padding: '1rem 0'
              }}>
                {category.skills.map((skill, skillIndex) => {
                  const skillIcon = getIconForSkill(skill);
                  return (
                    <button
                      key={skillIndex}
                      onClick={() => handleSkillClick(skill)}
                      className={styles.skillCard}
                      style={{
                        background: `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}15, ${selectedGradient?.colors?.[1] || '#764ba2'}15)`,
                        border: `2px solid ${selectedGradient?.colors?.[0] || '#667eea'}30`,
                        borderRadius: '16px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.8rem',
                        minHeight: '120px',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-8px)';
                        e.target.style.boxShadow = `0 15px 40px ${selectedGradient?.colors?.[0] || '#667eea'}20`;
                        e.target.style.borderColor = selectedGradient?.colors?.[0] || '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                        e.target.style.borderColor = `${selectedGradient?.colors?.[0] || '#667eea'}30`;
                      }}
                    >
                      {skillIcon && (
                        <div style={{ fontSize: '2.5rem' }}>
                          {skillIcon}
                        </div>
                      )}
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        textAlign: 'center'
                      }}>
                        {skill}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontSize: '1.2rem' }}>Loading skills...</p>
          </div>
        )}
      </div>

      {/* Modal for skill details */}
      {selectedSkill && (
        <Modal onClose={closeModal} styles={styles}>
          <div style={{ 
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '2rem',
              textAlign: 'center',
              background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: selectedGradient?.colors?.[0] || '#667eea'
            }}>
              {selectedSkill}
            </h2>
            
            <div style={{ 
              display: 'grid',
              gap: '2rem'
            }}>
              {/* Related Posts */}
              {relatedContent.posts.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    📝 Related Blog Posts
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}>
                    {relatedContent.posts.map((post, index) => (
                      <Link
                        key={index}
                        to={post.slug}
                        style={{
                          textDecoration: 'none',
                          padding: '1rem',
                          background: 'var(--background-tertiary)',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = `${selectedGradient?.colors?.[0] || '#667eea'}10`;
                          e.target.style.borderColor = selectedGradient?.colors?.[0] || '#667eea';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--background-tertiary)';
                          e.target.style.borderColor = 'var(--border-color)';
                        }}
                      >
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)'
                        }}>
                          {post.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Experiences */}
              {relatedContent.experiences.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    💼 Related Experience
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}>
                    {relatedContent.experiences.map((exp, index) => (
                      <a
                        key={index}
                        href={`/experience#${exp.id}`}
                        style={{
                          textDecoration: 'none',
                          padding: '1rem',
                          background: 'var(--background-tertiary)',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = `${selectedGradient?.colors?.[0] || '#667eea'}10`;
                          e.target.style.borderColor = selectedGradient?.colors?.[0] || '#667eea';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--background-tertiary)';
                          e.target.style.borderColor = 'var(--border-color)';
                        }}
                      >
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)'
                        }}>
                          {exp.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {relatedContent.projects.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    🚀 Related Projects
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}>
                    {relatedContent.projects.map((project, index) => (
                      <a
                        key={index}
                        href={`/projects#${project.id}`}
                        style={{
                          textDecoration: 'none',
                          padding: '1rem',
                          background: 'var(--background-tertiary)',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = `${selectedGradient?.colors?.[0] || '#667eea'}10`;
                          e.target.style.borderColor = selectedGradient?.colors?.[0] || '#667eea';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--background-tertiary)';
                          e.target.style.borderColor = 'var(--border-color)';
                        }}
                      >
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)'
                        }}>
                          {project.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* No related content message */}
              {relatedContent.posts.length === 0 && 
               relatedContent.experiences.length === 0 && 
               relatedContent.projects.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'var(--text-secondary)'
                }}>
                  <p>No related content found for this skill yet.</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Dynamic styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .${styles.skillCategorySection}:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
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
          
          .${styles.skillGrid} {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
          }
        }
        
        @media (max-width: 480px) {
          .content-container h1 {
            font-size: 2rem !important;
          }
          .content-container p {
            font-size: 1.1rem !important;
          }
          
          .${styles.skillGrid} {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default SkillsPage; 