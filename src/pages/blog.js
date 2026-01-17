import React, { useState, useMemo } from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { useGradient } from '../context/GradientContext';
import { blogConfig } from '../config/blog';
import { useMediumPosts } from '../hooks/useMediumPosts';
import * as styles from '../styles/blog.module.css';

const decodeHtmlEntities = (text) => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const truncateText = (text, maxLength = 160) => {
  if (!text) return '';
  const decoded = decodeHtmlEntities(text);
  const clean = decoded.replace(/<[^>]*>/g, '');
  return clean.length <= maxLength ? clean : clean.substr(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

const BlogIndexPage = ({ data }) => {
  const { selectedGradient, isLoading } = useGradient();
  const { mediumPosts } = useMediumPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());

  const localPosts = data.allPosts.nodes.map(post => ({
    source: 'local',
    id: post.fields.slug,
    title: post.frontmatter.title,
    date: post.frontmatter.date,
    tags: post.frontmatter.tags || [],
    description: post.frontmatter.description || post.excerpt,
    slug: post.fields.slug
  }));

  const allPosts = [...localPosts, ...mediumPosts].sort((a, b) => 
    new Date(b.isoDate || b.date) - new Date(a.isoDate || a.date)
  );

  const allTagCounts = allPosts.reduce((acc, post) => {
    post.tags?.forEach(tag => tag && (acc[tag] = (acc[tag] || 0) + 1));
    return acc;
  }, {});

  const allUniqueTags = Object.entries(allTagCounts)
    .map(([tag, totalCount]) => ({ tag, totalCount }))
    .sort((a, b) => b.totalCount - a.totalCount);

  const mediumTagCounts = mediumPosts.reduce((acc, post) => {
    post.tags?.forEach(tag => tag && (acc[tag] = (acc[tag] || 0) + 1));
    return acc;
  }, {});

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const query = searchQuery.toLowerCase();
      const searchMatch = !query || 
        post.title?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag?.toLowerCase().includes(query));

      const tagMatch = !selectedTags.size || 
        post.tags?.some(tag => selectedTags.has(tag));

      return searchMatch && tagMatch;
    });
  }, [allPosts, searchQuery, selectedTags]);

  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
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

      {/* Blog Content Container */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem 2rem',
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {/* Search Bar - Full width aligned with grid */}
        <div className={styles.searchContainer} style={{
          marginBottom: '2rem'
        }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            style={{
              width: '100%',
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
              {allUniqueTags.map(group => {
                // Check if this tag exists in Medium posts (dynamic indicator)
                const isInMedium = mediumTagCounts[group.tag] > 0;
                
                return (
                  <li key={group.tag}>
                    <button
                      onClick={() => handleTagClick(group.tag)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: `2px solid ${selectedTags.has(group.tag) ? (selectedGradient?.colors?.[0] || '#667eea') : (selectedGradient?.colors?.[0] || '#667eea') + '40'}`,
                        borderRadius: '8px',
                        background: selectedTags.has(group.tag) 
                          ? `linear-gradient(135deg, ${selectedGradient?.colors?.[0] || '#667eea'}20, ${selectedGradient?.colors?.[1] || '#764ba2'}20)`
                          : 'transparent',
                        color: selectedTags.has(group.tag) ? (selectedGradient?.colors?.[0] || '#667eea') : '#333333',
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {group.tag}
                        {isInMedium && (
                          <span style={{
                            fontSize: '0.6rem',
                            padding: '0.2rem 0.4rem',
                            background: blogConfig.mediumColor,
                            color: 'white',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            M
                          </span>
                        )}
                      </span>
                      <span style={{
                        fontSize: '0.8rem',
                        opacity: 0.7
                      }}>
                        ({group.totalCount})
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {selectedTags.size > 0 && (
              <button 
                onClick={() => setSelectedTags(new Set())} 
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.8rem 1rem',
                  border: `2px solid ${(selectedGradient?.colors?.[0] || '#667eea') + '40'}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#333333',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {filteredPosts.map(post => {
                  const title = decodeHtmlEntities(post.title);
                  const postPath = post.source === 'local' ? `/blog/${post.slug}` : post.link;
                  const isExternal = post.source === 'medium';
                  
                  return (
                    <div key={post.id} className={styles.postCard} style={{
                      padding: '2rem',
                      background: 'var(--background-secondary)',
                      borderRadius: '16px',
                      border: `1px solid ${isExternal ? blogConfig.mediumBorderColor : 'var(--border-color)'}`,
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}>
                      {/* Source indicator */}
                      {isExternal && (
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          padding: '0.3rem 0.8rem',
                                                     background: `linear-gradient(135deg, ${blogConfig.mediumBackgroundColor}, ${blogConfig.mediumBackgroundColor})`,
                           border: `1px solid ${blogConfig.mediumBorderColor}`,
                          borderRadius: '15px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                                                     color: blogConfig.mediumColor,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                          </svg>
                          Medium
                        </div>
                      )}
                      
                      <article itemScope itemType="http://schema.org/Article">
                        <header style={{ marginBottom: '1rem', paddingRight: isExternal ? '4rem' : '0' }}>
                          <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            marginBottom: '0.5rem'
                          }}>
                            {isExternal ? (
                              <a 
                                href={postPath} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                itemProp="url" 
                                style={{
                                  background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                  color: selectedGradient?.colors?.[0] || '#667eea',
                                  textDecoration: 'none'
                                }}
                              >
                                <span itemProp="headline">{title}</span>
                              </a>
                            ) : (
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
                            )}
                          </h2>
                          <small className={styles.postDate} style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            {post.date}
                          </small>
                        </header>
                        <section>
                          <p
                            itemProp="description"
                            className={styles.postDescription}
                            style={{
                              fontSize: '1.1rem',
                              lineHeight: '1.6',
                              color: 'var(--text-primary)',
                              marginBottom: '1rem'
                            }}
                          >
                            {truncateText(post.description || post.excerpt, 160)}
                          </p>
                        </section>
                        
                        {/* Tags for individual posts */}
                        {post.tags && post.tags.length > 0 && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginTop: '1rem'
                          }}>
                            {post.tags.map((tag, index) => (
                              <span key={`${tag}-${index}`} style={{
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
        
        .${styles.sidebar} button:hover {
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
          color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
        }
        
        .${styles.sidebar} button:last-child:hover {
          border-color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
          color: ${selectedGradient?.colors?.[0] || '#667eea'} !important;
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

// Gatsby Head API for SEO
export const Head = () => (
  <Seo
    title="Technical Blog"
    description="Insights, tutorials, and thoughts on software engineering, cloud architecture, and modern web development. Explore articles on full-stack development, DevOps, and AI integration."
    pathname="/blog"
  />
);

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
        internal {
          type
        }
      }
    }
  }
`; 