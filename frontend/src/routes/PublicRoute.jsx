import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated && user) {
    const redirectMap = {
      ADMIN: '/admin/dashboard',
      DONOR: '/donor/dashboard',
      RECIPIENT: '/recipient/dashboard',
    };

    return <Navigate to={redirectMap[user.role] || '/'} replace state={{ from: location }} />;
  }

  return children;
};

export default PublicRoute;
