/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './BlogComments.module.css';

const Comment = ({ comment, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const formattedDate = new Date(comment.createdAt).toLocaleDateString();
  
  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
        <div>
          <span className={styles.username}>{comment.user?.username}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
      <p className={styles.content}>{comment.content}</p>
      <div className={styles.actions}>
        <button onClick={() => onReply(comment.id)} className={styles.actionButton}>
          Reply
        </button>
        {comment.replies?.length > 0 && (
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className={styles.actionButton}
          >
            {showReplies ? 'Hide' : `Show ${comment.replies.length} replies`}
          </button>
        )}
      </div>
      {showReplies && comment.replies?.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;