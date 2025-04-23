import React, { useState, useEffect, useMemo } from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import Modal from '../components/Modal'; // Import the external Modal component
import * as styles from '../styles/skills.module.css';
// Import specific icons
import {
  FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaAws, FaDocker, FaPython, FaJava, FaGitAlt, FaLinux
} from 'react-icons/fa';
import {
  SiGatsby, SiNextdotjs, SiTypescript, SiKubernetes, SiGooglecloud,
  SiMicrosoftazure, // Revert back to SiMicrosoftazure
  SiMongodb, SiPostgresql, SiRedis, SiTerraform, SiJenkins, SiSolidity, SiRust, SiFlask, SiDjango
  // Add more Si icons as needed
} from 'react-icons/si';

const SkillsPage = ({ data }) => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null); // Skill name for modal
  const [relatedContent, setRelatedContent] = useState({ posts: [], experiences: [], projects: [] });

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
  const handleSkillClick = (skillName) => {
    setSelectedSkill(skillName);
    setRelatedContent({
      posts: skillConnections.postsBySkill[skillName] || [],
      experiences: skillConnections.experiencesBySkill[skillName] || [],
      projects: skillConnections.projectsBySkill[skillName] || [],
    });
  };

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
    if (lowerSkill.includes('azure') || lowerSkill.includes('microsoftazure')) return <SiMicrosoftazure title="Azure" />;
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

  return (
    <Layout>
       {/* <Seo title={pageTitle} /> */}
      <h1>{pageTitle}</h1>

      {skillCategories.length === 0 && !skillsHtml && <p>Loading skills...</p>}
      {skillCategories.length === 0 && skillsHtml && <p>Could not parse skills from Markdown. Check format in src/content/resume/skills.md (e.g., use H2/H3 for categories followed by a UL list).</p>}

      <div className={styles.skillsContainer}>
        {skillCategories.map(category => (
          <section key={category.name} className={styles.categorySection}>
            <h2>{category.name}</h2>
            {/* Display the explanation if available */}
            {skillCategoryExplanations[category.name] && (
              <p className={styles.categoryExplanation}>
                {skillCategoryExplanations[category.name]}
              </p>
            )}
            <div className={styles.skillsGrid}>
              {category.skills.map(skill => (
                <button
                  key={skill}
                  className={styles.skillBadge}
                  onClick={() => handleSkillClick(skill)}
                  title={`Show related content for ${skill}`}
                >
                  {getIconForSkill(skill)} {/* Call the icon function */}
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
          {relatedContent.posts.length > 0 && (
            <div className={styles.modalSection}>
              <h3>Blog Posts:</h3>
              <ul>
                {relatedContent.posts.map(post => (
                  <li key={post.slug}>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {relatedContent.experiences.length > 0 && (
            <div className={styles.modalSection}>
              <h3>Experience:</h3>
              <ul>
                {relatedContent.experiences.map(exp => (
                   <li key={exp.id || exp.title}>
                     {exp.id ? (
                       <Link to={`/experience#${exp.id}`}>{exp.title}</Link>
                     ) : (
                       <span>{exp.title} (No ID found)</span>
                     )}
                   </li>
                ))}
              </ul>
            </div>
          )}
          {relatedContent.projects.length > 0 && (
            <div className={styles.modalSection}>
              <h3>Projects:</h3>
              <ul>
                {relatedContent.projects.map(proj => (
                   <li key={proj.id || proj.title}>
                     {proj.id ? (
                       <Link to={`/projects#${proj.id}`}>{proj.title}</Link>
                     ) : (
                       <span>{proj.title} (No ID found)</span>
                     )}
                   </li>
                ))}
              </ul>
            </div>
          )}
           {(relatedContent.posts.length === 0 && relatedContent.experiences.length === 0 && relatedContent.projects.length === 0) && (
               <p>No specific blog posts, experience sections, or project sections found mentioning this skill (based on current parsing).</p>
           )}
        </Modal>
      )}
    </Layout>
  );
};

export default SkillsPage;

export const query = graphql`
  query SkillsPageAndAllConnectionsQuery {
    skillsMd: markdownRemark(
      fields: { slug: { eq: "skills" }, sourceInstanceName: { eq: "resume" } }
    ) {
      html
      frontmatter {
        title
      }
      fields {
        skillCategoryExplanations
      }
    }
    experienceMd: markdownRemark(
      fields: { slug: { eq: "experience" }, sourceInstanceName: { eq: "resume" } }
    ) {
      html
      frontmatter {
        title
      }
    }
    projectsMd: markdownRemark(
      fields: { slug: { eq: "projects" }, sourceInstanceName: { eq: "pages" } }
    ) {
      html
      frontmatter {
        title
      }
    }
    allBlogPosts: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "posts" } } }
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
`; 