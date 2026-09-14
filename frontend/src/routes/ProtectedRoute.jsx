import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
