/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './CreateBlogForm.module.css';

const CreateBlogForm = ({ userId, onSubmit, onCancel }) => {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    isPublic: false,
    userId
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(blog);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.createForm}>
      <input
        type="text"
        placeholder="Blog Title (3-100 characters)"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        className={styles.input}
        minLength={3}
        maxLength={100}
        required
      />
      <textarea
        placeholder="Blog Content (minimum 100 characters)"
        value={blog.content}
        onChange={(e) => setBlog({ ...blog, content: e.target.value })}
        className={styles.textarea}
        minLength={100}
        required
      />
      <div className={styles.formControls}>
        <label>
          <input
            type="checkbox"
            checked={blog.isPublic}
            onChange={(e) => setBlog({ ...blog, isPublic: e.target.checked })}
          />
          Make Public
        </label>
        <div>
          <button type="submit" className={styles.submitButton}>Create</button>
          <button 
            type="button" 
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className={styles.formHints}>
        <small>{blog.title.length}/100 characters (title)</small>
        <small>{blog.content.length}/100 characters minimum (content)</small>
      </div>
    </form>
  );
};

export default CreateBlogForm