import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import ErrorPage from '../pages/ErrorPage'

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) return <div className="load-error">লোড হচ্ছে...</div>;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <ErrorPage />;
  return children;
}

export default AdminProtectedRoute
