import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthorHome.module.css';
import WelcomeHeader from '../../components/WelcomeHeader/WelcomeHeader';
import CreateBlogForm from '../../components/CreateBlogForm/CreateBlogForm';
import BlogList from '../../components/BlogList/BlogList';


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
      <WelcomeHeader 
        username={user.username} 
        onCreateClick={() => setIsCreating(true)}
      />

      {isCreating && (
        <CreateBlogForm
          userId={user.id}
          onSubmit={handleCreateBlog}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <BlogList 
        blogs={blogs}
        onDeleteBlog={handleDeleteBlog}
      />
    </div>
  );
};

export default AuthorHome;