// src/components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { CircularProgress, Box } from '@mui/material';
import useAuthStore from '../stores/auth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, getProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verify authentication on mount if we think we're authenticated
    const checkAuth = async () => {
      if (isAuthenticated) {
        // Verify with server to ensure cookies are still valid
        const user = await getProfile();
        const stillAuthenticated = !!user;
        if (!stillAuthenticated) {
          navigate('/login', { state: { from: location }, replace: true });
        }
      } else if (!isLoading) {
        // Not authenticated and not loading, redirect to login
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, navigate, getProfile, location]);

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If authenticated, render the child routes
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;