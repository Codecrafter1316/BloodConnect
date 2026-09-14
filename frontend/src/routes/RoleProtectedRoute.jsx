import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectMap = {
      ADMIN: '/admin/dashboard',
      DONOR: '/donor/dashboard',
      RECIPIENT: '/recipient/dashboard',
    };

    return <Navigate to={redirectMap[user.role] || '/'} replace state={{ from: location }} />;
  }

  return children;
};

export default RoleProtectedRoute;
