import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
    const ROLE_ID = 1196;
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        username: '',
        password: '',
        roleId: ROLE_ID
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }
        
        if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/)) {
            setError('Password must contain at least one letter and one number');
            setIsLoading(false);
            return;
        }
        
        if (formData.username.length < 3 || formData.username.length > 30) {
            setError('Username must be between 3 and 30 characters');
            setIsLoading(false);
            return;
        }
        
        if (!formData.username.match(/^[a-zA-Z0-9_-]+$/)) {
            setError('Username can only contain letters, numbers, underscores, and dashes');
            setIsLoading(false);
            return;
        }
        
        try {
            const valid = await signup(formData);
            if (valid) {
                navigate('/login');
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
            <div>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            </div>

            <div>
            <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
            />
            </div>

            <div>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
            />
            </div>

            <div>
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />
            </div>

            <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
        </form>
        </div>
    );
};

export default SignUpForm;