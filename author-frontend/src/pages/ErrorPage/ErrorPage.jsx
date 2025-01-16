import { Link } from "react-router-dom";
import styles from './ErrorPage.module.css';

function ErrorPage() {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.content}>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorMessage}>Page Not Found</h2>
                <p className={styles.description}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link to="/" className={styles.homeButton}>
                    Return Home
                </Link>
            </div>
        </div>
    );
}

export default ErrorPage;