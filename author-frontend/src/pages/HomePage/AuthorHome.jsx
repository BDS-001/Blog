import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthorHome.module.css';

const AuthorHome = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    isPublic: false,
    userId: user.id
  });

  const API_BASE_URL = 'http://localhost:3000';

  const fetchUserBlogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/${user.id}/blogs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);



  const handleCreateBlog = async (e) => {
    e.preventDefault();

    // Validate form data
    if (newBlog.title.length < 3 || newBlog.title.length > 100) {
      alert('Title must be between 3 and 100 characters');
      return;
    }
    if (newBlog.content.length < 100) {
      alert('Content must be at least 100 characters');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBlog)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setIsCreating(false);
      setNewBlog({
        title: '',
        content: '',
        isPublic: false,
        userId: user.id
      });
      fetchUserBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      alert(error.message);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.ok) {
        fetchUserBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <h1>Welcome, {user.username}</h1>
        <button 
          className={styles.createButton}
          onClick={() => setIsCreating(true)}
        >
          Create New Blog
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateBlog} className={styles.createForm}>
          <input
            type="text"
            placeholder="Blog Title (3-100 characters)"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            className={styles.input}
            minLength={3}
            maxLength={100}
            required
          />
          <textarea
            placeholder="Blog Content (minimum 100 characters)"
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            className={styles.textarea}
            minLength={100}
            required
          />
          <div className={styles.formControls}>
            <label>
              <input
                type="checkbox"
                checked={newBlog.isPublic}
                onChange={(e) => setNewBlog({ ...newBlog, isPublic: e.target.checked })}
              />
              Make Public
            </label>
            <div>
              <button type="submit" className={styles.submitButton}>Create</button>
              <button 
                type="button" 
                onClick={() => {
                  setIsCreating(false);
                  setNewBlog({
                    title: '',
                    content: '',
                    isPublic: false,
                    userId: user.id
                  });
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className={styles.formHints}>
            <small>{newBlog.title.length}/100 characters (title)</small>
            <small>{newBlog.content.length}/100 characters minimum (content)</small>
          </div>
        </form>
      )}

      <div className={styles.blogList}>
        {blogs.length === 0 ? (
          <p>No blogs yet. Create your first blog post!</p>
        ) : (
          blogs.map(blog => (
          <div key={blog.id} className={styles.blogCard}>
            <h2>{blog.title}</h2>
            <p>{blog.content.substring(0, 150)}...</p>
            <div className={styles.blogControls}>
              <span>{blog.isPublic ? 'Public' : 'Private'}</span>
              <button 
                onClick={() => handleDeleteBlog(blog.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default AuthorHome;