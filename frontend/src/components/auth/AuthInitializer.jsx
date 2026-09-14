import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner';

const AuthInitializer = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!initialized) {
    return <LoadingSpinner label="Restoring your session..." />;
  }

  return children;
};

export default AuthInitializer;