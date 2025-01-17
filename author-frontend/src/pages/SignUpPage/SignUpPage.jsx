import { useState } from 'react';

const SignUpForm = () => {
    const ROLE_TITLE = 1197
    console.log(ROLE_TITLE)
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div>
        <h2>Sign Up</h2>
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

            <button type="submit">Sign Up</button>
        </form>
        </div>
    );
};

export default SignUpForm;