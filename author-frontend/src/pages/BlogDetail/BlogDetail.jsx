// pages/BlogDetail/BlogDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogDetail.module.css';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedBlog, setEditedBlog] = useState(null);

  const API_BASE_URL = 'http://localhost:3000';

  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }

      const data = await response.json();
      setBlog(data.data);
      setEditedBlog(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedBlog)
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      setBlog(editedBlog);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          ← Back to Blogs
        </button>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            Edit Blog
          </button>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <input
            type="text"
            value={editedBlog.title}
            onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            className={styles.titleInput}
            minLength={3}
            maxLength={100}
          />
          <textarea
            value={editedBlog.content}
            onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
            className={styles.contentInput}
            minLength={100}
          />
          <div className={styles.formControls}>
            <label className={styles.visibilityToggle}>
              <input
                type="checkbox"
                checked={editedBlog.isPublic}
                onChange={(e) => setEditedBlog({ ...editedBlog, isPublic: e.target.checked })}
              />
              Make Public
            </label>
            <div className={styles.buttonGroup}>
              <button 
                onClick={handleUpdate}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedBlog(blog);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.blogContent}>
          <h1>{blog.title}</h1>
          <div className={styles.metadata}>
            <span className={styles.visibility}>
              {blog.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          <div className={styles.content}>
            {blog.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;