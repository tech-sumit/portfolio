import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
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
  if (lowerText.startsWith('email:')) return <FaEnvelope />;
  if (lowerText.startsWith('phone:')) return <FaPhone />;
  if (lowerText.startsWith('location:')) return <FaMapMarkerAlt />;
  if (lowerText.startsWith('linkedin:')) return <FaLinkedin />;
  if (lowerText.startsWith('github:')) return <FaGithub />;
  if (lowerText.startsWith('instagram:')) return <FaInstagram />;
  // Add more checks if needed
  return null;
};

const AboutPage = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const [parsedSections, setParsedSections] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && html) {
      setParsedSections(parseAboutHtml(html));
    }
  }, [html]);

  return (
    <Layout>
      <h1>{frontmatter.title}</h1>

      {parsedSections.length > 0 ? (
        parsedSections.map((section, index) => (
          <section key={index} className={styles.contentCard}>
            {/* Render section title - relies on standard .contentCard h2 style */}
            {section.title && <h2>{section.title}</h2>}

            {/* Handle Contact Info section specifically */}
            {section.title.toLowerCase().includes('contact') && section.listItems.length > 0 ? (
              <ul className={styles.contactList}>
                {section.listItems.map((itemHtml, itemIndex) => {
                  // Create a temporary element to easily extract text content
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = itemHtml;
                  const itemText = tempDiv.textContent || '';
                  const icon = getIconForContact(itemText);
                  
                  return (
                    <li key={itemIndex} className={styles.contactItem}>
                      {icon && <span className={styles.contactIcon}>{icon}</span>}
                      {/* Render the original HTML to preserve links (like mailto:) */}
                      <span className={styles.contactText} dangerouslySetInnerHTML={{ __html: itemHtml }} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              /* Render standard content for other sections */
              <div dangerouslySetInnerHTML={{ __html: section.contentHtml }} />
            )}
          </section>
        ))
      ) : (
        /* Fallback if parsing fails or content is empty */
        <section className={styles.contentCard} dangerouslySetInnerHTML={{ __html: html }} />
      )}

    </Layout>
  );
};

export default AboutPage;

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