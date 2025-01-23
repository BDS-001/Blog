/* eslint-disable react/prop-types */
import styles from './BlogCard.module.css';

const BlogCard = ({ blog }) => {
    const formattedDate = new Date(blog.createdAt).toLocaleDateString();
    
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{blog.title}</h2>
          <div className={styles.meta}>
            By {blog.author.name} • {formattedDate}
          </div>
        </div>
        <div className={styles.content}>
          <p>{blog.content}</p>
        </div>
        <div className={styles.footer}>
          <a href={`/blog/${blog.slug}`} className={styles.button}>
            Read More
          </a>
        </div>
      </div>
    );
  };

export default BlogCard;