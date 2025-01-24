/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './BlogComments.module.css';

const CommentForm = ({ blogId, parentId = undefined, onCommentAdded, onCancel }) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const commentData = {
      content: content.trim(),
      blogId: parseInt(blogId),
      userId: parseInt(user?.id),
      parentId: parentId ? parseInt(parentId) : undefined
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Failed to post comment');
      }

      setContent('');
      onCommentAdded();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Comment as ${user.username}`}
        className={styles.textarea}
        rows="3"
        required
      />
      <div>
        <button type="submit" className={styles.submitButton}>Post</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;