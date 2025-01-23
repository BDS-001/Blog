import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './BlogDetails.module.css';


const BlogDetails = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBlog = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/blogs/${slug}`);
          if (!response.ok) throw new Error('Blog not found');
          const data = await response.json();
          setBlog(data.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchBlog();
    }, [slug]);
  
    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!blog) return <div className={styles.error}>Blog not found</div>;
  
    const formattedDate = new Date(blog.createdAt).toLocaleDateString();
  
    return (
      <article className={styles.blogDetails}>
        <header className={styles.header}>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>By {blog.author.name}</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        </header>
        
        <div className={styles.content}>
          {blog.content}
        </div>
  
        <footer className={styles.footer}>
          <button 
            onClick={() => window.history.back()} 
            className={styles.backButton}
          >
            Back to Blogs
          </button>
        </footer>
      </article>
    );
  };
  
  export default BlogDetails;