import { useState } from 'react';
import styles from './LoginPage.module.css'

const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        return
    }

    return (
        <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
                <div className={styles.formRow}>
                    <label>Email:</label>
                    <input type="email" name='email' onChange={handleChange} value={formData.email} placeholder='Enter your email:' />
                </div>
                <div className={styles.formRow}>
                    <label>Password:</label>
                    <input type="password" name='password' onChange={handleChange} value={formData.password} placeholder='Enter your password' />
                </div>
            </div>
            <button type="submit" >Login</button>
        </form>
        </div>
    );
    };

export default LoginPage;