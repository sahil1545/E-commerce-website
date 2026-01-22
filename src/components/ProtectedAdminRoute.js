import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking session
  if (loading) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Not admin → redirect to home
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Admin → allow access
  return children;
}

export default ProtectedAdminRoute;