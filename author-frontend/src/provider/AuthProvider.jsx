/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';


export const AuthProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                setIsAuth(false)
                setIsLoading(false)
                return
            }

            const response = await fetch('http://localhost:3000/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            })

            if (response.ok) {
                const {user} = await response.json()
                setIsAuth(true);
                setUser(user)
            } else {
                localStorage.removeItem('token');
                setIsAuth(false);
            }

        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuth(false);
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
        setUser(null)
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const {token, user} = await response.json()
                localStorage.setItem('token', token)
                setIsAuth(true)
                setUser(user)
                return true
            }
            return false
        } catch (error) {
            console.log(`Login failed: ${error}`)
            return false
        }
    }

    const signup = async (userData) => {
        try {
            if (!userData.email || !userData.password || !userData.username || !userData.roleId) {
                throw new Error('Missing required fields');
            }

            const response = await fetch('http://localhost:3000/api/v1/users', {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                return false
            }
    
            return true;
        } catch (error) {
            console.log(`Login failed: ${error}`)
            return false
        }
    }

    return (
        <AuthContext.Provider value={{ isAuth, isLoading, login, logout, signup, user }}>
          {children}
        </AuthContext.Provider>
    );
}