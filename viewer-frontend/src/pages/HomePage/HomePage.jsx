import { useState, useEffect } from 'react';
import BlogGrid from '../../components/BlogGrid/BlogGrid';
import styles from './Homepage.module.css';

const BlogHomepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <main className={styles.homepage}>
      <h1 className={styles.title}>Latest Blog Posts</h1>
      <BlogGrid blogs={blogs} />
    </main>
  );
};

export default BlogHomepage;