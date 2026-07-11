// src/components/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location          = useLocation();

  if (loading) return <p style={{ padding:24 }}>Loading…</p>;
  if (!user)   return <Navigate to={`/login?next=${location.pathname}`} replace />;
  return children;
}
