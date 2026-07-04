import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if role is incorrect
    return <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />;
  }

  return <Outlet />;
};
