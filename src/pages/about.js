import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from '../components/layout';
import { useGradient } from '../context/GradientContext';
import * as styles from '../styles/content-page.module.css';
// Import icons
import { 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaLinkedin, 
    FaGithub, 
    FaInstagram 
} from 'react-icons/fa';

// Helper function to parse About page HTML
function parseAboutHtml(html) {
  const sections = [];
  if (!html) return sections;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes = Array.from(doc.body.firstChild.childNodes);

  let currentSection = null;

  nodes.forEach(node => {
    const nodeName = node.nodeName.toUpperCase();
    const textContent = node.textContent?.trim() || '';

    // Start new section if H2/H3 found
    if (nodeName === 'H2' || nodeName === 'H3') {
      currentSection = {
        title: textContent,
        contentHtml: '',
        listItems: [], // Specifically for contact info
      };
      sections.push(currentSection);
    } 
    // Accumulate content if a section has started
    else if (currentSection) {
       // Special handling for Contact Info list
      if ((currentSection.title.toLowerCase().includes('contact')) && nodeName === 'UL') {
         const items = node.querySelectorAll('li');
         items.forEach(li => {
             currentSection.listItems.push(li.innerHTML); // Store innerHTML to keep links
         });
         // Don't add the UL itself to contentHtml if we handle it separately
      } else if (node.nodeType !== Node.TEXT_NODE || textContent !== '') {
         // Append other relevant nodes (like <p>) to contentHtml
         currentSection.contentHtml += node.outerHTML || textContent;
      }
    }
  });

  return sections;
}

// Helper function to get icon based on list item content
const getIconForContact = (text) => {
  const lowerText = text.toLowerCase();
  const firstWord = lowerText.split(' ')[0];
  if (firstWord === 'email') return <FaEnvelope />;
  if (firstWord === 'phone') return <FaPhone />;
  if (firstWord === 'location') return <FaMapMarkerAlt />;
  if (firstWord === 'linkedin') return <FaLinkedin />;
  if (firstWord === 'github') return <FaGithub />;
  if (firstWord === 'instagram') return <FaInstagram />;
  // Add more checks if needed
  return null;
};

const AboutPage = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fields: { slug: { eq: "about" } }) {
        html
        frontmatter {
          title
        }
      }
    }
  `);
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const [parsedSections, setParsedSections] = useState([]);
  const { selectedGradient, isLoading } = useGradient();

  useEffect(() => {
    if (typeof window !== 'undefined' && html) {
      setParsedSections(parseAboutHtml(html));
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
          Discover my journey, passion for technology, and let's build something amazing together
        </p>
      </div>

      {/* Content Sections - Side by Side Layout */}
      <div style={{ 
        width: '100%',
        padding: '0 1rem 4rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {parsedSections.length > 0 ? (
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            {/* About Me Content - 70% width */}
            <div style={{
              flex: '1 1 65%',
              minWidth: '300px'
            }}>
              {parsedSections
                .filter(section => !section.title.toLowerCase().includes('contact'))
                .map((section, index) => (
                  <section key={index} className={styles.contentCard} style={{
                    marginBottom: '3rem',
                    padding: '2.5rem',
                    background: 'var(--background-secondary)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {/* Render section title with gradient */}
                    {section.title && (
                      <h2 style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: selectedGradient?.colors?.[0] || '#667eea'
                      }}>
                        {section.title}
                      </h2>
                    )}
                    {/* Render standard content */}
                    <div style={{
                      fontSize: '1.1rem',
                      lineHeight: '1.7',
                      color: 'var(--text-primary)'
                    }} dangerouslySetInnerHTML={{ __html: section.contentHtml }} />
                  </section>
                ))}
            </div>

            {/* Contact Information - 30% width */}
            <div style={{
              flex: '0 1 30%',
              minWidth: '280px'
            }}>
              {parsedSections
                .filter(section => section.title.toLowerCase().includes('contact'))
                .map((section, index) => (
                  <section key={index} className={styles.contentCard} style={{
                    padding: '1.8rem',
                    background: 'var(--background-secondary)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--border-color)',
                    position: 'sticky',
                    top: '2rem'
                  }}>
                    {/* Render section title with gradient */}
                    {section.title && (
                      <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        marginBottom: '1.2rem',
                        background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: selectedGradient?.colors?.[0] || '#667eea'
                      }}>
                        {section.title}
                      </h2>
                    )}
                    {/* Handle Contact Info section */}
                    {section.listItems.length > 0 && (
                      <ul className={styles.contactList} style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                      }}>
                        {section.listItems.map((itemHtml, itemIndex) => {
                          // Create a temporary element to easily extract text content
                          const tempDiv = document.createElement('div');
                          tempDiv.innerHTML = itemHtml;
                          const itemText = tempDiv.textContent || '';
                          const icon = getIconForContact(itemText);
                          
                          // Clean up the HTML content to remove colons
                          const cleanHtml = itemHtml.replace(/^([^:]+):\s*/, '$1 ');
                          
                          return (
                            <li key={itemIndex} className={styles.contactItem} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.8rem',
                              padding: '0.8rem',
                              background: 'var(--background-tertiary)',
                              borderRadius: '10px',
                              border: '1px solid var(--border-color)',
                              transition: 'all 0.3s ease'
                            }}>
                              {icon && (
                                <span className={styles.contactIcon} style={{
                                  fontSize: '1.2rem',
                                  color: selectedGradient?.colors?.[0] || '#667eea',
                                  minWidth: '20px'
                                }}>
                                  {icon}
                                </span>
                              )}
                              {/* Render the cleaned HTML to preserve links */}
                              <span className={styles.contactText} style={{
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                wordBreak: 'break-word'
                              }} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                ))}
            </div>
          </div>
        ) : (
          /* Fallback if parsing fails or content is empty */
          <section className={styles.contentCard} style={{
            padding: '2.5rem',
            background: 'var(--background-secondary)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border-color)'
          }} dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>

      {/* Dynamic styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .${styles.contactItem}:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'};
        }
        
        .${styles.contactText} a {
          color: ${selectedGradient?.colors?.[0] || '#667eea'};
          text-decoration: none;
          font-weight: 600;
        }
        
        .${styles.contactText} a:hover {
          opacity: 0.8;
        }
      `}</style>
    </Layout>
  );
};

export default AboutPage; 