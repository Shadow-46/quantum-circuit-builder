import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * ProtectedRoute - Wrapper component for routes requiring authentication
 * Redirects to home page if user is not logged in
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to home page with a message
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
