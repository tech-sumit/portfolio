import React, { useState, useMemo } from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import { useGradient } from '../context/GradientContext';
// import Seo from "../components/seo"; // Optional
import * as styles from '../styles/blog.module.css';

const BlogIndexPage = ({ data }) => {
  const { isLoading } = useGradient();
  
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

  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      {/* <Seo title="Blog" /> */}
      <h1 className="gradient-text">Blog</h1>

      {/* --- Search Bar --- */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.blogLayout}>
        {/* --- Sidebar for Tags --- */}
        <aside className={styles.sidebar}>
          <h2 className="gradient-text">Filter by Tag</h2>
          <ul className={styles.tagList}>
            {allUniqueTags.map(group => (
              <li key={group.tag}>
                <button
                  onClick={() => handleTagClick(group.tag)}
                  className={`${styles.tagButton} ${selectedTags.has(group.tag) ? styles.activeTag : ''} ${selectedTags.has(group.tag) ? 'btn btn-primary' : 'btn btn-secondary'}`}
                >
                  {group.tag} ({group.totalCount})
                </button>
              </li>
            ))}
          </ul>
          {selectedTags.size > 0 && (
            <button onClick={() => setSelectedTags(new Set())} className={`${styles.clearButton} btn btn-secondary`}>
              Clear Tags
            </button>
          )}
        </aside>

        {/* --- Main Post List --- */}
        <main className={styles.postListContainer}>
          {filteredPosts.length === 0 ? (
            <p>No blog posts match your filters.</p>
          ) : (
            <div className={styles.postGrid}>
              {filteredPosts.map(post => {
                const title = post.frontmatter.title || post.fields.slug;
                const postPath = `/blog/${post.fields.slug}`;
                return (
                  <div key={post.fields.slug} className={styles.postCard}>
                    <article itemScope itemType="http://schema.org/Article">
                      <header>
                        <h2>
                          <Link to={postPath} itemProp="url">
                            <span itemProp="headline">{title}</span>
                          </Link>
                        </h2>
                        <small className={styles.postDate}>{post.frontmatter.date}</small>
                      </header>
                      <section>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: post.frontmatter.description || post.excerpt,
                          }}
                          itemProp="description"
                          className={styles.postDescription}
                        />
                      </section>
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
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