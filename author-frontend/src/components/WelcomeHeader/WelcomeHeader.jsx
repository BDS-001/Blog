/* eslint-disable react/prop-types */
import styles from './WelcomeHeader.module.css';

const WelcomeHeader = ({ username, onCreateClick }) => (
  <div className={styles.welcomeSection}>
    <h1>Welcome, {username}</h1>
    <button 
      className={styles.createButton}
      onClick={onCreateClick}
    >
      Create New Blog
    </button>
  </div>
);

export default WelcomeHeader;