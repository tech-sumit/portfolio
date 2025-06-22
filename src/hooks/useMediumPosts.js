import { useState, useEffect } from 'react';
import { blogConfig } from '../config/blog';

export const useMediumPosts = () => {
  const [mediumPosts, setMediumPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blogConfig.showMediumPosts || !blogConfig.mediumUsername || blogConfig.mediumUsername === 'YOUR_MEDIUM_USERNAME') {
      return;
    }

    const fetchMediumPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${blogConfig.mediumUsername}`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
          const decodeHtml = (text) => {
            if (!text) return '';
            const textarea = document.createElement('textarea');
            textarea.innerHTML = text;
            return textarea.value;
          };

          const posts = data.items.map((post, index) => ({
            id: post.guid || `medium-${index}`,
            title: decodeHtml(post.title),
            link: post.link,
            date: new Date(post.pubDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long', 
              day: 'numeric'
            }),
            isoDate: post.pubDate,
            description: decodeHtml(post.contentSnippet || post.description),
            tags: post.categories || [],
            source: 'medium'
          }));
          
          setMediumPosts(posts);
        }
      } catch (err) {
        console.warn('Failed to fetch Medium posts:', err);
        setError(err.message);
        setMediumPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMediumPosts();
  }, []);

  return { mediumPosts, loading, error };
}; 