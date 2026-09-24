import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
const ProtectedRoute = ({ children }) => {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) return <div className="load-error">লোড হচ্ছে...</div>;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (role !== "student") return <Navigate to="/admin" replace />;

  return children;
}

export default ProtectedRoute
