import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking session
  if (loading) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return children;
}

export default ProtectedRoute;
