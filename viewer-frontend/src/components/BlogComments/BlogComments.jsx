/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Comment from './Comment';
import CommentForm from './CommentForm';
import styles from './BlogComments.module.css';

const BlogComments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const { isAuth } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/blogs/${blogId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data.filter(comment => !comment.parentId));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleReply = (commentId) => {
    if (!isAuth) return;
    setReplyToId(commentId);
  };

  return (
    <section className={styles.comments}>
      <h2 className={styles.title}>Comments</h2>
      
      {isAuth && !replyToId && (
        <CommentForm blogId={blogId} onCommentAdded={fetchComments} />
      )}

      {!isAuth && (
        <p className={styles.loginPrompt}>Please sign in to leave a comment.</p>
      )}

      <div>
        {comments.map(comment => (
          <div key={comment.id}>
            <Comment comment={comment} onReply={handleReply} />
            {replyToId === comment.id && (
              <div className={styles.replies}>
                <CommentForm 
                  blogId={blogId} 
                  parentId={comment.id}
                  onCommentAdded={fetchComments}
                  onCancel={() => setReplyToId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogComments;