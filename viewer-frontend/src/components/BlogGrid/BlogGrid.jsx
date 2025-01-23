/* eslint-disable react/prop-types */
import BlogCard from '../BlogCard/BlogCard';
import styles from './BlogGrid.module.css';

const BlogGrid = ({blogs}) => {
    return (
        <div className={styles.grid}>
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    )
}

export default BlogGrid