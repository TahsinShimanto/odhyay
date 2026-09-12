import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading</div>;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return children;
}

export default ProtectedRoute
