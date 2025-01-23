import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          BlogSpace
        </Link>
        
        <nav>
          {isAuth ? (
            <button
              onClick={handleSignOut}
              className={styles.signOutButton}
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className={styles.signInButton}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;