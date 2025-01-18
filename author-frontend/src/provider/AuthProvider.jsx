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
            console.log('Sending login request with email:', credentials.email);
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
      
          const result = await response.json();
          
          if (response.ok) {
            const { token, user } = result.data;
            localStorage.setItem('token', token);
            setIsAuth(true);
            setUser(user);
            return true;
          } else {
            console.error('Login failed:', result.message);
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      }

    const signup = async (userData) => {
        try {
          console.log('Sending user data:', userData);
      
          if (!userData.email || !userData.password || !userData.username || !userData.name || !userData.roleId) {
            throw new Error('Missing required fields');
          }
      
          const response = await fetch('http://localhost:3000/api/v1/users', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          const responseData = await response.json();
          console.log('Server response:', responseData);
      
          if (!response.ok) {
            // Log the specific validation errors
            if (responseData.errors) {
              console.log('Validation errors:', responseData.errors);
              throw new Error(responseData.errors.map(err => err.msg).join(', '));
            }
            throw new Error('Signup failed');
          }
      
          return true;
        } catch (error) {
          console.log(`Signup failed: ${error}`);
          throw error;
        }
      };

    return (
        <AuthContext.Provider value={{ isAuth, isLoading, login, logout, signup, user }}>
          {children}
        </AuthContext.Provider>
    );
}