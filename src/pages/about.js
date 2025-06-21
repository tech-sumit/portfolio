import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from "gatsby-plugin-image";
import Layout from '../components/layout';
import HeroSection from '../components/HeroSection';
import GradientText from '../components/GradientText';
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
      <HeroSection 
        imageComponent={
          <StaticImage
            src="../images/home-page.webp"
            alt="About Me"
            placeholder="blurred"
            layout="constrained"
            width={550}
            height={550}
            style={{ 
              borderRadius: '20px'
            }}
          />
        }
        subtitle="Personal Story"
        title={frontmatter.title}
        description="Discover my journey, passion for technology"
        additionalDescription="Learn about my background, interests, and let's build something amazing together."
      />

      {/* Content Sections - Side by Side Layout */}
      <div style={{ 
        width: '100%',
        padding: '4rem 1rem 4rem',
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
                    {/* Render Contact section title with gradient */}
                    {section.title && (
                      <h2 style={{
                        fontSize: '1.8rem',
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
                    {/* Render contact items with icons */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      {section.listItems.map((item, itemIndex) => {
                        const icon = getIconForContact(item);
                        return (
                          <div key={itemIndex} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}10, ${selectedGradient?.colors?.[1] || '#764ba2'}10)`,
                            border: `1px solid ${selectedGradient?.colors?.[0] || '#667eea'}20`,
                            transition: 'all 0.3s ease'
                          }}>
                            <div style={{ 
                              fontSize: '1.2rem', 
                              color: selectedGradient?.colors?.[0] || '#667eea' 
                            }}>
                              {icon}
                            </div>
                            <div style={{
                              fontSize: '1rem',
                              color: 'var(--text-primary)',
                              flex: 1
                            }} dangerouslySetInnerHTML={{ __html: item }} />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontSize: '1.2rem' }}>Loading about content...</p>
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

export default AboutPage; 