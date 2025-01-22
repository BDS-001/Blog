/* eslint-disable react/prop-types */
import styles from './BlogList.module.css';
import BlogCard from '../BlogCard/BlogCard';

const BlogList = ({ blogs, onDeleteBlog }) => (
  <div className={styles.blogList}>
    {blogs.length === 0 ? (
      <p>No blogs yet. Create your first blog post!</p>
    ) : (
      blogs.map(blog => (
        <BlogCard 
          key={blog.id} 
          blog={blog} 
          onDelete={onDeleteBlog}
        />
      ))
    )}
  </div>
);

export default BlogList