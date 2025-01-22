/* eslint-disable react/prop-types */
// components/BlogCard/BlogCard.jsx
import { Link } from 'react-router-dom';
import styles from './BlogCard.module.css';

const BlogCard = ({ blog, onDelete }) => (
  <div className={styles.blogCard}>
    <h2>{blog.title}</h2>
    <p>{blog.content.substring(0, 150)}...</p>
    <div className={styles.blogControls}>
      <span className={styles.visibility}>
        {blog.isPublic ? 'Public' : 'Private'}
      </span>
      <div className={styles.buttonGroup}>
        <Link 
          to={`/blogs/${blog.id}`}
          className={styles.viewButton}
        >
          View/Edit
        </Link>
        <button 
          onClick={() => onDelete(blog.id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default BlogCard