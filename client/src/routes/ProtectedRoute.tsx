import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const ProtectedRoute = () => {
  const canAccess = useAuthStore(
    (s) => s.isAuthenticated && Boolean(s.token)
  );

  if (!canAccess) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};
