import React, { useState, useMemo } from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import { useGradient } from '../context/GradientContext';
import * as styles from '../styles/blog.module.css';

const BlogIndexPage = ({ data }) => {
  const { selectedGradient, isLoading } = useGradient();
  
  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());

  // --- Data extraction ---
  const allPosts = data.allPosts.nodes;
  const allUniqueTags = data.allTags.group;

  // --- Filtering logic ---
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const title = post.frontmatter.title || "";
      const description = post.frontmatter.description || "";
      const excerpt = post.excerpt || "";
      const tags = post.frontmatter.tags || [];
      const lowerSearchQuery = searchQuery.toLowerCase(); // Lowercase search query once

      // Match search query (case-insensitive) against title, desc, excerpt, AND tags
      const searchMatch = searchQuery === "" ||
        title.toLowerCase().includes(lowerSearchQuery) ||
        description.toLowerCase().includes(lowerSearchQuery) ||
        excerpt.toLowerCase().includes(lowerSearchQuery) ||
        tags.some(tag => tag.toLowerCase().includes(lowerSearchQuery)); // <<< Check tags

      // Match selected tags (post must have ALL selected tags if any tags are selected)
      // Corrected logic: use .every() if you want posts matching ALL selected tags
      // Or keep .some() if matching ANY selected tag is desired.
      // Let's stick with ANY for now as it's common.
      const tagMatch = selectedTags.size === 0 ||
        tags.some(tag => selectedTags.has(tag));

      return searchMatch && tagMatch;
    });
  }, [allPosts, searchQuery, selectedTags]);

  // --- Handlers ---
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prevTags => {
      const newTags = new Set(prevTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

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
          Blog
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Insights, tutorials, and thoughts on technology and development
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem 2rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div className={styles.searchContainer} style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              border: `2px solid ${selectedGradient?.colors?.[0] || '#667eea'}30`,
              borderRadius: '12px',
              background: 'var(--background-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        <div className={styles.blogLayout} style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* --- Sidebar for Tags --- */}
          <aside className={styles.sidebar} style={{
            padding: '2rem',
            background: 'var(--background-secondary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            height: 'fit-content',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: selectedGradient?.colors?.[0] || '#667eea'
            }}>
              Filter by Tag
            </h2>
            <ul className={styles.tagList} style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {allUniqueTags.map(group => (
                <li key={group.tag}>
                  <button
                    onClick={() => handleTagClick(group.tag)}
                    className={`${styles.tagButton} ${selectedTags.has(group.tag) ? styles.activeTag : ''} ${selectedTags.has(group.tag) ? 'btn btn-primary' : 'btn btn-secondary'}`}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      border: `2px solid ${selectedTags.has(group.tag) ? selectedGradient?.colors?.[0] : selectedGradient?.colors?.[0] + '40'} || '#667eea'`,
                      borderRadius: '8px',
                      background: selectedTags.has(group.tag) 
                        ? `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}20, ${selectedGradient?.colors?.[1] || '#764ba2'}20)`
                        : 'transparent',
                      color: selectedTags.has(group.tag) ? selectedGradient?.colors?.[0] || '#667eea' : 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{group.tag}</span>
                    <span style={{
                      fontSize: '0.8rem',
                      opacity: 0.7
                    }}>
                      ({group.totalCount})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {selectedTags.size > 0 && (
              <button 
                onClick={() => setSelectedTags(new Set())} 
                className={`${styles.clearButton} btn btn-secondary`}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.8rem',
                  border: '2px solid var(--text-tertiary)',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Clear Tags
              </button>
            )}
          </aside>

          {/* --- Main Post List --- */}
          <main className={styles.postListContainer}>
            {filteredPosts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ fontSize: '1.2rem' }}>No blog posts match your filters.</p>
              </div>
            ) : (
              <div className={styles.postGrid} style={{
                display: 'grid',
                gap: '2rem'
              }}>
                {filteredPosts.map(post => {
                  const title = post.frontmatter.title || post.fields.slug;
                  const postPath = `/blog/${post.fields.slug}`;
                  return (
                    <div key={post.fields.slug} className={styles.postCard} style={{
                      padding: '2rem',
                      background: 'var(--background-secondary)',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease'
                    }}>
                      <article itemScope itemType="http://schema.org/Article">
                        <header style={{ marginBottom: '1rem' }}>
                          <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            marginBottom: '0.5rem'
                          }}>
                            <Link to={postPath} itemProp="url" style={{
                              background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              color: selectedGradient?.colors?.[0] || '#667eea',
                              textDecoration: 'none'
                            }}>
                              <span itemProp="headline">{title}</span>
                            </Link>
                          </h2>
                          <small className={styles.postDate} style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            {post.frontmatter.date}
                          </small>
                        </header>
                        <section>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: post.frontmatter.description || post.excerpt,
                            }}
                            itemProp="description"
                            className={styles.postDescription}
                            style={{
                              fontSize: '1.1rem',
                              lineHeight: '1.6',
                              color: 'var(--text-primary)',
                              marginBottom: '1rem'
                            }}
                          />
                        </section>
                        
                        {/* Tags for individual posts */}
                        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginTop: '1rem'
                          }}>
                            {post.frontmatter.tags.map(tag => (
                              <span key={tag} style={{
                                padding: '0.3rem 0.8rem',
                                background: `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}20, ${selectedGradient?.colors?.[1] || '#764ba2'}20)`,
                                border: `1px solid ${selectedGradient?.colors?.[0] || '#667eea'}40`,
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                color: selectedGradient?.colors?.[0] || '#667eea'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Dynamic styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .${styles.searchInput}:focus {
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'};
          box-shadow: 0 0 0 3px ${selectedGradient?.colors?.[0] || '#667eea'}20;
        }
        
        .${styles.postCard}:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'}40;
        }
        
        .${styles.tagButton}:hover {
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
          color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
        }
        
        .${styles.clearButton}:hover {
          border-color: var(--text-primary) !important;
          color: var(--text-primary) !important;
        }
        
        @media (max-width: 768px) {
          .${styles.blogLayout} {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          .${styles.sidebar} {
            position: static !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default BlogIndexPage;

export const pageQuery = graphql`
  query BlogIndexQuery {
    allPosts: allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "posts" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt(pruneLength: 160)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
    allTags: allMarkdownRemark(
        filter: { fields: { sourceInstanceName: { eq: "posts" } } }
    ) {
      group(field: { frontmatter: { tags: SELECT }}) {
        tag: fieldValue
        totalCount
      }
    }
  }
`; 