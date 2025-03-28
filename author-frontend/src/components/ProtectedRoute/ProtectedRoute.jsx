/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({children}) => {
    const { isAuth, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!isAuth) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
}